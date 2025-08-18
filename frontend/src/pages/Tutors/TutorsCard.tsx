import type { ReactNode } from "react";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import type { Tutor } from "../../types/tutor";

type TutorCardProps = Tutor & {
  avatar: ReactNode;
};

const TutorCard = ({
  id,
  avatar,
  expertise,
  rating,
  totalLessons,
  first_name,
  last_name,
  bio,
}: TutorCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-gray-200 dark:border-gray-700 w-full max-w-4xl">
      <div className="md:col-span-4 flex justify-center md:justify-start">
        <div className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-5xl">
            {avatar}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {expertise.join(", ")}
          </div>
          <div className="text-yellow-500 font-semibold">
            {rating && !isNaN(Number(rating))
              ? Number(rating).toFixed(1)
              : "0.0"}{" "}
            ★
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm mb-3">
            {totalLessons} Lessons
          </div>
          <Link to={`/tutors/${id}`} className="w-full">
            <Button fullWidth size="sm">
              Show more
            </Button>
          </Link>
        </div>
      </div>

      <div className="md:col-span-8">
        <h3 className="text-2xl font-medium mb-2 text-gray-900 dark:text-gray-100">
          {first_name} {last_name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{bio}</p>

        <div className="flex flex-col gap-4 text-sm" />
      </div>
    </div>
  );
};

export default TutorCard;
