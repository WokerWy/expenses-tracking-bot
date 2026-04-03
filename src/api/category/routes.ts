import express from 'express';
import { getCategories } from '../../services/categories/categories';
import { CategoryType } from '../../services/categories/categories.types';
import authenticateToken from '../auth';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    const categories: {
      [type: string]: {
        label: string
        enabled: boolean
      }[]
    } = {};

    if (type) {
      categories[type as string] = await getCategories(req.params.type as CategoryType);
    } else {
      categories.expense = await getCategories('expense');
      categories.income = await getCategories('expense');
    }

    res.status(200).json(categories);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
