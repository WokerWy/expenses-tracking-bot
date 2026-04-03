import { getSheet } from '../../config/google-sheets';
import { SelectItem } from '../session/session.types';
import { SHEET_DB_ID } from '../../config';
import { getAccountsFromCache, hasAccountInCache, saveAccountsInCache } from './cache';

const getAccountSheet = async (chatId: number) => getSheet(SHEET_DB_ID, `${chatId}_ACCOUNTS`);

export const getAccounts = async (
  chatId: number,
  options = { useCache: true, updateCache: true },
): Promise<SelectItem[]> => {
  const { useCache, updateCache } = options;

  if (useCache && hasAccountInCache(chatId)) {
    return getAccountsFromCache(chatId);
  }

  try {
    const sheet = await getAccountSheet(chatId);
    const rows = await sheet.getRows({ limit: 50, offset: 0 });
    const accounts = rows.map((row) => ({
      label: row.get('label'),
      enabled: Boolean(Number(row.get('enabled'))),
    }));

    if (updateCache) {
      saveAccountsInCache(chatId, accounts);
    }

    return accounts;
  } catch (e) {
    throw new Error(`No accounts found for chatId ${chatId}`);
  }
};

export const isValidAccount = async (account: string, chatId: number): Promise<boolean> => {
  const accounts = await getAccounts(chatId);
  return accounts.some((a) => a.label === account);
};
