export default function SearchContact() {
    return (
        <div className="animate-in fade-in duration-200">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {isSearching ? "Buscando..." : "Personas encontradas"}
            </p>
            {searchResults.map((u) => (
                <button
                    key={u.id}
                    onClick={() => {/* Aquí llamas a la función que abre la ventana de chat */ }}
                    className="w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors"
                >
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">@{u.username}</p>
                        <p className="text-[10px] text-blue-500">Click para iniciar chat</p>
                    </div>
                </button>
            ))}
            {!isSearching && searchResults.length === 0 && searchTerm.length > 2 && (
                <p className="p-4 text-center text-xs text-gray-500 italic">No se encontraron usuarios.</p>
            )}
        </div>
    );
}