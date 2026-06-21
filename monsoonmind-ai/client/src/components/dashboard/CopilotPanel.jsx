import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Loader2, Send, X } from "lucide-react";
import { askCopilot } from "../../api/platform";
import { getApiError } from "../../api/client";

const CopilotPanel = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  const mutation = useMutation({
    mutationFn: askCopilot,
    onSuccess: (data) => {
      setAnswer(data.answer);
      setMessage("");
    }
  });

  const submit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    mutation.mutate({ message, context });
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center justify-between gap-3 bg-field-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Bot size={21} />
              </span>
              <div>
                <p className="font-extrabold">Farm chat</p>
                <p className="text-xs text-white/65">Rain, sowing, irrigation, crop timing</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
              aria-label="Close farm chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[48vh] min-h-[180px] overflow-y-auto bg-field-50/70 p-4">
            <div className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-100">
              {mutation.isPending ? (
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <Loader2 className="animate-spin" size={16} /> Checking the farm context...
                </span>
              ) : answer ? (
                answer
              ) : (
                "Ask a farming question like: should I irrigate before sowing, wait for more rain, or hold fertilizer today?"
              )}
            </div>
            {mutation.isError ? (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">
                {getApiError(mutation.error)}
              </p>
            ) : null}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about your farm..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-field-500 focus:ring-2 focus:ring-field-100"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !message.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-field-600 text-white shadow-lg shadow-field-600/20 transition hover:bg-field-500 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send farm question"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-field-600 px-5 py-4 font-extrabold text-white shadow-2xl shadow-field-600/25 transition hover:bg-field-500 sm:right-6"
        aria-label="Open farm chat"
      >
        <Bot size={21} />
        <span className="hidden sm:inline">Ask MonsoonMind</span>
      </button>
    </>
  );
};

export default CopilotPanel;