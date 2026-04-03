import { Markup } from 'telegraf';
import { BOT_CALLBACK_DATA } from '../../../../bot/messages';
import { SelectItem } from '../../session.types';
import { NO_RESPONSE, saveSessionConfirmButtonsText } from '../../constants';
import { selectAccountResponse } from '../../bot/responses';
import { BotContext, BotResponse } from '../../../../bot/bot.types';

export const insertAmountResponse = (ctx: BotContext): BotResponse => ({
  text: 'insertAmount',
  options: Markup.inlineKeyboard([
    Markup.button.callback(ctx.t('useCalculator'), BOT_CALLBACK_DATA.useCalculator),
  ]),
});

export const insertAmountWithErrorResponse = (ctx: BotContext): BotResponse => ({
  text: 'insertAmountWithError',
  options: Markup.inlineKeyboard([
    Markup.button.callback(ctx.t('useCalculator'), BOT_CALLBACK_DATA.useCalculator),
  ]),
});

export const selectAccountFromResponse = (accounts: SelectItem[]): BotResponse => ({
  ...selectAccountResponse(accounts),
  text: 'selectAccountFrom',
});

export const selectAccountToResponse = (accounts: SelectItem[]): BotResponse => ({
  ...selectAccountResponse(accounts),
  text: 'selectAccountTo',
});

export const chooseIfInsertNoteResponse = (ctx: BotContext, notes: SelectItem[]): BotResponse => ({
  text: 'chooseIfInsertNote',
  options: Markup.keyboard([
    Markup.button.text(ctx.t(NO_RESPONSE)),
    ...notes.map((note) => Markup.button.text(note.label)),
  ])
    .oneTime()
    .resize(true),
});

export const operationAbortedResponse: BotResponse = {
  text: 'operationAborted',
  options: Markup.removeKeyboard(),
};

export const areYouSureToSaveResponse = (ctx: BotContext): BotResponse => ({
  text: 'areYouSureToSave',
  options: Markup.keyboard(
    saveSessionConfirmButtonsText.map((buttonText) => Markup.button.text(ctx.t(buttonText))),
  )
    .oneTime(),
});

export const savedSuccessfullyResponse: BotResponse = {
  text: 'savedSuccessfully',
  options: Markup.removeKeyboard(),
};
