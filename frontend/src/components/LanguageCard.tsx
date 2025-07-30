type CardProps = {
  category: string;
  language: string;
  tutors: number;
};

const LanguageCard = ({ category, language, tutors }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center">
      <div className="text-pink-500 border border-pink-500 px-3 py-1 rounded-full inline-block mb-3 font-bold">
        {category}
      </div>
      <h3 className="text-lg font-semibold">{language} language</h3>
      <p className="text-sm text-gray-500">{tutors} Tutors</p>
    </div>
  );
};

export default LanguageCard;
