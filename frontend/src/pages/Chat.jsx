import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Chat() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    api.get("/chat/threads").then((r) => setThreads(r.data.threads));
    const role = user.role === "tutor" ? "student" : "tutor";
    api.get(`/users?role=${role}`).then((r) => setContacts(r.data.users)).catch(() => {});
  }, [user.role]);

  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    const s = io("/", { auth: { token } });
    socketRef.current = s;
    s.on("message", (m) => {
      setMessages((prev) => {
        if (prev.find((x) => x._id === m._id)) return prev;
        return [...prev, m];
      });
    });
    s.on("typing", ({ from, typing }) => { if (active && String(from) === String(active._id)) setTyping(typing); });
    return () => s.disconnect();
  }, [active?._id]);

  const open = async (other) => {
    setActive(other);
    const { data } = await api.get(`/chat/with/${other._id}`);
    setMessages(data.messages);
    socketRef.current?.emit("join", other._id);
  };

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    socketRef.current?.emit("message", { to: active._id, body: text });
    setText("");
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div>
      <PageHeader title="Chat" emoji="💬" subtitle="Real-time messages with your tutors / students" />
      <div className="grid grid-cols-12 gap-4 h-[70vh]">
        <div className="col-span-4 card-x overflow-y-auto">
          <h3 className="font-bold text-sm mb-2">Conversations</h3>
          {threads.map((t) => (
            <button key={t.user._id} onClick={() => open(t.user)}
              className={`w-full text-left p-2 rounded-xl flex items-center gap-2 ${active?._id === t.user._id ? "bg-primary/20" : "hover:bg-white/5"}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center font-bold">{t.user.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t.user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{t.lastMessage}</div>
              </div>
            </button>
          ))}
          <h3 className="font-bold text-sm mt-3 mb-2">Start new</h3>
          {contacts.filter((c) => !threads.some((t) => t.user._id === c._id)).slice(0, 8).map((c) => (
            <button key={c._id} onClick={() => open(c)} className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/5 grid place-items-center">{c.name[0]}</div>
              <span className="text-sm">{c.name}</span>
            </button>
          ))}
        </div>

        <div className="col-span-8 card-x flex flex-col">
          {!active ? (
            <div className="m-auto text-muted-foreground">Pick a conversation to start chatting 💬</div>
          ) : (
            <>
              <div className="border-b border-white/10 pb-2 mb-3">
                <div className="font-bold">{active.name}</div>
                <div className="text-xs text-muted-foreground">{active.role}</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 px-1">
                <AnimatePresence initial={false}>
                  {messages.map((m) => {
                    const mine = String(m.from) === String(user.id);
                    return (
                      <motion.div key={m._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-gradient-to-br from-primary to-accent text-white" : "bg-white/10"}`}>
                          {m.body}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {typing && <div className="text-xs text-muted-foreground">typing…</div>}
                <div ref={endRef} />
              </div>
              <form onSubmit={send} className="mt-3 flex gap-2">
                <input className="input" placeholder="Type a message…" value={text}
                  onChange={(e) => { setText(e.target.value); socketRef.current?.emit("typing", { to: active._id, typing: true }); }}
                  onBlur={() => socketRef.current?.emit("typing", { to: active._id, typing: false })} />
                <button className="btn-primary"><Send className="w-4 h-4" /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
