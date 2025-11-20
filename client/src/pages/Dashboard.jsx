import { useState, useEffect } from 'react';
import GenerationPanel from '../components/Dashboard/GenerationPanel';
import ResultCard from '../components/Dashboard/ResultCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState(null);
    const { updateUser } = useAuth();

    // Listen for history selection from Sidebar
    useEffect(() => {
        const handleHistorySelect = (e) => {
            setCurrentResult(e.detail);
        };
        window.addEventListener('historySelected', handleHistorySelect);
        return () => window.removeEventListener('historySelected', handleHistorySelect);
    }, []);

    const handleGenerate = async (prompt, aspectRatio) => {
        setLoading(true);
        try {
            const { data } = await api.post('/generate', { prompt, aspectRatio });
            setCurrentResult(data.image);
            updateUser(data.user); // Update credits/xp
            // Notify sidebar to update history
            window.dispatchEvent(new Event('historyUpdated'));
        } catch (error) {
            console.error("Generation failed", error);
            alert(error.response?.data?.message || "Generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-1">
                <GenerationPanel onGenerate={handleGenerate} loading={loading} />

                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">Pro Tip</h3>
                    <p className="text-sm text-blue-200/80">
                        Try being specific with your educational requests. E.g., "Diagram of the solar system with labels" or "Historical reenactment of the signing of the Magna Carta".
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2">
                {currentResult ? (
                    <ResultCard result={currentResult} />
                ) : (
                    <div className="h-[500px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">🎨</span>
                        </div>
                        <p className="text-lg">Your masterpiece will appear here</p>
                        <p className="text-sm opacity-60">Start by entering a prompt on the left</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
