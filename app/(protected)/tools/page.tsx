"use client";

import Text from "@/components/UI/Text";
import { 
  LuCalculator, 
  LuBus, 
  LuFileText, 
  LuCalendar, 
  LuMap, 
  LuGraduationCap, 
  LuChevronRight 
} from "react-icons/lu";

const TOOLS_CATEGORIES = [
  {
    title: "Académico",
    items: [
      { 
        name: "Calculadora de Promedio", 
        desc: "Calcula tu índice académico y proyecta tus notas finales.",
        icon: LuCalculator,
        color: "bg-blue-500",
        href: "/tools/promedio"
      },
      { 
        name: "Pensum de Estudios", 
        desc: "Consulta las materias y requisitos de tu carrera por semestre.",
        icon: LuGraduationCap,
        color: "bg-purple-500",
        href: "/tools/pensum"
      },
      { 
        name: "Repositorio de Guías", 
        desc: "Material de estudio, exámenes pasados y guías resueltas.",
        icon: LuFileText,
        color: "bg-orange-500",
        href: "/tools/recursos"
      }
    ]
  },
  {
    title: "Servicios Universitarios",
    items: [
      { 
        name: "Rutas de Transporte", 
        desc: "Horarios actualizados y paradas de las unidades de la UDO.",
        icon: LuBus,
        color: "bg-green-500",
        href: "/tools/rutas"
      },
      { 
        name: "Mapa del Campus", 
        desc: "Ubica los módulos, departamentos y áreas comunes.",
        icon: LuMap,
        color: "bg-red-500",
        href: "/tools/mapa"
      },
      { 
        name: "Calendario Académico", 
        desc: "Fechas de inscripciones, retiros y asuetos oficiales.",
        icon: LuCalendar,
        color: "bg-teal-500",
        href: "/tools/calendario"
      }
    ]
  }
];

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Encabezado */}
      <header className="mb-10 text-center md:text-left">
        <Text variant="lg" weight="bold" className="text-3xl text-gray-900">
          Herramientas Estudiantiles
        </Text>
        <Text className="text-gray-500 mt-2">
          Todo lo que necesitas para tu vida universitaria en la Universidad de Oriente.
        </Text>
      </header>

      {/* Grid de Categorías */}
      <div className="space-y-12">
        {TOOLS_CATEGORIES.map((category) => (
          <section key={category.title}>
            <Text weight="bold" className="text-lg text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              {category.title}
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 overflow-hidden"
                >
                  {/* Círculo de fondo decorativo al hacer hover */}
                  <div className={`absolute -right-8 -top-8 w-24 h-24 ${tool.color} opacity-[0.03] group-hover:opacity-10 rounded-full transition-all duration-500 group-hover:scale-150`}></div>

                  <div className="flex flex-col h-full">
                    <div className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/20`}>
                      <tool.icon size={24} />
                    </div>

                    <Text weight="bold" className="text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </Text>
                    
                    <Text variant="sm" className="text-gray-500 mt-2 flex-1">
                      {tool.desc}
                    </Text>

                    <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Explorar herramienta <LuChevronRight className="ml-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Informativo */}
      <footer className="mt-20 p-8 bg-gray-900 rounded-3xl text-center text-white">
        <Text weight="bold" className="text-xl mb-2 text-white">¿Tienes una idea?</Text>
        <Text variant="sm" className="text-white mb-6">
          Como proyecto de Ingeniería de Sistemas, UDO Social está abierto a nuevas herramientas.
        </Text>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors">
          Sugerir Funcionalidad
        </button>
      </footer>
    </div>
  );
}