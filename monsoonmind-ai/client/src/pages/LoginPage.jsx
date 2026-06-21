import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sprout } from "lucide-react";
import { getApiError } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      await login(values);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
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
            <p className="text-sm text-slate-500">Welcome back</p>
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-950">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
              {...register("email", { required: true })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
              {...register("password", { required: true })}
            />
          </label>
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
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{" "}
          <Link to="/register" className="font-bold text-field-700">
            Create farmer account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
