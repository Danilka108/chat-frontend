export class WsEvents {
    static readonly user = {
        connect: 'user:connect',
        connectSuccess: 'user:connect_success',
        invalidToken: 'user:invalid_token',
        newMessage: 'user:new_message',
        newDialog: 'user:new_dialog',
        allMessagesRead: 'user:all_messages_read',
    }
}
