# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?



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

export const USERS_KEY = "users";
export const QUOTATIONS_KEY = "quotations";
export const SALESMEN_KEY = "salesmen";
export const SERVICE_ITEMS_KEY = "serviceItems";
export const PRODUCTS_KEY = "products";

export const SECRET_QUESTIONS = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "In what city were you born?",
    "What is your favorite book?",
    "What was the model of your first car?",
];

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shubh Ho Quotation Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'brand-indigo': {
                '50': '#f0f4ff',
                '100': '#e0e8ff',
                '200': '#c7d5ff',
                '300': '#a3baff',
                '400': '#7f9bff',
                '500': '#607dff',
                '600': '#4b63f2',
                '700': '#3c52e0',
                '800': '#3245b9',
                '900': '#2d3d94',
                '950': '#1f285c',
              },
              'brand-yellow': {
                '500': '#f5b50a',
                '400': '#f6c031',
              }
            }
          }
        }
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react-router-dom": "https://esm.sh/react-router-dom@^7.8.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.539.0",
    "react/": "https://esm.sh/react@^19.1.1/",
    "react": "https://esm.sh/react@^19.1.1",
    "react-dom/": "https://esm.sh/react-dom@^19.1.1/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-brand-indigo-50">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
{
  "name": "SHUBHHO QUOTE",
  "description": "An application to create, manage, and track customer quotations for products and services.",
  "requestFramePermissions": [],
  "prompt": ""
}
{
  "name": "shubhho-quote",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react-router-dom": "^7.8.0",
    "lucide-react": "^0.539.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

export interface User {
    id: string;
    name: string;
    mobile: string;
    passwordHash: string;
    secretQuestion: string;
    secretAnswerHash: string;
    isAdmin: boolean;
}

export enum QuotationStatus {
    DRAFT = 'DRAFT',
    SALE = 'SALE',
    CANCEL = 'CANCEL',
    WALK_OUT = 'WALK-OUT',
}

export interface Customer {
    name: string;
    mobile: string;
}

export interface Salesman {
    id: string;
    name: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    mrp: number;
}

export interface ProductItem {
    id: string;
    name: string;
    mrp: number;
}

export interface QuotationItem {
    barcode: string;
    unit: 'MTR' | 'PCS';
    quantity: number;
    mrp: number;
    total: number;
}

export interface StitchingItem {
    name: string;
    unit: 'PCS';
    quantity: number;
    mrp: number;
    total: number;
}

export interface Discount {
    percent: number;
    amount: number;
}

export interface CancellationReason {
    category: string;
    subCategory: string;
}

export interface Quotation {
    id: string;
    quotationNumber: string;
    userId: string; // The mobile number of the user who created it
    customerName: string;
    customerMobile: string;
    trialDate: string;
    deliveryDate: string;
    salesman: string;
    products: QuotationItem[];
    services: StitchingItem[];
    productDiscount: Discount;
    serviceDiscount: Discount;
    productSubtotal: number;
    serviceSubtotal: number;
    grandTotal: number;
    status: QuotationStatus;
    cancellationReason?: CancellationReason | null;
    saleBillNumber?: string;
    saleBillDate?: string;
    createdAt: string;
    updatedAt: string;
}
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

GEMINI_API_KEY=PLACEHOLDER_API_KEY
