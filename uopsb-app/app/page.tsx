"use client";
import { useAuth } from "../app/AuthContext";
import UserMatchCard from "./_components/UserMatchCard";

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoggedIn && user ? (
        <div className="flex flex-col justify-center items-center">
          <UserMatchCard user={user} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">Sign up to UOPSB</h1>
        </div>
      )}
    </main>
  );
}
