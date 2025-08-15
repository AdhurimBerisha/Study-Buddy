import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

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
      const templateParams = {
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        message: data.message,
        to_name: "StudyBuddy Team",
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      reset();
      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-6 sm:space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Send us a message
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            We'll get back to you as soon as we can.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm sm:text-base mb-2 text-gray-700 dark:text-gray-300">
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
              className={`border rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.firstName
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm sm:text-base mb-2 text-gray-700 dark:text-gray-300 invisible sm:visible">
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
              className={`border rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.lastName
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
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
          <label className="font-semibold text-sm sm:text-base mb-2 block text-gray-700 dark:text-gray-300">
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
            className={`border rounded-lg px-4 py-3 text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.email
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="font-semibold text-sm sm:text-base mb-2 block text-gray-700 dark:text-gray-300">
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
            className={`border rounded-lg px-4 py-3 text-sm sm:text-base w-full resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.message
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          />
          {errors.message && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.message.message}
            </span>
          )}
        </div>

        <div className="pt-2 sm:pt-4">
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
