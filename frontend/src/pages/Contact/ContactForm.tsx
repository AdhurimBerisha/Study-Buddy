import { useForm } from "react-hook-form";
import Button from "../../components/Button";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      console.log("Form submitted:", data);

      // Here you would typically send the data to your backend
      // await submitContactForm(data);

      // Reset form after successful submission
      reset();
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl w-full mx-auto mt-10 space-y-6"
    >
      <div className="pb-3">
        <h1 className="text-6xl font-bold pb-10">
          Media and <br /> Business Inquiries
        </h1>
        <p className="font-thin">
          Send us a message below or email us at <br />
          <span className="underline">contact@info.com</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="First"
            {...register("firstName", {
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            })}
            className={`border rounded px-4 py-2 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-1 invisible">Last</label>
          <input
            type="text"
            placeholder="Last"
            {...register("lastName", {
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            })}
            className={`border rounded px-4 py-2 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="font-semibold text-sm mb-1 block">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className={`border rounded px-4 py-2 w-full ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label className="font-semibold text-sm mb-1 block">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters",
            },
          })}
          className={`border rounded px-4 py-2 w-full ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.message && (
          <span className="text-red-500 text-xs mt-1">
            {errors.message.message}
          </span>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" className="px-8" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
