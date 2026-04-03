import { Markup } from 'telegraf';
import { SelectItem } from '../session.types';
import { BotResponse } from '../../../bot/bot.types';

export const selectCategoryResponse = (categories: SelectItem[]): BotResponse => ({
  text: 'selectCategory',
  options: Markup.keyboard(
    categories
      .filter((category) => category.enabled)
      .map((category) => Markup.button.text(category.label)),
  ).oneTime(),
});

export const selectCategoryWithErrorResponse = (categories: SelectItem[]): BotResponse => ({
  ...selectCategoryResponse(categories),
  text: 'selectCategoryWithError',
});

export const selectAccountResponse = (accounts: SelectItem[]): BotResponse => ({
  text: 'selectAccount',
  options: Markup.keyboard(
    accounts
      .filter((account) => account.enabled)
      .map((account) => Markup.button.text(account.label)),
  ).oneTime(),
});

export const selectAccountWithErrorResponse = (accounts: SelectItem[]): BotResponse => ({
  ...selectAccountResponse(accounts),
  text: 'selectAccountWithError',
});

export const operationDefaultErrorResponse: BotResponse = {
  text: 'error',
};
