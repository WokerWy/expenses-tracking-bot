import { Markup } from 'telegraf';
import { ReadSession } from '../session.types';
import { BotContext, BotResponse } from '../../../../bot/bot.types';
import {
  addSession, hasSession, removeSession, updateSession,
} from '../../cache';
import { getAccounts } from '../../../accounts/accounts';
import { getCategories } from '../../../categories/categories';
import {
  isAccountStateReadSession,
  isCategoryStateReadSession,
  isInitStateReadSession,
  isOperationStateReadSession,
  isTotalAccountStateReadSession,
} from '../predicates';
import {
  chooseOperationTypeResponse,
  chooseOperationTypeWithErrorResponse,
  chooseRangeResponse,
  chooseRangeWithErrorResponse,
} from './responses';
import { lookupSession } from '../lookup-session';
import {
  operationDefaultErrorResponse,
  selectAccountResponse,
  selectAccountWithErrorResponse,
  selectCategoryResponse, selectCategoryWithErrorResponse,
} from '../../bot/responses';
import { getKeyFromKeyLabelObject } from '../../../../utils/key-label';
import {
  ReadOperationsKeys,
  ReadRanges,
  ReadRangesKeys,
} from '../constants';
import { withAll } from '../../bot/utils';
import { getUsers } from '../../../user/users';
import { captureException } from '../../../../config/sentry';
import { All } from '../../constants';

export const handleReadSessionMessages = async (
  ctx: BotContext,
  session: ReadSession,
  userText: string,
): Promise<BotResponse> => {
  if (isInitStateReadSession(session)) {
    const accounts = withAll(ctx, await getAccounts(session.chatId));

    const readOperations = {
      expense: ctx.t('expense'),
      income: ctx.t('income'),
      total: ctx.t('total'),
    };

    const operation = getKeyFromKeyLabelObject(readOperations, userText);
    if (operation === undefined) {
      return chooseOperationTypeWithErrorResponse(Object.values(readOperations));
    }

    updateSession({
      ...session,
      state: 'operation',
      operation,
    });

    if (operation === ReadOperationsKeys.total) {
      return selectAccountResponse(accounts);
    }

    return selectCategoryResponse(withAll(ctx, await getCategories(operation)));
  }

  if (isOperationStateReadSession(session) && session.operation !== ReadOperationsKeys.total) {
    const accounts = withAll(ctx, await getAccounts(session.chatId));
    const categories = withAll(ctx, await getCategories(session.operation));

    if (!categories.some((category) => category.label === userText)) {
      return selectCategoryWithErrorResponse(categories);
    }

    updateSession({
      ...session,
      state: 'category',
      operation: session.operation,
      category: userText === ctx.t(All) ? All : userText,
    });

    return selectAccountResponse(accounts);
  }

  if (
    isCategoryStateReadSession(session)
    || (isOperationStateReadSession(session) && session.operation === ReadOperationsKeys.total)
  ) {
    const accounts = withAll(ctx, await getAccounts(session.chatId));
    if (!accounts.some((account) => account.label === userText)) {
      return selectAccountWithErrorResponse(accounts);
    }

    updateSession({
      ...session,
      state: 'account',
      account: userText === ctx.t(All) ? All : userText,
    });

    return chooseRangeResponse(ctx);
  }

  if (isAccountStateReadSession(session) || isTotalAccountStateReadSession(session)) {
    const translatedReadRanges = Object.entries(ReadRanges)
      .reduce((acc, [rangeKey, rangeValue]) => ({ ...acc, [rangeKey]: ctx.t(rangeValue) }), {});

    if (!Object.values(translatedReadRanges).includes(userText)) {
      return chooseRangeWithErrorResponse(ctx);
    }

    const updatedSession = updateSession({
      ...session,
      state: 'range',
      range: getKeyFromKeyLabelObject(translatedReadRanges, userText),
    });

    try {
      const result = await lookupSession(updatedSession);
      removeSession(session.chatId);

      const {
        category,
        account,
        range,
        operation,
      } = result;

      const categoryMessage = category === All
        ? ctx.t('categoryMessageAll')
        : ctx.t('categoryMessage', { category });

      const accountMessage = account === All
        ? ctx.t('accountMessageAll')
        : ctx.t('accountMessage', { account });

      const rangeMessage = range === ReadRangesKeys.all_time
        ? ''
        : ` ${ctx.t('rangeMessage', { range: ctx.t(ReadRanges[range]) })}`;

      const operationMessage = ctx.t(
        // eslint-disable-next-line no-nested-ternary
        operation === ReadOperationsKeys.total
          ? 'operationMessageTotal'
          : operation === ReadOperationsKeys.expense ? 'operationMessageExpense' : 'operationMessageIncome',
      );

      return {
        text: 'lookupResult',
        textReplacements: {
          rangeMessage,
          categoryMessage,
          accountMessage,
          operationMessage,
          result: result.total,
        },
        options: Markup.removeKeyboard(),
      };
    } catch (e) {
      captureException(e);
      return operationDefaultErrorResponse;
    }
  }

  captureException(new Error(`Session state not found: ${JSON.stringify(session)}`));
  return operationDefaultErrorResponse;
};

export const handleReadSessionCreate = async (
  ctx: BotContext,
  chatId: number,
): Promise<BotResponse> => {
  const hasActiveSession = hasSession(chatId);
  if (hasActiveSession) {
    return { text: 'sessionInProgress' };
  }

  // Preload users
  getUsers();

  // Preload accounts
  getAccounts(chatId);

  // Preload categories (expense as the most common)
  getCategories(ReadOperationsKeys.expense);

  try {
    addSession({
      _tag: 'read',
      state: 'init',
      createdAt: new Date(),
      chatId,
    });

    const operations = [ctx.t('expense'), ctx.t('income'), ctx.t('total')];
    return chooseOperationTypeResponse(operations);
  } catch (e) {
    throw new Error(e);
  }
};
