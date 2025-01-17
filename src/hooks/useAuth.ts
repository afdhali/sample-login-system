"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Track session when authenticated
  const { mutate: trackSession } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/session-tracking", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to track session");
      return response.json();
    },
    onError: (error) => {
      console.error("Session tracking error:", error);
    },
  });

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return false;
      }

      if (result?.ok) {
        // Track session after successful login
        trackSession();

        // Update session data
        await update();

        // Redirect to home page
        router.push("/");
        router.refresh();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Delete session tracking first
      await fetch("/api/auth/session-tracking", {
        method: "DELETE",
      });

      // Then sign out from NextAuth
      await signOut({ redirect: false });

      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  // Get user data
  const { data: user } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const response = await fetch(`/api/users/${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    enabled: !!session?.user?.id,
  });

  // Track session whenever authentication status changes
  useEffect(() => {
    if (status === "authenticated") {
      trackSession();
    }
  }, [status, trackSession]);

  return {
    user,
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
  };
};
