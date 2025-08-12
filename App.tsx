

import React, { useContext, useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuotationPage from './pages/QuotationPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import { LogOut, User as UserIcon, Home as HomeIcon, LayoutDashboard, ScrollText, Settings as SettingsIcon } from 'lucide-react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, logout } = useContext(AuthContext);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const settingsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setSettingsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinkClassName = ({ isActive }: { isActive: boolean }): string => {
        const baseClasses = "p-2 rounded-md transition-colors duration-200";
        const activeClasses = "bg-brand-yellow-500 text-brand-indigo-900 shadow-inner";
        const inactiveClasses = "text-gray-300 hover:bg-brand-indigo-700 hover:text-white";
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };
    
    const userActionClassName = (isOpen: boolean): string => {
        const baseClasses = "p-2 rounded-md transition-colors duration-200";
        const activeClasses = "bg-brand-indigo-700 text-white";
        const inactiveClasses = "text-gray-300 hover:bg-brand-indigo-700 hover:text-white";
        return `${baseClasses} ${isOpen ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className="bg-brand-indigo-50 min-h-screen font-sans text-gray-800">
            <header className="bg-brand-indigo-800 shadow-lg sticky top-0 z-30 border-b-4 border-brand-yellow-500 py-3">
                <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                    {/* Row 1: Centered Title */}
                    <h1 className="text-center text-xl sm:text-2xl font-bold text-brand-yellow-500 tracking-wider">II SHUBH HO II</h1>

                    {/* Row 2: Navigation and User Actions */}
                    <nav className="w-full relative flex justify-center items-center mt-2">
                        {/* Centered Navigation Icons */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <NavLink to="/" className={navLinkClassName} title="Home">
                                <HomeIcon size={22} />
                            </NavLink>
                            <NavLink to="/dashboard" className={navLinkClassName} title="Dashboard">
                                <LayoutDashboard size={22} />
                            </NavLink>
                            <NavLink to="/history" className={navLinkClassName} title="History">
                                <ScrollText size={22} />
                            </NavLink>
                        </div>
                        
                        {/* Right-aligned User Icons */}
                        <div className="absolute right-0 flex items-center space-x-1 sm:space-x-2">
                            {/* Settings Dropdown (Admin only) */}
                            {currentUser?.isAdmin && (
                                <div className="relative" ref={settingsMenuRef}>
                                    <button onClick={() => setSettingsMenuOpen(o => !o)} className={userActionClassName(settingsMenuOpen)} title="Settings">
                                        <SettingsIcon size={22} />
                                    </button>
                                    {settingsMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                            <Link to="/settings" state={{ tab: 'users' }} onClick={() => setSettingsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Users</Link>
                                            <Link to="/settings" state={{ tab: 'salesmen' }} onClick={() => setSettingsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Salesmen</Link>
                                            <Link to="/settings" state={{ tab: 'services' }} onClick={() => setSettingsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Services</Link>
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* Profile Dropdown */}
                            <div className="relative" ref={profileMenuRef}>
                                <button onClick={() => setProfileMenuOpen(o => !o)} className={userActionClassName(profileMenuOpen)} title="Profile">
                                    <UserIcon size={22}/>
                                </button>
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 overflow-hidden">
                                        <div className="px-4 py-2 text-sm text-gray-800 font-bold border-b bg-gray-50">
                                            {currentUser?.name}
                                        </div>
                                        <div className="py-1">
                                            <Link to="/settings" state={{ tab: 'profile' }} onClick={() => setProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Change Password</Link>
                                            <button onClick={() => { logout(); setProfileMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <main className="p-2 sm:p-4 lg:p-6">{children}</main>
        </div>
    );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <MainLayout>{children}</MainLayout>;
};

const AppRoutes: React.FC = () => {
    const { currentUser, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-brand-indigo-50">
                <div className="text-lg font-semibold text-brand-indigo-800">Loading...</div>
            </div>
        );
    }
    
    return (
        <Routes>
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/forgot-password" element={currentUser ? <Navigate to="/" /> : <ForgotPasswordPage />} />
            
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/quotation/new" element={<ProtectedRoute><QuotationPage /></ProtectedRoute>} />
            <Route path="/quotation/:id" element={<ProtectedRoute><QuotationPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </HashRouter>
    );
};

export default App;