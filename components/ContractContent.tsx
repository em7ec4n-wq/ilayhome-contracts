import React from 'react';
import { Contract } from '@/lib/types';

export interface InfluencerFormData {
  fullName?: string;
  instagramUsername?: string;
  tcNo?: string;
  phone?: string;
  email?: string;
  address?: string;
  selectedProduct?: string;
  productValue?: number;
}

interface ContractContentProps {
  contract: Pick<Contract, 'influencer_name' | 'product_detail' | 'product_value' | 'content_count' | 'content_type' | 'platform' | 'notes' | 'delivery_deadline'>;
  influencerInfo?: InfluencerFormData;
}

export default function ContractContent({ contract, influencerInfo }: ContractContentProps) {
  const currentInfluencerName = influencerInfo?.fullName || contract.influencer_name;
  const currentProductDetail = influencerInfo?.selectedProduct || contract.product_detail;
  const currentProductValue = influencerInfo?.productValue || contract.product_value;

  return (
    <div className="card p-6 md:p-10 space-y-6 text-sm text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="text-center pb-4 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide uppercase">
          Barter (Takas) Sözleşmesi
        </h1>
        <p className="text-xs text-gray-500 mt-1">İlay Home (İlay Züccaciye) & İçerik Üretici Barter İş Birliği Anlaşması</p>
      </div>

      {/* 1. Taraflar */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">1. Taraflar</h2>
        <p className="text-gray-700 leading-relaxed">
          İşbu sözleşme, aşağıda bilgileri belirtilen <strong>MARKA (İlay Züccaciye)</strong> ile <strong>INFLUENCER</strong> arasında karşılıklı hak ve yükümlülükleri düzenlemek üzere akdedilmiştir.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs sm:text-sm">
          {/* Marka Bilgileri */}
          <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100">
            <p className="font-bold text-brand-800 border-b border-gray-200 pb-1 flex items-center gap-1.5">
              <span>🏢</span> MARKA (FİRMA) BİLGİLERİ
            </p>
            <p><span className="text-gray-500 font-medium">Firma Unvanı:</span> <strong>İlay Züccaciye</strong></p>
            <p><span className="text-gray-500 font-medium">Marka Adı:</span> <strong>İlay Home</strong></p>
            <p><span className="text-gray-500 font-medium">Firma Adresi:</span> Kumluca / Antalya, Türkiye</p>
            <p><span className="text-gray-500 font-medium">İletişim:</span> info@ilayhome.com</p>
          </div>

          {/* Influencer Bilgileri */}
          <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100">
            <p className="font-bold text-brand-800 border-b border-gray-200 pb-1 flex items-center gap-1.5">
              <span>👤</span> INFLUENCER BİLGİLERİ
            </p>
            <p><span className="text-gray-500 font-medium">Adı Soyadı:</span> <strong>{currentInfluencerName || '-'}</strong></p>
            <p><span className="text-gray-500 font-medium">Instagram Hesabı:</span> <strong>{influencerInfo?.instagramUsername ? (influencerInfo.instagramUsername.startsWith('@') ? influencerInfo.instagramUsername : `@${influencerInfo.instagramUsername}`) : '@'}</strong></p>
            {influencerInfo?.tcNo && <p><span className="text-gray-500 font-medium">T.C. Kimlik No:</span> {influencerInfo.tcNo}</p>}
            {influencerInfo?.phone && <p><span className="text-gray-500 font-medium">Telefon:</span> {influencerInfo.phone}</p>}
            {influencerInfo?.email && <p><span className="text-gray-500 font-medium">E-posta:</span> {influencerInfo.email}</p>}
            {influencerInfo?.address && <p><span className="text-gray-500 font-medium">Kargo Adresi:</span> {influencerInfo.address}</p>}
          </div>
        </div>
      </section>

      {/* 2. Barter Kapsamındaki Ürün */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">2. Barter Kapsamındaki Ürün</h2>
        <p className="text-gray-700">Marka, influencer'a aşağıda detayı belirtilen ücretsiz barter ürününü sağlayacaktır:</p>
        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1.5 text-xs sm:text-sm">
          <p><span className="text-gray-500 font-medium">Seçilen Barter Ürünü:</span> <strong className="text-gray-900">{currentProductDetail}</strong></p>
          <p><span className="text-gray-500 font-medium">Ürün Bedeli Esası:</span> <span className="text-gray-700">İlay Home resmi web sitesindeki (<strong>www.ilayhome.com</strong>) güncel perakende satış fiyatı geçerlidir.</span></p>
        </div>
      </section>

      {/* 3. İçerik Teknik Gereksinimleri */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">3. İçerik Teknik Gereksinimleri</h2>
        <p className="text-gray-700 leading-relaxed">
          Minimum 30 saniye süre, minimum 1080p çekim kalitesi, dikey format (9:16). Videoda marka adı, logo veya herhangi bir rakip etiket görünmeyecektir. İçerik doğal ve organik bir kullanıcı deneyimi şeklinde çekilecektir (UGC formatı). Ürün videoda net bir şekilde kullanılacak ve gösterilecektir. Influencer ürünü gerçekten kullanarak samimi bir kullanıcı deneyim videosu çekecektir.
        </p>
      </section>

      {/* 4. İçerik Teslim Tarihi */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">4. İçerik Teslim Tarihi</h2>
        <p className="text-gray-700">
          Influencer, ürün kargo ile kendisine teslim edildikten sonra aşağıdaki süre içinde içerikleri markaya teslim edecektir:
        </p>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs sm:text-sm">
          <p><span className="text-gray-500 font-medium">Teslim Süresi:</span> <strong>Ürün tesliminden itibaren 5 iş günü (Gecikme halinde en geç 7 iş günü)</strong></p>
          {contract.delivery_deadline && (
            <p><span className="text-gray-500 font-medium">Son Teslim Tarihi:</span> <strong>{new Date(contract.delivery_deadline).toLocaleDateString('tr-TR')}</strong></p>
          )}
        </div>
      </section>

      {/* 5. İçerik Onay Süreci */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">5. İçerik Onay Süreci</h2>
        <p className="text-gray-700 leading-relaxed">
          Üretilen içerikler, marka tarafından <strong>2 iş günü</strong> içinde onaylanacaktır. Onay süresi içinde herhangi bir itiraz olmaması durumunda içerik kabul edilmiş sayılır. Markanın en fazla 2 revizyon talep etme hakkı saklıdır.
        </p>
      </section>

      {/* 6. Gecikme ve Yaptırımlar */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">6. Gecikme ve Yaptırımlar</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, içerik tesliminde gecikme yaşaması veya belirlenen 7 iş günlük azami süre içinde videoyu teslim etmemesi halinde marka, gönderilen seçili ürünün ({currentProductDetail}) markaya ait resmi web sitesindeki (<strong>www.ilayhome.com</strong>) güncel perakende satış bedelini influencer'dan nakden talep ve tahsil etme hakkına sahiptir.
        </p>
      </section>

      {/* 7. Reklam ve Tanıtım Kullanım Hakları */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">7. Reklam ve Tanıtım Kullanım Hakları</h2>
        <p className="text-gray-700 leading-relaxed">
          Marka (İlay Züccaciye), influencer tarafından üretilen tüm içerikleri (video, fotoğraf, ham çekimler) süresiz olarak Meta (Facebook/Instagram), TikTok, Google/YouTube reklam kampanyalarında, web sitesinde, pazar yerlerinde ve diğer tüm dijital/basılı reklam mecralarında ticari amaçla kullanma hakkına sahiptir. İçerikler reklam amacıyla kullanılırken düzenleme, kırpma, ses/müzik ekleme gibi değişiklikler yapılabilir. Influencer bu kullanıma itiraz etmeyeceğini peşinen kabul ve taahhüt eder.
        </p>
      </section>

      {/* 8. İçerik Paylaşımı & Silme Yasağı */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">8. İçerik Paylaşımı & Silme Yasağı</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, içeriği kendi sosyal medya profilinde paylaşabilir ancak bu zorunlu değildir. Paylaşması halinde içerik minimum 60 gün boyunca profilinde yayında kalacaktır. Bu süre dolmadan silinmesi halinde ürün bedeli talep edilir.
        </p>
      </section>

      {/* 9. Gizlilik ve Fesih */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">9. Gizlilik ve Fesih</h2>
        <p className="text-gray-700 leading-relaxed">
          Taraflar, sözleşme süresince ve sonrasında birbirlerine ait ticari ve kişisel bilgileri üçüncü taraflarla paylaşmamayı kabul eder.
        </p>
      </section>

      {/* 10. Kargo ve Ürün Teslimi */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">10. Kargo ve Ürün Teslimi</h2>
        <p className="text-gray-700 leading-relaxed">
          Kargo masrafları marka tarafından karşılanır. Ürün hasarlı gelirse influencer 48 saat içinde markaya bildirecektir.
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
              <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">INFLUENCER</p>
            <div className="h-14 flex items-center justify-center border-b border-emerald-200 text-emerald-700 text-xs italic font-medium">
              (Aşağıdaki dijital imza alanı geçerlidir)
            </div>
            <div className="text-xs space-y-1 text-emerald-900 pt-1">
              <p><strong>Ad Soyad:</strong> {currentInfluencerName || '-'}</p>
              <p><strong>Instagram:</strong> {influencerInfo?.instagramUsername ? (influencerInfo.instagramUsername.startsWith('@') ? influencerInfo.instagramUsername : `@${influencerInfo.instagramUsername}`) : '-'}</p>
              <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
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
