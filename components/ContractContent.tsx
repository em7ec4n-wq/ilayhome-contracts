import React from 'react';
import { Contract } from '@/lib/types';

interface ContractContentProps {
  contract: Pick<Contract, 'influencer_name' | 'product_detail' | 'product_value' | 'content_count' | 'content_type' | 'platform' | 'notes' | 'delivery_deadline'>;
}

export default function ContractContent({ contract }: ContractContentProps) {
  return (
    <div className="card p-6 md:p-10 space-y-6 text-sm text-gray-800 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="text-center pb-4 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide">
          Barter (Takas) Sözleşmesi
        </h1>
        <p className="text-xs text-gray-400 mt-1">İlay Home E-Ticaret & Micro-Influencer İş Birliği Anlaşması</p>
      </div>

      {/* 1. Taraflar */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">1. Taraflar</h2>
        <p className="text-gray-700 leading-relaxed">
          Bu sözleşme, aşağıda bilgileri belirtilen taraflar arasında tarafların karşılıklı hak ve yükümlülüklerini düzenlemek üzere akdedilmiştir.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-semibold text-brand-800 border-b border-gray-200 pb-1">MARKA BİLGİLERİ</p>
            <p><span className="text-gray-500 font-medium">Marka Adı:</span> <strong>İlay Home</strong></p>
            <p><span className="text-gray-500 font-medium">Marka Adresi:</span> İstanbul, Türkiye</p>
            <p><span className="text-gray-500 font-medium">Marka İletişim:</span> info@ilayhome.com</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-brand-800 border-b border-gray-200 pb-1">INFLUENCER BİLGİLERİ</p>
            <p><span className="text-gray-500 font-medium">Influencer Adı:</span> <strong>{contract.influencer_name}</strong></p>
            <p><span className="text-gray-500 font-medium">İçerik Platformu:</span> {contract.platform || 'Instagram / TikTok'}</p>
            <p><span className="text-gray-500 font-medium">İçerik Türü:</span> {contract.content_type || 'UGC Video'}</p>
          </div>
        </div>
      </section>

      {/* 2. Barter Kapsamındaki Ürün */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">2. Barter Kapsamındaki Ürün</h2>
        <p className="text-gray-700">Marka, influencer'a aşağıda detayları belirtilen ücretsiz ürünü sağlayacaktır:</p>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs sm:text-sm">
          <p><span className="text-gray-500 font-medium">Ürün Detayı:</span> <strong>{contract.product_detail}</strong></p>
          <p><span className="text-gray-500 font-medium">Ürün Tahmini Değeri (TL):</span> <strong>{contract.product_value} TL</strong></p>
        </div>
      </section>

      {/* 3. İçerik Teknik Gereksinimleri */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">3. İçerik Teknik Gereksinimleri</h2>
        <p className="text-gray-700 leading-relaxed">
          Minimum 30 saniye süre, minimum 1080p çekim kalitesi, dikey format (9:16). Videoda marka adı, logo veya etiket görünmeyecektir. İçerik doğal ve organik bir kullanıcı deneyimi şeklinde çekilecektir (UGC formatı). Ürün videoda net bir şekilde kullanılacak ve gösterilecektir. Influencer ürünü gerçekten kullanarak samimi bir deneyim videosu çekecektir.
        </p>
      </section>

      {/* 4. İçerik Teslim Tarihi */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">4. İçerik Teslim Tarihi</h2>
        <p className="text-gray-700">
          Influencer, ürün tesliminden itibaren aşağıdaki sürede içerikleri teslim edecektir:
        </p>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs sm:text-sm">
          <p><span className="text-gray-500 font-medium">İçerik Teslim Süresi:</span> <strong>Ürün tesliminden itibaren 5 iş günü (Gecikme halinde en geç 7 iş günü)</strong></p>
          {contract.delivery_deadline && (
            <p><span className="text-gray-500 font-medium">Son Teslim Tarihi:</span> <strong>{new Date(contract.delivery_deadline).toLocaleDateString('tr-TR')}</strong></p>
          )}
        </div>
      </section>

      {/* 5. İçerik Onay Süreci */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">5. İçerik Onay Süreci</h2>
        <p className="text-gray-700 leading-relaxed">
          Üretilen içerikler, marka tarafından aşağıdaki süre içinde onaylanacaktır. Onay süresi içinde herhangi bir itiraz olmaması durumunda içerik kabul edilmiş sayılır:
        </p>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm">
          <p><span className="text-gray-500 font-medium">Onay Süresi:</span> <strong>2 İş Günü (Maksimum 2 revizyon hakkı)</strong></p>
        </div>
      </section>

      {/* 6. Gecikme ve Yaptırımlar */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">6. Gecikme ve Yaptırımlar</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer, içerik tesliminde gecikme yaşanması veya belirlenen süre içinde içeriğin teslim edilmemesi halinde marka, gönderilen ürünün perakende satış bedelini talep etme ve tahsil etme hakkına sahiptir.
        </p>
      </section>

      {/* 7. İçerik Kullanım Hakları */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">7. İçerik Kullanım Hakları</h2>
        <p className="text-gray-700 leading-relaxed">
          Influencer tarafından üretilen içeriklerin marka tarafından kendi sosyal medya hesaplarında, reklam kampanyalarında ve tüm tanıtım materyallerinde kullanım hakkı süresiz ve münhasıran markaya ait olacaktır.
        </p>
      </section>

      {/* 8. Gizlilik ve Fesih */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-gray-900">8. Gizlilik ve Fesih</h2>
        <p className="text-gray-700 leading-relaxed">
          Taraflar, sözleşme süresince ve sonrasında birbirlerine ait gizli bilgileri üçüncü taraflarla paylaşmamayı kabul eder. Taraflardan herhangi biri sözleşmeyi yazılı bildirimle feshedebilir.
        </p>
      </section>

      {/* 10. Ek Maddeler */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">10. Ek Maddeler</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 leading-relaxed">
          <li>
            <strong>Reklam ve Tanıtım Kullanım Hakkı:</strong> Marka, influencer tarafından üretilen tüm içerikleri (video, fotoğraf, story) süresiz olarak Meta (Facebook/Instagram), TikTok, Google/YouTube reklam kampanyalarında, web sitesinde, e-ticaret sayfalarında ve diğer tüm dijital/basılı reklam mecralarında kullanma hakkına sahiptir. İçerikler reklam amacıyla kullanılırken düzenleme, kırpma, metin/müzik ekleme gibi değişiklikler yapılabilir. Influencer bu kullanıma itiraz etmeyeceğini kabul eder.
          </li>
          <li>
            <strong>Teslim Süresi ve Gecikme Yaptırımı:</strong> Influencer, ürünü teslim aldıktan sonra en geç 5 iş günü içinde içerikleri teslim edecektir. Gecikme halinde 2 iş günü ek süre tanınır. Toplamda 7 iş günü içinde içerik teslim edilmezse gönderilen ürünün perakende satış bedeli influencer'dan tahsil edilir.
          </li>
          <li>
            <strong>İçerik Teknik Gereksinimleri:</strong> Minimum 30 saniye süre, minimum 1080p çekim kalitesi, dikey format (9:16). Videoda marka adı, logo veya herhangi bir marka etiketi görünmeyecektir. İçerik doğal ve organik bir kullanıcı deneyimi şeklinde çekilecektir (UGC formatı). Ürün videoda net bir şekilde kullanılacak ve gösterilecektir. Influencer ürünü gerçekten kullanarak samimi bir deneyim videosu çekecektir.
          </li>
          <li>
            <strong>Onay Süreci:</strong> İçerik yayınlanmadan önce markaya onay için gönderilecektir. Marka 2 iş günü içinde onay veya revizyon talep edecektir. Marka en fazla 2 revizyon talep edebilir.
          </li>
          <li>
            <strong>İçerik Paylaşımı:</strong> Influencer, içeriği kendi sosyal medya profilinde paylaşabilir ancak bu zorunlu değildir. Paylaşması halinde içerik minimum 60 gün boyunca profilinde yayında kalacaktır. Bu süre dolmadan silinmesi halinde ürün bedeli talep edilir.
          </li>
          <li>
            <strong>Kargo ve Ürün Teslimi:</strong> Kargo ücreti marka tarafından karşılanır. Ürün hasarlı gelirse influencer 48 saat içinde markaya bildirir. Sözleşme ihlali halinde ürün iade edilir.
          </li>
        </ol>
      </section>

      {/* 9. Tarafların İmzaları */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base font-bold text-gray-900">9. Tarafların İmzaları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">MARKA İMZASI</p>
            <div className="h-16 flex items-center justify-center border-b border-purple-200 text-purple-700 italic font-serif text-lg">
              İlay Home Yetkilisi ✓
            </div>
            <div className="text-xs space-y-1 text-purple-900 pt-1">
              <p><strong>Ad Soyad:</strong> İlay Home Yönetimi</p>
              <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">INFLUENCER İMZASI</p>
            <div className="h-16 flex items-center justify-center border-b border-emerald-200 text-emerald-700 text-xs italic">
              (Aşağıdaki alandan imzalanacaktır)
            </div>
            <div className="text-xs space-y-1 text-emerald-900 pt-1">
              <p><strong>Ad Soyad:</strong> {contract.influencer_name}</p>
              <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>
      </section>

      {contract.notes && (
        <section className="space-y-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h2 className="text-sm font-bold text-amber-900">Özel Notlar</h2>
          <p className="text-amber-800 text-xs sm:text-sm">{contract.notes}</p>
        </section>
      )}
    </div>
  );
}
