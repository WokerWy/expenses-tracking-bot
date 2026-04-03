import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const auth = async (sheetId: string): Promise<GoogleSpreadsheet> => {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return new GoogleSpreadsheet(sheetId, serviceAccountAuth);
};

export const getSheet = async (
  sheetId: string,
  sheetDocName: string,
): Promise<GoogleSpreadsheetWorksheet> => {
  const doc = await auth(sheetId);
  await doc.loadInfo();
  return doc.sheetsByTitle[sheetDocName];
};
