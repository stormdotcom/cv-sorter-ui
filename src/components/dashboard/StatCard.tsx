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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-800">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full bg-opacity-20 flex items-center justify-center ${iconColor.replace('text-', 'bg-')}`}>
          <span className={`material-icons ${iconColor}`}>{icon}</span>
        </div>
      </div>
      {trend && (
        <p className={`text-sm ${trendColor} mt-2 flex items-center`}>
          <span className="material-icons text-sm mr-1">arrow_upward</span>
          {trend}
        </p>
      )}
      {description && (
        <p className="text-sm text-neutral-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
