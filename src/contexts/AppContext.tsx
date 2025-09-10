import React, { createContext, useReducer, Dispatch, useContext, useCallback } from 'react';
import { AppState, AppAction, FundData, CalculatedFund, ComplianceCheck } from '../types';
import { DEFAULT_CURRENT_YEAR, INITIAL_HISTORICAL_DATA, INITIAL_ANNUAL_DATA, DEFAULT_USER } from '../constants';

const LOCAL_STORAGE_KEY = 'salario-accessorio-app-state';

const defaultInitialState: AppState = {
  currentUser: DEFAULT_USER,
  currentYear: DEFAULT_CURRENT_YEAR,
  fundData: {
    historicalData: INITIAL_HISTORICAL_DATA,
    annualData: INITIAL_ANNUAL_DATA,
    fondoAccessorioDipendenteData: {},
    fondoElevateQualificazioniData: {},
    fondoSegretarioComunaleData: {},
    fondoDirigenzaData: {},
    distribuzioneRisorseData: {},
  },
  personaleServizio: {
    dettagli: [],
  },
  calculatedFund: undefined,
  complianceChecks: [],
  isLoading: false,
  error: undefined,
  validationErrors: {},
  activeTab: 'benvenuto',
};

const loadInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...defaultInitialState,
        ...parsedState,
        isLoading: false,
        error: undefined,
        validationErrors: {},
      };
    }
  } catch (error) {
    console.error("Could not load state from localStorage. Using default state.", error);
  }
  return defaultInitialState;
};

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
  performFundCalculation: () => Promise<void>;
  saveState: () => void;
}>({
  state: defaultInitialState,
  dispatch: () => null,
  performFundCalculation: async () => {},
  saveState: () => {},
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CURRENT_YEAR':
      return { ...state, currentYear: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'CALCULATE_FUND_START':
      return { ...state, isLoading: true, error: undefined, validationErrors: {} };
    case 'CALCULATE_FUND_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        calculatedFund: action.payload.fund, 
        complianceChecks: action.payload.checks, 
        validationErrors: {} 
      };
    case 'CALCULATE_FUND_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload, 
        calculatedFund: undefined, 
        complianceChecks: [] 
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());

  const saveState = useCallback(() => {
    try {
      const stateToSave = { 
        ...state, 
        isLoading: undefined, 
        error: undefined, 
        validationErrors: undefined 
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Could not save state to localStorage.", error);
    }
  }, [state]);

  const performFundCalculation = useCallback(async () => {
    dispatch({ type: 'CALCULATE_FUND_START' });
    try {
      // Simulazione calcolo fondo
      const mockCalculatedFund: CalculatedFund = {
        fondoBase2016: 100000,
        incrementiStabiliCCNL: [],
        adeguamentoProCapite: { descrizione: '', importo: 0, riferimento: '', tipo: 'stabile' },
        risorseVariabili: [],
        totaleFondoRisorseDecentrate: 100000,
        ammontareSoggettoLimite2016: 100000,
        totaleRisorseSoggetteAlLimiteDaFondiSpecifici: 100000,
        totaleFondo: 100000,
        totaleParteStabile: 80000,
        totaleParteVariabile: 20000,
        totaleComponenteStabile: 80000,
        totaleComponenteVariabile: 20000,
        dettaglioFondi: {
          dipendente: { stabile: 60000, variabile: 15000, totale: 75000 },
          eq: { stabile: 10000, variabile: 2000, totale: 12000 },
          segretario: { stabile: 8000, variabile: 2000, totale: 10000 },
          dirigenza: { stabile: 2000, variabile: 1000, totale: 3000 },
        }
      };

      const mockComplianceChecks: ComplianceCheck[] = [
        {
          id: 'test_check',
          descrizione: 'Controllo di test',
          isCompliant: true,
          messaggio: 'Tutto funziona correttamente',
          riferimentoNormativo: 'Test',
          gravita: 'info'
        }
      ];

      dispatch({ 
        type: 'CALCULATE_FUND_SUCCESS', 
        payload: { fund: mockCalculatedFund, checks: mockComplianceChecks } 
      });
      saveState();
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      dispatch({ type: 'CALCULATE_FUND_ERROR', payload: `Errore nel calcolo: ${error}` });
    }
  }, [saveState]);

  const contextValue = {
    state,
    dispatch,
    performFundCalculation,
    saveState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);