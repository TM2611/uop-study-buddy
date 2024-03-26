"use client";
import React from "react";
import Link from "next/link";

const Settings = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <section className="flex justify-center mb-8">
        <ul className="list-none">
          <li className="mb-4">
            <Link
              href="/settings/availability"
              className="text-lg font-semibold text-blue-500 hover:text-blue-700"
            >
              Change your Availability
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/settings/confidence"
              className="text-lg font-semibold text-blue-500 hover:text-blue-700"
            >
              Update your Confidence
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Settings;
