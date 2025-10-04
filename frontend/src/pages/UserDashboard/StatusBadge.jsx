// components/UserDashboard/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status, config }) => {
  const StatusIcon = config[status]?.icon;
  const statusStyle = config[status]?.color || "bg-gray-100 text-gray-800 border-gray-200";
  const label = config[status]?.label || status;

  return (
    <div className="flex items-center gap-2">
      {StatusIcon && <StatusIcon className="w-4 h-4" />}
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyle}`}>
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;