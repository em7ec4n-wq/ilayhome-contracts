'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ContractContent from '@/components/ContractContent';
import { Contract } from '@/lib/types';

// Dynamic import for signature pad to avoid SSR issues
const SignaturePad = dynamic(() => import('@/components/SignaturePad'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-md flex items-center justify-center text-gray-400">İmza alanı yükleniyor...</div>
});

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Step state (1: Information Form, 2: Contract Review & Sign)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const id = params?.id;
        if (!id) return;
        
        const res = await fetch(`/api/contracts?id=${id}`);
        if (!res.ok) throw new Error('Sözleşme bulunamadı veya bir hata oluştu.');
        
        const data = await res.json();
        setContract(data);
        if (data.influencer_name && !fullName) {
          // If name has @username pattern, extract
          setFullName(data.influencer_name);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params?.id]);

  const isStep1Valid = fullName.trim().length > 0 && 
    instagramUsername.trim().length > 0 && 
    tcNo.replace(/\D/g, '').length === 11 && 
    phone.trim().length > 0 && 
    email.trim().length > 0 && 
    address.trim().length > 0;

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !signatureData || !isAccepted) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: contract.id,
          full_name: fullName,
          instagram_username: instagramUsername,
          tc_no: tcNo,
          phone,
          email,
          address,
          signature_data: signatureData
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'İmzalama işlemi sırasında hata oluştu.');
      }

      router.push(`/contract/${contract.id}/success`);
    } catch (err: any) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Sözleşme Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="card p-6 text-center max-w-md w-full space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h2 className="text-xl font-bold text-gray-900">Sözleşme Bulunamadı</h2>
          <p className="text-gray-600 text-sm">{error || 'Geçersiz sözleşme bağlantısı.'}</p>
        </div>
      </div>
    );
  }

  if (contract.status === 'signed' && contract.id !== 'ornek' && contract.id !== 'demo') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="card p-6 text-center max-w-md w-full space-y-4 border-t-4 border-brand-500">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
          <h2 className="text-xl font-bold text-gray-900">Bu Sözleşme Zaten Onaylanmıştır</h2>
          <p className="text-gray-600 text-sm">
            {contract.influencer_name} adına düzenlenen bu sözleşme başarıyla onaylanmış durumdadır.
          </p>
        </div>
      </div>
    );
  }

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
            <span>Bilgileriniz</span>
          </div>

          <div className="h-0.5 w-8 bg-gray-200"></div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${step === 2 ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 bg-gray-50'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-white text-brand-700' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>Sözleşme & İmza</span>
          </div>
        </div>

        {/* STEP 1: INFLUENCER INFORMATION FORM */}
        {step === 1 && (
          <div className="card p-6 md:p-8 space-y-6 bg-white shadow-sm border border-gray-100">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                👤 İçerik Üretici Bilgileri
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Sözleşmenizin ve ürün kargo gönderiminizin hazırlanması için lütfen bilgilerinizi eksiksiz doldurunuz.
              </p>
            </div>

            {/* Product Summary Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm space-y-1">
              <p className="font-bold text-amber-900">📦 Gönderilecek Barter Ürünü:</p>
              <p className="text-amber-950"><strong>{contract.product_detail}</strong> ({contract.product_value} TL)</p>
            </div>

            <form className="space-y-4" onSubmit={handleGoToStep2}>
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
                  placeholder="Kimlikte yazan tam adınız"
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
                    placeholder="kullaniciadiniz"
                  />
                </div>
              </div>

              {/* TC Kimlik No */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  T.C. Kimlik Numarası <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  maxLength={11}
                  value={tcNo}
                  onChange={e => setTcNo(e.target.value.replace(/\D/g, ''))}
                  className="input-field w-full" 
                  placeholder="11 haneli T.C. Kimlik No (Sözleşme geçerliliği için)"
                />
                {tcNo.length > 0 && tcNo.length !== 11 && (
                  <p className="text-xs text-amber-600 mt-1">11 haneli olmalıdır ({tcNo.length}/11)</p>
                )}
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
                  placeholder="ornek@gmail.com"
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
                  placeholder="Ürünün kargolanacağı tam adres (İlçe, İl ve Posta Kodu dahil)"
                />
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

        {/* STEP 2: CONTRACT VIEW WITH INFLUENCER'S FILLED INFO + SIGNATURE PAD */}
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
                <span>Bilgilerimi Düzenle</span>
              </button>
              <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                ✓ Bilgileriniz Sözleşmeye İşlendi
              </span>
            </div>

            {/* Render Contract with Filled Influencer Information */}
            <ContractContent 
              contract={contract} 
              influencerInfo={{
                fullName,
                instagramUsername,
                tcNo,
                phone,
                email,
                address
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
                    İşbu <strong>Barter (Takas) Sözleşmesi</strong>'nde yer alan tüm maddeleri, teslimat şartlarını ve Kumluca Mahkemeleri yetki hükmünü okudum, anladım ve kabul ediyorum.
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
