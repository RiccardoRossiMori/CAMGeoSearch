import React, { useState } from 'react';
import MapComponent from './MapRelated/MapComponent';
import ResultBar from './MapRelated/ResultBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [results, setResults] = useState<any[]>([]);

    const handleSearchResults = (newResults: any[]) => {
        setResults(newResults);
    };

    const handleCloseSidebar = () => {
        setResults([]);
    };

    return (
        <div>
            <MapComponent onSearchResults={handleSearchResults} />
            <ResultBar results={results} onClose={handleCloseSidebar} />
        </div>
    );
}

export default App;