'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ContractContent from '@/components/ContractContent';
import { Contract } from '@/lib/types';

// Dynamic import for signature pad to avoid SSR issues
const SignaturePad = dynamic(() => import('@/components/SignaturePad'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-md flex items-center justify-center text-gray-400">İmza alanı yükleniyor...</div>
});

const DEFAULT_PRODUCT_OPTIONS = [
  { id: 'cift_kisilik', name: 'Çift Kişilik Uyku Seti', icon: '🛏️', desc: 'Lüks Pamuk Çift Kişilik Nevresim & Uyku Seti' },
  { id: 'tek_kisilik', name: 'Tek Kişilik Uyku Seti', icon: '🛏️', desc: 'Lüks Pamuk Tek Kişilik Nevresim & Uyku Seti' },
  { id: 'klimali_yastik', name: 'Klimalı Yastık', icon: '❄️', desc: 'Özel Ortopedik Klimalı Soğutucu Etkili Yastık' },
];

export default function DirectContractPage() {
  const router = useRouter();
  
  // Step state (1: Information Form & Product Selection, 2: Contract Review & Sign)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Çift Kişilik Uyku Seti');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Default contract template info
  const defaultContractTemplate: Pick<Contract, 'influencer_name' | 'product_detail' | 'product_value' | 'content_count' | 'content_type' | 'platform' | 'notes' | 'delivery_deadline'> = {
    influencer_name: fullName,
    product_detail: selectedProduct,
    product_value: 2450,
    content_count: 1,
    content_type: 'UGC Video (Doğal Deneyim & Kullanım)',
    platform: 'Instagram Reels & TikTok',
    notes: 'İlay Home Barter İş Birliği Sözleşmesi',
    delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  const isStep1Valid = fullName.trim().length > 0 && 
    instagramUsername.trim().length > 0 && 
    phone.trim().length > 0 && 
    email.trim().length > 0 && 
    address.trim().length > 0 &&
    selectedProduct.trim().length > 0;

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureData || !isAccepted) return;
    
    setSubmitting(true);
    try {
      const contractId = 'c_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

      const signRes = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: contractId,
          full_name: fullName,
          instagram_username: instagramUsername,
          selected_product: selectedProduct,
          product_value: 2450,
          phone,
          email,
          address,
          signature_data: signatureData
        })
      });

      if (!signRes.ok) {
        const errData = await signRes.json().catch(() => ({}));
        throw new Error(errData.error || 'İmzalama işlemi sırasında hata oluştu.');
      }

      router.push(`/contract/${contractId}/success`);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu, lütfen tekrar deneyiniz.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 via-gray-50 to-gray-50 scroll-smooth pb-16">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-brand-600 tracking-tight">İlay Home</h1>
          <p className="text-xs text-gray-500 font-medium">İlay Züccaciye & İçerik Üretici Barter İş Birliği</p>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${step === 1 ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 bg-gray-50'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-white text-brand-700' : 'bg-gray-200 text-gray-600'}`}>1</span>
            <span>Ürün & Bilgileriniz</span>
          </div>

          <div className="h-0.5 w-8 bg-gray-200"></div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${step === 2 ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 bg-gray-50'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-white text-brand-700' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>Sözleşme & İmza</span>
          </div>
        </div>

        {/* STEP 1: INFLUENCER INFORMATION & PRODUCT SELECTION FORM */}
        {step === 1 && (
          <div className="card p-6 md:p-8 space-y-6 bg-white shadow-sm border border-gray-100">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                👤 İçerik Üretici Bilgileri & Ürün Tercihi
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Lütfen talep ettiğiniz barter ürününü seçiniz ve kargo bilgilerinizi eksiksiz doldurunuz.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleGoToStep2}>
              {/* Product Selection Options */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-gray-800">
                  📦 Gönderilecek Barter Ürününü Seçiniz: <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {DEFAULT_PRODUCT_OPTIONS.map((prod) => {
                    const isSelected = selectedProduct === prod.name;
                    return (
                      <label 
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod.name)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-1 ring-brand-400/30' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="barter_product" 
                            checked={isSelected}
                            onChange={() => setSelectedProduct(prod.name)}
                            className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                              <span>{prod.icon}</span>
                              <span>{prod.name}</span>
                            </p>
                            <p className="text-xs text-gray-500">{prod.desc}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                          isSelected ? 'bg-brand-600 text-white font-bold' : 'text-gray-400 bg-gray-100'
                        }`}>
                          {isSelected ? 'Seçildi ✓' : 'Seç'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                {/* Ad Soyad */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Adınız ve Soyadınız <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="input-field w-full" 
                    placeholder="Adınızı ve soyadınızı giriniz"
                  />
                </div>

                {/* Instagram Kullanıcı Adı */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Instagram Kullanıcı Adınız <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">@</span>
                    <input 
                      type="text" 
                      required 
                      value={instagramUsername.replace(/^@/, '')}
                      onChange={e => setInstagramUsername(e.target.value.replace(/^@/, ''))}
                      className="input-field w-full pl-9" 
                      placeholder="Instagram kullanıcı adınız"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Telefon Numarası <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-field w-full" 
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    E-posta Adresi <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field w-full" 
                    placeholder="E-posta adresinizi giriniz (örn: adiniz@gmail.com)"
                  />
                </div>

                {/* Kargo Açık Adresi */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Kargo / Teslimat Açık Adresi <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required 
                    rows={3}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="input-field w-full resize-none" 
                    placeholder="Ürünün kargolanacağı tam adresiniz (Mahalle, Cadde/Sokak, Bina No, İlçe, İl)"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={!isStep1Valid}
                  className="btn-primary w-full py-4 text-base sm:text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                >
                  <span>Devam Et & Sözleşmeyi İncele</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: CONTRACT VIEW WITH INFLUENCER'S FILLED INFO & SELECTED PRODUCT + SIGNATURE PAD */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1.5 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200"
              >
                <span>←</span>
                <span>Bilgilerimi & Ürünü Düzenle</span>
              </button>
              <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                ✓ {selectedProduct} Seçildi
              </span>
            </div>

            {/* Render Contract with Filled Influencer Information and Selected Product */}
            <ContractContent 
              contract={defaultContractTemplate} 
              influencerInfo={{
                fullName,
                instagramUsername,
                phone,
                email,
                address,
                selectedProduct,
                productValue: 2450
              }}
            />

            {/* Signature & Approval Form */}
            <div className="card p-6 md:p-8 space-y-6 bg-white shadow-sm border border-gray-100">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  ✍️ Dijital İmzanız
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Lütfen aşağıdaki alana parmağınızla imzanızı atınız.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <SignaturePad onSave={(data) => setSignatureData(data)} />
                  {signatureData && (
                    <p className="text-xs sm:text-sm text-green-600 mt-2 font-semibold flex items-center gap-1">
                      <span>✓</span> İmzanız başarıyla kaydedildi.
                    </p>
                  )}
                </div>

                {/* Checkbox */}
                <div className="pt-2 flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <input 
                    type="checkbox" 
                    id="accept" 
                    required
                    checked={isAccepted}
                    onChange={e => setIsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="accept" className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-relaxed">
                    İşbu <strong>Barter (Takas) Sözleşmesi</strong>'nde yer alan tüm maddeleri, seçtiğim ({selectedProduct}) ürün şartlarını ve Kumluca Mahkemeleri yetki hükmünü okudum, anladım ve kabul ediyorum.
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={!signatureData || !isAccepted || submitting}
                  className="btn-primary w-full py-4 text-base sm:text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sözleşme Onaylanıyor...</span>
                    </>
                  ) : (
                    <span>Sözleşmeyi Onayla ve Tamamla ✓</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 pt-4">
          Resmi & Hukuki Geçerlilik: İlay Züccaciye — Kumluca / Antalya
        </div>
      </div>
    </div>
  );
}
