import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GenerativeArtScene } from '../ui/AnomalousMatterHero';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    const handleHistorySelect = (item) => {
        setSelectedHistoryItem(item);
        // Dispatch a custom event or use context to notify Dashboard
        const event = new CustomEvent('historySelected', { detail: item });
        window.dispatchEvent(event);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300 relative">
            {/* Background 3D Animation - Only for non-auth pages (Dashboard, Gallery) */}
            {!isAuthPage && (
                <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
                    <GenerativeArtScene />
                </div>
            )}

            <div className="relative z-10">
                <Navbar />
                {!isAuthPage && <Sidebar onSelectHistory={handleHistorySelect} />}
                <main className={`pt-24 px-6 pb-12 transition-all duration-300 ${!isAuthPage ? 'ml-16 lg:ml-64' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
