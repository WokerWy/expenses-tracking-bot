import { BaseSession } from '../session.types';

export type WriteSessionOperation = 'expense' | 'income' | 'transfer';

type WriteSessionTag = {
  _tag: 'write'
}

type InitWriteSession = {
  operation: WriteSessionOperation
} & BaseSession & WriteSessionTag

export type AmountWriteSession = {
  amount: number
} & InitWriteSession

export type CategoryWriteSession = {
  category: string
} & AmountWriteSession

export type AccountWriteSession = {
  account: string
} & CategoryWriteSession

export type AccountFromWriteSession = {
  accountFrom: string
} & AmountWriteSession

export type AccountToWriteSession = {
  accountTo: string
} & AccountFromWriteSession

export type NoteWriteSession = {
  note: string
} & AccountWriteSession

export type TransferNoteWriteSession = {
  note: string
} & AccountToWriteSession

// Session State
export type InitStateWriteSession = {
  state: 'init'
} & InitWriteSession

export type AmountStateWriteSession = {
  state: 'amount'
  operation: Exclude<WriteSessionOperation, 'transfer'>
} & AmountWriteSession

export type TransferAmountStateWriteSession = {
  state: 'amount'
  operation: Extract<WriteSessionOperation, 'transfer'>
} & AmountWriteSession

export type CategoryStateWriteSession = {
  state: 'category'
  operation: Exclude<WriteSessionOperation, 'transfer'>
} & CategoryWriteSession

export type AccountStateWriteSession = {
  state: 'account'
  operation: Exclude<WriteSessionOperation, 'transfer'>
} & AccountWriteSession

export type AccountFromStateWriteSession = {
  state: 'accountFrom'
  operation: Extract<WriteSessionOperation, 'transfer'>
} & AccountFromWriteSession

export type AccountToStateWriteSession = {
  state: 'accountTo'
  operation: Extract<WriteSessionOperation, 'transfer'>
} & AccountToWriteSession

export type NoteStateWriteSession = {
  state: 'note'
  operation: Exclude<WriteSessionOperation, 'transfer'>
} & NoteWriteSession

export type WriteSession = InitStateWriteSession
  | AmountStateWriteSession
  | TransferAmountStateWriteSession
  | CategoryStateWriteSession
  | AccountStateWriteSession
  | AccountFromStateWriteSession
  | AccountToStateWriteSession
  | NoteStateWriteSession
