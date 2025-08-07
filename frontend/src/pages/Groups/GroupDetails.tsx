import { useParams, useNavigate } from "react-router-dom";
import Hero from "../../components/Hero";
import Button from "../../components/Button";
import { FaUsers, FaStar, FaClock } from "react-icons/fa";

const dummyGroups = [
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
    description:
      "Join this group to master modern frontend tools like React, Vue, and Tailwind. Weekly workshops and real-world projects included.",
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
    description:
      "Explore Python fundamentals and web development using Django and Flask. Perfect for beginners stepping into software dev.",
  },
];

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const group = dummyGroups.find((g) => g.id === Number(id));

  if (!group) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Group not found
        </h2>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Hero />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{group.name}</h1>
        <p className="text-blue-600 font-semibold text-sm mb-2">
          {group.category}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <FaUsers /> {group.members} members
          </div>
          <div className="flex items-center gap-2">
            <FaStar /> {group.level}
          </div>
          <div className="flex items-center gap-2">
            <FaClock /> Last active: {group.lastActivity}
          </div>
        </div>

        <div className="text-gray-700 mb-6 leading-relaxed">
          {group.description}
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Upcoming Event</h3>
          <p className="text-gray-600">{group.upcomingEvent}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary">Join Chat</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Groups
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
