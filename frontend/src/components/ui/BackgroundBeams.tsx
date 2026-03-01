"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none",
                className
            )}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen">
                <svg
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <radialGradient
                            id="radial-gradient"
                            cx="50%"
                            cy="50%"
                            r="50%"
                            fx="50%"
                            fy="50%"
                        >
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#radial-gradient)" />

                    <path
                        d="M 0 0 L 100 100"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeOpacity="0.1"
                        className="text-foreground/20 dark:text-foreground/10"
                    />
                    <path
                        d="M0 0C50 50 150 0 200 50"
                        stroke="var(--accent)"
                        strokeWidth="1"
                        fill="none"
                        strokeOpacity="0.3"
                        style={{ filter: 'blur(4px)' }}
                    />
                </svg>
            </div>
        </div>
    );
};
