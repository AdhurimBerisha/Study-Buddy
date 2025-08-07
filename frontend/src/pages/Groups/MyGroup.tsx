import { useSelector } from "react-redux";
import Hero from "../../components/Hero";
import Button from "../../components/Button";
import GroupCard from "./GroupCard";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";

const MyGroup = () => {
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth
  );

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
  };

  const handleLeaveGroup = (groupId: number) => {
    console.log(`Leaving group ${groupId}`);
  };

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Groups</h1>

        {!isAuthenticated ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Please login to view the groups you have joined
            </h3>
            <p className="text-gray-500 mb-6">
              Once logged in, you'll be able to see and manage your joined
              groups.
            </p>
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </div>
        ) : (
          <>
            {myGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    variant="my"
                    onLeave={() => handleLeaveGroup(group.id)}
                    actions={
                      <div className="flex space-x-4">
                        <Link to={`/groups/${group.id}`} className="flex-1">
                          <Button variant="primary" className="w-full">
                            View Group
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          Leave Group
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                  You haven't joined any groups yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Join groups to collaborate with other learners
                </p>
                <Link to="/groups">
                  <Button variant="primary">Browse All Groups</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        subtitle="Choose a teacher for 1-on-1 lessons"
        buttonText="Sign Up"
      />
    </div>
  );
};

export default MyGroup;
