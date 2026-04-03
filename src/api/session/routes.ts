import express from 'express';
import { saveSession } from '../../services/session/write/save';
import { mapSessionBody } from './mappers';
import authenticateToken from '../auth';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const session = mapSessionBody(req.body);

  try {
    await saveSession(session);
    res.json({
      data: session,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
