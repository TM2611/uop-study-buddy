"use client";
import Link from "next/link";
import { useAuth } from "../app/AuthContext";
import GoogleLoginCard from "./_components/GoogleLoginCard";

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoggedIn && user ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-8">
            Welcome, {user.given_name}
          </h1>
          <p className="text-lg text-center">
            Start finding your perfect study partner by{" "}
            <Link className="text-blue-600 hover:text-blue-800" href="/study">
              here
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-8">
            University of Portsmouth Study Partner Finder
          </h1>
          <p className="text-lg text-center mb-8">
            Join us to find a suitable study partner based on study habits,
            preferences, and availability.
          </p>
          <GoogleLoginCard />
        </div>
      )}
    </main>
  );
}
