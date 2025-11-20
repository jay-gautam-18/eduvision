import { motion } from 'framer-motion';
import { FaLightbulb, FaShareAlt, FaDownload } from 'react-icons/fa';

const ResultCard = ({ result }) => {
    if (!result) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg dark:shadow-none transition-colors duration-300"
        >
            <div className="relative group">
                <img
                    src={result.imageUrl}
                    alt={result.originalPrompt}
                    className="w-full h-auto object-cover max-h-[500px]"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <FaDownload />
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <FaShareAlt />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400 mt-1">
                        <FaLightbulb />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Educational Insight</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {result.educationalFact}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Original Prompt</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 italic">"{result.originalPrompt}"</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
