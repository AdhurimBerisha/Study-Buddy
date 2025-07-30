import LanguageCard from "./LanguageCard";

const languages = [
  {
    category: "Web Development - Front End",
    language: "HTML/CSS/Javascript",
    tutors: 125,
  },
  {
    category: "Web Development - Back End",
    language: "Node.JS/Java/SpringBoot",
    tutors: 83,
  },
  { category: "Software Development", language: "Python", tutors: 76 },
  {
    category: "Networking & Security",
    language: "Python, Bash, Ansible, Cisco tools",
    tutors: 64,
  },
];

const LanguageGrid = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-12 bg-white">
      {languages.map((lang) => (
        <LanguageCard key={lang.category} {...lang} />
      ))}
    </section>
  );
};

export default LanguageGrid;
