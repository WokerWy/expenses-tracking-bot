import { getSheet } from '../../config/google-sheets';
import { SHEET_DB_ID } from '../../config';
import {
  getSheetConfigFromCache,
  hasSheetConfigInCache,
  saveSheetConfigInCache,
} from './cache';
import { SheetConfig, SheetConfigKey } from './sheetConfig.types';

const getConfigSheet = async () => getSheet(SHEET_DB_ID, 'EXTRA_CATEGORIES');

export const getSheetConfig = async (
  options = { useCache: true, updateCache: true },
): Promise<SheetConfig> => {
  try {
    const { useCache, updateCache } = options;
    if (useCache && hasSheetConfigInCache()) {
      return getSheetConfigFromCache();
    }

    const sheet = await getConfigSheet();
    const rows = await sheet.getRows({ limit: 50, offset: 0 });
    const data = rows.map((row) => ({
      config: row.get('config'),
      label: row.get('label'),
    })).reduce((acc, item) => {
      acc[item.config as SheetConfigKey] = item.label;
      return acc;
    }, {} as Record<SheetConfigKey, string>);

    if (updateCache) {
      saveSheetConfigInCache(data);
    }

    return data;
  } catch (e) {
    throw new Error(e);
  }
};
