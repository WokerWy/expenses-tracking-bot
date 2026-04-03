import { canUseBot, canUseBotFromGroup } from '../config';

export const canUseAsGroupOrUser = (id: number) => canUseBotFromGroup(id) || canUseBot(id);
export const canUseAsGroup = (groupId: number) => canUseBotFromGroup(groupId);
export const canUseAsUser = (chatId: number) => canUseBot(chatId);
