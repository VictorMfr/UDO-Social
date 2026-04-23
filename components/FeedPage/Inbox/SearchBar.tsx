import { Dispatch, SetStateAction } from "react";

export default function SearchBar({ 
    searchTerm,
    setSearchTerm
}: {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}) {
    return (
        <div className="p-3">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar personas para chatear..."
                    className="w-full bg-gray-100 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    );
}