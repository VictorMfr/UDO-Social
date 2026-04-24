import Header from "@/components/UI/Header";
import Text from "@/components/UI/Text";
import Title from "@/components/UI/Title";
import Link from "@/components/UI/Link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HEADER (h-16 = 64px) */}
      <Header auth={false} />

      {/* HERO SECTION */}
      <section className="relative px-6 min-h-[calc(100vh-65px)] flex items-center">

        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landingPage/udo-monagas-background.webp"
            alt="Campus UDO Monagas"
            fill 
            priority 
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        </div>

        {/* MAIN CONTENT */}
        {/* Cambiamos py-28 por w-full para que el flex lo centre verticalmente */}
        <main className="relative z-10 w-full py-16"> 
          <section className="max-w-3xl mx-auto text-center">
            <div className="space-y-4">
              <Title className=" md:text-6xl font-black">
                Conecta con la comunidad de la <span className="text-blue-600">UDO Monagas</span>
              </Title>
              <Text className="max-w-xl mx-auto text-lg">
                La red exclusiva para Ingeniería de Sistemas.
                Comparte, publica y chatea en tiempo real.
              </Text>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
              <Link
                href="/register"
                size="sm"
                variant="solid"
                className="w-full sm:w-auto"
              >
                <Text variant="sm" className="text-white">Empezar ahora</Text>
              </Link>
              <Link
                href="/about"
                size="sm"
                variant="outline"
              >
                <Text variant="sm">Saber más</Text>
              </Link>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}