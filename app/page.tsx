"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-gray-50 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold tracking-tight text-brand-600">İlay Home</span>
        </div>
        <Link 
          href="/admin/login" 
          className="text-xs text-gray-500 hover:text-brand-600 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-200 bg-white"
        >
          Yönetici Girişi
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto px-6 py-12 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/60 text-brand-800 text-xs font-semibold">
          ✨ İlay Home Barter & İş Birliği Portalı
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          İçerik Üreticilerimiz İçin <br className="hidden sm:inline" />
          <span className="text-brand-600">Hızlı & Güvenli Sözleşme</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          İlay Home ile yapacağınız barter ve UGC video iş birliklerinde sözleşmenizi tek tıkla inceleyebilir ve telefonunuzdan parmağınızla anında imzalayabilirsiniz.
        </p>

        {/* Info Card */}
        <div className="card max-w-lg mx-auto p-6 bg-white/90 backdrop-blur border border-gray-100 text-left space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Size Özel Linki Açın</p>
              <p className="text-xs text-gray-500">Ekibimizin WhatsApp veya DM üzerinden ilettiği sözleşme linkine tıklayın. (Şifre gerekmez)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Şartları İnceleyin</p>
              <p className="text-xs text-gray-500">Ürün detayları, video formatı ve teslim sürelerini kontrol edin.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Telefondan İmzalayın</p>
              <p className="text-xs text-gray-500">Ekrandaki imza alanına parmağınızla imzanızı atıp tek tıkla onaylayın.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full px-6 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} İlay Home. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
