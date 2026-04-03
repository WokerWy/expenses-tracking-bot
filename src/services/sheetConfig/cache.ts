import Cache from '../../utils/cache';
import { SheetConfig } from './sheetConfig.types';

export const getSheetConfigFromCache = (): SheetConfig => Cache.getData<SheetConfig>('sheet_config');
export const saveSheetConfigInCache = (sheetConfig: SheetConfig) => Cache.setData('sheet_config', sheetConfig);
export const hasSheetConfigInCache = () => Cache.hasData('sheet_config');
