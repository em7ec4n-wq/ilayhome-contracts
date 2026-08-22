'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Contract } from '@/lib/types';

export default function SuccessPage() {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const id = params?.id;
        if (!id) return;
        
        const res = await fetch(`/api/contracts?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setContract(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* CSS Confetti bits */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-10 left-10 w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-brand-600">İlay Home</h1>
        </div>

        <div className="card p-8 text-center space-y-6 shadow-xl border-t-4 border-green-500 bg-white">
          
          {/* Checkmark Animation CSS */}
          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-500 animate-[pulse_1s_ease-in-out_infinite]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900">Tebrikler! 🎉</h2>
            <p className="text-lg text-gray-600 font-medium">Sözleşmeniz başarıyla onaylandı.</p>
          </div>

          {loading ? (
            <div className="py-4 text-gray-400 animate-pulse">Bilgiler yükleniyor...</div>
          ) : contract ? (
            <div className="bg-gray-50 rounded-lg p-5 text-left space-y-3 text-sm border border-gray-100">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">İsim:</span>
                <span className="font-semibold text-gray-900">{contract.influencer_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Ürün:</span>
                <span className="font-semibold text-gray-900 text-right">{contract.product_detail}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Son Teslim:</span>
                <span className="font-semibold text-gray-900">
                  {contract.delivery_deadline ? new Date(contract.delivery_deadline).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Sözleşme Tarihi:</span>
                <span className="font-semibold text-brand-600">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ) : (
             <div className="py-4 text-gray-500">Sözleşme detayları yüklenemedi.</div>
          )}

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm font-medium border border-blue-100">
            💡 Ürününüz size ulaştıktan sonra 5 iş günü içinde içeriklerinizi teslim etmeyi unutmayın.
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        </div>
      </div>
    </div>
  );
}
