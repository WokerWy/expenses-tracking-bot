import {
  AccountStateWriteSession,
  CategoryStateWriteSession,
  InitStateWriteSession,
  NoteStateWriteSession,
  WriteSession,
  AmountStateWriteSession,
  AccountFromStateWriteSession,
  AccountToStateWriteSession,
  // TransferNoteStateWriteSession,
  TransferAmountStateWriteSession,
} from './session.types';

export const isInitStateWriteSession = (session: WriteSession): session is InitStateWriteSession => session.state === 'init';
export const isAmountStateWriteSession = (session: WriteSession): session is AmountStateWriteSession => session.state === 'amount' && session.operation !== 'transfer';
export const isTransferAmountStateWriteSession = (session: WriteSession): session is TransferAmountStateWriteSession => session.state === 'amount' && session.operation === 'transfer';
export const isAccountFromStateWriteSession = (session: WriteSession): session is AccountFromStateWriteSession => session.state === 'accountFrom';
export const isAccountToStateWriteSession = (session: WriteSession): session is AccountToStateWriteSession => session.state === 'accountTo';
export const isCategoryStateWriteSession = (session: WriteSession): session is CategoryStateWriteSession => session.state === 'category';
export const isAccountStateWriteSession = (session: WriteSession): session is AccountStateWriteSession => session.state === 'account';
export const isNoteStateWriteSession = (session: WriteSession): session is NoteStateWriteSession => session.state === 'note';
