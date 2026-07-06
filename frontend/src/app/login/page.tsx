"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      router.push("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    try {
      setLoading(true);

      await login(
        "admin@facultiq.com",
        "Admin@123"
      );

      router.push("/dashboard");
    } catch {
      alert("Demo login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-center text-4xl font-bold">
          FacultiQ
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Faculty Management Portal
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>

          <span className="mx-3 text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full rounded-lg border border-blue-600 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          🚀 Login as Demo Admin
        </button>

        <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-blue-700">
            Demo Credentials
          </p>

          <p>
            <strong>Email:</strong> admin@facultiq.com
          </p>

          <p>
            <strong>Password:</strong> Admin@123
          </p>

          <p className="mt-3 text-xs text-gray-600">
            You can either use the credentials above or simply click
            <strong> "Login as Demo Admin"</strong>.
          </p>
        </div>

      </div>
    </main>
  );
}