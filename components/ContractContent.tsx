import React from 'react';
import { Contract } from '@/lib/types';

export interface InfluencerFormData {
  fullName: string;
  instagramUsername: string;
  tcNo?: string;
  phone: string;
  email: string;
  address: string;
  selectedProduct: string;
  productValue?: number;
  signatureData?: string;
  signedAt?: string;
  ipAddress?: string;
}

interface ContractContentProps {
  contract: Pick<Contract, 'influencer_name' | 'product_detail' | 'product_value' | 'content_count' | 'content_type' | 'platform' | 'notes' | 'delivery_deadline'>;
  influencerInfo?: InfluencerFormData;
}

export default function ContractContent({ contract, influencerInfo }: ContractContentProps) {
  const currentInfluencerName = influencerInfo?.fullName || contract.influencer_name;
  const currentProductDetail = influencerInfo?.selectedProduct || contract.product_detail;

  return (
    <div className="card p-6 md:p-10 space-y-6 text-sm text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl print:border-none print:shadow-none print:p-2">
      <div className="text-center pb-4 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide uppercase">
          Barter (Takas) Sözleşmesi
        </h1>
        <p className="text-xs text-gray-500 mt-1">İlay Home (İlay Züccaciye) & İçerik Üretici Barter İş Birliği Anlaşması</p>
        <p className="text-xs font-semibold text-brand-800 bg-brand-50 inline-block px-3 py-1 rounded-full border border-brand-200/60 mt-2">
          📅 Düzenleme Tarihi: {influencerInfo?.signedAt ? new Date(influencerInfo.signedAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>

      {/* 1. Taraflar */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">1. Taraflar</h2>
        <p className="text-gray-700 leading-relaxed">
          İşbu sözleşme, aşağıda bilgileri belirtilen <strong>MARKA (İlay Züccaciye)</strong> ile <strong>INFLUENCER</strong> arasında karşılıklı hak ve yükümlülükleri düzenlemek üzere akdedilmiştir.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* MARKA */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs sm:text-sm">
            <p className="font-bold text-brand-900 uppercase border-b border-gray-200 pb-1">MARKA (FİRMA)</p>
            <p><strong>Ticari Unvan:</strong> İlay Züccaciye (İlay Home)</p>
            <p><strong>Adres:</strong> Kumluca / Antalya, Türkiye</p>
            <p><strong>Resmi Web Sitesi:</strong> <a href="https://www.ilayhome.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">www.ilayhome.com</a></p>
            <p><strong>Yetkili Mahkeme:</strong> Antalya Kumluca Mahkemeleri</p>
          </div>

          {/* INFLUENCER */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs sm:text-sm">
            <p className="font-bold text-brand-900 uppercase border-b border-gray-200 pb-1">INFLUENCER (İÇERİK ÜRETİCİ)</p>
            <p><strong>Adı Soyadı:</strong> {currentInfluencerName || <span className="text-gray-400 italic">(Doldurulacak)</span>}</p>
            <p><strong>Instagram:</strong> {influencerInfo?.instagramUsername ? (influencerInfo.instagramUsername.startsWith('@') ? influencerInfo.instagramUsername : `@${influencerInfo.instagramUsername}`) : <span className="text-gray-400 italic">(Doldurulacak)</span>}</p>
            <p><strong>Telefon:</strong> {influencerInfo?.phone || <span className="text-gray-400 italic">(Doldurulacak)</span>}</p>
            <p><strong>E-posta:</strong> {influencerInfo?.email || <span className="text-gray-400 italic">(Doldurulacak)</span>}</p>
            <p><strong>Teslimat Adresi:</strong> {influencerInfo?.address || <span className="text-gray-400 italic">(Doldurulacak)</span>}</p>
          </div>
        </div>
      </section>

      {/* 2. Barter Kapsamındaki Ürün */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">2. Barter Kapsamındaki Ürün</h2>
        <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200 space-y-1">
          <p className="text-gray-800">
            <strong>Gönderilecek Ürün:</strong> <span className="text-brand-900 font-bold">{currentProductDetail}</span>
          </p>
          <p className="text-gray-700 text-xs sm:text-sm">
            <strong>Ürün Bedeli Esası:</strong> İlay Home resmi web sitesindeki (<a href="https://www.ilayhome.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">www.ilayhome.com</a>) güncel perakende satış fiyatı geçerlidir.
          </p>
        </div>
      </section>

      {/* 3. Üretilecek İçerik ve Format */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">3. Üretilecek İçerik ve Format</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-700 leading-relaxed">
          <li><strong>İçerik Adedi ve Türü:</strong> {contract.content_count || 1} adet {contract.content_type || 'UGC Tanıtım / Deneyim Videosu'}</li>
          <li><strong>İçerik Platformu:</strong> {contract.platform || 'Instagram Reels & TikTok'}</li>
          <li><strong>Format:</strong> Minimum 1080x1920 (9:16 dikey format), minimum 1080p yüksek çözünürlükte, net ses ve aydınlatmaya sahip olmalıdır.</li>
          <li><strong>İçerik Doğallığı:</strong> UGC (User Generated Content) formatında, samimi ve ürünü gerçek kullanım esnasında estetik biçimde yansıtan bir akışla hazırlanmalıdır.</li>
        </ul>
      </section>

      {/* 4. Reklam ve Kullanım Hakları Devri */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">4. Reklam ve Kullanım Hakları Devri</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, hazırladığı video ve görsel içeriklerin tüm mali ve fikri kullanım haklarını <strong>İlay Züccaciye (İlay Home)</strong> markasına süresiz, sınırsız ve münhasır olmaksızın devretmiştir. Marka; söz konusu içerikleri Meta (Instagram & Facebook Reklamları), TikTok Ads, Google/YouTube, web sitesi (<a href="https://www.ilayhome.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">www.ilayhome.com</a>) ve tüm dijital/basılı pazarlama kanallarında reklam olarak kullanma, kırpma, ses/metin ekleme ve yeniden düzenleme hakkına sahiptir. Influencer bu kullanımlar için ilave telif veya ücret talep etmeyeceğini kabul ve taahhüt eder.
        </p>
      </section>

      {/* 5. Teslim Süreci ve Onay */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">5. Teslim Süreci ve Onay</h2>
        <p className="text-gray-700 leading-relaxed">
          Ürün influencer'a kargo şirketi tarafından teslim edildiği günden itibaren en geç <strong>5 (beş) iş günü</strong> içinde çekilen ham veya kurgulu video onaya gönderilmelidir. Marka, içeriği 2 iş günü içinde inceler. Gerekli görülmesi durumunda en fazla 2 (iki) revizyon talep edebilir.
        </p>
      </section>

      {/* 6. Teslim Gecikmesi ve Yaptırım */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">6. Teslim Gecikmesi ve Cezai Şart</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, ürün kendisine ulaştıktan sonra mücbir sebep olmaksızın belirlenen süre içinde içeriği teslim etmemesi veya iletişimi kesmesi halinde marka, gönderilen seçili ürünün resmi web sitesindeki (<a href="https://www.ilayhome.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">www.ilayhome.com</a>) güncel perakende satış bedelini ve doğan masrafları influencer'dan nakden ve defaten tahsil etme hakkına sahiptir.
        </p>
      </section>

      {/* 7. Profilde Paylaşım Koşulu */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">7. İçerik Yayını ve Silmeme Taahhüdü</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer içeriği kendi Instagram veya TikTok profilinde paylaştığı takdirde, paylaşım tarihinden itibaren en az <strong>60 gün</strong> boyunca profilinde yayında tutmayı ve silmemeyi kabul eder.
        </p>
      </section>

      {/* 8. Kargo ve Masraflar */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">8. Kargo ve Teslimat Masrafları</h2>
        <p className="text-gray-700 leading-relaxed">
          Barter ürününün influencer'ın belirttiği adrese gönderim kargo ücreti MARKA (İlay Züccaciye) tarafından karşılanır.
        </p>
      </section>

      {/* 9. Gizlilik */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">9. Gizlilik</h2>
        <p className="text-gray-700 leading-relaxed">
          Taraflar, işbu iş birliği sürecinde edinilen ticari, operasyonel veya kişisel bilgileri üçüncü şahıslarla paylaşamaz.
        </p>
      </section>

      {/* 10. Rakip Kısıtlaması */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">10. Kategori Kısıtlaması</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, içeriğin tesliminden itibaren 15 gün boyunca doğrudan aynı kategorideki rakip bir ev tekstili markası ile rakip tanıtım yapmayacağını iyi niyet çerçevesinde beyan eder.
        </p>
      </section>

      {/* 11. Yetkili Mahkeme ve İcra Daireleri */}
      <section className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
        <h2 className="text-base font-bold text-amber-900">11. Yetkili Mahkeme ve Hukuksal Geçerlilik</h2>
        <p className="text-amber-950 leading-relaxed font-medium">
          İşbu sözleşmeden doğabilecek her türlü ihtilaf, uyuşmazlık veya alacak davalarında Türk Hukuku uygulanacak olup, <strong>Antalya Kumluca Mahkemeleri ve Kumluca İcra Daireleri</strong> münhasıran yetkilidir.
        </p>
      </section>

      {/* 12. Tarafların İmzaları */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base font-bold text-gray-900">12. Tarafların İmzaları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Marka Signature */}
          <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">MARKA YETKİLİSİ İMZASI</p>
            <div className="h-20 flex items-center justify-center border-b border-purple-200 py-1">
              <img 
                src="/company-signature.png" 
                alt="İlay Züccaciye İmza" 
                className="max-h-full max-w-[180px] object-contain"
              />
            </div>
            <div className="text-xs space-y-1 text-purple-900 pt-1">
              <p><strong>Firma:</strong> İlay Züccaciye / Antalya Kumluca</p>
              <p><strong>Yetkili:</strong> Marka Yönetimi ✓</p>
              <p><strong>Tarih:</strong> {influencerInfo?.signedAt ? new Date(influencerInfo.signedAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* Influencer Signature */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">INFLUENCER DİJİTAL ISLAK İMZA</p>
            <div className="h-20 flex items-center justify-center border-b border-emerald-200 py-1">
              {influencerInfo?.signatureData ? (
                <img 
                  src={influencerInfo.signatureData} 
                  alt="Influencer Islak İmza" 
                  className="max-h-full max-w-[180px] object-contain"
                />
              ) : (
                <span className="text-emerald-700 text-xs italic font-medium">
                  (Dijital imza alanı onaylandığında geçerlidir)
                </span>
              )}
            </div>
            <div className="text-xs space-y-1 text-emerald-900 pt-1">
              <p><strong>Ad Soyad:</strong> {currentInfluencerName || '-'}</p>
              <p><strong>Instagram:</strong> {influencerInfo?.instagramUsername ? (influencerInfo.instagramUsername.startsWith('@') ? influencerInfo.instagramUsername : `@${influencerInfo.instagramUsername}`) : '-'}</p>
              <p><strong>Tarih:</strong> {influencerInfo?.signedAt ? new Date(influencerInfo.signedAt).toLocaleString('tr-TR') : new Date().toLocaleDateString('tr-TR')}</p>
              {influencerInfo?.ipAddress && (
                <p className="text-gray-500"><strong>IP:</strong> {influencerInfo.ipAddress}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {contract.notes && (
        <section className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">Özel Notlar</h2>
          <p className="text-gray-700 text-xs sm:text-sm">{contract.notes}</p>
        </section>
      )}
    </div>
  );
}
