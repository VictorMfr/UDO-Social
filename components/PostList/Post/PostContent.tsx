export default function PostContent({ content }: { content: string }) {
    return (
        <p className="text-gray-800 leading-relaxed">
            {content}
        </p>
    );
}