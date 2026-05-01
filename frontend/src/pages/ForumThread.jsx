import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import api from "../api/client.js";
import Skeleton from "../components/Skeleton.jsx";

export default function ForumThread() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState("");

  const load = () => api.get(`/forum/posts/${id}`).then((r) => setPost(r.data.post));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await api.post(`/forum/posts/${id}/replies`, { body: reply });
    toast.success("Reply posted!");
    setReply(""); load();
  };

  if (!post) return <Skeleton className="h-64" />;
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/forum" className="text-sm text-muted-foreground hover:underline">← Back to forum</Link>
      <div className="card-x mt-3">
        <div className="text-xs text-muted-foreground">
          {post.subject && <span>{post.subject.emoji} {post.subject.name} · </span>}
          by <strong>{post.author?.name}</strong> · {new Date(post.createdAt).toLocaleString()}
        </div>
        <h1 className="text-2xl font-extrabold mt-1">{post.title}</h1>
        <div className="prose prose-invert max-w-none mt-3"><ReactMarkdown>{post.body}</ReactMarkdown></div>
        <div className="mt-2 text-xs text-muted-foreground">▲ {post.upvotes.length} upvotes</div>
      </div>

      <h3 className="font-bold mt-6 mb-2">{post.replies.length} replies</h3>
      <div className="space-y-3">
        {post.replies.map((r) => (
          <div key={r._id} className="card-x">
            <div className="text-xs text-muted-foreground">{r.author?.name} · {new Date(r.createdAt).toLocaleString()}</div>
            <div className="prose prose-invert max-w-none mt-1"><ReactMarkdown>{r.body}</ReactMarkdown></div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card-x mt-4">
        <textarea className="input" rows={3} placeholder="Add a reply (markdown ok)…" value={reply} onChange={(e) => setReply(e.target.value)} />
        <button className="btn-primary mt-2">Reply</button>
      </form>
    </div>
  );
}
