import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '../../store/hooks';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { sidebarOpen, theme } = useAppSelector((state) => state.ui);

  return (
    <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            width: sidebarOpen ? 280 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-card border-r border-border overflow-hidden"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto bg-background">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="container mx-auto p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};
