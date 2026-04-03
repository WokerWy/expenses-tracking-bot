import express from 'express';
import { getAccounts } from '../../services/accounts/accounts';
import authenticateToken from '../auth';

const router = express.Router();

router.get('/:chatId', authenticateToken, async (req, res) => {
  try {
    const accounts = await getAccounts(Number(req.params.chatId));
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
