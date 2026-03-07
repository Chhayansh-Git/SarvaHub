"use client";

import { useEffect, useState } from "react";
import { Users, Search, Loader2, Mail, Phone, Package } from "lucide-react";
import { api } from "@/lib/api";

export default function SellerCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // We extract unique customers from the seller's order history
                const orders = await api.get<any[]>('/seller/orders');

                if (Array.isArray(orders)) {
                    const uniqueCustomersMap = new Map();

                    orders.forEach(order => {
                        const email = order.shippingAddress?.email || order.user?.email;
                        if (!email) return;

                        if (!uniqueCustomersMap.has(email)) {
                            uniqueCustomersMap.set(email, {
                                name: order.shippingAddress?.name || order.user?.name || "Customer",
                                email: email,
                                phone: order.shippingAddress?.phone || order.user?.phone || "N/A",
                                totalOrders: 1,
                                totalSpent: order.totalAmount || order.total || order.amount || 0,
                                lastOrderDate: order.createdAt
                            });
                        } else {
                            const existing = uniqueCustomersMap.get(email);
                            existing.totalOrders += 1;
                            existing.totalSpent += (order.totalAmount || order.total || order.amount || 0);
                            if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
                                existing.lastOrderDate = order.createdAt;
                            }
                        }
                    });

                    setCustomers(Array.from(uniqueCustomersMap.values()));
                }
            } catch (error) {
                console.error("Failed to load customers", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight">Customers</h1>
                    <p className="text-muted-foreground mt-1">View and manage the people who buy your products.</p>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-border/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            className="w-full bg-muted/50 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                </div>

                {customers.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50 mb-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No customers yet</h3>
                        <p className="text-muted-foreground mb-6">Your customer list will grow as you make sales.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((customer, i) => (
                            <div key={i} className="p-5 rounded-2xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-lg">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{customer.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                            <Mail className="h-3 w-3" /> {customer.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Package className="h-3 w-3" /> Total Orders</div>
                                        <div className="font-bold">{customer.totalOrders}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Lifetime Value</div>
                                        <div className="font-bold text-accent">₹{(customer.totalSpent / 100).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
