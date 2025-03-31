import { Activity } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

export default function ActivityCard({ activity, className }: ActivityCardProps) {
  return (
    <div 
      className={cn(
        "bg-white border border-gray-200 rounded-md p-3 shadow-sm drag-item cursor-grab",
        className
      )}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 h-10 w-10 rounded-md ${activity.iconBg} flex items-center justify-center ${activity.iconColor}`}>
          <i className={`ri-${activity.icon} text-lg`}></i>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-gray-900">{activity.name}</h4>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <span className="flex items-center"><i className="ri-time-line mr-1"></i> {activity.duration}</span>
            <span className="mx-2">•</span>
            <span>{activity.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
