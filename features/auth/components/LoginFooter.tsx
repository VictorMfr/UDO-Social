import Link from "@/components/UI/Link";
import Text from "@/components/UI/Text";

export default function LoginFooter() {
    return (
        <div className="text-center">
            <Text variant="sm" className="text-gray-500">
                ¿No tienes una cuenta?{" "}
                <Link
                    href="/register"
                    size="none"
                    variant="ghost"
                    className="text-blue-600 font-bold hover:underline"
                >
                    Regístrate aquí
                </Link>
            </Text>
        </div>
    );
}