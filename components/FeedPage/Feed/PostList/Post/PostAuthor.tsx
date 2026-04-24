import Avatar from "@/components/Avatar";

export default function PostAuthor({ username, date, avatar }: { username: string, date: string, avatar: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <Avatar initialSrc={avatar} size="sm"/>
            <div>
                <p className="font-bold text-gray-900 text-sm">{username}</p>
                <p className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}