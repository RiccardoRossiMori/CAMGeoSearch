import React, { useEffect, useState, MutableRefObject } from 'react';
import { handleRemovePreviewSearcherResults } from './MapDrawningComponent';
import VectorSource from 'ol/source/Vector';

interface SearchBarProps {
    onSearch: (sector: string) => void;
    sectors: string[];
    vectorSourceRef: MutableRefObject<VectorSource | null>;
    setSelectedSector: (sector: string) => void;
    setCompanyNames: (names: string[]) => void;
    setAziende: (aziende: any[]) => void;
}



const SearchBar: React.FC<SearchBarProps> = ({ onSearch, sectors, vectorSourceRef, setSelectedSector, setCompanyNames, setAziende }) => {
    const [selectedSector, setSelectedSectorState] = useState<string>('');

    useEffect(() => {
        onSearch(selectedSector);
    }, [selectedSector, onSearch]);

    const handleReset = () => {
        handleRemovePreviewSearcherResults(vectorSourceRef);
        setSelectedSectorState('');
        setSelectedSector('');
        setCompanyNames([]);
        setAziende([]);
    };
    
    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(31,51,241,0.8)',
            padding: '10px',
            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <select value={selectedSector} onChange={(e) => setSelectedSectorState(e.target.value)}
                    style={{backgroundColor: 'rgb(108,113,160)', marginRight: '10px'}}>
                <option value="">Seleziona il Settore che ti interessa.</option>
                {sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                ))}
            </select>
            <button onClick={handleReset}
                    style={{backgroundColor: 'rgb(108,113,160)', color: 'white', padding: '5px 10px'}}>
                Reset
            </button>
        </div>
    );
};

export default SearchBar;