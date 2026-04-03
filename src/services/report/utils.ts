import {
  AccountsByUser,
  AccountTotalByUser,
  CategoryTotal,
  DbRow,
} from './report.types';
import { getSheet } from '../../config/google-sheets';
import { SHEET_DB_ID, SHEET_DB_NAME } from '../../config';
import { isSameOrBefore, stringToDate } from '../../utils/date';
import { formatAmount } from '../../utils/amount';
import { SelectItem } from '../session/session.types';

export const createReportResult = () => {
  let report = '';

  const get = () => report;
  const set = (r: string) => {
    report = r;
  };

  return {
    get,
    set,
    addDataToNewLine: (data: string) => set(`${report} 
${data}`),
    addReportTitle: (title: string) => set(`${report}
*${title}*
${Array(title.length + 4).join('¯')}`),
    addReportSection: (title: string) => set(`${report} 
*${title}*
`),
    addNewLine: () => set(`${report}    
`),
  };
};

export const getSheetRows = async (): Promise<DbRow[]> => {
  const mainSheet = await getSheet(SHEET_DB_ID, SHEET_DB_NAME);
  const mainSheetRows = await mainSheet.getRows({ limit: 50000, offset: 0 });
  return mainSheetRows.map((row) => ({
    date: stringToDate(row.get('date')),
    amount: formatAmount(row.get('amount')),
    category: row.get('category').trim(),
    account: row.get('account').trim(),
    user: row.get('user').trim(),
  }));
};

export const onlyEnabled = (row: SelectItem) => row.enabled;

export const getAccountsTotalByUsers = async (
  rows: DbRow[],
  accountsByUsers: AccountsByUser[],
  options: {
    toDate?: Date;
  } = {
    toDate: null,
  },
): Promise<AccountTotalByUser[]> => {
  const result: AccountTotalByUser[] = [];
  const rowsByToDate = options.toDate
    ? rows.filter((row) => isSameOrBefore(row.date, options.toDate))
    : rows;

  accountsByUsers.forEach(({ user, accounts }) => {
    const userTotal = { expense: -0, income: 0 };
    const userAccounts = [];

    accounts.forEach((account) => {
      const accountRows = rowsByToDate.filter(
        (row) => row.account === account.label && row.user === user,
      );

      const accountTransactions = accountRows.reduce((acc, row) => {
        if (row.amount < 0) {
          return {
            ...acc,
            expense: acc.expense + Number(row.amount),
          };
        }

        if (row.amount > 0) {
          return {
            ...acc,
            income: acc.income + Number(row.amount),
          };
        }

        return acc;
      }, { expense: -0, income: 0 });

      userTotal.income += accountTransactions.income;
      userTotal.expense += accountTransactions.expense;

      userAccounts.push({
        account: account.label,
        income: accountTransactions.income,
        expense: accountTransactions.expense,
        total: accountTransactions.income + accountTransactions.expense,
      });
    });

    userAccounts.push({
      account: 'total',
      income: userTotal.income,
      expense: userTotal.expense,
      total: userTotal.income + userTotal.expense,
    });

    result.push({ user, accounts: userAccounts });
  });
  return result;
};
