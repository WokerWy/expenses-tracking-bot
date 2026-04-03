import { getSheet } from '../../config/google-sheets';
import { UserSelectItem } from './users.types';
import { SHEET_DB_ID } from '../../config';
import {
  getUsersFromCache,
  hasUsersInCache,
  saveUsersInCache,
} from './cache';

const getUsersSheet = async () => getSheet(SHEET_DB_ID, 'USERS');

export const getUsers = async (
  options = { useCache: true, updateCache: true },
): Promise<UserSelectItem[]> => {
  try {
    const { useCache, updateCache } = options;
    if (useCache && hasUsersInCache()) {
      return getUsersFromCache();
    }

    const sheet = await getUsersSheet();
    const rows = await sheet.getRows({ limit: 50, offset: 0 });
    const data = rows.map((row) => ({
      label: row.get('label'),
      enabled: Boolean(Number(row.get('enabled'))),
      chatId: Number(row.get('chatId')),
    }));

    if (updateCache) {
      saveUsersInCache(data);
    }

    return data;
  } catch (e) {
    throw new Error(e);
  }
};

export const isValidUserChatId = async (chatId: number): Promise<boolean> => {
  const users = await getUsers();
  return users.some((u) => u.chatId === chatId);
};

export const getUserByChatId = async (chatId: number): Promise<UserSelectItem> => {
  const users = await getUsers();
  return users.find((user) => user.chatId === chatId);
};
