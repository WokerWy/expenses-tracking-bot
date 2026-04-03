import { Session } from './session.types';
import { ReadSession } from './read/session.types';
import { WriteSession } from './write/session.types';

export const isReadSession = (session: Session): session is ReadSession => session._tag === 'read';
export const isWriteSession = (session: Session): session is WriteSession => session._tag === 'write';
