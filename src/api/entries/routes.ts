import 'dotenv';
import express from 'express';
import authenticateToken from '../auth';
import { getSheet } from '../../config/google-sheets';
import { SHEET_DB_ID } from '../../config';
import { formatAmount } from '../../utils/amount';

const router = express.Router();

const formatDate = (date: string): Date => {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      categories, accounts, users, from, to,
    } = req.query;
    const fromDate = from ? new Date(from as string) : new Date(0);
    const toDate = to ? new Date(to as string) : new Date();

    const sheet = await getSheet(SHEET_DB_ID, 'DB');
    const rows = await sheet.getRows({ limit: sheet.rowCount, offset: 0 });

    const result = rows.map((row) => ({
      date: formatDate(row.get('date')),
      amount: formatAmount(row.get('amount')),
      category: row.get('category'),
      account: row.get('account'),
      note: row.get('note'),
      user: row.get('user'),
    }))
      .filter((row) => row.date >= fromDate && row.date <= toDate)
      .filter((row) => (Array.isArray(categories) ? categories.includes(row.category) : true))
      .filter((row) => (Array.isArray(accounts) ? accounts.includes(row.account) : true))
      .filter((row) => (Array.isArray(users) ? users.includes(row.user) : true))
      .map((row) => ({
        date: row.date,
        amount: Number(row.amount),
        category: row.category,
        account: row.account,
        note: row.note,
        user: row.user,
      }));

    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
