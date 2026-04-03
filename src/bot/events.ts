import { callbackQuery, message as messageFilter } from 'telegraf/filters';
import { Markup, Telegraf } from 'telegraf';
import { canUseAsUser } from './permission';
import { getSession } from '../services/session/cache';
import { BOT_CALLBACK_DATA } from './messages';
import { isReadSession, isWriteSession } from '../services/session/predicates';
import { handleWriteSessionMessages } from '../services/session/write/bot/handler';
import { handleReadSessionMessages } from '../services/session/read/bot/handler';
import { formatBotMessageForMarkdownV2 } from '../utils/format-bot-message';
import { isInitStateWriteSession } from '../services/session/write/predicates';
import { calculatorMarkup } from '../services/session/calculator/responses';
import { handleWriteSessionCalculate } from '../services/session/calculator/calculator';
import { formatAmountToCurrency } from '../utils/amount';
import { BotContext } from './bot.types';

export const setBotEvents = (bot: Telegraf<BotContext>) => {
  bot.on(messageFilter('text'), async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      return;
    }

    const currentSession = getSession(ctx.chat.id);
    if (!currentSession) {
      return ctx.sendMessage(ctx.t('sessionNotInProgress'));
    }

    if (isWriteSession(currentSession)) {
      const { text, textReplacements, options } = await handleWriteSessionMessages(ctx, currentSession, ctx.message.text);
      return ctx.sendMessage(ctx.t(text, textReplacements), options);
    }

    if (isReadSession(currentSession)) {
      const { text, textReplacements, options } = await handleReadSessionMessages(ctx, currentSession, ctx.message.text);
      return ctx.sendMessage(
        formatBotMessageForMarkdownV2(ctx.t(text, textReplacements)),
        { parse_mode: 'MarkdownV2', ...options },
      );
    }

    ctx.sendMessage(ctx.t('error'));
  });

  bot.on(callbackQuery('data'), async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      return;
    }

    const currentSession = getSession(ctx.chat.id);
    if (!currentSession) {
      return ctx.sendMessage(ctx.t('sessionNotInProgress'));
    }

    if (isWriteSession(currentSession) && isInitStateWriteSession(currentSession)) {
      const { data, message } = ctx.update.callback_query;

      if (data === BOT_CALLBACK_DATA.useCalculator) {
        return ctx.editMessageReplyMarkup(calculatorMarkup.reply_markup);
      }

      const calculationMessageId = message.message_id + 1;
      const { result, calculation } = handleWriteSessionCalculate(data);

      if (result === null) {
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            calculationMessageId,
            undefined,
            `=${calculation.toString().replace(/\./g, ',')}`,
          );
        } catch (e) {
          if (e.response.error_code === 400
            && e.response.description === 'Bad Request: message to edit not found') {
            ctx.sendMessage(calculation);
          }
        }

        return;
      }

      const formattedResult = formatAmountToCurrency(Number(result));
      ctx.editMessageReplyMarkup(null);
      ctx.deleteMessage(calculationMessageId);
      ctx.sendMessage(
        ctx.t('selectAmountOrInsert', { amount: formattedResult }),
        Markup.keyboard([Markup.button.text(`${formattedResult}`)]).oneTime().resize(),
      );

      return;
    }

    ctx.sendMessage(ctx.t('cantPerformAction'));
  });
};
