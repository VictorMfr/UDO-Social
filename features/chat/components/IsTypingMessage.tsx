export default function IsTypingMessage() {
    return (
        <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-green-600 italic">escribiendo</span>
            <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
        </div>
    );
}