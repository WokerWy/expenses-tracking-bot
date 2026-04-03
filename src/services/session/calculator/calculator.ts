import Cache from '../../../utils/cache';
import { calculateByStringExpression } from '../../../utils/calculate';
import { CalculatorResponse } from './calculator.types';
import { CACHE_CALCULATION_STRING_KEY } from './constants';
import { BOT_CALLBACK_DATA } from '../../../bot/messages';

export const handleWriteSessionCalculate = (
  data: string,
): CalculatorResponse => {
  const calculation = Cache.getData<string>(CACHE_CALCULATION_STRING_KEY) ?? '';
  switch (data) {
    case BOT_CALLBACK_DATA.calculator.equal: {
      const result = calculateByStringExpression(calculation);
      if (!Number.isNaN(Number(result))) {
        Cache.setData(CACHE_CALCULATION_STRING_KEY, result);
      }
      break;
    }
    case BOT_CALLBACK_DATA.calculator.backspace: {
      const newCalculation = calculation.slice(0, -1) || '0';
      Cache.setData(CACHE_CALCULATION_STRING_KEY, newCalculation);
      break;
    }
    case BOT_CALLBACK_DATA.calculator.clear: {
      Cache.setData(CACHE_CALCULATION_STRING_KEY, '0');
      break;
    }
    case BOT_CALLBACK_DATA.calculator.empty:
      break;
    case BOT_CALLBACK_DATA.calculator.confirm: {
      const result = calculateByStringExpression(calculation);
      if (!Number.isNaN(Number(result))) {
        Cache.deleteData(CACHE_CALCULATION_STRING_KEY);
        return { result, calculation };
      }
      break;
    }
    default:
      Cache.setData(CACHE_CALCULATION_STRING_KEY, `${calculation === '0' ? '' : calculation}${data.toString()}`);
      break;
  }

  return {
    calculation: Cache.getData(CACHE_CALCULATION_STRING_KEY) ?? '',
    result: null,
  };
};
