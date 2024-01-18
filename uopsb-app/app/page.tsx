"use client";
import Nav from "../components/Nav";
import { useAuth } from "../app/AuthContext";

export default function Home() {
  const { isLoggedIn, user} = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav />
      {isLoggedIn ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">Welcome {user.fname}</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">Welcome to UOPSB</h1>
        </div>
      )}
    </main>
  );
}
