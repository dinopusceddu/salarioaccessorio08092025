// components/dataInput/EntityGeneralInfoForm.tsx
import React from 'react';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { AnnualData } from '../../types.ts';
import { TipologiaEnte } from '../../enums.ts';
import { Input } from '../shared/Input.tsx';
import { Select } from '../shared/Select.tsx';
import { Card } from '../shared/Card.tsx';
import { TEXTS_UI, ALL_TIPOLOGIE_ENTE } from '../../constants.ts';
import { Checkbox } from '../shared/Checkbox.tsx';

const booleanOptions = [
  { value: 'true', label: TEXTS_UI.trueText },
  { value: 'false', label: TEXTS_UI.falseText },
];

export const EntityGeneralInfoForm: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { annualData } = state.fundData;
  const { validationErrors } = state;

  const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean | undefined = value;

    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    } else if (['isEnteDissestato',
               'isEnteStrutturalmenteDeficitario',
               'isEnteRiequilibrioFinanziario',
               'hasDirigenza',
               'isDistributionMode'
               ].includes(name)) {
      processedValue = (e.target as HTMLInputElement).type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value === 'true' ? true : (value === 'false' ? false : undefined);
      if (value === "") processedValue = undefined;
    }
    
    dispatch({ type: 'UPDATE_ANNUAL_DATA', payload: { [name]: processedValue } as Partial<AnnualData> });
  };

  const handleTipologiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTipologia = e.target.value as TipologiaEnte;
      const isNumeroAbitantiRequired = newTipologia === TipologiaEnte.COMUNE || newTipologia === TipologiaEnte.PROVINCIA;

      const payload: Partial<AnnualData> = { tipologiaEnte: newTipologia };

      if (!isNumeroAbitantiRequired) {
          payload.numeroAbitanti = undefined;
      }
      if (newTipologia !== TipologiaEnte.ALTRO) {
          payload.altroTipologiaEnte = '';
      }
      
      dispatch({ type: 'UPDATE_ANNUAL_DATA', payload });
  };


  const isNumeroAbitantiRequired = annualData.tipologiaEnte === TipologiaEnte.COMUNE || annualData.tipologiaEnte === TipologiaEnte.PROVINCIA;
  const numeroAbitantiWarning = isNumeroAbitantiRequired && (!annualData.numeroAbitanti || annualData.numeroAbitanti <= 0) 
      ? "Campo obbligatorio per il calcolo corretto del simulatore e dei limiti di spesa. La compilazione non sarà bloccata." 
      : undefined;

  return (
    <Card title="Informazioni Generali Ente e Anno di Riferimento" className="mb-8">
       <Input
          label="Anno di Riferimento per la Costituzione del Fondo"
          type="number"
          id="annoRiferimento"
          name="annoRiferimento"
          value={annualData.annoRiferimento}
          onChange={(e) => dispatch({ type: 'SET_CURRENT_YEAR', payload: parseInt(e.target.value) || new Date().getFullYear() })}
          min="2000"
          max="2099"
          containerClassName="mb-6"
          aria-required="true"
        />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
        <Input
          label="Denominazione Ente"
          type="text"
          id="denominazioneEnte"
          name="denominazioneEnte"
          value={annualData.denominazioneEnte ?? ''}
          onChange={handleGenericChange}
          placeholder="Es. Comune di..."
          containerClassName="md:col-span-2 mb-3"
          aria-required="true"
          error={validationErrors['fundData.annualData.denominazioneEnte']}
        />
        <Select
          label="Tipologia Ente"
          id="tipologiaEnte"
          name="tipologiaEnte"
          options={ALL_TIPOLOGIE_ENTE}
          value={annualData.tipologiaEnte ?? ''}
          onChange={handleTipologiaChange}
          placeholder="Seleziona tipologia..."
          aria-required="true"
          containerClassName="mb-3"
          error={validationErrors['fundData.annualData.tipologiaEnte']}
        />
        {annualData.tipologiaEnte === TipologiaEnte.ALTRO && (
          <Input
            label="Specifica Altra Tipologia Ente"
            type="text"
            id="altroTipologiaEnte"
            name="altroTipologiaEnte"
            value={annualData.altroTipologiaEnte ?? ''}
            onChange={handleGenericChange}
            placeholder="Indicare la tipologia"
            aria-required={annualData.tipologiaEnte === TipologiaEnte.ALTRO}
            containerClassName="mb-3"
            error={validationErrors['fundData.annualData.altroTipologiaEnte']}
          />
        )}
         <Input
          key={isNumeroAbitantiRequired ? 'abitanti-required' : 'abitanti-optional'}
          label="Numero Abitanti al 31.12 Anno Precedente"
          type="number"
          id="numeroAbitanti"
          name="numeroAbitanti"
          value={annualData.numeroAbitanti ?? ''}
          onChange={handleGenericChange}
          placeholder="Es. 15000"
          step="1"
          min="0"
          aria-required={isNumeroAbitantiRequired}
          containerClassName="mb-3"
          warning={numeroAbitantiWarning}
          disabled={!isNumeroAbitantiRequired}
          inputInfo={!isNumeroAbitantiRequired ? "Campo non richiesto per questa tipologia di ente." : "Obbligatorio per Comuni e Province."}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-0">
         <Select
          label="Ente in dissesto finanziario (art. 244 TUEL)?"
          id="isEnteDissestato"
          name="isEnteDissestato"
          options={booleanOptions}
          value={annualData.isEnteDissestato === undefined ? '' : String(annualData.isEnteDissestato)}
          onChange={handleGenericChange}
          placeholder="Seleziona..."
          aria-required="true"
        />
         <Select
          label="Ente strutturalmente deficitario (art. 242 TUEL)?"
          id="isEnteStrutturalmenteDeficitario"
          name="isEnteStrutturalmenteDeficitario"
          options={booleanOptions}
          value={annualData.isEnteStrutturalmenteDeficitario === undefined ? '' : String(annualData.isEnteStrutturalmenteDeficitario)}
          onChange={handleGenericChange}
          placeholder="Seleziona..."
          aria-required="true"
        />
        <Select
          label="Ente in piano di riequilibrio finanziario pluriennale (art. 243-bis TUEL)?"
          id="isEnteRiequilibrioFinanziario"
          name="isEnteRiequilibrioFinanziario"
          options={booleanOptions}
          value={annualData.isEnteRiequilibrioFinanziario === undefined ? '' : String(annualData.isEnteRiequilibrioFinanziario)}
          onChange={handleGenericChange}
          placeholder="Seleziona..."
          aria-required="true"
        />
        <Select
          label="È un ente con personale dirigente?"
          id="hasDirigenza"
          name="hasDirigenza"
          options={booleanOptions}
          value={annualData.hasDirigenza === undefined ? '' : String(annualData.hasDirigenza)}
          onChange={handleGenericChange}
          placeholder="Seleziona..."
          aria-required="true"
          containerClassName="mb-3"
          error={validationErrors['fundData.annualData.hasDirigenza']}
        />
        <Checkbox
            id="isDistributionMode"
            name="isDistributionMode"
            label="Abilita modalità Distribuzione Risorse?"
            checked={!!annualData.isDistributionMode}
            onChange={handleGenericChange}
            containerClassName="mt-4"
        />
      </div>

      <hr className="my-6 border-t border-[#d1c0c1]" />

      <h4 className="text-base font-semibold text-[#1b0e0e] mb-1">Dati Specifici Anno di Riferimento</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
        <Input
          label="Fondo per il Lavoro Straordinario (€)"
          type="number"
          id="fondoLavoroStraordinario"
          name="fondoLavoroStraordinario"
          value={annualData.fondoLavoroStraordinario ?? ''}
          onChange={handleGenericChange}
          placeholder="Es. 20000.00"
          step="0.01"
          containerClassName="mb-3"
          inputInfo="Inserire l'importo stanziato per il lavoro straordinario per l'anno di riferimento."
        />
      </div>
    </Card>
  );
};
