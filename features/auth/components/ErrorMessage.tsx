import Text from "@/components/UI/Text";

export default function ErrorMessage({ error }: { error: string }) {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg" >
            <Text variant="xs" weight="semibold" className="text-red-700" >
                {error}
            </Text>
        </div>
    );
}