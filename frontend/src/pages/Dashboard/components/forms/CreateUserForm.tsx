import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../../../store/store";
import {
  createUser,
  setShowCreateUserForm,
} from "../../../../store/slice/adminSlice";
import { InputField, SelectField } from "./CourseFormParts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Role = "user" | "admin" | "tutor";

interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  role: Role;
}

const defaultValues: CreateUserFormValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  avatar: "",
  role: "user",
};

const CreateUserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { creatingUser } = useSelector((state: RootState) => state.admin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({ defaultValues, mode: "onSubmit" });

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      const payload = { ...data, phone: data.phone ?? "" };
      await dispatch(createUser(payload)).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setShowCreateUserForm(false));
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="relative">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New User
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a new user to the platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name *"
              placeholder="Enter first name"
              error={errors.firstName?.message as string}
              {...register("firstName", { required: "First name is required" })}
            />

            <InputField
              label="Last Name *"
              placeholder="Enter last name"
              error={errors.lastName?.message as string}
              {...register("lastName", { required: "Last name is required" })}
            />

            <InputField
              label="Email *"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message as string}
              {...register("email", { required: "Email is required" })}
            />

            <InputField
              label="Password *"
              type="password"
              placeholder="Enter password"
              error={errors.password?.message as string}
              {...register("password", { required: "Password is required" })}
            />

            <InputField
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              error={errors.phone?.message as string}
              {...register("phone")}
            />

            <InputField
              label="Avatar URL"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              error={errors.avatar?.message as string}
              {...register("avatar")}
            />

            <SelectField
              label="Role *"
              error={errors.role?.message as string}
              {...register("role", { required: "Role is required" })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </SelectField>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingUser}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {creatingUser ? (
                <div className="flex items-center space-x-2">
                  <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
