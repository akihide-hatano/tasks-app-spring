import { MessageType } from './MessageType';

export type Notice = {
    type: MessageType;
    message: string;
}