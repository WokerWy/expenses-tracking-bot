import { getSheet } from '../../../config/google-sheets';
import { WriteSession } from './session.types';
import { formatUTCDate, isValidDate } from '../../../utils/date';
import { SHEET_DB_ID, SHEET_DB_NAME } from '../../../config';
import {
  isAccountToStateWriteSession,
  isNoteStateWriteSession,
} from './predicates';
import { getUserByChatId, isValidUserChatId } from '../../user/users';
import { isValidAmount } from '../../../utils/amount';
import { isValidCategory } from '../../categories/categories';
import { WriteSessionOperationKeys } from './constants';
import { isValidAccount } from '../../accounts/accounts';
import { getSheetConfig } from '../../../services/sheetConfig/sheetConfig';

const getSessionSheet = async () => getSheet(SHEET_DB_ID, SHEET_DB_NAME);

const validateWriteSession = async (session: WriteSession): Promise<true> => {
  const error = (d: string) => {
    throw new Error(`Session "${d}" is not valid`);
  };

  if (!isNoteStateWriteSession(session) && !isAccountToStateWriteSession(session)) {
    return error('state');
  }

  if (!isValidAmount(session.amount)) {
    return error('amount');
  }

  if (!isValidDate(session.createdAt)) {
    return error('date');
  }

  if (!(await isValidUserChatId(session.chatId))) {
    return error('chatId');
  }

  if (!WriteSessionOperationKeys[session.operation]) {
    return error('operation');
  }

  if (session.operation !== 'transfer') {
    if (!(await isValidCategory(session.category, WriteSessionOperationKeys[session.operation]))) {
      return error('category');
    }

    if (!(await isValidAccount(session.account, session.chatId))) {
      return error('account');
    }
  } else {
    if (!(await isValidAccount(session.accountFrom, session.chatId))) {
      return error('accountFrom');
    }
    if (!(await isValidAccount(session.accountTo, session.chatId))) {
      return error('accountTo');
    }
  }

  return true;
};

export const saveSession = async (session: WriteSession) => {
  try {
    await validateWriteSession(session);

    const sheet = await getSessionSheet();
    const sheetConfig = await getSheetConfig();

    if (isNoteStateWriteSession(session)) {
      await sheet.insertDimension('ROWS', { startIndex: 1, endIndex: 2 }, false);
      await sheet.addRow({
        date: formatUTCDate(session.createdAt),
        user: (await getUserByChatId(session.chatId)).label,
        account: session.account,
        category: session.category,
        amount: session.amount * (session.operation === 'expense' ? -1 : 1),
        note: session.note,
      });
    }

    if (isAccountToStateWriteSession(session)) {
      await sheet.insertDimension('ROWS', { startIndex: 1, endIndex: 3 }, false);

      await sheet.addRow({
        date: formatUTCDate(session.createdAt),
        user: (await getUserByChatId(session.chatId)).label,
        account: session.accountFrom,
        category: sheetConfig.transfer,
        amount: session.amount * -1,
        note: '',
      });

      await sheet.addRow({
        date: formatUTCDate(session.createdAt),
        user: (await getUserByChatId(session.chatId)).label,
        account: session.accountTo,
        category: sheetConfig.transfer,
        amount: session.amount,
        note: '',
      });
    }

    return true;
  } catch (e) {
    throw new Error(e);
  }
};
