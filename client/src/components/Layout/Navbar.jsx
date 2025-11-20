import Avatar from '../UI/Avatar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaGem, FaStar } from 'react-icons/fa';
import { Home, Image, LogIn, UserPlus } from 'lucide-react';
import { AnimeNavBar } from '../ui/AnimeNavBar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const guestNavItems = [
        { name: "Home", url: "/", icon: Home },
        { name: "Gallery", url: "/gallery", icon: Image },
        { name: "Login", url: "/login", icon: LogIn },
        { name: "Sign Up", url: "/signup", icon: UserPlus },
    ];

    if (!user) {
        return <AnimeNavBar items={guestNavItems} defaultActive="Home" />;
    }

    return (
        <nav className="w-full h-16 bg-white/80 dark:bg-white/10 backdrop-blur-md border-b border-gray-200 dark:border-white/20 flex items-center justify-between px-6 fixed top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-2">
                <Link to="/dashboard" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
                    EduVision AI
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                >
                    {theme === 'dark' ? <FaSun /> : <FaMoon className="text-purple-600" />}
                </button>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 bg-gray-100 dark:bg-black/20 px-4 py-1 rounded-full border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <FaGem />
                            <span className="font-semibold">{user.credits} Credits</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300 dark:bg-white/20"></div>
                        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <FaStar />
                            <span className="font-semibold">{user.xp} XP</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 group relative cursor-pointer">
                        <Avatar name={user.username} size="md" />
                        <span className="text-gray-700 dark:text-white font-medium hidden md:block">{user.username}</span>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 pt-2 w-48 hidden group-hover:block z-50">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl p-2">
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
