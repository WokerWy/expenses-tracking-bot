import express, { Express } from 'express';
import cors from 'cors';
import entriesRoutes from './entries/routes';
import accountRoutes from './account/routes';
import categoryRoutes from './category/routes';
import userRoutes from './user/routes';

export const initApiApp = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  app.use('/api/entries', entriesRoutes);
  app.use('/api/accounts', accountRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/users', userRoutes);
  // app.use('/api/session', sessionRoutes);
};
