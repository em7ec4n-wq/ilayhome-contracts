'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ContractContent from '@/components/ContractContent';
import dynamic from 'next/dynamic';
import { ContractWithSignature } from '@/lib/types';

const SignaturePad = dynamic(() => import('@/components/SignaturePad'), { 
  ssr: false,
  loading: () => <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">İmza alanı yükleniyor...</div>
});

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<ContractWithSignature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [fullName, setFullName] = useState('');
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params?.id]);

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
          tc_no: tcNo,
          phone,
          email,
          address,
          signature_data: signatureData
        })
      });

      if (!res.ok) throw new Error('Onay işlemi sırasında bir hata oluştu.');
      
      router.push(`/contract/${contract.id}/success`);
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="card p-6 text-center max-w-md w-full">
          <p className="text-red-500 font-medium">{error || 'Sözleşme bulunamadı.'}</p>
        </div>
      </div>
    );
  }

  if (contract.status === 'signed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="card p-6 text-center max-w-md w-full space-y-4 border-t-4 border-brand-500">
          <h2 className="text-xl font-bold text-gray-900">Bu sözleşme zaten imzalanmıştır</h2>
          <p className="text-gray-600">
            {contract.influencer_name} adına düzenlenen bu sözleşme başarıyla onaylanmış durumdadır.
          </p>
        </div>
      </div>
    );
  }

  const isFormValid = fullName.length > 0 && tcNo.length === 11 && phone.length > 0 && email.length > 0 && address.length > 0 && signatureData !== null && isAccepted;

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-brand-600">İlay Home</h1>
          <p className="text-gray-500">İçerik Üretici Barter Sözleşmesi</p>
        </div>

        <ContractContent contract={contract} />

        <hr className="border-gray-200" />

        <div className="card p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
            Sözleşmeyi Onaylamak İçin Bilgilerinizi Girin
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="input-field w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500" 
                placeholder="Kimlikteki adınız ve soyadınız"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
              <input 
                type="text" 
                required 
                maxLength={11}
                pattern="\d{11}"
                value={tcNo}
                onChange={e => setTcNo(e.target.value.replace(/\D/g, ''))}
                className="input-field w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500" 
                placeholder="11 haneli TC kimlik numaranız"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500" 
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500" 
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
              <textarea 
                required 
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-field w-full px-4 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500 resize-none" 
                placeholder="Kargo teslimatı için tam adresiniz"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">İmza</label>
              <SignaturePad onSave={(data) => setSignatureData(data)} />
              {signatureData && (
                <p className="text-sm text-green-600 mt-2 font-medium">✓ İmza kaydedildi</p>
              )}
            </div>

            <div className="pt-4 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="accept" 
                required
                checked={isAccepted}
                onChange={e => setIsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <label htmlFor="accept" className="text-sm text-gray-600 cursor-pointer">
                Sözleşmeyi okudum, anladım ve kabul ediyorum
              </label>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={!isFormValid || submitting}
                className="btn-primary w-full py-4 text-lg font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                {submitting ? 'İşleniyor...' : 'Sözleşmeyi Onayla'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400 pb-8">
          IP adresiniz ve imzanız yasal geçerlilik için kayıt altına alınmaktadır.
        </div>
      </div>
    </div>
  );
}
