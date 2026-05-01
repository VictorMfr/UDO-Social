import Link from "@/components/UI/Link";

export default function RegisterFooter() {
    return (
        <div className="text-center text-sm">
            <p className="text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <Link
                    href="/login"
                    size="none"
                    variant="ghost"
                    className="text-blue-600 font-bold hover:underline"
                >
                    Inicia sesion aquí
                </Link>
            </p>
        </div>
    );
}