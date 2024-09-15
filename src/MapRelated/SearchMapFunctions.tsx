import {Azienda} from "../Data/Azienda";
import React from "react";
import VectorSource from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import {Map} from "ol";
import {Circle as CircleGeom} from "ol/geom";
import {toLonLat} from "ol/proj";

// Function to calculate the vertices of a square given a center and radius
export const calculateSquareVertices = (center: number[], radius: number) => {
    const [lon, lat] = center;

    // Approximate conversion factors
    const latConversionFactor = 1 / 111000; // 1 degree latitude is approximately 111 km
    const lonConversionFactor = 1 / (111000 * Math.cos(lat * (Math.PI / 180))); // Adjust for longitude

    // Convert radius from meters to degrees
    const radiusLat = radius * latConversionFactor;
    const radiusLon = radius * lonConversionFactor;
    return {
        topLeft: [lon - radiusLon, lat + radiusLat],
        bottomRight: [lon + radiusLon, lat - radiusLat]
    };
};

export async function searchInArea(
    squareVertices: { topLeft: number[]; bottomRight: number[] },
    setCompanyNames: (value: (((prevState: string[]) => string[]) | string[])) => void,
    setAziende: (value: (((prevState: Azienda[]) => Azienda[]) | Azienda[])) => void,
    createMarker: (company: any, vectorSourceRef: React.MutableRefObject<VectorSource | null>) => void,
    _vectorSourceRef: React.MutableRefObject<VectorSource | null>,
    sector: string
) {
    const { topLeft, bottomRight } = squareVertices;

    try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setCompanyNames(data.map((company: { properties: { Nome: string } }) => company.properties.Nome));

        // Filter companies within the drawn area and by sector
        const filteredCompanies = data.filter((company: { geometry: { coordinates: [number, number] }, properties: { Settore: string } }) => {
            const [lon, lat] = company.geometry.coordinates;
            return lon >= topLeft[0] && lon <= bottomRight[0] && lat >= bottomRight[1] && lat <= topLeft[1] && (sector === '' || company.properties.Settore.includes(sector));
        });
        alert(`Number of companies found: ${filteredCompanies.length}`);

        setAziende([]);

        const newAziende = filteredCompanies.map((company: {
            geometry: { coordinates: [number, number] },
            properties: any
        }) => {
            const azienda = new Azienda(
                'Feature',
                'Point',
                company.geometry.coordinates,
                company.properties.Nome,
                company.properties.Posizione,
                company.properties.Sito,
                company.properties.Settore,
                company.properties.Keywords,
                company.properties.Descrizione
            );
            createMarker(company, _vectorSourceRef);
            return azienda;
        });

        setAziende(newAziende);
    } catch (error) {
        console.error('Error fetching company names:', error);
    }
}

export function setSearchInfo(
    draw: Draw,
    setCircleInfo: (info: { center: number[]; radius: number }) => void,
    setSquareVertices: (vertices: { topLeft: number[]; bottomRight: number[] }) => void,
    setDrawInteraction: (interaction: Draw | null) => void,
    mapObjRef: React.MutableRefObject<Map | null>
) {
    draw.on('drawend', (event) => {
        const circle = event.feature.getGeometry() as CircleGeom;
        const center = toLonLat(circle.getCenter());
        const radius = circle.getRadius();
        setCircleInfo({ center, radius });
        setSquareVertices(calculateSquareVertices(center, radius));
        setDrawInteraction(null);
        mapObjRef.current?.removeInteraction(draw);
    });
}

export async function fetchEveryCompany(setCompanyNames: (value: (((prevState: string[]) => string[]) | string[])) => void, createMarker: (company: any, vectorSourceRef: React.MutableRefObject<VectorSource | null>) => void, vectorSourceRef: React.MutableRefObject<VectorSource | null>, selectedSector: string) {
    try {
        const response = await fetch('/api/companies');
        var data = await response.json();
        data = data.filter((company: { properties: { Settore: string } }) =>
            company.properties && company.properties.Settore.includes(selectedSector)
        );

        // Aggiorna lo stato con i nomi delle aziende filtrate
        setCompanyNames(data.map((company: { properties: { Nome: string } }) => company.properties.Nome));

        // Crea marker per ogni azienda filtrata
        data.forEach((company: { geometry: { coordinates: [number, number] } }) => {
            createMarker(company, vectorSourceRef);
        });
        alert(`Number of markers found: ${data.length}`);
    } catch (error) {
        console.error('Error fetching company names:', error);
    }
}

export {}