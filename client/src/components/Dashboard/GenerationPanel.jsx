import { useState } from 'react';
import { FaMagic, FaExpand } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LiquidButton } from '../ui/LiquidGlassButton';

const GenerationPanel = ({ onGenerate, loading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt, aspectRatio);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg dark:shadow-none transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaMagic className="text-purple-600 dark:text-purple-400" />
                Create New Image
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Describe your educational concept</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-32 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg p-4 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors resize-none shadow-inner"
                        placeholder="E.g., A detailed cross-section of a plant cell showing chloroplasts..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FaExpand /> Aspect Ratio
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                className={`py-2 rounded-lg text-sm font-medium transition-all ${aspectRatio === ratio
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>

                <LiquidButton
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full py-6 text-lg font-bold mt-4"
                >
                    {loading ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                            />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FaMagic className="mr-2" />
                            Generate Image
                        </>
                    )}
                </LiquidButton>
            </form>
        </div>
    );
};

export default GenerationPanel;
