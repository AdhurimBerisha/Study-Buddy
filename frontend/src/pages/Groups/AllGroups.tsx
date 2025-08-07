import Hero from "../../components/Hero";
import Button from "../../components/Button";
import { FaPlus, FaStar, FaClock, FaUsers } from "react-icons/fa";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";
import GroupCard from "./GroupCard";

const AllGroups = () => {
  const allGroups = [
    {
      id: 1,
      name: "Frontend Masters",
      category: "Web Development",
      members: 85,
      level: "Intermediate",
      description: "Learn modern frontend technologies with industry experts",
      upcomingEvent: "React Workshop - Tomorrow 3PM",
    },
    {
      id: 2,
      name: "Python Pioneers",
      category: "Software Development",
      members: 120,
      level: "Beginner",
      description: "Master Python programming from basics to advanced concepts",
      upcomingEvent: "Django Basics - Friday 10AM",
    },
    {
      id: 3,
      name: "Data Wizards",
      category: "Data Science",
      members: 95,
      level: "Professional",
      description: "Advanced data analysis and machine learning techniques",
      upcomingEvent: "TensorFlow Workshop - Next Week",
    },
    {
      id: 4,
      name: "Cloud Commanders",
      category: "DevOps & Cloud",
      members: 55,
      level: "Advanced",
      description: "Cloud infrastructure and deployment strategies",
      upcomingEvent: "AWS Certification Prep - Ongoing",
    },
    {
      id: 5,
      name: "Network Ninjas",
      category: "Networking & Security",
      members: 45,
      level: "Advanced",
      description: "Network architecture and cybersecurity best practices",
      upcomingEvent: "Cisco Lab Session - Wednesday",
    },
    {
      id: 6,
      name: "Unity Universe",
      category: "Game Development",
      members: 40,
      level: "Beginner",
      description: "Game development with Unity and Unreal Engine",
      upcomingEvent: "3D Modeling Workshop - Coming Soon",
    },
  ];

  const handleJoinGroup = (groupId: number) => {
    console.log(`Joining group ${groupId}`);
    // Add your join group logic here
  };

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Groups</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Button>
              <FaPlus className="mr-2" />
              Create New Group
            </Button>
            <Button variant="outline">
              <FaUsers className="mr-2" />
              My Groups
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaUsers className="text-blue-600 text-xl" />
            <span className="text-gray-700 font-semibold">
              {allGroups.reduce((sum, group) => sum + group.members, 0)}+ Active
              Members
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaStar className="text-yellow-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              {allGroups.length} Specialized Groups
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <FaClock className="text-green-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              Weekly Events & Activities
            </span>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              variant="all"
              onJoin={() => handleJoinGroup(group.id)}
            />
          ))}
        </div>

        {/* Empty state */}
        {allGroups.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              No groups available yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to create a new group
            </p>
            <Button variant="primary">Create New Group</Button>
          </div>
        )}
      </div>

      <Features />
      <Banner
        imageSrc={bannerBg}
        title="Find your perfect learning community!"
        subtitle="Join groups that match your interests and skill level"
        buttonText="Browse Groups"
      />
    </div>
  );
};

export default AllGroups;
