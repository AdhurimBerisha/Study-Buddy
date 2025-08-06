import type { ReactNode } from "react";
import Button from "../../components/Button";

type TutorCardProps = {
  avatar: ReactNode;
  category: string;
  rating: number;
  lessons: number;
  name: string;
  headline: string;
  description: string;
  speaks: string;
  hourlyRate: string;
  trialRate: string;
};

export default function TutorCard({
  avatar,
  category,
  rating,
  lessons,
  name,
  headline,
  description,
  speaks,
  hourlyRate,
  trialRate,
}: TutorCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-gray-200 w-full max-w-4xl">
      <div className="md:col-span-4 flex justify-center md:justify-start">
        <div className="w-72 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gray-200 text-gray-500 text-5xl">
            {avatar}
          </div>
          <div className="text-sm text-gray-600 mb-2">{category}</div>
          <div className="text-yellow-500 font-semibold">
            {rating.toFixed(1)} ★
          </div>
          <div className="text-gray-400 text-sm mb-3">{lessons} Lessons</div>
          <Button>Book Trial</Button>
        </div>
      </div>

      <div className="md:col-span-8">
        <h3 className="text-2xl font-medium mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4">
          <strong>{headline}</strong> {description}
        </p>

        <div className="text-sm text-gray-500 uppercase mb-1">Speaks:</div>
        <p className="mb-6">{speaks}</p>

        <div className="flex flex-col gap-4 text-sm">
          <div>
            <div className="text-gray-400 uppercase text-xs">
              Hourly Rate From:
            </div>
            <div className="font-semibold">{hourlyRate}</div>
          </div>

          <div>
            <div className="text-gray-400 uppercase text-xs">Trial:</div>
            <div className="font-semibold">{trialRate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
