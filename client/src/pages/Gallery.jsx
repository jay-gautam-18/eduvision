import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { CircularGallery } from '../components/ui/CircularGallery';
import { LayoutGrid, Box } from 'lucide-react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or '3d'

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await api.get('/gallery');
                setImages(data);
            } catch (error) {
                console.error("Failed to fetch gallery", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    // Transform data for CircularGallery
    const circularItems = images.map(item => ({
        common: item.originalPrompt,
        binomial: item.user?.username || 'Unknown',
        photo: {
            url: item.imageUrl,
            text: item.originalPrompt,
            by: item.user?.username || 'Unknown'
        }
    }));

    return (
        <div className={`max-w-7xl mx-auto ${viewMode === '3d' ? 'min-h-[500vh]' : 'min-h-[calc(100vh-6rem)]'}`}>
            <div className={`flex justify-between items-center mb-8 ${viewMode === '3d' ? 'sticky top-24 z-50 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/10' : ''}`}>
                <h1 className="text-3xl font-bold text-white">Community Gallery</h1>

                {/* View Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('3d')}
                        className={`p-2 rounded-md transition-all ${viewMode === '3d' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        title="3D View"
                    >
                        <Box size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-20">Loading gallery...</div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {images.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.originalPrompt}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                            <p className="text-white text-sm truncate">{item.originalPrompt}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <img
                                                    src={item.user?.avatar || 'https://via.placeholder.com/20'}
                                                    alt="user"
                                                    className="w-5 h-5 rounded-full"
                                                />
                                                <span className="text-xs text-gray-300">{item.user?.username || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="sticky top-40 h-[80vh] w-full relative overflow-hidden rounded-xl bg-black/20 border border-white/5">
                            {circularItems.length > 0 ? (
                                <CircularGallery items={circularItems} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No images to display in 3D view
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Gallery;
