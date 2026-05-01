import Card from "@/components/UI/Card"
import Text from "@/components/UI/Text"
import Title from "@/components/UI/Title"

export default function AuthLayout({ 
    children, 
    title, 
    subtitle 
}: { 
    children: React.ReactNode, 
    title: string, 
    subtitle: string 
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card variant="flat" padding="lg" className="max-w-sm w-full space-y-8">

                {/* Encabezado */}
                <div className="text-center space-y-2">
                    <Title variant="h3" weight="black">
                        {title}
                    </Title>
                    <Text variant="sm" className="text-gray-500">
                        {subtitle}
                    </Text>
                </div>

                {children}
            </Card>
        </div>
    )
}