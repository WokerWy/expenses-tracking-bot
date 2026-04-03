import { VercelRequest, VercelResponse } from '@vercel/node';
import { startBot } from '../../src';

export default async function handle(req: VercelRequest, res: VercelResponse) {
  try {
    await startBot(req, res);
  } catch (e: unknown) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
  }
}
