import {
  FaUsers,
  FaCalendarAlt,
  FaComments,
  FaTasks,
  FaLock,
  FaCrown,
  FaShieldAlt,
  FaTrash,
} from "react-icons/fa";
import Button from "../../components/Button";
import type { Group } from "../../store/slice/groupsSlice";

type GroupCardProps = {
  group: Group;
  variant: "all" | "my";
  onView?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
  actions?: React.ReactNode;
  isAuthenticated?: boolean;
};

const GroupCard = ({
  group,
  variant,
  onView,
  onJoin,
  onLeave,
  onDelete,
  actions,
  isAuthenticated = true,
}: GroupCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <FaCrown className="text-yellow-500" title="Admin" />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {variant === "my" && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs border-red-600 text-red-600 hover:bg-red-50"
                  onClick={onDelete}
                  title="Delete group"
                >
                  <FaTrash />
                </Button>
              )}
              <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
              {group.userRole && getRoleIcon(group.userRole)}
            </div>
            <p className="text-gray-600">{group.category}</p>
            {group.createdBy && (
              <p className="text-sm text-gray-500 mt-1">
                Created by {group.createdBy.firstName}{" "}
                {group.createdBy.lastName}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {group.level}
            </span>
            {group.isPrivate && (
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <FaLock className="text-xs" />
                Private
              </span>
            )}
          </div>
        </div>

        {variant === "all" && group.description && (
          <p className="mt-3 text-gray-700 line-clamp-2">{group.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 text-gray-600">
          <div className="flex items-center">
            <FaUsers className="mr-2" />
            <span>{group.memberCount} </span>
            {group.maxMembers && (
              <span className=" ml-1">/ {group.maxMembers} members</span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(group.createdAt)}
          </span>
        </div>

        <div className="mt-4">
          {variant === "my" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium">
                    {formatDate(group.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-blue-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium capitalize">
                    {group.userRole || "Member"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          {actions ? (
            actions
          ) : variant === "all" ? (
            !isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full opacity-75 cursor-not-allowed"
                disabled
              >
                <FaLock className="mr-2" />
                Login to Join
              </Button>
            ) : group.isMember ? (
              <div className="text-center py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-medium">
                  You are already a member
                </span>
              </div>
            ) : (
              <Button variant="primary" className="w-full" onClick={onJoin}>
                Join Group
              </Button>
            )
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
