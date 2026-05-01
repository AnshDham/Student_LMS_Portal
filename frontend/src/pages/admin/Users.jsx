import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const load = () => api.get(`/users${role ? `?role=${role}` : ""}`).then((r) => setUsers(r.data.users));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [role]);

  const del = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <PageHeader title="Users" emoji="👥">
        <select className="input w-44" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="parent">Parents</option>
          <option value="admin">Admins</option>
        </select>
      </PageHeader>
      <div className="card-x overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b border-white/10">
            <tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>XP</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 font-medium">{u.name}</td>
                <td className="text-muted-foreground">{u.email}</td>
                <td><span className="chip">{u.role}</span></td>
                <td>{u.xp || 0}</td>
                <td className="text-right">
                  <button onClick={() => del(u._id)} className="btn-ghost text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
