import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{companyInfo.Nome}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Posizione:</strong> {companyInfo.Posizione}</p>
                        <p><strong>Sito:</strong> <a href={companyInfo.Sito} target="_blank" rel="noopener noreferrer">{companyInfo.Sito}</a></p>
                        <p><strong>Settore:</strong> {companyInfo.Settore}</p>
                        <p><strong>Keywords:</strong> {companyInfo.Keywords}</p>
                        <p><strong>Descrizione:</strong> {companyInfo.Descrizione}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyInfoModal;