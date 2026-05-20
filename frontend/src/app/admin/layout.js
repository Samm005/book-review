"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1]),
      );

      if (payload.role !== "admin") {
        router.push("/");
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error(error);
      router.push("/login");
    } finally {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#120a2a] flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}