import Cache from '../../utils/cache';
import { SelectItem } from '../session/session.types';

export const getAccountsFromCache = (chatId: number): SelectItem[] => Cache.getData<SelectItem[]>(`${chatId}:account`);
export const saveAccountsInCache = (chatId: number, accounts: SelectItem[]) => Cache.setData(`${chatId}:account`, accounts);
export const hasAccountInCache = (chatId: number) => Cache.hasData(`${chatId}:account`);
