import { Link } from 'react-router-dom';
import { SplineScene } from '../components/ui/SplineScene';
import { Card } from '../components/ui/Card';
import { Spotlight } from '../components/ui/Spotlight';
import { LiquidButton } from '../components/ui/LiquidGlassButton';
import { FaRocket, FaImage, FaHistory, FaTrophy } from 'react-icons/fa';

export default function Landing() {
    const features = [
        {
            icon: <FaImage className="w-8 h-8" />,
            title: "AI-Powered Image Generation",
            description: "Transform your educational ideas into stunning visuals using advanced Gemini AI technology.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        },
        {
            icon: <FaRocket className="w-8 h-8" />,
            title: "Smart Prompt Enhancement",
            description: "Our AI automatically enhances your prompts to generate more accurate and detailed educational content.",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
        },
        {
            icon: <FaHistory className="w-8 h-8" />,
            title: "Generation History",
            description: "Keep track of all your creations with our comprehensive history and gallery features.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        },
        {
            icon: <FaTrophy className="w-8 h-8" />,
            title: "Gamified Experience",
            description: "Earn XP and credits as you create. Make learning and content creation fun and rewarding.",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            {/* Hero Section with 3D Spline */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <Card className="w-full h-screen bg-black/[0.96] dark:bg-black/[0.98] relative overflow-hidden border-0 rounded-none">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="white"
                    />

                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left content */}
                        <div className="flex-1 p-8 lg:p-16 relative z-10 flex flex-col justify-center">
                            <div className="max-w-2xl">
                                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
                                    EduVision AI
                                </h1>
                                <p className="text-xl md:text-2xl text-neutral-300 mb-4">
                                    Transform Education with AI-Powered Visuals
                                </p>
                                <p className="text-lg text-neutral-400 mb-8 max-w-lg">
                                    Create stunning educational images instantly with our advanced AI technology.
                                    Powered by Google Gemini, EduVision AI turns your ideas into captivating visual content.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/signup">
                                        <LiquidButton className="px-8 py-6 text-lg font-bold">
                                            Try It Free
                                        </LiquidButton>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right content - 3D Scene */}
                        <div className="flex-1 relative min-h-[400px] lg:min-h-full">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 lg:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-zinc-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Everything you need to create amazing educational content with AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-md border-gray-200 dark:border-white/10 hover:border-white/50 dark:hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:shadow-white/20"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-zinc-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of educators creating amazing visual content with AI
                    </p>
                    <Link to="/signup">
                        <LiquidButton className="px-10 py-6 text-lg font-bold bg-white text-black hover:text-white hover:bg-black/20">
                            Start Creating Now
                        </LiquidButton>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-zinc-900 text-zinc-400 text-center">
                <p>&copy; 2025 EduVision AI. Powered by Google Gemini.</p>
            </footer>
        </div>
    );
}
