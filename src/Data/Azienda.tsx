export class Azienda {
    type: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    properties: {
        Nome: string;
        Posizione: string;
        Sito: string;
        Settore: string;
        Keywords: string;
        Descrizione: string;
    };

    constructor(
        type: string,
        geometryType: string,
        coordinates: [number, number],
        Nome: string,
        Posizione: string,
        Sito: string,
        Settore: string,
        Keywords: string,
        Descrizione: string
    ) {
        this.type = type;
        this.location = {
            type: geometryType,
            coordinates: coordinates
        };
        this.properties = {
            Nome: Nome,
            Posizione: Posizione,
            Sito: Sito,
            Settore: Settore,
            Keywords: Keywords,
            Descrizione: Descrizione
        };
    }
}

export {};