export default function PostAuthor({ username, date }: { username: string, date: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {username[0].toUpperCase()}
            </div>
            <div>
                <p className="font-bold text-gray-900 text-sm">{username}</p>
                <p className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}