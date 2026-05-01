"use client";

import { useState } from "react";
import Text from "@/components/UI/Text";
import { 
  LuHeart, 
  LuCoffee, 
  LuBeer, 
  LuServer, 
  LuGlobe, 
  LuQrCode, 
  LuCopy, 
  LuCheck 
} from "react-icons/lu";

const DONATION_PLANS = [
  {
    id: "coffee",
    name: "Cómprame un café",
    amount: "$3",
    icon: LuCoffee,
    desc: "Un pequeño impulso para las sesiones de coding nocturnas.",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    id: "server",
    name: "Mantenimiento",
    amount: "$10",
    icon: LuServer,
    desc: "Ayuda a cubrir los costos de Supabase y el hosting del MVP.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: "pro",
    name: "Socio UDO Social",
    amount: "$25",
    icon: LuHeart,
    desc: "Contribuye al desarrollo de nuevas herramientas para la universidad.",
    color: "text-red-600",
    bg: "bg-red-50"
  }
];

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
          <LuHeart size={32} fill="currentColor" />
        </div>
        <Text variant="lg" weight="bold" className="text-3xl text-gray-900">
          Apoya el Proyecto
        </Text>
        <Text className="text-gray-500 mt-2 max-w-lg mx-auto">
          UDO Social es desarrollado por y para estudiantes. Tu contribución ayuda a mantener los servidores activos y a mejorar la plataforma.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {DONATION_PLANS.map((plan) => (
          <button
            key={plan.id}
            className="group p-6 bg-white border border-gray-200 rounded-2xl text-left hover:border-blue-500 hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 ${plan.bg} ${plan.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <plan.icon size={24} />
            </div>
            <Text weight="bold" className="text-gray-900">{plan.name}</Text>
            <Text weight="bold" className="text-2xl text-blue-600 my-1">{plan.amount}</Text>
            <Text variant="sm" className="text-gray-500 leading-tight">
              {plan.desc}
            </Text>
          </button>
        ))}
      </div>

      {/* Métodos de Pago */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100">
          <Text weight="bold" className="text-xl text-gray-800 flex items-center gap-2">
            <LuGlobe className="text-blue-600" /> Métodos Disponibles
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Pago Móvil / Local */}
          <div className="p-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Venezuela</span>
            </div>
            <Text weight="bold" className="text-gray-900 mb-4 block">Pago Móvil (BCV)</Text>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Banco:</strong> Banesco (0134)</p>
              <p><strong>Cédula:</strong> V-XX.XXX.XXX</p>
              <p><strong>Teléfono:</strong> 04XX-XXX-XXXX</p>
            </div>
          </div>

          {/* Crypto / Global */}
          <div className="p-8 flex flex-col items-center justify-center bg-gray-50/50">
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
              <LuQrCode size={120} className="text-gray-800" />
            </div>
            <Text variant="sm" weight="bold" className="text-gray-700 mb-2">Billetera USDT (BEP20)</Text>
            <div className="flex items-center gap-2 w-full max-w-[240px] bg-white border border-gray-200 p-2 rounded-lg">
              <code className="text-[10px] text-gray-500 truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
              <button 
                onClick={() => copyToClipboard("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-blue-600"
              >
                {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje Final */}
      <p className="text-center text-gray-400 text-xs mt-8">
        Al donar, aceptas que esto es una contribución voluntaria para el soporte de <strong>UDO Social</strong>. <br />
        ¡Gracias por creer en el talento de la Universidad de Oriente!
      </p>
    </div>
  );
}