import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  description?: string;
  icon: string;
  iconColor: string;
  trendColor?: string;
}

export default function StatCard({
  title,
  value,
  trend,
  description,
  icon,
  iconColor,
  trendColor = "text-neutral-500"
}: StatCardProps) {
  return (
    <div
      className="bg-card text-card-foreground rounded-2xl shadow-lg glass-effect p-6 transition-transform duration-300 ease-out transform hover:scale-105 hover:shadow-2xl animate-fade-in cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white drop-shadow-lg">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-20 ${iconColor.replace('text-', 'bg-')} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
        >
          <span className={`material-icons ${iconColor} text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12`}>{icon}</span>
        </div>
      </div>
      {trend && (
        <p className={`text-sm ${trendColor} mt-3 flex items-center`}>
          <span className="material-icons text-base mr-1">arrow_upward</span>
          {trend}
        </p>
      )}
      {description && (
        <p className="text-sm text-neutral-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
