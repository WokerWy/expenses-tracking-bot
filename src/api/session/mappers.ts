import { WriteSession } from '../../services/session/write/session.types';
import { formatAmount } from '../../utils/amount';
import { SessionDTO } from './types';

export const mapSessionBody = (body: SessionDTO): WriteSession => {
  const amount = formatAmount(body.amount);
  const createdAt = new Date();
  if (body.operation === 'transfer') {
    return {
      _tag: 'write',
      state: 'accountTo',
      operation: body.operation,
      accountTo: body.accountTo,
      accountFrom: body.accountFrom,
      amount,
      createdAt,
      chatId: body.chatId,
    };
  }
  return {
    _tag: 'write',
    state: 'note',
    operation: body.operation,
    note: body.note ?? '',
    account: body.account,
    category: body.category,
    amount,
    createdAt,
    chatId: body.chatId,
  };
};
