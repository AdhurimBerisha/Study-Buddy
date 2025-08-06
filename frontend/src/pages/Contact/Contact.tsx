import Banner from "../../components/Banner";
import Hero from "../../components/Hero";
import ContactForm from "./ContactForm";
import bannerBg from "../../assets/bannerBg.webp";

const Contact = () => {
  return (
    <div>
      <Hero />
      <ContactForm />
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
