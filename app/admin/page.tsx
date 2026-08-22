"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContractWithSignature } from "@/lib/types";

export default function AdminDashboard() {
  const [contracts, setContracts] = useState<ContractWithSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pwd = sessionStorage.getItem("admin_pwd");
    if (!pwd) {
      router.push("/admin/login");
      return;
    }
    fetchContracts(pwd);
  }, []);

  const [dbError, setDbError] = useState("");

  const fetchContracts = async (pwd: string) => {
    try {
      const res = await fetch("/api/contracts", {
        headers: {
          "Authorization": `Bearer ${pwd}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(Array.isArray(data) ? data : []);
        setDbError("");
      } else if (res.status === 401) {
        sessionStorage.removeItem("admin_pwd");
        router.push("/admin/login");
      } else {
        const errData = await res.json().catch(() => ({}));
        setDbError(errData.error || "Veritabanı bağlantısı bekleniyor");
      }
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      setDbError("Sunucu bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pwd");
    router.push("/admin/login");
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/contract/${id}`;
    navigator.clipboard.writeText(url);
    setToast("Link kopyalandı!");
    setTimeout(() => setToast(""), 3000);
  };

  const filteredContracts = contracts.filter(c => {
    if (filter === "pending") return c.status === "pending";
    if (filter === "signed") return c.status === "signed";
    if (filter === "overdue") {
      return c.status === "pending" && new Date(c.delivery_deadline) < new Date();
    }
    return true;
  });

  const pendingCount = contracts.filter(c => c.status === "pending").length;
  const signedCount = contracts.filter(c => c.status === "signed").length;
  const overdueCount = contracts.filter(c => c.status === "pending" && new Date(c.delivery_deadline) < new Date()).length;

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-gray-50">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-50 transition-opacity">
          {toast}
        </div>
      )}
      
      <header className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-600">İlay Home</h1>
          <p className="text-sm text-gray-500">Dashboard</p>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
          Çıkış
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {dbError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <p className="font-semibold mb-1">ℹ️ Veritabanı Bağlantısı:</p>
            <p>Sözleşmelerin kaydedilmesi ve listelenmesi için Vercel panelinden Supabase veritabanınızı bağlayınız.</p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center border-t-4 border-yellow-400">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Bekleyen</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{pendingCount}</p>
          </div>
          <div className="card p-4 text-center border-t-4 border-green-500">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Onaylanan</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{signedCount}</p>
          </div>
          <div className="card p-4 text-center border-t-4 border-red-500">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 whitespace-nowrap">Süresi Geçen</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{overdueCount}</p>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 hide-scrollbar">
          {['all', 'pending', 'signed', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
                filter === f 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && 'Tümü'}
              {f === 'pending' && 'Bekleyenler'}
              {f === 'signed' && 'Onaylananlar'}
              {f === 'overdue' && 'Süresi Geçenler'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredContracts.map(contract => (
            <div key={contract.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-800">{contract.influencer_name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    contract.status === 'signed' ? 'bg-green-100 text-green-700' :
                    new Date(contract.delivery_deadline) < new Date() ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contract.status === 'signed' ? 'Onaylandı' : 'Bekliyor'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{contract.product_detail} ({contract.product_value} TL)</p>
                <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Oluşturulma: {new Date(contract.created_at).toLocaleDateString('tr-TR')}</span>
                  <span>Son Teslim: {new Date(contract.delivery_deadline).toLocaleDateString('tr-TR')}</span>
                  {contract.status === 'signed' && contract.signatures?.signed_at && (
                    <span className="text-green-600">İmza: {new Date(contract.signatures.signed_at).toLocaleDateString('tr-TR')}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <button 
                  onClick={() => copyLink(contract.id)}
                  className="btn-secondary text-sm flex-1 sm:flex-none py-2 px-4"
                >
                  Link Kopyala
                </button>
                <Link 
                  href={`/contract/${contract.id}`}
                  className="btn-primary text-sm text-center flex-1 sm:flex-none py-2 px-4"
                >
                  Detay
                </Link>
              </div>
            </div>
          ))}
          
          {filteredContracts.length === 0 && (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              Sözleşme bulunamadı.
            </div>
          )}
        </div>
      </main>

      <Link 
        href="/admin/create" 
        className="fixed bottom-6 right-6 btn-primary rounded-full px-6 py-4 shadow-lg flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform"
      >
        + Yeni Sözleşme
      </Link>
    </div>
  );
}
