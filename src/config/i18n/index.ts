import { Middleware } from 'telegraf/typings';
import { I18n } from 'i18n';
import path from 'path';
import { BotContext } from '../../bot/bot.types';
import { captureException } from '../sentry';

export const locales = ['en', 'it'];
export const defaultLocale = 'en';

const i18n = new I18n({
  locales,
  directory: path.join(__dirname, '../../locales'),
});

export function useI18nMiddleware<C extends BotContext>(): Middleware<C> {
  return (ctx, next) => {
    try {
      if (ctx.session.locale) {
        i18n.setLocale(ctx.session.locale);
      } else if (ctx.from.language_code) {
        i18n.setLocale(ctx.from.language_code);
      } else {
        i18n.setLocale(defaultLocale);
      }

      ctx.i18n = i18n;
      ctx.t = (text, textReplacements) => i18n.__(text, textReplacements);
    } catch (error) {
      captureException(error);
      console.error(error);
    }

    return next();
  };
}
