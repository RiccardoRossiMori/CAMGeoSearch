import React from 'react';
import './ResultBar.css';

interface ResultBarProps {
    results: any[];
    onClose: () => void;
}

const ResultBar: React.FC<ResultBarProps> = ({ results, onClose}) => {
    return (
        <div className={`resultbar ${results.length > 0 ? 'open' : ''}`}>
            <button type="button" className="btn-close-white" aria-label="Close" onClick={onClose}>Chiudi</button>
            <h2 className="p-3">Risultati della Ricerca</h2>
            {results.map((result, index) => (
                <div key={index} className="result-item p-3 border-bottom">
                    <h3>{result.properties.Nome}</h3>
                    <p><strong>Posizione:</strong> {result.properties.Posizione}</p>
                    <p><strong>Sito:</strong> <a href={result.properties.Sito} target="_blank" rel="noopener noreferrer">{result.properties.Sito}</a></p>
                    <p><strong>Settore:</strong> {result.properties.Settore}</p>
                    <p><strong>Keywords:</strong> {result.properties.Keywords}</p>
                    <p><strong>Descrizione:</strong> {result.properties.Descrizione}</p>
                </div>
            ))}
        </div>
    );
};

export default ResultBar;