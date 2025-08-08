import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Hero from "../../components/Hero";
import Button from "../../components/Button";
import { FaUsers, FaStar, FaClock } from "react-icons/fa";
import bannerBg from "../../assets/bannerBg.webp";
import Banner from "../../components/Banner";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allGroups = useSelector((state: RootState) => state.groups.allGroups);

  const group = allGroups.find((g) => g.id === Number(id));

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

        {group.upcomingEvent && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Upcoming Event</h3>
            <p className="text-gray-600">{group.upcomingEvent}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button variant="primary">Join Chat</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Groups
          </Button>
        </div>
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

export default GroupDetails;
