import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { XYZ } from "ol/source";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from "ol/style";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Draw from 'ol/interaction/Draw';
import { MapBrowserEvent } from 'ol';
import Geometry from 'ol/geom/Geometry';
import "./Map.css";
import MapDrawingComponent from './MapDrawningComponent';
import SearchBar from './SearchBar';
import CompanyInfoModal from './CompanyInfoModal';

const initializeMap = (
    mapRef: React.MutableRefObject<HTMLDivElement | null>,
    vectorSourceRef: React.MutableRefObject<VectorSource | null>,
    mapObjRef: React.MutableRefObject<Map | null>
): Map | undefined => {
    if (!mapRef.current) return;

    const mapObj = new Map({
        view: new View({
            center: fromLonLat([13.0678500, 43.1386600]),
            zoom: 10,
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    crossOrigin: 'anonymous',
                }),
            }),
        ],
        target: mapRef.current
    });

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    mapObj.addLayer(new VectorLayer({source: vectorSource}));
    mapObjRef.current = mapObj;

    return mapObj;
};

const addMarkers = (mapObj: Map, vectorSource: VectorSource | null) => {
    const newMarkers = [
        { lon: 13.0688300, lat: 43.1396760, name: 'Università di Camerino, Sezione di Informatica' }
    ];

    const markerStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            scale: 0.7,
        }),
    });

    const newFeatures = newMarkers.map((marker) => {
        const point = new Point(fromLonLat([marker.lon, marker.lat]));
        const feature = new Feature({
            geometry: point,
            name: marker.name,
            isFixedMarker: true, // Add custom property to identify fixed markers
        });
        feature.setStyle(markerStyle);
        return feature;
    });

    vectorSource?.addFeatures(newFeatures);
};

interface MapComponentProps {
    onSearchResults: (newResults: any[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSearchResults }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);
    const mapObjRef = useRef<Map | null>(null);
    const [sectors, setSectors] = useState<string[]>([]);
    const [selectedSector, setSelectedSector] = useState<string>('');
    const [companyNames, setCompanyNames] = useState<string[]>([]);
    const [aziende, setAziende] = useState<any[]>([]);
    const [selectedCompanyInfo, setSelectedCompanyInfo] = useState<any>(null);

    useEffect(() => {
        const mapObj = initializeMap(mapRef, vectorSourceRef, mapObjRef);
        if (mapObj) {
            addMarkers(mapObj, vectorSourceRef.current);

            mapObj.on('click', (evt: MapBrowserEvent<UIEvent>) => {
                const feature = mapObj.forEachFeatureAtPixel(evt.pixel,
                    (feature) => feature as Feature<Geometry>
                );

                if (feature && feature.get('companyInfo')) {
                    const companyInfo = feature.get('companyInfo');
                    setSelectedCompanyInfo(companyInfo);
                }
            });
        }

        fetch('/api/companies')
            .then(response => response.json())
            .then(data => {
                const sectors = data.flatMap((company: { properties: { Settore: string; }; }) =>
                    company.properties.Settore.split(',').map(sector => sector.trim())
                );
                setSectors([...new Set(sectors)] as string[]);
            });

        return () => mapObj?.setTarget('');
    }, []);

    const handleSearch = (sector: string) => {
        setSelectedSector(sector);
    };

    return (
        <div>
            <MapDrawingComponent
                mapObjRef={mapObjRef}
                drawInteraction={drawInteraction}
                setDrawInteraction={setDrawInteraction}
                vectorSourceRef={vectorSourceRef}
                selectedSector={selectedSector}
            />
            <div className="map" ref={mapRef} />
            <SearchBar
                onSearch={handleSearch}
                sectors={sectors}
                vectorSourceRef={vectorSourceRef}
                setSelectedSector={setSelectedSector}
                setCompanyNames={setCompanyNames}
                setAziende={setAziende}
            />
            {selectedCompanyInfo && (
                <CompanyInfoModal
                    companyInfo={selectedCompanyInfo}
                    onClose={() => setSelectedCompanyInfo(null)}
                />
            )}
        </div>
    );
};

export default MapComponent;