import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageModule } from './types';

// Import delle pagine
import { HomePage } from './pages/HomePage';
import { DataEntryPage } from './pages/DataEntryPage';
import { FundDetailsPage } from './pages/FundDetailsPage';
import { CompliancePage } from './pages/CompliancePage';
import { ReportsPage } from './pages/ReportsPage';
import { ChecklistPage } from './pages/ChecklistPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const allPageModules: PageModule[] = [
  { id: 'benvenuto', name: 'Benvenuto!', component: HomePage },
  { id: 'dataEntry', name: 'Dati Costituzione Fondo', component: DataEntryPage },
  { id: 'fundDetails', name: 'Dettaglio Fondo Calcolato', component: FundDetailsPage },
  { id: 'compliance', name: 'Conformità', component: CompliancePage },
  { id: 'checklist', name: 'Check list Interattiva', component: ChecklistPage },
  { id: 'reports', name: 'Report', component: ReportsPage },
];

const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { activeTab, isLoading } = state;

  const visibleModules = allPageModules;

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