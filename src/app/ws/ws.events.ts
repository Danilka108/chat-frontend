export class WsEvents {
    static readonly user = {
        invalidToken: 'user:invalid_token',
        connectSuccess: 'user:connect_success',
        newMessage: 'user:new_message',
        newDialog: 'user:new_dialog',
        allMessagesRead: 'user:all_messages_read',
        messageRead: 'user:message_read',
        connect: 'user:connect',
        connectionStatus: 'user:connection_status',
    }
}
