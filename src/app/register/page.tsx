"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTranslations } from "@/lib/clientTranslations";

// Icônes locales
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
    <path d="M4 20a8 8 0 0116 0" />
  </svg>
);
const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// Fonction de validation du mot de passe
const validatePassword = (password: string) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);
  return { requirements, isValid };
};

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);

  // ... tes hooks de locale et translations ici ...

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleRegister = async () => {
    if (!passwordValidation?.isValid) {
      setMessage("Password does not meet security requirements");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await register(form.username, form.email, form.password);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-purple-100 bg-cover bg-no-repeat animate-bgMove"
      style={{ backgroundImage: "url('/bg.jpg')" }}>
      {/* Fenêtre blanche */}
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Colonne gauche violet */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 to-indigo-700 text-white items-center justify-center p-12 relative">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
            <p className="text-lg">Create your account and join our platform to access all features.</p>
          </div>
          {/* Décorations */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* Colonne droite formulaire */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
          <div className="p-8 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

            <div className="space-y-4">
              {/* Username */}
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Requirements */}
              {form.password && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={passwordValidation?.requirements.minLength ? "text-green-600" : "text-red-600"}>
                      ✓ At least 8 characters
                    </li>
                    <li className={passwordValidation?.requirements.hasUppercase ? "text-green-600" : "text-red-600"}>
                      ✓ At least one uppercase letter (A-Z)
                    </li>
                    <li className={passwordValidation?.requirements.hasLowercase ? "text-green-600" : "text-red-600"}>
                      ✓ At least one lowercase letter (a-z)
                    </li>
                    <li className={passwordValidation?.requirements.hasNumber ? "text-green-600" : "text-red-600"}>
                      ✓ At least one number (0-9)
                    </li>
                    <li className={passwordValidation?.requirements.hasSpecialChar ? "text-green-600" : "text-red-600"}>
                      ✓ At least one special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading || !passwordValidation?.isValid}
              className="w-full mt-6 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

            <p className="mt-6 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
