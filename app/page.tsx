"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Lütfen şifre giriniz.");
      return;
    }
    
    sessionStorage.setItem("admin_pwd", password);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600 mb-2">İlay Home</h1>
          <p className="text-gray-500">Sözleşme Yönetim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yönetici Şifresi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="input-field w-full"
              placeholder="Şifrenizi giriniz"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
