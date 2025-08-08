import Banner from "../../components/Banner";
import Hero from "../../components/Hero";
import ContactForm from "./ContactForm";
import bannerBg from "../../assets/bannerBg.webp";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <ContactForm />
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
export default Contact;
