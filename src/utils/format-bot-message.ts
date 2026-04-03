export const formatBotMessageForMarkdownV2 = (message: string) => message
  .replace(/\./g, '\\.')
  .replace(/\+/g, '\\+')
  .replace(/-/g, '\\-')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');
