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
      console.log("Form submitted:", data);

      reset();
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-6 sm:space-y-8"
      >
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pb-6 sm:pb-8 lg:pb-10 leading-tight">
            Media and <br className="sm:hidden" />
            Business Inquiries
          </h1>
          <p className="font-thin text-sm sm:text-base lg:text-lg text-gray-600">
            Send us a message below or email us at{" "}
            <br className="hidden sm:block" />
            <span className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200">
              contact@info.com
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm sm:text-base mb-2 text-gray-700">
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
              className={`border rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${
                errors.firstName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm sm:text-base mb-2 text-gray-700 invisible sm:visible">
              Last Name
            </label>
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
              className={`border rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${
                errors.lastName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm sm:text-base mb-2 block text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`border rounded-lg px-4 py-3 text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${
              errors.email
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="font-semibold text-sm sm:text-base mb-2 block text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Tell us about your inquiry..."
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
            className={`border rounded-lg px-4 py-3 text-sm sm:text-base w-full resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ${
              errors.message
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          />
          {errors.message && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.message.message}
            </span>
          )}
        </div>

        <div className="pt-4 sm:pt-6">
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="px-8 py-3 text-sm sm:text-base"
          >
            {isSubmitting ? "Submitting..." : "Submit Message"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
