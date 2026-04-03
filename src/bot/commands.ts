import { Markup, Telegraf } from 'telegraf';
import { defaultLocale, locales } from '../config/i18n';
import { canUseAsGroupOrUser, canUseAsUser } from './permission';
import { BOT_STICKERS } from './messages';
import { handleWriteSessionCreate } from '../services/session/write/bot/handler';
import { WriteSessionOperationKeys } from '../services/session/write/constants';
import { hasSession, removeSession } from '../services/session/cache';
import { handleReadSessionCreate } from '../services/session/read/bot/handler';
import { DESTROY_MESSAGE_TIMEOUT } from './costants';
import {
  generateAccountsReport,
  generateBaseMonthStats,
} from '../services/report/generate';
import { formatBotMessageForMarkdownV2 } from '../utils/format-bot-message';
import { captureException } from '../config/sentry';
import Cache from '../utils/cache';
import { stringToDate } from '../utils/date';
import { BotContext } from './bot.types';

const sendUnauthorizedException = (from: unknown) => {
  captureException(new Error(`User or Group is not allowed to use bot ${JSON.stringify(from)}`));
};

export const setBotCommands = (bot: Telegraf<BotContext>) => {
  bot.start((ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return;
    }
    ctx.sendMessage(ctx.t('start', { firstName: ctx.from.first_name }));
  });

  bot.command('expense', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    const {
      text,
      options,
    } = handleWriteSessionCreate(ctx, ctx.chat.id, WriteSessionOperationKeys.expense);
    ctx.sendMessage(ctx.t(text), options);
  });

  bot.command('income', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    const {
      text,
      options,
    } = handleWriteSessionCreate(ctx, ctx.chat.id, WriteSessionOperationKeys.income);
    ctx.sendMessage(ctx.t(text), options);
  });

  bot.command('transfer', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    const {
      text,
      options,
    } = handleWriteSessionCreate(
      ctx,
      ctx.chat.id,
      WriteSessionOperationKeys.transfer,
    );
    ctx.sendMessage(ctx.t(text), options);
  });

  bot.command('lookup', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    if (hasSession(ctx.chat.id)) {
      return ctx.sendMessage(ctx.t('sessionInProgress'));
    }

    const { text, options } = await handleReadSessionCreate(ctx, ctx.chat.id);
    ctx.sendMessage(ctx.t(text), options);
  });

  bot.command('month_stats', async (ctx) => {
    if (!canUseAsGroupOrUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    if (hasSession(ctx.chat.id)) {
      return ctx.sendMessage(ctx.t('sessionInProgress'));
    }

    const loadingMessage = await ctx.sendSticker(BOT_STICKERS.loadingMatrix);
    const result = await generateBaseMonthStats(ctx, ctx.chat.id);
    const message = await ctx.sendMessage(formatBotMessageForMarkdownV2(result), { parse_mode: 'MarkdownV2' });

    ctx.deleteMessage(loadingMessage.message_id);
    setTimeout(() => {
      ctx.deleteMessage(message.message_id);
    }, DESTROY_MESSAGE_TIMEOUT.SHORT);
  });

  bot.command('accounts', async (ctx) => {
    const maybeDate = ctx.message.text.split('/accounts ')[1];
    const toDate = maybeDate !== undefined ? stringToDate(maybeDate) : null;

    if (!canUseAsGroupOrUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    if (hasSession(ctx.chat.id)) {
      return ctx.sendMessage(ctx.t('sessionInProgress'));
    }

    const loadingMessage = await ctx.sendSticker(BOT_STICKERS.loadingSleepy);
    const result = await generateAccountsReport(ctx, ctx.chat.id, toDate);
    const message = await ctx.sendMessage(formatBotMessageForMarkdownV2(result), { parse_mode: 'MarkdownV2' });

    ctx.deleteMessage(loadingMessage.message_id);
    setTimeout(() => {
      ctx.deleteMessage(message.message_id);
    }, DESTROY_MESSAGE_TIMEOUT.MEDIUM);
  });

  bot.command('cancel', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    const hasActiveSession = hasSession(ctx.chat.id);
    if (!hasActiveSession) {
      return ctx.sendMessage(ctx.t('sessionNotInProgress'));
    }

    try {
      removeSession(ctx.chat.id);
      ctx.sendMessage(ctx.t('operationAborted'), Markup.removeKeyboard());
    } catch (e) {
      captureException(e);
    }
  });

  bot.command('set_locale', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return;
    }

    if (hasSession(ctx.chat.id)) {
      return ctx.sendMessage(ctx.t('sessionInProgress'));
    }

    const maybeLocale = ctx.message.text.split('/set_locale ')[1]?.toLowerCase();
    if (locales.includes(maybeLocale)) {
      ctx.session.locale = maybeLocale;
    } else if (ctx.from.language_code) {
      ctx.session.locale = ctx.from.language_code;
    } else {
      ctx.session.locale = defaultLocale;
    }

    ctx.i18n.setLocale(ctx.session.locale);
    ctx.sendMessage(ctx.t('localeSet'));
  });

  bot.command('clear_cache', async (ctx) => {
    if (!canUseAsUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    Cache.flushAll();
    ctx.sendMessage(ctx.t('cacheRemoved'));
  });

  bot.command('help', (ctx) => {
    if (!canUseAsGroupOrUser(ctx.chat.id)) {
      sendUnauthorizedException(ctx.from);
      return ctx.sendMessage(ctx.t('operationNotAllowed'));
    }

    ctx.sendMessage(ctx.t('help'));
  });
};
