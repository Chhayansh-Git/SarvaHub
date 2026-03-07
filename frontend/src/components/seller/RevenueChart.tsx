"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

// Mock data
const mockData = [
    { date: "Mon", revenue: 0 },
    { date: "Tue", revenue: 0 },
    { date: "Wed", revenue: 0 },
    { date: "Thu", revenue: 0 },
    { date: "Fri", revenue: 0 },
    { date: "Sat", revenue: 0 },
    { date: "Sun", revenue: 0 },
];

export function RevenueChart() {
    const { theme } = useTheme();

    // Responsive SVG calculation logic (Simplified for aesthetics)
    const points = useMemo(() => {
        const rawMax = Math.max(...mockData.map(d => d.revenue));
        const maxRev = rawMax === 0 ? 100 : rawMax;

        return mockData.map((d, i) => {
            const x = (i / (mockData.length - 1)) * 100;
            const y = 100 - ((d.revenue / maxRev) * 80); // Leave a 20% margin at the top
            return `${x},${y}`;
        }).join(" ");
    }, []);

    const polygonPoints = `0,100 ${points} 100,100`;

    return (
        <div className="glass-panel p-6 rounded-2xl border-border/50 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-heading font-black text-lg">Revenue Overview</h3>
                    <p className="text-muted-foreground text-sm">Last 7 days performance</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="flex-1 relative min-h-[250px] w-full mt-auto">
                <svg viewBox="-5 -5 110 115" className="w-full h-full preserve-aspect-ratio-none overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#C9A96E" stopOpacity="1" />
                            <stop offset="100%" stopColor="#a38245" stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[20, 40, 60, 80].map((y) => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} className="stroke-border/30" strokeWidth="0.5" strokeDasharray="2,2" />
                    ))}

                    {/* Area Fill */}
                    <polygon points={polygonPoints} fill="url(#gradientFill)" />

                    {/* Line */}
                    <polyline fill="none" stroke="url(#gradientLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} className="drop-shadow-lg drop-shadow-accent/40" />

                    {/* Data Points */}
                    {points.split(" ").map((p, i) => {
                        const [x, y] = p.split(",");
                        const rawMax = Math.max(...mockData.map(d => d.revenue));
                        // Only highlight max point if revenue > 0
                        const isMax = rawMax > 0 && mockData[i].revenue === rawMax;

                        return (
                            <g key={i}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isMax ? "4" : "2"}
                                    className="fill-background stroke-accent"
                                    strokeWidth={isMax ? "1.5" : "1"}
                                />
                                {isMax && (
                                    <text x={x} y={Number(y) - 8} textAnchor="middle" className="text-[6px] font-bold fill-foreground">
                                        ₹{(mockData[i].revenue / 1000).toFixed(1)}k
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* X Axis Labels */}
                <div className="absolute left-0 right-0 -bottom-2 flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-2">
                    {mockData.map((d, i) => (
                        <span key={i} className="-ml-2 w-4 text-center">{d.date[0]}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
