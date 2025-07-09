import SimpleMenuHeader from '../classes/menus/SimpleMenuHeader.js';
import Notification from '../classes/Notification.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { IGetNotificationsMenuResponse } from '../types/index.js';
export default class NotificationsMenu {
    #private;
    header: SimpleMenuHeader;
    contents: Notification[];
    constructor(actions: Actions, response: ApiResponse);
    getContinuation(): Promise<NotificationsMenu>;
    get page(): IGetNotificationsMenuResponse;
}
