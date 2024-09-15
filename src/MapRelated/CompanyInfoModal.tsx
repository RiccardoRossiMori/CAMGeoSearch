import React from 'react';

interface CompanyInfoModalProps {
    companyInfo: {
        Nome: string;
        Posizione: string;
        Sito: string;
        Settore: string;
        Keywords: string;
        Descrizione: string;
    } | null;
    onClose: () => void;
}

const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ companyInfo, onClose }) => {
    if (!companyInfo) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                maxWidth: '500px',
                width: '100%'
            }}>
                <h2>{companyInfo.Nome}</h2>
                <p><strong>Posizione:</strong> {companyInfo.Posizione}</p>
                <p><strong>Sito:</strong> <a href={companyInfo.Sito} target="_blank" rel="noopener noreferrer">{companyInfo.Sito}</a></p>
                <p><strong>Settore:</strong> {companyInfo.Settore}</p>
                <p><strong>Keywords:</strong> {companyInfo.Keywords}</p>
                <p><strong>Descrizione:</strong> {companyInfo.Descrizione}</p>
                <button onClick={onClose}>Chiudi</button>
            </div>
        </div>
    );
};

export default CompanyInfoModal;