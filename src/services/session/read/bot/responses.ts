import { Markup } from 'telegraf';
import { ReadRanges } from '../constants';
import { BotContext, BotResponse } from '../../../../bot/bot.types';

export const chooseRangeResponse = (ctx: BotContext): BotResponse => ({
  text: 'chooseRange',
  options: Markup.keyboard(Object.values(ReadRanges)
    .map((range) => Markup.button.text(ctx.t(range))))
    .oneTime(),
});

export const chooseRangeWithErrorResponse = (ctx: BotContext): BotResponse => ({
  ...chooseRangeResponse(ctx),
  text: 'chooseRangeWithError',
});

export const chooseOperationTypeResponse = (operations: string[]): BotResponse => ({
  text: 'chooseOperationType',
  options: Markup.keyboard(operations
    .map((operation) => Markup.button.text(operation)))
    .oneTime(),
});

export const chooseOperationTypeWithErrorResponse = (operations: string[]): BotResponse => ({
  ...chooseOperationTypeResponse(operations),
  text: 'chooseOperationTypeWithError',
});
