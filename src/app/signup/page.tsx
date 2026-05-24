"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password } = formData;

    // Simple validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email) && !/^\d{10}$/.test(email)) {
      setError("Please enter a valid email or 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // Call real API
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      // Login successful, set session
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email,
        })
      );

      // Redirect to profile
      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server.');
      setIsLoading(false);
    }
  };

const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const email = `${provider.toLowerCase()}user@example.com`;
      const userName = `${provider} User`;
      
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: userName,
          email: email,
        })
      );
      
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
             localStorage.removeItem("activeBookings");
          }
        } catch (e) {}
      }
      window.location.href = "/profile";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] flex items-center justify-center relative overflow-hidden p-6 pt-24">
      {/* Background Ornaments */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-rose-100/40 rounded-full blur-[80px] -z-10 mix-blend-multiply" />

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
            <h1 className="text-2xl font-serif text-stone-800 mb-2">Join Us</h1>
            <p className="text-stone-500 font-light text-sm">Create an account to start planning unforgettable moments.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-light">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email or Mobile Number</label>
              <input 
                type="text" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                placeholder="name@example.com or 10-digit mobile"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-800 text-white py-3.5 rounded-xl font-medium hover:bg-stone-700 transition-colors shadow-lg shadow-stone-800/10 flex items-center justify-center gap-2 group mt-2 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">
                By signing up, you agree to our <a href="#" className="underline hover:text-stone-600">Terms of Service</a> and <a href="#" className="underline hover:text-stone-600">Privacy Policy</a>.
             </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-400 font-medium font-serif italic">or sign up with</span>
            </div>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 bg-white border border-stone-200 text-stone-700 py-3 rounded-xl font-medium flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
             </button>
             <button className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-medium flex items-center justify-center hover:bg-stone-700 transition-colors shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.637-.026 2.62-1.508 3.608-2.978 1.15-1.682 1.626-3.32 1.65-3.417-.035-.013-3.176-1.22-3.221-4.857-.039-3.04 2.484-4.53 2.583-4.58-1.505-2.205-3.83-2.502-4.662-2.55-1.954-.158-3.842 1.258-4.839 1.258h-.002zM15.175 4.314c.828-1.002 1.385-2.394 1.233-3.784-1.185.048-2.656.788-3.513 1.776-.757.854-1.42 2.29-1.239 3.639 1.32.102 2.688-.636 3.519-1.631z"/>
                </svg>
             </button>
          </div>

          <p className="mt-8 text-center text-sm text-stone-600 font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-700 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
