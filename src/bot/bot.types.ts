import { I18n, Replacements, TranslateOptions } from 'i18n';
import { Context, Markup } from 'telegraf';
import {
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  InlineKeyboardMarkup,
  Update,
} from 'telegraf/types';
import enLocale from '../locales/en.json';

export type BotResponse = {
  text: keyof typeof enLocale;
  textReplacements?: Replacements;
  options?: Markup.Markup<ReplyKeyboardMarkup | ReplyKeyboardRemove | InlineKeyboardMarkup>
};

export type TelegrafContextUpdate = Context<Update>

export type BotSessionData = {
  locale?: string;
}

export type BotSessionContext = TelegrafContextUpdate & { session: BotSessionData }

export type BotI18nContext = {
  i18n: I18n;
  t: (text: keyof typeof enLocale | TranslateOptions, textReplacements?: Replacements) => string;
};

export type BotContext = BotSessionContext & BotI18nContext
