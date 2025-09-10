import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { TEXTS_UI } from '../constants';

export const ReportsPage: React.FC = () => {
  const { state } = useAppContext();
  const { calculatedFund, isLoading } = state;

  const handleGenerateReport = () => {
    alert('Funzionalità di generazione report in sviluppo');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
        Generazione Report e Documentazione
      </h2>
      
      {!calculatedFund && (
        <Card title="Attenzione">
          <p className="text-[#1b0e0e]">
            {TEXTS_UI.noDataAvailable} per la generazione dei report. 
            Effettuare prima il calcolo del fondo.
          </p>
        </Card>
      )}

      {calculatedFund && (
        <Card title="Report Disponibili">
          <p className="text-sm text-[#1b0e0e] mb-4">
            Genera report e documentazione per il fondo calcolato.
          </p>
          <Button 
            variant="primary" 
            onClick={handleGenerateReport} 
            disabled={!calculatedFund || isLoading} 
            size="md"
          >
            {isLoading ? TEXTS_UI.calculating : "Genera Report PDF"}
          </Button>
        </Card>
      )}
    </div>
  );
};