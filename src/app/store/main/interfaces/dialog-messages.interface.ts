import { IMessage } from 'src/app/routing/sections/main/interface/message.interface';

export interface IDialogMessages {
    receiverID: number
    messages: IMessage[]
}