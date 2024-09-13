import React, {MutableRefObject, useState} from 'react';
import {Map} from 'ol';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import {Point} from 'ol/geom';
import {fromLonLat} from 'ol/proj';
import {Icon, Style} from 'ol/style';
import Feature from 'ol/Feature';
import {Azienda} from '../Data/Azienda';
import {fetchEveryCompany, searchInArea, setSearchInfo} from "./SearchMapFunctions";

// Define the props for the MapDrawingComponent
interface MapDrawingComponentProps {
    mapObjRef: MutableRefObject<Map | null>;
    drawInteraction: Draw | null;
    setDrawInteraction: (interaction: Draw | null) => void;
    vectorSourceRef: MutableRefObject<VectorSource | null>;
}

const handleRemovePreviewSearcherResults = (vectorSourceRef: MutableRefObject<VectorSource | null>) => {
    if (vectorSourceRef.current) {
        const features = vectorSourceRef.current.getFeatures();
        features.forEach((feature) => {
            const geometry = feature.getGeometry();
            if ((geometry && geometry.getType() === 'Circle' || geometry && geometry.getType() === 'Point') && !feature.get('isFixedMarker')) {
                vectorSourceRef.current?.removeFeature(feature);
            }
        });
    }
};

// Main component for drawing on the map
const MapDrawingComponent = ({
                                 mapObjRef,
                                 drawInteraction,
                                 setDrawInteraction,
                                 vectorSourceRef,
                             }: MapDrawingComponentProps) => {
    const [circleInfo, setCircleInfo] = useState<{
        center: number[],
        radius: number
    } | null>(null);
    const [squareVertices, setSquareVertices] = useState<{ topLeft: number[], bottomRight: number[] } | null>(null);
    const [companyNames, setCompanyNames] = useState<string[]>([]);
    const [aziende, setAziende] = useState<Azienda[]>([]);
    var _vectorSourceRef = vectorSourceRef;

    // Function to create a marker for a company
    const createMarker = (company: any, vectorSourceRef: MutableRefObject<VectorSource | null>) => {
        if (!company.geometry || !company.geometry.coordinates) {
            console.error('Invalid company data:', company);
            return;
        }

        const marker = new Feature({
            geometry: new Point(fromLonLat(company.geometry.coordinates)),
            companyInfo: company.properties,
        });

        marker.setStyle(new Style({
            image: new Icon({
                src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Path to your marker icon
                scale: 1, // Adjust the scale as needed
            }),
        }));

        vectorSourceRef.current?.addFeature(marker);
    };

    // Function to handle the draw button click event
    const handleDrawButtonClick = () => {
        handleRemovePreviewSearcherResults(vectorSourceRef);
        _vectorSourceRef = vectorSourceRef;
        if (mapObjRef.current) {
            if (drawInteraction) {
                mapObjRef.current.removeInteraction(drawInteraction);
                setDrawInteraction(null);
            } else {
                const draw = new Draw({
                    source: vectorSourceRef.current!,
                    type: 'Circle',
                });

                setSearchInfo(draw, setCircleInfo, setSquareVertices, setDrawInteraction, mapObjRef);

                setDrawInteraction(draw);
                mapObjRef.current.addInteraction(draw);
            }
        }
    };

    // Function to handle the search button click event
    const handleSearchButtonClick = async () => {
        if (squareVertices) {
            await searchInArea(squareVertices, setCompanyNames, setAziende, createMarker, _vectorSourceRef);
        } else {
            alert('Nessun cerchio disegnato');
        }
    };

    // Function to fetch all company names and create markers for them
    const fetchCompanyNames = async () => {
        await fetchEveryCompany(setCompanyNames, createMarker, vectorSourceRef);
    };

    return (
        <div>
            <button
                style={{position: 'absolute', top: 10, right: 10, zIndex: 1000}}
                onClick={handleDrawButtonClick}
            >
                Disegna un Cerchio
            </button>
            <button
                style={{position: 'absolute', top: 50, right: 10, zIndex: 1000}}
                onClick={handleSearchButtonClick}
            >
                Cerca in questa area
            </button>
            <button
                style={{position: 'absolute', top: 90, right: 10, zIndex: 1000}}
                onClick={fetchCompanyNames}>
                Vedi tutte le aziende
            </button>
        </div>
    );
};

export default MapDrawingComponent;