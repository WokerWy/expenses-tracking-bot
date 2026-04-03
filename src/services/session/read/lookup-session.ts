import { getSheet } from '../../../config/google-sheets';
import { SHEET_DB_ID, SHEET_DB_NAME } from '../../../config';
import { ReadSession } from './session.types';
import { isRangeStateReadSession, isTotalRangeStateReadSession } from './predicates';
import {
  ReadOperationsKeys,
  ReadRangesKeys,
} from './constants';
import { formatAmount, formatAmountToCurrency } from '../../../utils/amount';
import { All } from '../constants';
import { stringToDate } from '../../../utils/date';
import { getUsers } from '../../user/users';
import { getSheetConfig } from '../../sheetConfig/sheetConfig';

const getSessionSheet = async () => getSheet(SHEET_DB_ID, SHEET_DB_NAME);

export const lookupSession = async (session: ReadSession): Promise<{
  category: string,
  account: string,
  range: keyof typeof ReadRangesKeys,
  operation: string,
  total: string,
}> => {
  if (isRangeStateReadSession(session)) {
    const {
      operation,
      account,
      range,
      chatId,
    } = session;

    const users = await getUsers();
    const user = users.find((u) => u.chatId === chatId).label;

    const sheetConfig = await getSheetConfig();

    let category: string = All;
    if (isTotalRangeStateReadSession(session)) {
      category = session.category;
    }

    const sheet = await getSessionSheet();
    const rows = await sheet.getRows({ limit: 50000, offset: 0 });

    const rowsToAnalyze = rows.map((row) => ({
      date: stringToDate(row.get('date')),
      amount: formatAmount(row.get('amount')),
      category: row.get('category').trim(),
      account: row.get('account').trim(),
      user: row.get('user').trim(),
    })).filter((row) => {
      if (user !== row.user) {
        return false;
      }

      if (account !== All && account !== row.account) {
        return false;
      }

      if (category !== All && !row.category.includes(category)) {
        return false;
      }

      if (
        operation !== ReadOperationsKeys.total
        && ((operation === 'expense' && row.amount > 0)
        || (operation === 'income' && row.amount < 0))
      ) {
        return false;
      }

      if (operation !== ReadOperationsKeys.total
        && row.category === sheetConfig.transfer) {
        return false;
      }

      switch (range) {
        case ReadRangesKeys.today:
          return row.date.getMonth() === new Date().getMonth()
            && row.date.getFullYear() === new Date().getFullYear()
            && row.date.getDate() === new Date().getDate();
        case ReadRangesKeys.this_year:
          return row.date.getFullYear() === new Date().getFullYear();
        case ReadRangesKeys.this_month:
          return row.date.getMonth() === new Date().getMonth()
            && row.date.getFullYear() === new Date().getFullYear();
        case ReadRangesKeys.all_time:
          return true;
        default:
          break;
      }

      return true;
    });

    const total = rowsToAnalyze
      .reduce(
        (acc, row) => acc + row.amount,
        0,
      );

    return {
      category,
      account,
      range,
      operation,
      total: formatAmountToCurrency(total),
    };
  }

  throw new Error('Invalid read session state');
};
