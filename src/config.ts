import 'dotenv/config';
import * as process from 'process';

export const ALLOWED_GROUP_IDS = Array.isArray(JSON.parse(process.env.ALLOWED_GROUP_IDS))
  ? JSON.parse(process.env.ALLOWED_GROUP_IDS)
  : [];
export const ALLOWED_CHAT_IDS = Array.isArray(JSON.parse(process.env.ALLOWED_CHAT_IDS))
  ? JSON.parse(process.env.ALLOWED_CHAT_IDS)
  : [];

export const canUseBot = (chatId: number) => ALLOWED_CHAT_IDS.includes(chatId);
export const canUseBotFromGroup = (groupId: number) => ALLOWED_GROUP_IDS.includes(groupId);

export const { SHEET_DB_ID, SHEET_DB_NAME } = process.env;
export const SENTRY_DSN = process.env.SENTRY_DNS || null;
