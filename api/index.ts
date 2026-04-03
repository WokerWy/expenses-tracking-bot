import express from 'express';
import { initApiApp } from '../src/api';

const app = express();

initApiApp(app);

export default app;
