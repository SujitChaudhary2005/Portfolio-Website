"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export function SparklesUnderName() {
  return (
    <div className="w-full h-12 relative">
      <div className="absolute left-0 right-0 top-2 bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent h-[2px] blur-sm" />
      <div className="absolute left-0 right-0 top-2 bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent h-px" />
      <div className="absolute left-[15%] right-[15%] top-2 bg-gradient-to-r from-transparent via-[#2e6ba8] to-transparent h-[3px] blur-sm" />
      <div className="absolute left-[15%] right-[15%] top-2 bg-gradient-to-r from-transparent via-[#2e6ba8] to-transparent h-px" />
      <div className="absolute left-[25%] right-[25%] top-2 bg-gradient-to-r from-transparent via-[#1a4c7a] to-transparent h-[2px] blur-sm" />
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1.0}
        particleDensity={300}
        className="w-full h-full"
        particleColor="#ffffff"
        speed={0.5}
      />
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_100%_100%_at_center,white_50%,transparent_80%)] dark:[mask-image:radial-gradient(ellipse_100%_100%_at_center,black_50%,transparent_80%)]"></div>
    </div>
  );
}
