import React from 'react';
import { NavLink } from 'react-router-dom'; 
import { LayoutDashboard, ArrowLeftRight, Wallet, Settings, Globe, Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Remains static on the left */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg"><Globe size={24} /></div>
          <span className="text-xl font-bold tracking-tight">P2P-Ex</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Marketplace" />
          <NavItem to="/trades" icon={<ArrowLeftRight size={20}/>} label="My Trades" />
          <NavItem to="/wallet" icon={<Wallet size={20}/>} label="Wallet" />
          <NavItem to="/settings" icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">MA</div>
            <div>
              <p className="text-sm font-medium">Muhammad Ali</p>
              <p className="text-xs text-slate-400">Verified Trader</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <button className="md:hidden"><Menu /></button>
          <div className="font-semibold text-gray-700">Market Overview</div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all">
            + New Trade Offer
          </button>
        </header>
        
        {/* Page Content */}
        <main className="p-8 flex-1">
          {children}
        </main>

        {/* Professional Footer inside the scrollable area */}
        <footer className="py-8 px-8 border-t bg-white mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-slate-900 font-bold mb-4">P2P-Ex International</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                The most secure peer-to-peer currency exchange platform. 
                Swap currency directly with people you trust.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-slate-500 text-sm space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">About Us</li>
                <li className="hover:text-blue-600 cursor-pointer">How it Works</li>
                <li className="hover:text-blue-600 cursor-pointer">Contact Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="text-slate-500 text-sm space-y-2">
                <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-slate-400 text-xs">
            © 2026 P2P-Ex International. All rights reserved. Made for Pakistan & Global Users.
          </div>
        </footer>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
      ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    {icon} <span className="font-medium">{label}</span>
  </NavLink>
);

export default MainLayout;