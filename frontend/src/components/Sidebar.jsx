import React from 'react';
import { User, History, PlusCircle, Award, ShieldAlert, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, tabs, isAdmin = false }) => {
  return (
    <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl shadow-premium p-4 md:sticky md:top-20 flex-shrink-0">
      <div className="mb-6 px-2">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
          {isAdmin ? (
            <>
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Admin Options</span>
            </>
          ) : (
            <>
              <Settings className="w-5 h-5 text-primary-600" />
              <span>Dashboard Options</span>
            </>
          )}
        </h2>
        <p className="text-xs text-slate-500 mt-1">Manage your account and quizzes</p>
      </div>

      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 w-full text-left ${
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm border-l-4 border-l-primary-600 rounded-l-none'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
