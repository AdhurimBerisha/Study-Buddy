import { FaUsers, FaCalendarAlt, FaComments, FaTasks } from "react-icons/fa";
import Button from "../../components/Button";

type GroupCardProps = {
  group: {
    id: number;
    name: string;
    category: string;
    members: number;
    level: string;
    description?: string;
    upcomingEvent?: string;
    lastActivity?: string;
    unreadMessages?: number;
    pendingTasks?: number;
  };
  variant: "all" | "my";
  onView?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
  actions?: React.ReactNode;
};

const GroupCard = ({
  group,
  variant,
  onView,
  onJoin,
  onLeave,
  actions,
}: GroupCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
            <p className="text-gray-600">{group.category}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {group.level}
          </span>
        </div>

        {/* Description (for All Groups) */}
        {variant === "all" && group.description && (
          <p className="mt-3 text-gray-700">{group.description}</p>
        )}

        {/* Members Count */}
        <div className="flex items-center mt-4 text-gray-600">
          <FaUsers className="mr-2" />
          <span>{group.members} members</span>
        </div>

        {/* Additional Info Section */}
        <div className="mt-4">
          {variant === "all" ? (
            // All Groups variant
            group.upcomingEvent && (
              <div className="flex items-start">
                <FaCalendarAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700">
                  {group.upcomingEvent}
                </p>
              </div>
            )
          ) : (
            // My Groups variant
            <div className="grid grid-cols-2 gap-4">
              {group.upcomingEvent && (
                <div className="flex items-center">
                  <FaCalendarAlt className="text-green-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Upcoming</p>
                    <p className="text-sm font-medium">{group.upcomingEvent}</p>
                  </div>
                </div>
              )}
              {group.unreadMessages !== undefined && (
                <div className="flex items-center">
                  <FaComments className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Messages</p>
                    <p className="text-sm font-medium">
                      {group.unreadMessages} new
                    </p>
                  </div>
                </div>
              )}
              {group.pendingTasks !== undefined && (
                <div className="flex items-center">
                  <FaTasks className="text-orange-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Tasks</p>
                    <p className="text-sm font-medium">
                      {group.pendingTasks} pending
                    </p>
                  </div>
                </div>
              )}
              {group.lastActivity && (
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <FaUsers className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last active</p>
                    <p className="text-sm font-medium">{group.lastActivity}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {/* Action Buttons */}
        <div className="mt-6">
          {actions ? (
            actions
          ) : variant === "all" ? (
            <Button variant="primary" className="w-full" onClick={onJoin}>
              Join Group
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button variant="primary" className="flex-1" onClick={onView}>
                View Group
              </Button>
              <Button variant="outline" className="flex-1" onClick={onLeave}>
                Leave Group
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
