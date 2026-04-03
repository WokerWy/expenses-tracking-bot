import express from 'express';
import { getUsers } from '../../services/user/users';
import authenticateToken from '../auth';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
