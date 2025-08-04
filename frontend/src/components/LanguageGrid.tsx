import Button from "./Button";
import LanguageCard from "./LanguageCard";
import { FaPlus } from "react-icons/fa6";

const languages = [
  {
    category: "Web Development - Front End",
    language: "HTML/CSS/Javascript",
    tutors: 20,
  },
  {
    category: "Web Development - Back End",
    language: "Node.JS/Java/SpringBoot",
    tutors: 10,
  },
  { category: "Software Development", language: "Python/C#/C++", tutors: 30 },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 17,
  },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 17,
  },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 17,
  },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 17,
  },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 17,
  },
];

const LanguageGrid = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 -mt-40 pt-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  py-10 px-6 rounded-xl shadow-xl ">
          {languages.map((lang) => (
            <LanguageCard key={lang.category} {...lang} />
          ))}
        </div>
        <div className="flex justify-center mt-12 mb-6">
          <Button>
            <FaPlus />
            Show All
          </Button>
        </div>
      </section>
    </>
  );
};

export default LanguageGrid;
