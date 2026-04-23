export default function PostMedia({ media_url }: { media_url?: string }) {

    if (!media_url) {
        return;
    }

    return (
        <img
            src={media_url}
            alt="Post media"
            className="mt-3 rounded-lg w-full object-cover max-h-96"
        />
    )
}