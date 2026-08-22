"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContractWithSignature } from "@/lib/types";
import ContractContent from "@/components/ContractContent";

export default function AdminDashboard() {
  const [contracts, setContracts] = useState<ContractWithSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [selectedContract, setSelectedContract] = useState<ContractWithSignature | null>(null);
  const [modalTab, setModalTab] = useState<'contract' | 'summary'>('contract');
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    setToast("Sözleşme linki kopyalandı!");
    setTimeout(() => setToast(""), 3000);
  };

  const copyDirectLink = () => {
    const url = `${window.location.origin}/sozlesme`;
    navigator.clipboard.writeText(url);
    setToast("Direkt sözleşme linki (/sozlesme) kopyalandı!");
    setTimeout(() => setToast(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu sözleşmeyi silmek istediğinize emin misiniz?")) return;
    const pwd = sessionStorage.getItem("admin_pwd") || "";
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contracts?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${pwd}`
        }
      });
      if (res.ok) {
        setContracts(prev => prev.filter(c => c.id !== id));
        if (selectedContract?.id === id) {
          setSelectedContract(null);
        }
        setToast("Sözleşme silindi.");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      alert("Silinirken hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (filter === "pending") return c.status === "pending";
    if (filter === "signed") return c.status === "signed";
    if (filter === "overdue") {
      return c.status === "overdue" || (c.status === "pending" && new Date(c.delivery_deadline) < new Date());
    }
    return true;
  });

  const pendingCount = contracts.filter(c => c.status === "pending" && new Date(c.delivery_deadline) >= new Date()).length;
  const signedCount = contracts.filter(c => c.status === "signed").length;
  const overdueCount = contracts.filter(c => c.status === "overdue" || (c.status === "pending" && new Date(c.delivery_deadline) < new Date())).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg z-50 transition-all border border-gray-700 flex items-center gap-2">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-30 print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-brand-600 tracking-tight">İlay Home</h1>
            <p className="text-xs text-gray-500 font-medium">Sözleşme Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={copyDirectLink}
              className="btn-secondary text-xs sm:text-sm px-3 py-2 font-bold shadow-sm"
              title="Influencer'a atılacak direkt /sozlesme linkini kopyala"
            >
              📋 Genel Link Kopyala
            </button>
            <Link 
              href="/admin/create"
              className="btn-primary text-xs sm:text-sm px-3.5 py-2 font-bold shadow-sm"
            >
              + Yeni Sözleşme
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-gray-500 hover:text-red-600 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 print:hidden">
        {dbError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
            <p className="font-semibold mb-1">ℹ️ Durum:</p>
            <p>{dbError}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="card p-4 text-center border-t-4 border-yellow-400 bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Bekleyen</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="card p-4 text-center border-t-4 border-green-500 bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Onaylanan</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-600">{signedCount}</p>
          </div>
          <div className="card p-4 text-center border-t-4 border-red-500 bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium whitespace-nowrap">Süresi Geçen</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-600">{overdueCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-1 hide-scrollbar">
          {['all', 'pending', 'signed', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs sm:text-sm font-semibold transition-all ${
                filter === f 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && `Tümü (${contracts.length})`}
              {f === 'pending' && `Bekleyenler (${pendingCount})`}
              {f === 'signed' && `Onaylananlar (${signedCount})`}
              {f === 'overdue' && `Süresi Geçenler (${overdueCount})`}
            </button>
          ))}
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Sözleşmeler Yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredContracts.map(contract => {
              const isSigned = contract.status === 'signed';
              const displayName = contract.signatures?.full_name || contract.influencer_name || 'İsimsiz Influencer';
              const displayProduct = contract.product_detail;

              return (
                <div 
                  key={contract.id} 
                  className="card p-5 bg-white border border-gray-200 hover:border-brand-300 transition-all shadow-sm rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">{displayName}</h3>
                      
                      {isSigned ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                          ✓ Onaylandı
                        </span>
                      ) : new Date(contract.delivery_deadline) < new Date() ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                          Süresi Geçti
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Bekliyor
                        </span>
                      )}

                      {contract.signatures?.instagram_username && (
                        <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          @{contract.signatures.instagram_username.replace(/^@/, '')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 font-medium">
                      📦 <strong>{displayProduct}</strong>
                    </p>

                    {/* Quick Meta Info */}
                    <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      <span>Oluşturulma: {new Date(contract.created_at).toLocaleDateString('tr-TR')}</span>
                      <span>Son Teslim: {new Date(contract.delivery_deadline).toLocaleDateString('tr-TR')}</span>
                      {isSigned && contract.signatures?.signed_at && (
                        <span className="text-green-600 font-semibold">
                          İmza Tarihi: {new Date(contract.signatures.signed_at).toLocaleString('tr-TR')}
                        </span>
                      )}
                      {contract.signatures?.phone && (
                        <span className="text-gray-600">Tel: {contract.signatures.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <button 
                      onClick={() => copyLink(contract.id)}
                      className="btn-secondary text-xs sm:text-sm py-2 px-3 flex-1 sm:flex-none font-semibold rounded-xl"
                      title="Özel linki kopyala"
                    >
                      🔗 Link
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedContract(contract);
                        setModalTab('contract');
                      }}
                      className="btn-primary text-xs sm:text-sm py-2 px-4 flex-1 sm:flex-none font-bold rounded-xl shadow-sm"
                    >
                      Sözleşmeyi İncele 📄
                    </button>
                  </div>
                </div>
              );
            })}
            
            {filteredContracts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
                <p className="text-gray-500 font-medium text-sm mb-4">Bu kategoride henüz sözleşme bulunmuyor.</p>
                <Link 
                  href="/admin/create"
                  className="btn-primary text-sm px-5 py-2.5 font-bold inline-block"
                >
                  + İlk Sözleşmeyi Oluştur
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DETAY & TAM SÖZLEŞME MODALI */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 print:hidden">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900">
                    {selectedContract.signatures?.full_name || selectedContract.influencer_name || 'Sözleşme Detayı'}
                  </h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedContract.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedContract.status === 'signed' ? '✓ İmzalandı' : '⏳ Bekliyor'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">ID: {selectedContract.id}</p>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1 rounded-xl flex text-xs font-semibold">
                  <button
                    onClick={() => setModalTab('contract')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      modalTab === 'contract' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-gray-600'
                    }`}
                  >
                    📄 Resmi Sözleşme
                  </button>
                  <button
                    onClick={() => setModalTab('summary')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      modalTab === 'summary' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-gray-600'
                    }`}
                  >
                    👤 Müşteri Bilgileri
                  </button>
                </div>

                <button 
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {modalTab === 'contract' ? (
                /* 1. TAB: OFFICIAL FULL CONTRACT WITH REAL INFLUENCER SIGNATURE */
                <div className="space-y-4">
                  <ContractContent 
                    contract={selectedContract}
                    influencerInfo={{
                      fullName: selectedContract.signatures?.full_name || selectedContract.influencer_name || '',
                      instagramUsername: selectedContract.signatures?.instagram_username || '',
                      phone: selectedContract.signatures?.phone || '',
                      email: selectedContract.signatures?.email || '',
                      address: selectedContract.signatures?.address || '',
                      selectedProduct: selectedContract.product_detail,
                      productValue: selectedContract.product_value,
                      signatureData: selectedContract.signatures?.signature_data,
                      signedAt: selectedContract.signatures?.signed_at,
                      ipAddress: selectedContract.signatures?.ip_address,
                    }}
                  />
                </div>
              ) : (
                /* 2. TAB: QUICK SUMMARY CARD */
                <div className="space-y-6 text-xs sm:text-sm">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    selectedContract.status === 'signed' 
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      <span>{selectedContract.status === 'signed' ? '✓ Onaylanmış Sözleşme' : '⏳ Henüz İmzalanmadı / Bekliyor'}</span>
                    </div>
                    {selectedContract.signatures?.signed_at && (
                      <span className="text-xs text-green-700 font-medium">
                        {new Date(selectedContract.signatures.signed_at).toLocaleString('tr-TR')}
                      </span>
                    )}
                  </div>

                  {/* Influencer / Müşteri Bilgileri */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-sm text-brand-900 border-b border-gray-200 pb-1.5 flex items-center gap-1.5">
                      <span>👤</span> INFLUENCER / MÜŞTERİ BİLGİLERİ
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-gray-500 block text-xs">Adı Soyadı:</span>
                        <strong className="text-gray-900 text-base">{selectedContract.signatures?.full_name || selectedContract.influencer_name || '-'}</strong>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-xs">Instagram:</span>
                        <strong className="text-purple-700 font-semibold text-base">
                          {selectedContract.signatures?.instagram_username ? `@${selectedContract.signatures.instagram_username.replace(/^@/, '')}` : '-'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-xs">Telefon Numarası:</span>
                        <a href={`tel:${selectedContract.signatures?.phone}`} className="text-brand-600 font-bold hover:underline">
                          {selectedContract.signatures?.phone || '-'}
                        </a>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-gray-500 block text-xs">E-posta Adresi:</span>
                        <a href={`mailto:${selectedContract.signatures?.email}`} className="text-brand-600 hover:underline">
                          {selectedContract.signatures?.email || '-'}
                        </a>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-gray-500 block text-xs">Kargo / Teslimat Açık Adresi:</span>
                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-800 font-medium mt-1 leading-relaxed">
                          {selectedContract.signatures?.address || 'Henüz adres girilmedi.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Islak İmza Görseli */}
                  {selectedContract.signatures?.signature_data && (
                    <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                      <h3 className="font-bold text-sm text-emerald-950 border-b border-emerald-200 pb-1.5 flex items-center gap-1.5">
                        <span>✍️</span> INFLUENCER ISLAK İMZA GÖRSELİ
                      </h3>

                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-center">
                        <img 
                          src={selectedContract.signatures.signature_data} 
                          alt="Influencer İmzası" 
                          className="max-h-36 max-w-full object-contain"
                        />
                      </div>

                      <div className="flex justify-between text-xs text-emerald-900 pt-1">
                        <span>İmzalayan: <strong>{selectedContract.signatures.full_name}</strong></span>
                        <span>IP: <strong>{selectedContract.signatures.ip_address}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center bg-gray-50 rounded-b-2xl print:hidden">
              <button 
                onClick={() => handleDelete(selectedContract.id)}
                disabled={deletingId === selectedContract.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-red-200"
              >
                {deletingId === selectedContract.id ? "Siliniyor..." : "🗑️ Sözleşmeyi Sil"}
              </button>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => window.print()}
                  className="btn-primary text-xs sm:text-sm py-2 px-4 font-bold rounded-xl shadow-sm bg-gray-900 hover:bg-black text-white"
                  title="Sözleşmeyi ve imzayı PDF olarak kaydet veya yazdır"
                >
                  🖨️ Yazdır / PDF İndir
                </button>
                <button 
                  onClick={() => copyLink(selectedContract.id)}
                  className="btn-secondary text-xs sm:text-sm py-2 px-3 font-semibold rounded-xl"
                >
                  🔗 Linki Kopyala
                </button>
                <Link 
                  href={`/contract/${selectedContract.id}`}
                  target="_blank"
                  className="btn-primary text-xs sm:text-sm py-2 px-4 font-bold rounded-xl shadow-sm"
                >
                  Yeni Sekmede Aç ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
