"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Admin login check
    if (email === "admin" || email === "admin@euphoria.com") {
      if (password === "admin@nascoders") {
        setIsLoading(true);
        setTimeout(() => {
          localStorage.setItem(
            "euphoria_session",
            JSON.stringify({
              name: "Admin",
              email: "admin@euphoria.com",
              role: "admin",
            })
          );
          window.location.href = "/admin";
        }, 1000);
        return;
      } else {
        setError("Invalid admin credentials.");
        return;
      }
    }

    if (!/\S+@\S+\.\S+/.test(email) && !/^\d{10}$/.test(email)) {
      setError("Please enter a valid email or 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication call
    setTimeout(() => {
      setIsLoading(false);

      // Check for user details in localStorage
      const usersStr = localStorage.getItem("euphoria_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      
      if (!existingUser) {
        setError("Account not found. Please sign up.");
        setIsLoading(false);
        return;
      }

      if (existingUser.password !== password) {
        setError("Invalid password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store active user session
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: existingUser.name,
          email: existingUser.email,
        })
      );
      
      // Migrate guest bookings to user account
      const guestBookingsStr = localStorage.getItem("activeBookings");
      if (guestBookingsStr) {
        try {
          const guestBookings = JSON.parse(guestBookingsStr);
          if (guestBookings && guestBookings.length > 0) {
             const userStorageKey = `activeBookings_${email}`;
             const existingUserBookingsStr = localStorage.getItem(userStorageKey);
             const existingUserBookings = existingUserBookingsStr ? JSON.parse(existingUserBookingsStr) : [];
             const mergedBookings = [...existingUserBookings, ...guestBookings];
             localStorage.setItem(userStorageKey, JSON.stringify(mergedBookings));
             localStorage.removeItem("activeBookings"); // clear guest bookings
          }
        } catch (e) {
          console.error("Migration error", e);
        }
      }

      // Redirect to profile and refresh navbar state
      window.location.href = "/profile";
    }, 1500);
  };

const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const email = `${provider.toLowerCase()}user@example.com`;
      const userName = `${provider} User`;
      
      // Store active user session
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: userName,
          email: email,
        })
      );
      
      // Migrate guest bookings to user account
      const guestBookingsStr = localStorage.getItem("activeBookings");
      if (guestBookingsStr) {
        try {
          const guestBookings = JSON.parse(guestBookingsStr);
          if (guestBookings && guestBookings.length > 0) {
             const userStorageKey = `activeBookings_${email}`;
             const existingUserBookingsStr = localStorage.getItem(userStorageKey);
             const existingUserBookings = existingUserBookingsStr ? JSON.parse(existingUserBookingsStr) : [];
             const mergedBookings = [...existingUserBookings, ...guestBookings];
             localStorage.setItem(userStorageKey, JSON.stringify(mergedBookings));
             localStorage.removeItem("activeBookings"); // clear guest bookings
          }
        } catch (e) {
          console.error("Migration error", e);
        }
      }

      // Redirect to profile and refresh navbar state
      window.location.href = "/profile";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] flex items-center justify-center relative overflow-hidden p-6 pt-24">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-100/40 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
      
      <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-stone-200">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-2xl shadow-stone-200/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-amber-500" />
          
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-6 group hover:bg-amber-100 transition-colors">
              <Sun className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            </Link>
            <h1 className="text-2xl font-serif text-stone-800 mb-2">Welcome Back</h1>
            <p className="text-stone-500 font-light text-sm">Sign in to continue planning your beautiful celebration.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-light">
              {error}
            </div>
          )}

          

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email or Mobile Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                  placeholder="name@example.com or 10-digit mobile"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-3.5 rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 group disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-600 font-light">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-700 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
