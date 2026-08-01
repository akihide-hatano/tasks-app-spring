import type { MessageType } from "./MessageType";

type MessageProps = {
    type: MessageType;
    message: string;
}

const styleMap:Record<MessageType, string> ={
    success: "mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700",
    error: "mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700",
    warning: "mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700",
    info: "mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700",
}

function Message({ type, message }: MessageProps) {
    return (
        <div className={` mb-6 rounded-lg border px-4 py-3
                        ${styleMap[type]}`}>
            {message}
        </div>
    );
}

export default Message;