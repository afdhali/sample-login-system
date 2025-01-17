"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
                <p className="text-gray-600">Logged in as: {user?.email}</p>
              </div>
              <Button onClick={() => logout()} variant="destructive">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
