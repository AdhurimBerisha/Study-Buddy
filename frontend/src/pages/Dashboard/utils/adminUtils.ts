export const showSuccessMessage = (
  setMessage: (
    message: { type: "success" | "error"; text: string } | null
  ) => void,
  text: string
) => {
  setMessage({ type: "success", text });
  setTimeout(() => setMessage(null), 5000);
};

export const showErrorMessage = (
  setMessage: (
    message: { type: "success" | "error"; text: string } | null
  ) => void,
  text: string
) => {
  setMessage({ type: "error", text });
  setTimeout(() => setMessage(null), 5000);
};

export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: { data?: { message?: string }; status?: number };
    };

    if (apiError.response?.status === 409) {
      return (
        apiError.response?.data?.message ||
        "A user with this email already exists. Please use a different email address."
      );
    }

    if (apiError.response?.status === 400) {
      return (
        apiError.response?.data?.message || "Please check all required fields."
      );
    }

    return (
      apiError.response?.data?.message || "An error occurred. Please try again."
    );
  }

  return "An unexpected error occurred. Please try again.";
};

export const validateCourseForm = (form: {
  title: string;
  description: string;
  category: string;
  language: string;
  level: string;
  tutorId: string;
}): string | null => {
  if (!form.title.trim()) return "Title is required";
  if (!form.description.trim()) return "Description is required";
  if (!form.category.trim()) return "Category is required";
  if (!form.language.trim()) return "Language is required";
  if (!form.level) return "Level is required";
  if (!form.tutorId) return "Tutor is required";
  return null;
};

export const validateUserForm = (form: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): string | null => {
  if (!form.email.trim()) return "Email is required";
  if (!form.password.trim()) return "Password is required";
  if (!form.firstName.trim()) return "First name is required";
  if (!form.lastName.trim()) return "Last name is required";
  if (form.password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const resetCourseForm = (
  setForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      category: string;
      language: string;
      level: string;
      price: number;
      thumbnail: string;
      totalLessons: number;
      tutorId: string;
    }>
  >
) => {
  setForm({
    title: "",
    description: "",
    category: "",
    language: "",
    level: "",
    price: 0,
    thumbnail: "",
    totalLessons: 0,
    tutorId: "",
  });
};

export const resetUserForm = (
  setForm: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
      role: "user" | "tutor" | "admin";
    }>
  >
) => {
  setForm({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "user",
  });
};
