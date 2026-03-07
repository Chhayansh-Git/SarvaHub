"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText, Loader2, Package, Users, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportDownloadButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const generateReport = async (type: 'comprehensive' | 'inventory' | 'revenue' | 'customers') => {
        setIsGenerating(true);
        setIsOpen(false);
        try {
            // Fetch everything needed natively
            const [ordersResponse, productsResponse, stats] = await Promise.all([
                api.get<any>('/seller/orders').catch(() => ({ orders: [] })),
                api.get<any>('/seller/products').catch(() => ({ products: [] })),
                api.get<any>('/seller/stats').catch(() => ({ revenue: '0', orders: '0' })),
            ]);

            const orders = ordersResponse.orders || [];
            const products = productsResponse.products || [];

            const doc = new jsPDF();
            const dateStr = new Date().toLocaleDateString();

            // Document Header
            doc.setFontSize(20);
            doc.text(`SarvaHub Seller Report`, 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Report Type: ${type.toUpperCase()}`, 14, 30);
            doc.text(`Generated on: ${dateStr}`, 14, 36);

            let currentY = 45;

            // Generate Inventory Section
            if (type === 'comprehensive' || type === 'inventory') {
                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Inventory Status", 14, currentY);

                const tableData = products.map((p: any) => [
                    p.sku || p._id.substring(0, 8),
                    p.name,
                    p.category || 'General',
                    `Rs ${p.price}`,
                    p.stock?.toString() || '0',
                    p.status || 'inactive'
                ]);

                autoTable(doc, {
                    startY: currentY + 5,
                    head: [['SKU', 'Product Name', 'Category', 'Price', 'Stock', 'Status']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [201, 169, 110] } // Accent color (#C9A96E)
                });

                currentY = (doc as any).lastAutoTable.finalY + 15;
            }

            // Generate Revenue/Sales Section
            if (type === 'comprehensive' || type === 'revenue') {
                if (currentY > 250) { doc.addPage(); currentY = 20; }

                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Revenue & Sales Summary", 14, currentY);

                // Add summary stats
                doc.setFontSize(10);
                doc.text(`Total Revenue: ${stats.revenue || 'Rs 0'}`, 14, currentY + 8);
                doc.text(`Total Orders: ${stats.orders || '0'}`, 14, currentY + 14);

                const tableData = orders.map((o: any) => [
                    o._id.substring(0, 8),
                    new Date(o.createdAt).toLocaleDateString(),
                    o.customer || o.user?.name || 'Customer',
                    `Rs ${o.total || o.amount || 0}`,
                    o.status
                ]);

                autoTable(doc, {
                    startY: currentY + 20,
                    head: [['Order ID', 'Date', 'Customer', 'Amount', 'Status']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [201, 169, 110] }
                });
                currentY = (doc as any).lastAutoTable.finalY + 15;
            }

            // Generate Customers Section
            if (type === 'comprehensive' || type === 'customers') {
                if (currentY > 250) { doc.addPage(); currentY = 20; }

                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Customer Behavior & Engagement", 14, currentY);

                doc.setFontSize(10);
                doc.text(`Total order volume analyzed: ${orders.length}`, 14, currentY + 8);

                const tableData = orders.slice(0, 50).map((o: any) => [
                    o.customer || o.user?.name || 'Customer',
                    new Date(o.createdAt).toLocaleDateString(),
                    `Rs ${o.total || o.amount || 0}`,
                ]);

                autoTable(doc, {
                    startY: currentY + 15,
                    head: [['Customer Name', 'Last Order Date', 'Order Value']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [201, 169, 110] }
                });
            }

            doc.save(`SarvaHub_${type}_report_${dateStr.replace(/\//g, '-')}.pdf`);

        } catch (err) {
            console.error("Failed to generate report", err);
            alert("Failed to generate report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isGenerating}
                className="px-5 py-2.5 glass-panel rounded-xl font-medium hover:bg-muted transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isGenerating ? "Generating PDF..." : "Download Report"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl shadow-xl border border-border/50 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
                        Select Report Type
                    </div>

                    <button onClick={() => generateReport('comprehensive')} className="w-full text-left px-4 py-2.5 hover:bg-accent/10 flex items-center gap-3 transition-colors group">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                        <div>
                            <div className="text-sm font-medium">Comprehensive Report</div>
                            <div className="text-xs text-muted-foreground">All store analytics & data</div>
                        </div>
                    </button>

                    <button onClick={() => generateReport('revenue')} className="w-full text-left px-4 py-2.5 hover:bg-accent/10 flex items-center gap-3 transition-colors group">
                        <TrendingUp className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                        <div>
                            <div className="text-sm font-medium">Revenue & Sales</div>
                            <div className="text-xs text-muted-foreground">Financial breakdown</div>
                        </div>
                    </button>

                    <button onClick={() => generateReport('inventory')} className="w-full text-left px-4 py-2.5 hover:bg-accent/10 flex items-center gap-3 transition-colors group">
                        <Package className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                        <div>
                            <div className="text-sm font-medium">Inventory Status</div>
                            <div className="text-xs text-muted-foreground">Current products & stock</div>
                        </div>
                    </button>

                    <button onClick={() => generateReport('customers')} className="w-full text-left px-4 py-2.5 hover:bg-accent/10 flex items-center gap-3 transition-colors group">
                        <Users className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                        <div>
                            <div className="text-sm font-medium">Customer Behavior</div>
                            <div className="text-xs text-muted-foreground">Engagement metrics</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
