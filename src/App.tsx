import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ChecklistPage } from './pages/ChecklistPage';
import { CompliancePage } from './pages/CompliancePage';
import { DataEntryPage } from './pages/DataEntryPage';
import { DistribuzioneRisorsePage } from './pages/DistribuzioneRisorsePage';
import { FondoAccessorioDipendentePage } from './pages/FondoAccessorioDipendentePage';
import { FondoDirigenzaPage } from './pages/FondoDirigenzaPage';
import { FondoElevateQualificazioniPage } from './pages/FondoElevateQualificazioniPage';
import { FondoSegretarioComunalePage } from './pages/FondoSegretarioComunalePage';
import { FundDetailsPage } from './pages/FundDetailsPage';
import { HomePage } from './pages/HomePage';
import { PersonaleServizioPage } from './pages/PersonaleServizioPage';
import { ReportsPage } from './pages/ReportsPage';
import { PageModule } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const allPageModules: PageModule[] = [
  { id: 'benvenuto', name: 'Benvenuto!', component: HomePage },
  { id: 'dataEntry', name: 'Dati Costituzione Fondo', component: DataEntryPage },
  {
    id: 'fondoAccessorioDipendente',
    name: 'Fondo Accessorio Personale',
    component: FondoAccessorioDipendentePage,
  },
  {
    id: 'fondoElevateQualificazioni',
    name: 'Fondo Elevate Qualificazioni',
    component: FondoElevateQualificazioniPage,
  },
  {
    id: 'fondoSegretarioComunale',
    name: 'Risorse Segretario Comunale',
    component: FondoSegretarioComunalePage,
  },
  { id: 'fondoDirigenza', name: 'Fondo Dirigenza', component: FondoDirigenzaPage },
  {
    id: 'personaleServizio',
    name: 'Personale in servizio',
    component: PersonaleServizioPage,
  },
  {
    id: 'distribuzioneRisorse',
    name: 'Distribuzione Risorse',
    component: DistribuzioneRisorsePage,
  },
  {
    id: 'fundDetails',
    name: 'Dettaglio Fondo Calcolato',
    component: FundDetailsPage,
  },
  { id: 'compliance', name: 'Conformità', component: CompliancePage },
  { id: 'checklist', name: 'Check list Interattiva', component: ChecklistPage },
  { id: 'reports', name: 'Report', component: ReportsPage },
];

const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { activeTab, fundData, isLoading } = state;

  const visibleModules = allPageModules.filter((module) => {
    if (module.id === 'fondoDirigenza' && !fundData.annualData.hasDirigenza) {
      return false;
    }
    if (module.id === 'distribuzioneRisorse' && !fundData.annualData.isDistributionMode) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    const activeModuleIsVisible = visibleModules.some(
      (mod) => mod.id === activeTab
    );
    if (!activeModuleIsVisible && activeTab !== 'benvenuto') {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'benvenuto' });
    }
  }, [visibleModules, activeTab, dispatch]);

  const ActiveComponent =
    visibleModules.find((mod) => mod.id === activeTab)?.component || HomePage;

  return (
    <MainLayout modules={visibleModules}>
      <ErrorBoundary resetKey={activeTab}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner text="Caricamento applicazione..." />
          </div>
        ) : (
          <ActiveComponent />
        )}
      </ErrorBoundary>
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
              <LoadingSpinner text="Caricamento applicazione..." />
            </div>
          }>
            <AppContent />
          </Suspense>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;