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

    const topLeft = [lon - radiusLon, lat + radiusLat];
    const bottomRight = [lon + radiusLon, lat - radiusLat];

    return {topLeft, bottomRight};
};

export async function searchInArea(squareVertices: {
    topLeft: number[];
    bottomRight: number[]
}, setCompanyNames: (value: (((prevState: string[]) => string[]) | string[])) => void, setAziende: (value: (((prevState: Azienda[]) => Azienda[]) | Azienda[])) => void, createMarker: (company: any, vectorSourceRef: React.MutableRefObject<VectorSource | null>) => void, _vectorSourceRef: React.MutableRefObject<VectorSource | null>) {
    const {topLeft, bottomRight} = squareVertices;

    try {
        const response = await fetch('/api/companies');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCompanyNames(data.map((company: { properties: { Nome: string } }) => company.properties.Nome));

        // Filter companies within the drawn area
        const filteredCompanies = data.filter((company: { geometry: { coordinates: [number, number] } }) => {
            const [lon, lat] = company.geometry.coordinates;
            return lon >= topLeft[0] && lon <= bottomRight[0] && lat >= bottomRight[1] && lat <= topLeft[1];
        });
        alert(`Number of companies found: ${filteredCompanies.length}`);

        // Clear existing Azienda objects
        setAziende([]);

        // Create new Azienda objects and markers for each filtered company
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

export function setSearchInfo(draw: Draw, setCircleInfo: (value: (((prevState: ({
    center: number[];
    radius: number
} | null)) => ({
    center: number[];
    radius: number
} | null)) | { center: number[]; radius: number } | null)) => void, setSquareVertices: (value: (((prevState: ({
    topLeft: number[];
    bottomRight: number[]
} | null)) => ({ topLeft: number[]; bottomRight: number[] } | null)) | {
    topLeft: number[];
    bottomRight: number[]
} | null)) => void, setDrawInteraction: (interaction: (Draw | null)) => void, mapObjRef: React.MutableRefObject<Map | null>) {
    draw.on('drawend', (event) => {
        const circle = event.feature.getGeometry() as CircleGeom;
        const center = toLonLat(circle.getCenter());
        const radius = circle.getRadius();
        setCircleInfo({center, radius});
        setSquareVertices(calculateSquareVertices(center, radius));
        setDrawInteraction(null);
        mapObjRef.current?.removeInteraction(draw);
    });
}

export async function fetchEveryCompany(setCompanyNames: (value: (((prevState: string[]) => string[]) | string[])) => void, createMarker: (company: any, vectorSourceRef: React.MutableRefObject<VectorSource | null>) => void, vectorSourceRef: React.MutableRefObject<VectorSource | null>) {
    try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanyNames(data.map((company: { name: string }) => company.name));

        // Create markers for each company
        data.forEach((company: { geometry: { coordinates: [number, number] } }) => {
            createMarker(company, vectorSourceRef);
        });
        alert(`Number of markers found: ${data.length}`);
    } catch (error) {
        console.error('Error fetching company names:', error);
    }
}

export {}