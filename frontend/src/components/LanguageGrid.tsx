import LanguageCard from "./LanguageCard";

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
    <section className="max-w-6xl mx-auto -mt-24 relative z-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  py-10 px-6 rounded-xl shadow-xl ">
        {languages.map((lang) => (
          <LanguageCard key={lang.category} {...lang} />
        ))}
      </div>
    </section>
  );
};

export default LanguageGrid;
