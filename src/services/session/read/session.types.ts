import { BaseSession } from '../session.types';
import { All as AllLabel } from '../constants';
import { ReadOperationsKeys, ReadRangesKeys } from './constants';

export type ReadSessionOperation = keyof typeof ReadOperationsKeys;
export type ReadSessionRange = keyof typeof ReadRangesKeys;
export type All = typeof AllLabel;

type ReadSessionTag = {
  _tag: 'read'
}

type InitReadSession = BaseSession & ReadSessionTag

export type OperationReadSession = {
  operation: ReadSessionOperation
} & InitReadSession

export type CategoryReadSession = {
  category: string | All
} & OperationReadSession

export type AccountReadSession = {
  account: string | All
} & OperationReadSession

export type TotalAccountReadSession = {
  account: string | All
} & CategoryReadSession

export type RangeReadSession = {
  range: ReadSessionRange
} & (AccountReadSession | TotalAccountReadSession)

export type TotalRangeReadSession = {
  range: ReadSessionRange
} & TotalAccountReadSession

// Session State
export type InitStateReadSession = {
  state: 'init'
} & InitReadSession

export type OperationStateReadSession = {
  state: 'operation'
} & OperationReadSession

export type CategoryStateReadSession = {
  state: 'category'
  operation: Exclude<ReadSessionOperation, 'total'>
} & CategoryReadSession

export type AccountStateReadSession = {
  state: 'account',
} & AccountReadSession

export type TotalAccountStateReadSession = {
  state: 'account',
} & TotalAccountReadSession

export type RangeStateReadSession = {
  state: 'range'
} & RangeReadSession

export type TotalRangeStateReadSession = {
  state: 'range'
  operation: Extract<ReadSessionOperation, 'total'>
} & TotalRangeReadSession

export type ReadSession = InitStateReadSession
  | OperationStateReadSession
  | CategoryStateReadSession
  | AccountStateReadSession
  | TotalAccountStateReadSession
  | RangeStateReadSession
  | TotalRangeStateReadSession;
