import { Markup } from 'telegraf';
import { BOT_CALLBACK_DATA } from '../../../bot/messages';

export const calculatorMarkup = Markup.inlineKeyboard([
  [Markup.button.callback('÷', '/'),
    Markup.button.callback('×', '*'),
    Markup.button.callback('-', '-'),
    Markup.button.callback('+', '+')],
  [Markup.button.callback('7', '7'),
    Markup.button.callback('8', '8'),
    Markup.button.callback('9', '9'),
    Markup.button.callback('=', BOT_CALLBACK_DATA.calculator.equal)],
  [Markup.button.callback('4', '4'),
    Markup.button.callback('5', '5'),
    Markup.button.callback('6', '6'),
    Markup.button.callback(',', '.')],
  [Markup.button.callback('1', '1'),
    Markup.button.callback('2', '2'),
    Markup.button.callback('3', '3'),
    Markup.button.callback('◀️', BOT_CALLBACK_DATA.calculator.backspace)],
  [Markup.button.callback('❌', BOT_CALLBACK_DATA.calculator.clear),
    Markup.button.callback('0', '0'),
    Markup.button.callback(' ', BOT_CALLBACK_DATA.calculator.empty),
    Markup.button.callback('✅', BOT_CALLBACK_DATA.calculator.confirm)],
]);
