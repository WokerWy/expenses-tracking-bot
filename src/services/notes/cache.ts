import Cache from '../../utils/cache';
import { SelectItem } from '../session/session.types';

export const getNotesFromCache = (categoryName: string): SelectItem[] => Cache.getData<SelectItem[]>(`${categoryName.trim()}:note`);
export const saveNotesInCache = (categoryName: string, note: SelectItem[]) => Cache.setData(`${categoryName.trim()}:note`, note);
export const hasNotesInCache = (categoryName: string) => Cache.hasData(`${categoryName.trim()}:note`);
