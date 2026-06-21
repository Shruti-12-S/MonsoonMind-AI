import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sprout } from "lucide-react";
import { getApiError } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      await registerAccount(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <Link to="/" className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-field-600 text-white">
            <Sprout size={23} />
          </span>
          <div>
            <p className="font-extrabold text-slate-950">MonsoonMind</p>
            <p className="text-sm text-slate-500">Set up your farm account</p>
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-950">
          Create account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
            {...register("name", { required: true })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
            {...register("email", { required: true })}
          />
          <input
            placeholder="Phone"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
            {...register("phone")}
          />
          <input
            type="password"
            placeholder="Password, minimum 8 characters"
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
            {...register("password", { required: true, minLength: 8 })}
          />
          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-field-600 px-5 py-3 font-extrabold text-white transition hover:bg-field-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create farmer account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-field-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
