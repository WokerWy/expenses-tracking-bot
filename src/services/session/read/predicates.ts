import {
  ReadSession,
  OperationStateReadSession,
  InitStateReadSession,
  CategoryStateReadSession,
  AccountStateReadSession,
  RangeStateReadSession,
  TotalAccountStateReadSession,
  TotalRangeStateReadSession,
} from './session.types';

export const isInitStateReadSession = (session: ReadSession): session is InitStateReadSession => session.state === 'init';
export const isOperationStateReadSession = (session: ReadSession): session is OperationStateReadSession => session.state === 'operation';
export const isCategoryStateReadSession = (session: ReadSession): session is CategoryStateReadSession => session.state === 'category';
export const isAccountStateReadSession = (session: ReadSession): session is AccountStateReadSession => session.state === 'account' && session.operation !== 'total';
export const isTotalAccountStateReadSession = (session: ReadSession): session is TotalAccountStateReadSession => session.state === 'account' && session.operation === 'total';
export const isRangeStateReadSession = (session: ReadSession): session is RangeStateReadSession => session.state === 'range';
export const isTotalRangeStateReadSession = (session: ReadSession): session is TotalRangeStateReadSession => session.state === 'range' && session.operation !== 'total';
