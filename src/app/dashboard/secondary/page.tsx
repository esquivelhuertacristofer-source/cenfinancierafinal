"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecondaryDashboardRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/hub"); }, [router]);
  return null;
}
