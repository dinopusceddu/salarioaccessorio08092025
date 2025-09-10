import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { TEXTS_UI } from '../constants';

export const DataEntryPage: React.FC = () => {
  const { state, performFundCalculation } = useAppContext();
  const { isLoading } = state;

  const handleSubmit = async () => {
    await performFundCalculation();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
        Inserimento Dati per Costituzione Fondo
      </h2>
      
      <Card title="Dati Ente">
        <p className="text-[#1b0e0e] mb-4">
          Questa sezione permetterà di inserire i dati dell'ente e del fondo.
        </p>
        <p className="text-sm text-[#5f5252]">
          Funzionalità in fase di sviluppo.
        </p>
      </Card>

      <div className="mt-10 flex justify-end">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? TEXTS_UI.calculating : "Salva Dati e Calcola Fondo"}
        </Button>
      </div>
    </div>
  );
};