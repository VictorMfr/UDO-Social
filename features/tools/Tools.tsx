"use client";

import {  
  LuBookOpen,  
  LuHeartPulse, 
  LuExternalLink 
} from "react-icons/lu";

const TOOL_OPTIONS = [
  { 
    name: "Recursos Académicos", 
    icon: LuBookOpen, 
    description: "Guías y material de la UDO",
    href: "/tools" 
  },
  { 
    name: "Donaciones", 
    icon: LuHeartPulse, 
    description: "Buy me a coffe",
    href: "/donate" 
  },
];

export default function Tools() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm tracking-tight">Herramientas</h3>
      </div>

      <nav className="flex flex-col">
        {TOOL_OPTIONS.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            className="group flex items-start gap-3 p-4 hover:bg-blue-50 transition-colors duration-200"
          >
            <div className="mt-1 p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              <tool.icon size={18} className="text-gray-600 group-hover:text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                  {tool.name}
                </span>
                <LuExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 group-hover:text-blue-500/70 leading-tight">
                {tool.description}
              </p>
            </div>
          </a>
        ))}
      </nav>

      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
          UDO Social v1.0
        </span>
      </div>
    </div>
  );
}