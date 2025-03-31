import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { DayPlan } from '@shared/schema';

interface ItineraryDayProps {
  day: DayPlan;
  onRemoveDay: () => void;
  onRemoveActivity: (activityIndex: number) => void;
}

export default function ItineraryDay({ day, onRemoveDay, onRemoveActivity }: ItineraryDayProps) {
  const dayDate = parseISO(day.date);
  const formattedDate = format(dayDate, "EEEE, MMM d");
  
  return (
    <div className="itinerary-day bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 rounded-t-lg flex items-center justify-between">
        <h4 className="font-medium text-gray-800">Day {day.day} - {formattedDate}</h4>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
          >
            <i className="ri-edit-line"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={onRemoveDay}
          >
            <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      </div>
      
      <Droppable droppableId={`day-${day.day}`}>
        {(provided) => (
          <div 
            className="p-4 space-y-3"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {day.activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
                <i className="ri-calendar-event-line text-3xl mb-2"></i>
                <p className="text-sm">Drop activities here for Day {day.day}</p>
              </div>
            ) : (
              day.activities.map((activity, index) => (
                <Draggable 
                  key={`${activity.activityId}-${index}`} 
                  draggableId={`day-${day.day}-activity-${index}`} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-200"
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <i className="ri-building-2-line"></i>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-900">{activity.name}</h5>
                        <p className="text-xs text-gray-500">{activity.startTime} - {activity.endTime}</p>
                      </div>
                      <div className="ml-auto flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{activity.duration}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onRemoveActivity(index)}
                        >
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
