import React from 'react';
import { Card } from '../components/shared/Card';

export const ChecklistPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-[#1b0e0e] tracking-light text-2xl sm:text-[30px] font-bold leading-tight">
        Check list Interattiva del Fondo
      </h2>
      
      <Card title="Assistente Virtuale">
        <p className="text-[#1b0e0e]">
          Funzionalità in fase di sviluppo. Qui sarà possibile interagire con un assistente virtuale 
          per ottenere informazioni sui calcoli del fondo.
        </p>
      </Card>
    </div>
  );
};