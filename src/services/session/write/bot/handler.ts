import { WriteSessionOperation, WriteSession } from '../session.types';
import { getAccounts } from '../../../accounts/accounts';
import { WriteSessionOperationKeys } from '../constants';
import { getCategories } from '../../../categories/categories';
import {
  isAccountFromStateWriteSession,
  isAccountStateWriteSession, isAccountToStateWriteSession,
  isAmountStateWriteSession, isCategoryStateWriteSession,
  isInitStateWriteSession, isNoteStateWriteSession,
  isTransferAmountStateWriteSession,
} from '../predicates';
import { formatAmount, isValidAmount } from '../../../../utils/amount';
import {
  areYouSureToSaveResponse,
  chooseIfInsertNoteResponse, insertAmountResponse,
  insertAmountWithErrorResponse,
  operationAbortedResponse,
  savedSuccessfullyResponse,
  selectAccountFromResponse,
  selectAccountToResponse,
} from './responses';

import {
  operationDefaultErrorResponse,
  selectAccountResponse,
  selectCategoryResponse,
  selectAccountWithErrorResponse,
  selectCategoryWithErrorResponse,
} from '../../bot/responses';

import {
  addSession, hasSession, removeSession, updateSession,
} from '../../cache';
import { checkIfAnswerIsNo, checkIfAnswerIsYes } from '../../bot/utils';
import { saveSession } from '../save';
import { BotContext, BotResponse } from '../../../../bot/bot.types';
import { SelectItem } from '../../session.types';
import { getUsers } from '../../../user/users';
import { captureException } from '../../../../config/sentry';
import { getNotes } from '../../../notes/notes';
import { getSheetConfig } from '../../../../services/sheetConfig/sheetConfig';

export const handleWriteSessionMessages = async (
  ctx: BotContext,
  session: WriteSession,
  userText: string,
): Promise<BotResponse> => {
  const accounts = await getAccounts(session.chatId);

  let categories: SelectItem[] = [];
  if (session.operation !== WriteSessionOperationKeys.transfer) {
    categories = await getCategories(session.operation);
  }

  if (isInitStateWriteSession(session)) {
    const amount = formatAmount(userText);
    if (!isValidAmount(amount)) {
      return insertAmountWithErrorResponse(ctx);
    }
    updateSession({
      ...session,
      state: 'amount',
      amount: Number(amount),
    });

    if (session.operation === 'transfer') {
      return selectAccountFromResponse(accounts);
    }

    return selectCategoryResponse(categories);
  }

  if (isAmountStateWriteSession(session)) {
    if (!categories.some((category) => category.label === userText)) {
      return selectCategoryWithErrorResponse(categories);
    }

    updateSession({
      ...session,
      state: 'category',
      category: String(userText),
    });

    // Preload notes (by category)
    getNotes(String(userText));

    return selectAccountResponse(accounts);
  }

  if (isTransferAmountStateWriteSession(session)) {
    if (!accounts.some((account) => account.label === userText)) {
      return selectAccountWithErrorResponse(accounts);
    }

    updateSession({
      ...session,
      state: 'accountFrom',
      accountFrom: String(userText),
    });

    return selectAccountToResponse(accounts);
  }

  if (isCategoryStateWriteSession(session)) {
    if (!accounts.some((account) => account.label === userText)) {
      return selectAccountWithErrorResponse(accounts);
    }

    updateSession({
      ...session,
      state: 'account',
      account: String(userText),
    });

    const notes = await getNotes(session.category);
    return chooseIfInsertNoteResponse(ctx, notes);
  }

  if (isAccountStateWriteSession(session)) {
    updateSession({
      ...session,
      state: 'note',
      note: checkIfAnswerIsNo(ctx, userText) ? '' : String(userText),
    });
    return areYouSureToSaveResponse(ctx);
  }

  if (isAccountFromStateWriteSession(session)) {
    if (!accounts.some((account) => account.label === userText)) {
      return selectAccountWithErrorResponse(accounts);
    }

    updateSession({
      ...session,
      state: 'accountTo',
      accountTo: String(userText),
    });

    return areYouSureToSaveResponse(ctx);
  }

  if (isNoteStateWriteSession(session) || isAccountToStateWriteSession(session)) {
    if (checkIfAnswerIsNo(ctx, userText)) {
      removeSession(session.chatId);
      return operationAbortedResponse;
    }

    if (checkIfAnswerIsYes(ctx, userText)) {
      try {
        await saveSession(session);
        removeSession(session.chatId);
        return savedSuccessfullyResponse;
      } catch (e) {
        captureException(e);
        return operationDefaultErrorResponse;
      }
    }

    return areYouSureToSaveResponse(ctx);
  }

  captureException(new Error(`Session state not found: ${JSON.stringify(session)}`));
  return operationDefaultErrorResponse;
};

export const handleWriteSessionCreate = (
  ctx: BotContext,
  chatId: number,
  operation: WriteSessionOperation,
): BotResponse => {
  const hasActiveSession = hasSession(chatId);
  if (hasActiveSession) {
    return { text: 'sessionInProgress' };
  }

  // Preload config
  getSheetConfig();

  // Preload users
  getUsers();

  // Preload categories if operation is not transfer
  if (operation !== WriteSessionOperationKeys.transfer) {
    getCategories(operation);
  }

  // Preload accounts
  getAccounts(chatId);

  try {
    addSession({
      _tag: 'write',
      state: 'init',
      createdAt: new Date(),
      chatId,
      operation,
    });

    return insertAmountResponse(ctx);
  } catch (e) {
    throw new Error(e);
  }
};
