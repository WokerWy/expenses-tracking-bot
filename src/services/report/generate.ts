import { formatAmountToCurrency } from '../../utils/amount';
import { getUsers } from '../user/users';
import { getAccounts } from '../accounts/accounts';
import {
  createReportResult, getAccountsTotalByUsers, getSheetRows, onlyEnabled,
} from './utils';
import { getSheetConfig } from '../sheetConfig/sheetConfig';
import { BotContext } from '../../bot/bot.types';

export const generateAccountsReport = async (
  ctx: BotContext,
  chatId: number,
  toDate: Date = null,
): Promise<string> => {
  const rows = await getSheetRows();
  const allUsers = await getUsers();
  const users = allUsers.filter(onlyEnabled);
  const selectedUser = users.find((u) => u.chatId === chatId);

  const accountsByUsers = [];
  for (const [, user] of users.entries()) {
    const allAccounts = await getAccounts(user.chatId, { useCache: false, updateCache: false });
    if (!selectedUser || (selectedUser && selectedUser.chatId === user.chatId)) {
      accountsByUsers.push({
        user: user.label,
        accounts: allAccounts,
      });
    }
  }

  const result = createReportResult();
  const accountsTotalByUsers = await getAccountsTotalByUsers(rows, accountsByUsers, {
    toDate,
  });
  let grandTotal = 0;
  accountsTotalByUsers.forEach(({ user, accounts }) => {
    result.addDataToNewLine(`__${user}:__`);

    accounts.forEach(({ account, total }) => {
      if (account === 'total') {
        grandTotal += total;
        result.addNewLine();
        result.addDataToNewLine(`*${ctx.t('total')}*: ||${formatAmountToCurrency(total)}||`);
      } else {
        result.addDataToNewLine(`*${account}*: ${formatAmountToCurrency(total)}`);
      }
    });
    result.addNewLine();
  });

  if (!selectedUser) {
    result.addDataToNewLine(`*${ctx.t('netWorth')}*: ||${formatAmountToCurrency(grandTotal)}||`);
  }

  return result.get();
};

export const generateBaseMonthStats = async (ctx: BotContext, chatId: number): Promise<string> => {
  const dbRows = await getSheetRows();
  const sheetConfig = await getSheetConfig();

  const rows = dbRows.filter((row) => {
    // Remove the rows with transfer or balance_update category (to avoid wrong totals)
    if (row.category === sheetConfig.transfer
      || row.category === sheetConfig.balance_update) {
      return false;
    }

    return row.date.getMonth() === new Date().getMonth()
      && row.date.getFullYear() === new Date().getFullYear();
  });

  const allUsers = await getUsers();
  const users = allUsers.filter(onlyEnabled);

  const user = users.find((u) => u.chatId === chatId)?.label;

  const total = { expense: -0, income: 0 };
  rows.forEach((row) => {
    if (user && row.user !== user) {
      return;
    }

    if (row.amount < 0) {
      total.expense += Number(row.amount);
    }

    if (row.amount > 0) {
      total.income += Number(row.amount);
    }
  });

  const result = createReportResult();
  result.addDataToNewLine(`*${ctx.t('income')}*: +${formatAmountToCurrency(total.income)}`);
  result.addDataToNewLine(`*${ctx.t('expense')}*: ${formatAmountToCurrency(total.expense)}`);
  result.addDataToNewLine(`*${ctx.t('total')}*: ${formatAmountToCurrency(total.income + total.expense)}`);

  return result.get();
};
