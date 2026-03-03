"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    const fetchUsers = async () => {
        try {
            const data = await api.get<any>('/admin/users');
            setUsers(data.users || []);
        } catch {
            // Error handling
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBan = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/admin/users/${id}`, { isBanned: !currentStatus });
            fetchUsers();
        } catch {
            // handle error
        }
    };

    const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(filter.toLowerCase()) || u.email?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">View and manage platform users and sellers.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-border/50 bg-glass rounded-xl text-sm focus:outline-none focus:border-accent w-full md:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden border border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-5 font-semibold">User</th>
                                    <th className="p-5 font-semibold">Role</th>
                                    <th className="p-5 font-semibold">Status</th>
                                    <th className="p-5 font-semibold">Joined</th>
                                    <th className="p-5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-5">
                                            <div className="font-bold text-foreground">{user.name}</div>
                                            <div className="text-muted-foreground">{user.email}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' : user.role === 'seller' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            {user.isBanned ? (
                                                <span className="flex items-center gap-1.5 text-red-500 text-xs font-semibold">
                                                    <ShieldAlert className="h-4 w-4" /> Banned
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                                                    <ShieldCheck className="h-4 w-4" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-5 text-right">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => toggleBan(user._id, user.isBanned)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.isBanned ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                                >
                                                    {user.isBanned ? 'Unban' : 'Suspend'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
