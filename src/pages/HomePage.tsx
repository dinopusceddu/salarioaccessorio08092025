import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { TEXTS_UI } from '../constants';

export const HomePage: React.FC = () => {
  const { state, performFundCalculation } = useAppContext();
  const { calculatedFund, isLoading, error } = state;

  const handleRecalculate = () => {
    performFundCalculation();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#f3e7e8] pb-4">
        <div>
          <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
            Dashboard Principale
          </h2>
          <p className="text-[#5f5252] mt-1">
            Benvenuto nell'applicazione per la gestione del fondo salario accessorio.
          </p>
        </div>
        <Button 
          onClick={handleRecalculate} 
          isLoading={isLoading} 
          disabled={isLoading} 
          variant="primary" 
          size="md"
        >
          {isLoading ? TEXTS_UI.calculating : "Calcola Fondo"}
        </Button>
      </div>
      
      {error && (
        <Card title="Errore" className="border-l-4 border-red-500">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {!calculatedFund && !isLoading && (
        <Card title="Inizia qui">
          <p className="text-[#1b0e0e] mb-4">
            Per iniziare, vai alla sezione "Dati Costituzione Fondo" per inserire i dati necessari.
          </p>
          <Button 
            variant="primary" 
            onClick={() => console.log('Navigate to data entry')}
          >
            Vai all'inserimento dati
          </Button>
        </Card>
      )}

      {calculatedFund && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Totale Fondo">
            <p className="text-2xl font-bold text-[#ea2832]">
              € {calculatedFund.totaleFondo.toLocaleString('it-IT')}
            </p>
          </Card>
          <Card title="Parte Stabile">
            <p className="text-xl font-semibold text-[#1b0e0e]">
              € {calculatedFund.totaleParteStabile.toLocaleString('it-IT')}
            </p>
          </Card>
          <Card title="Parte Variabile">
            <p className="text-xl font-semibold text-[#1b0e0e]">
              € {calculatedFund.totaleParteVariabile.toLocaleString('it-IT')}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};