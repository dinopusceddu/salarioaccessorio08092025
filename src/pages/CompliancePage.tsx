import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/shared/Card';
import { TEXTS_UI } from '../constants';

export const CompliancePage: React.FC = () => {
  const { state } = useAppContext();
  const { complianceChecks } = state;

  return (
    <div className="space-y-8">
      <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
        Controllo dei limiti
      </h2>
      
      <Card title="Controlli di Conformità">
        {complianceChecks.length === 0 ? (
          <p className="text-[#1b0e0e]">
            Nessun controllo di conformità disponibile. Effettuare prima il calcolo del fondo.
          </p>
        ) : (
          <div className="space-y-3">
            {complianceChecks.map(check => (
              <div key={check.id} className="p-3 border rounded-lg bg-blue-50">
                <h5 className="font-semibold text-blue-700">{check.descrizione}</h5>
                <p className="text-sm text-[#1b0e0e]">{check.messaggio}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};