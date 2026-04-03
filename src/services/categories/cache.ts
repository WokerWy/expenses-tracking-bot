import Cache from '../../utils/cache';
import { CategoryType } from './categories.types';
import { SelectItem } from '../session/session.types';

export const getCategoriesFromCache = (type: CategoryType): SelectItem[] => Cache.getData<SelectItem[]>(`${type}:categories`);
export const saveCategoriesInCache = (type: CategoryType, categories: SelectItem[]) => Cache.setData(`${type}:categories`, categories);
export const hasCategoriesInCache = (type: CategoryType) => Cache.hasData(`${type}:categories`);
