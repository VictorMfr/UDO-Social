export default function DesktopOnly() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">¡Hola!</h1>
      <p className="text-gray-600 max-w-sm">
        Estamos construyendo la mejor experiencia para **UDO Social**. Por ahora, el acceso está limitado a computadoras de escritorio.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
        Próximamente disponible en dispositivos móviles.
      </div>
    </div>
  )
}