// components/UserDashboard/DashboardTabs.jsx
import React from "react";

const DashboardTabs = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50">
        <nav className="flex space-x-8 px-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </nav>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-5 border-b-2 font-semibold text-sm transition-all duration-200 flex items-center space-x-2 ${
      isActive
        ? "border-purple-600 text-purple-700"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    <span>{tab.label}</span>
    {tab.count !== null && (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? "bg-purple-100 text-purple-700" 
          : "bg-gray-200 text-gray-600"
      }`}>
        {tab.count}
      </span>
    )}
  </button>
);

export default DashboardTabs;