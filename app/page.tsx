"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in, redirect to dashboard
      router.replace("/dashboard");
    } else {
      // Not logged in, redirect to login
      router.replace("/login");
    }
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl text-amber-200 animate-pulse">
        Checking authentication...
      </h1>
    </div>
  );
}