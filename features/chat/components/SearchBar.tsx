import Input from "@/components/UI/Input";
import { Dispatch, SetStateAction } from "react";
import { LuSearch } from 'react-icons/lu';

export default function SearchBar({
    searchTerm,
    setSearchTerm
}: {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
}) {
    return (
        <Input
            LeftIcon={LuSearch}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar personas para chatear..."
            sizeVariant="sm"
        />
    );
}