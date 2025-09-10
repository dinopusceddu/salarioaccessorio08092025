import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/shared/Card';
import { TEXTS_UI } from '../constants';

export const FundDetailsPage: React.FC = () => {
  const { state } = useAppContext();
  const { calculatedFund } = state;

  if (!calculatedFund) {
    return (
      <Card title="Dettaglio Calcolo Fondo">
        <p className="text-[#1b0e0e]">
          {TEXTS_UI.noDataAvailable} Effettuare prima il calcolo del fondo.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
        Dettaglio Calcolo Fondo
      </h2>
      
      <Card title="Riepilogo Generale">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-md">
            <strong>Totale Componente Stabile:</strong> 
            € {calculatedFund.totaleComponenteStabile.toLocaleString('it-IT')}
          </div>
          <div className="p-3 bg-green-50 rounded-md">
            <strong>Totale Componente Variabile:</strong> 
            € {calculatedFund.totaleComponenteVariabile.toLocaleString('it-IT')}
          </div>
        </div>
      </Card>
    </div>
  );
};