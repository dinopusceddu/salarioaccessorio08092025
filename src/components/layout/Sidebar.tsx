import React from 'react';
import { PageModule } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

interface SidebarProps {
  modules: PageModule[];
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ modules, isOpen, toggleSidebar }) => {
  const { state, dispatch } = useAppContext();

  const handleNav = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: id });
    if (isOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#fcf8f8] text-[#1b0e0e] p-4 transform 
                   ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} 
                   md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] 
                   transition-transform duration-300 ease-in-out border-r border-solid border-r-[#f3e7e8]`}
      >
        <nav>
          <ul>
            {modules.map((mod) => (
              <li key={mod.id} className="mb-1.5">
                <button
                  onClick={() => handleNav(mod.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 group text-left
                    ${state.activeTab === mod.id 
                      ? 'bg-[#f3e7e8] text-[#ea2832]'
                      : 'text-[#1b0e0e] hover:bg-[#f3e7e8] hover:text-[#1b0e0e]'
                    }`}
                >
                  {mod.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};