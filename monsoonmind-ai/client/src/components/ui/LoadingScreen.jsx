import { Sprout } from "lucide-react";

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-field-50">
    <div className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-4">
      <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-field-600 text-white">
        <Sprout size={22} />
      </span>
      <span className="font-semibold text-slate-800">Loading MonsoonMind</span>
    </div>
  </div>
);

export default LoadingScreen;
