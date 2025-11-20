import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gray-50 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 rounded-2xl shadow-xl p-8 transition-colors duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
