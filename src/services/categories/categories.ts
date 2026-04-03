import { getSheet } from '../../config/google-sheets';
import { CategoryType } from './categories.types';
import { SHEET_DB_ID } from '../../config';
import { getCategoriesFromCache, hasCategoriesInCache, saveCategoriesInCache } from './cache';
import { SelectItem } from '../session/session.types';

const getCategoriesSheet = async (categories: string) => getSheet(SHEET_DB_ID, categories);

export const getCategories = async (
  type: CategoryType,
  options = { useCache: true, updateCache: true },
): Promise<SelectItem[]> => {
  try {
    const { useCache, updateCache } = options;

    if (useCache && hasCategoriesInCache(type)) {
      return getCategoriesFromCache(type);
    }

    const sheet = await getCategoriesSheet(`${type.toUpperCase()}_CATEGORIES`);
    const rows = await sheet.getRows({ limit: 50, offset: 0 });
    const categories = rows.map((row) => ({
      label: row.get('label'),
      enabled: Boolean(Number(row.get('enabled'))),
    }));

    if (updateCache) {
      saveCategoriesInCache(type, categories);
    }

    return categories;
  } catch (e) {
    throw new Error(`No categories found for type ${type}`);
  }
};

export const isValidCategory = async (category: string, type: CategoryType): Promise<boolean> => {
  const categories = await getCategories(type);
  return categories.some((c) => c.label === category);
};
