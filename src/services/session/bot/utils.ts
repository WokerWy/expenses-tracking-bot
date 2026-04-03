import { BotContext } from '../../../bot/bot.types';
import { All, NO_RESPONSE, YES_RESPONSE } from '../constants';
import { SelectItem } from '../session.types';

export const checkIfAnswerIsYes = (
  ctx: BotContext,
  answer: string,
) => ctx.t(YES_RESPONSE) === answer;

export const checkIfAnswerIsNo = (
  ctx: BotContext,
  answer: string,
) => ctx.t(NO_RESPONSE) === answer;

export const withAll = (ctx: BotContext, array: SelectItem[]): SelectItem[] => [
  { label: ctx.t(All), enabled: true },
  ...array,
];
