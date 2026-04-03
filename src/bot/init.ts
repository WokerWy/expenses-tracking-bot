/* eslint-disable no-console */
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { Express } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { captureException } from '../config/sentry';
import { BotContext } from './bot.types';

const VERCEL_URL = `${process.env.VERCEL_URL}`;

export const initBotProduction = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: Telegraf<BotContext>,
) => {
  if (!VERCEL_URL) {
    throw new Error('VERCEL_URL is not set.');
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== `${VERCEL_URL}/bot`) {
    await bot.telegram.deleteWebhook();
    await bot.telegram.setWebhook(`${VERCEL_URL}/bot`);
  }

  if (req.method === 'POST') {
    await bot.handleUpdate(req.body as unknown as Update, res);
  } else {
    res.status(200).json('Listening to bot events...');
  }
};

export const initBotDevelopment = async (bot: Telegraf<BotContext>, app: Express) => {
  try {
    console.log('The bot is running locally');
    app.listen(process.env.PORT, () => console.log('Listening on port', process.env.PORT));

    await bot.launch({
      dropPendingUpdates: true,
    });
  } catch (e) {
    captureException(e);
  }
};
