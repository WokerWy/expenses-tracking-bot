import 'dotenv/config';
import { session, Telegraf } from 'telegraf';
import { useNewReplies } from 'telegraf/future';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initBotDevelopment, initBotProduction } from './bot/init';
import { initSentry } from './config/sentry';
import { setBotCommands } from './bot/commands';
import { setBotEvents } from './bot/events';
import { initApiApp } from './api';
import Cache from './utils/cache';
import { BotContext } from './bot/bot.types';
import { useI18nMiddleware } from './config/i18n';
import { getDefaultSession } from './config/session';

const app = express();
const bot: Telegraf<BotContext> = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({
  defaultSession: getDefaultSession,
}));
bot.use(useI18nMiddleware());
// https://github.com/telegraf/telegraf/releases/tag/v4.11.0
bot.use(useNewReplies());

setBotCommands(bot);
setBotEvents(bot);

initSentry();

export const startBot = async (req: VercelRequest, res: VercelResponse) => {
  await initBotProduction(req, res, bot);
};

// eslint-disable-next-line no-unused-expressions
process.env.NODE_ENV !== 'production' && initApiApp(app);

// eslint-disable-next-line no-unused-expressions
process.env.NODE_ENV !== 'production' && initBotDevelopment(bot, app);

process.once('SIGINT', async () => {
  Cache.flushAll();
  bot.stop('SIGINT');
});
process.once('SIGTERM', async () => {
  Cache.flushAll();
  bot.stop('SIGTERM');
});
