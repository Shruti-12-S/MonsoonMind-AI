import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserRound } from "lucide-react";
import { getApiError } from "../api/client";
import GlassCard from "../components/ui/GlassCard";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || ""
    }
  });

  const onSubmit = async (values) => {
    setMessage("");
    setError("");
    try {
      await updateProfile(values);
      setMessage("Profile updated.");
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
      <GlassCard>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-field-600 text-white">
          <UserRound size={28} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-950">
          Farmer profile
        </h1>
        <p className="mt-3 text-slate-600">
          Keep your contact details current. Farm details are saved from the dashboard input panel.
        </p>
        <div className="mt-6 rounded-2xl bg-white/70 p-4 text-sm">
          <p className="font-bold text-slate-950">{user?.email}</p>
          <p className="mt-1 text-slate-500">Role: {user?.role || "farmer"}</p>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-xl font-extrabold text-slate-950">Update profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <label>
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
              {...register("name", { required: true })}
            />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Phone</span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-field-500"
              {...register("phone")}
            />
          </label>
          {message ? (
            <p className="rounded-xl bg-field-50 px-4 py-3 text-sm font-semibold text-field-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-field-600 px-5 py-3 font-extrabold text-white transition hover:bg-field-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;
