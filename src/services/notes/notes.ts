import { getSheet } from '../../config/google-sheets';
import { SelectItem } from '../session/session.types';
import { SHEET_DB_ID } from '../../config';
import {
  getNotesFromCache,
  hasNotesInCache,
  saveNotesInCache,
} from './cache';

const getNotesSheet = async () => getSheet(SHEET_DB_ID, 'DB');

export const getNotes = async (
  categoryName: string,
  options = { useCache: true, updateCache: true },
): Promise<SelectItem[]> => {
  const { useCache, updateCache } = options;

  if (useCache && hasNotesInCache(categoryName)) {
    return getNotesFromCache(categoryName);
  }

  try {
    const sheet = await getNotesSheet();
    const rows = await sheet.getRows({ limit: 200, offset: 0 });
    const notes = [
      ...new Set(
        rows
          .filter((row) => row.get('category') === categoryName)
          .map((row) => String(row.get('note'))),
      ),
    ].map((label) => ({
      label,
      enabled: true,
    }));

    if (updateCache) {
      saveNotesInCache(categoryName, notes);
    }

    return notes;
  } catch (e) {
    throw new Error(`No notes found for category ${categoryName}`);
  }
};
