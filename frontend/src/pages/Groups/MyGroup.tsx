import Hero from "../../components/Hero";
import Button from "../../components/Button";
import GroupCard from "./GroupCard";

const MyGroup = () => {
  const myGroups = [
    {
      id: 1,
      name: "Frontend Masters",
      category: "Web Development",
      members: 85,
      level: "Intermediate",
      lastActivity: "2 hours ago",
      upcomingEvent: "React Workshop - Tomorrow 3PM",
      unreadMessages: 5,
      pendingTasks: 2,
    },
    {
      id: 2,
      name: "Python Pioneers",
      category: "Software Development",
      members: 120,
      level: "Beginner",
      lastActivity: "1 day ago",
      upcomingEvent: "Django Basics - Friday 10AM",
      unreadMessages: 3,
      pendingTasks: 1,
    },
  ];

  const handleViewGroup = (groupId: number) => {
    console.log(`Viewing group ${groupId}`);
    // Add your view group logic here
  };

  const handleLeaveGroup = (groupId: number) => {
    console.log(`Leaving group ${groupId}`);
    // Add your leave group logic here
  };

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Groups</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              variant="my"
              onView={() => handleViewGroup(group.id)}
              onLeave={() => handleLeaveGroup(group.id)}
            />
          ))}
        </div>

        {/* Empty state */}
        {myGroups.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              You haven't joined any groups yet
            </h3>
            <p className="text-gray-500 mb-6">
              Join groups to collaborate with other learners
            </p>
            <Button variant="primary">Browse All Groups</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroup;
