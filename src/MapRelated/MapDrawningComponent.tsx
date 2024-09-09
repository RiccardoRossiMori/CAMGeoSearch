import { MutableRefObject, useState } from 'react';
import { Map } from 'ol';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleGeom, Point } from 'ol/geom';
import { toLonLat, fromLonLat } from 'ol/proj';

interface MapDrawingComponentProps {
    mapObjRef: MutableRefObject<Map | null>;
    drawInteraction: Draw | null;
    setDrawInteraction: (interaction: Draw | null) => void;
    vectorSourceRef: MutableRefObject<VectorSource | null>;
}

const handleRemoveCirclesClick = (vectorSourceRef: MutableRefObject<VectorSource | null>) => {
    if (vectorSourceRef.current) {
        const features = vectorSourceRef.current.getFeatures();
        features.forEach((feature) => {
            const geometry = feature.getGeometry();
            if (geometry && geometry.getType() === 'Circle') {
                vectorSourceRef.current?.removeFeature(feature);
            }
        });
    }
};

const calculateSquareVertices = (center: number[], radius: number) => {
    const [lon, lat] = center;
    const topLeft = toLonLat(fromLonLat([lon - radius, lat + radius]));
    const bottomRight = toLonLat(fromLonLat([lon + radius, lat - radius]));
    return { topLeft, bottomRight };
};

const MapDrawingComponent = ({
                                 mapObjRef,
                                 drawInteraction,
                                 setDrawInteraction,
                                 vectorSourceRef,
                             }: MapDrawingComponentProps) => {
    const [circleInfo, setCircleInfo] = useState<{ center: number[], radius: number, pointOnCircumference: number[] } | null>(null);
    const [squareVertices, setSquareVertices] = useState<{ topLeft: number[], bottomRight: number[] } | null>(null);

    const handleDrawButtonClick = () => {
        handleRemoveCirclesClick(vectorSourceRef);
        if (mapObjRef.current) {
            if (drawInteraction) {
                mapObjRef.current.removeInteraction(drawInteraction);
                setDrawInteraction(null);
            } else {
                const draw = new Draw({
                    source: vectorSourceRef.current!,
                    type: 'Circle',
                });

                draw.on('drawend', (event) => {
                    const circle = event.feature.getGeometry() as CircleGeom;
                    const center = toLonLat(circle.getCenter());
                    const radius = circle.getRadius();
                    const pointOnCircumference = toLonLat([circle.getCenter()[0], circle.getCenter()[1] + radius]);
                    setCircleInfo({ center, radius, pointOnCircumference });
                    setSquareVertices(calculateSquareVertices(center, radius));
                    setDrawInteraction(null);
                    mapObjRef.current?.removeInteraction(draw);
                });

                setDrawInteraction(draw);
                mapObjRef.current.addInteraction(draw);
            }
        }
    };

    const handleSearchButtonClick = () => {
        if (squareVertices) {
            const { topLeft, bottomRight } = squareVertices;

            // Verifica i marker
            const markers = vectorSourceRef.current?.getFeatures().filter(feature => {
                const geometry = feature.getGeometry();
                if (geometry && geometry.getType() === 'Point') {
                    const point = (geometry as Point).getCoordinates();
                    const distance = Math.sqrt(
                        Math.pow(point[0] - fromLonLat(circleInfo!.center)[0], 2) +
                        Math.pow(point[1] - fromLonLat(circleInfo!.center)[1], 2)
                    );
                    return distance <= circleInfo!.radius;
                }
                return false;
            });

            alert(`Marker all'interno del cerchio: ${markers?.length}`);
        } else {
            alert('Nessun cerchio disegnato');
        }
    };
    

    return (
        <div>
            <button
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
                onClick={handleDrawButtonClick}
            >
                Disegna un Cerchio
            </button>
            <button
                style={{ position: 'absolute', top: 50, right: 10, zIndex: 1000 }}
                onClick={handleSearchButtonClick}
            >
                Cerca in questa area
            </button>
        </div>
    );
};

export default MapDrawingComponent;