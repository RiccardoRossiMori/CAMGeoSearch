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
        <div className="d-flex justify-content-center align-items-center p-3" style={{
            backgroundColor: 'rgba(31,51,241,0.8)',
            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
            position: 'fixed',
            bottom: 0,
            width: '100%'
        }}>
            <select value={selectedSector} onChange={(e) => setSelectedSectorState(e.target.value)}
                    className="form-select me-2" style={{backgroundColor: 'rgb(108,113,160)', color: 'white'}}>
                <option value="">Seleziona il Settore che ti interessa.</option>
                {sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                ))}
            </select>
            <button onClick={handleReset} className="btn btn-primary"
                    style={{backgroundColor: 'rgb(108,113,160)', color: 'white'}}>
                Reset
            </button>
        </div>
    );
};

export default SearchBar;