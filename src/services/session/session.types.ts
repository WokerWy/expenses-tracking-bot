import { WriteSession } from './write/session.types';
import { ReadSession } from './read/session.types';

export type SelectItem = {
  label: string
  enabled: boolean
}

export type BaseSession = {
  chatId: number
  createdAt: Date
}

export type Session = WriteSession | ReadSession
