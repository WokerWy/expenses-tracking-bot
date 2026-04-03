import Cache from '../../utils/cache';
import { UserSelectItem } from './users.types';

export const getUsersFromCache = (): UserSelectItem[] => Cache.getData<UserSelectItem[]>('users');
export const saveUsersInCache = (users: UserSelectItem[]) => Cache.setData('users', users);
export const hasUsersInCache = () => Cache.hasData('users');
