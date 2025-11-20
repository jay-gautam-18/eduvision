import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FaHistory, FaEllipsisV } from 'react-icons/fa';
import { LayoutDashboard, Image as ImageIcon, LogOut } from 'lucide-react';
import Avatar from '../UI/Avatar';
import { Sidebar as SidebarContainer, SidebarBody, SidebarLink } from '../ui/SidebarUI';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const Sidebar = ({ onSelectHistory }) => {
    const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false);
    const { logout, user } = useAuth();

    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Gallery",
            href: "/gallery",
            icon: <ImageIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "#",
            icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            onClick: (e) => {
                e.preventDefault();
                logout();
            }
        }
    ];

    // Fetch history on mount and listen for updates
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/history');
                setHistory(data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            }
        };
        fetchHistory();

        // Listen for history updates
        const handleHistoryUpdate = () => {
            fetchHistory();
        };
        window.addEventListener('historyUpdated', handleHistoryUpdate);

        return () => {
            window.removeEventListener('historyUpdated', handleHistoryUpdate);
        };
    }, []);

    // Handler to delete a history item
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent triggering onSelectHistory
        try {
            await api.delete(`/history/${id}`);
            setHistory(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error('Failed to delete history item', error);
        }
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 flex flex-col md:flex-row bg-gray-100 dark:bg-black/20 border-r border-gray-200 dark:border-white/10 overflow-hidden">
            <SidebarContainer open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div className="flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <div key={idx} onClick={link.onClick}>
                                    <SidebarLink link={link} />
                                </div>
                            ))}
                        </div>

                        {/* History Section */}
                        <div className="mt-8">
                            <div className={cn("flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400 px-2", !open && "justify-center")}>
                                <FaHistory className="flex-shrink-0" />
                                {open && <span className="font-semibold uppercase text-xs tracking-wider whitespace-pre">Recent History</span>}
                            </div>

                            <div className="space-y-3">
                                {history.map(item => (
                                    <div
                                        key={item._id}
                                        onClick={() => onSelectHistory(item)}
                                        className={cn(
                                            "group relative cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-white/10",
                                            !open && "flex justify-center p-1"
                                        )}
                                    >
                                        <div className="flex gap-3 items-center">
                                            {item.imageUrl && !item.imageUrl.startsWith('data:image/svg') ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt="thumbnail"
                                                    className="w-8 h-8 rounded object-cover bg-gray-800 flex-shrink-0"
                                                />
                                            ) : (
                                                <Avatar name={item.originalPrompt} size="sm" className="shrink-0 w-8 h-8 text-xs" />
                                            )}
                                            {open && (
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{item.originalPrompt}</p>
                                                    <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Delete button appears on hover */}
                                        {open && (
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={e => handleDelete(e, item._id)}
                                                aria-label="Delete history item"
                                            >
                                                <FaEllipsisV size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Profile at Bottom */}
                    <div>
                        <SidebarLink
                            link={{
                                label: user?.username || "User",
                                href: "#",
                                icon: (
                                    <Avatar name={user?.username || "User"} size="sm" className="h-7 w-7 flex-shrink-0 rounded-full" />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </SidebarContainer>
        </div>
    );
};

export default Sidebar;

