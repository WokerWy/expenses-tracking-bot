import { WriteSessionOperation } from '../../services/session/write/session.types';

export type SessionDTO = {
  operation: WriteSessionOperation
  chatId: number
  amount: string
  category?: string
  note?: string
  account?: string
  accountFrom?: string
  accountTo?: string
}
