// Import necessary modules and components
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

// Initialize the map and add layers
const initializeMap = (
    mapRef: React.MutableRefObject<HTMLDivElement | null>,
    vectorSourceRef: React.MutableRefObject<VectorSource | null>,
    mapObjRef: React.MutableRefObject<Map | null>
): Map | undefined => {
    if (!mapRef.current) return;

    const mapObj = new Map({
        view: new View({
            center: fromLonLat([13.0678500, 43.1386600]),
            zoom: 16,
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
    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    mapObj.addLayer(vectorLayer);
    mapObjRef.current = mapObj;

    return mapObj;
};

// Add markers to the map
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

// Main component for the map
const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);
    const mapObjRef = useRef<Map | null>(null);

    // Initialize the map and add event listeners
    useEffect(() => {
        const mapObj = initializeMap(mapRef, vectorSourceRef, mapObjRef);
        if (mapObj) {
            addMarkers(mapObj, vectorSourceRef.current);

            // Add click event listener for markers
            mapObj.on('click', (evt: MapBrowserEvent<UIEvent>) => {
                const feature = mapObj.forEachFeatureAtPixel(evt.pixel,
                    (feature) => feature as Feature<Geometry>
                );

                if (feature && feature.get('companyInfo')) {
                    const companyInfo = feature.get('companyInfo');
                    alert(`Nome: ${companyInfo.Nome}\nPosizione: ${companyInfo.Posizione}\nSito: ${companyInfo.Sito}\nSettore: ${companyInfo.Settore}\nKeywords: ${companyInfo.Keywords}\nDescrizione: ${companyInfo.Descrizione}`);
                }
            });
        }

        return () => mapObj?.setTarget('');
    }, []);

    return (
        <div>
            <MapDrawingComponent
                mapObjRef={mapObjRef}
                drawInteraction={drawInteraction}
                setDrawInteraction={setDrawInteraction}
                vectorSourceRef={vectorSourceRef}
            />
            <div className="map" ref={mapRef} />
        </div>
    );
};

export default MapComponent;