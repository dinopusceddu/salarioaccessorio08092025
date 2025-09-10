import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { PageModule } from './types';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Import delle pagine
import { HomePage } from './pages/HomePage';
import { DataEntryPage } from './pages/DataEntryPage';
import { FundDetailsPage } from './pages/FundDetailsPage';
import { CompliancePage } from './pages/CompliancePage';
import { ReportsPage } from './pages/ReportsPage';
import { ChecklistPage } from './pages/ChecklistPage';

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
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner text="Caricamento applicazione..." />
        </div>
      ) : (
        <ActiveComponent />
      )}
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;