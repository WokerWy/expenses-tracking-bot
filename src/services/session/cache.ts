import Cache from '../../utils/cache';
import { Session } from './session.types';

export const getSession = (chatId: number): Session | null => Cache.getData<Session>(`session:${chatId}`) ?? null;

export const hasSession = (chatId: number) => !!getSession(chatId);

export const addSession = (session: Session) => {
  Cache.setData(`session:${session.chatId}`, session);
};

export const updateSession = <T extends Session>(session: T): T => {
  const hasActiveSession = hasSession(session.chatId);
  if (!hasActiveSession) {
    throw new Error('Session not found');
  }

  Cache.setData(`session:${session.chatId}`, session);
  return session;
};

export const removeSession = (chatId: number) => {
  const hasActiveSession = hasSession(chatId);
  if (!hasActiveSession) {
    return;
  }
  Cache.deleteData(`session:${chatId}`);
};
