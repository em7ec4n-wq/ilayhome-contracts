import React from 'react';
import { Contract } from '@/lib/types';

interface ContractContentProps {
  contract: Pick<Contract, 'influencer_name' | 'product_detail' | 'product_value' | 'content_count' | 'content_type' | 'platform' | 'notes' | 'delivery_deadline'>;
}

export default function ContractContent({ contract }: ContractContentProps) {
  return (
    <div className="card p-6 md:p-8 space-y-6 text-sm text-gray-800">
      <div className="text-center space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">
          BARTER (TAKAS) SÖZLEŞMESİ
        </h1>
        <p className="text-gray-500">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">1. Taraflar</h2>
        <p><strong>Marka:</strong> İlay Home</p>
        <p><strong>Influencer:</strong> {contract.influencer_name}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">2. Barter Kapsamındaki Ürün</h2>
        <p>Marka, Influencer'a aşağıdaki ürünleri ücretsiz olarak temin edecektir:</p>
        <p><strong>Ürün Detayı:</strong> {contract.product_detail}</p>
        <p><strong>Ürün Değeri:</strong> {contract.product_value} TL</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">3. Üretilecek İçerik</h2>
        <p>Influencer, temin edilen ürün karşılığında aşağıdaki içerikleri üretecektir:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>İçerik Sayısı:</strong> {contract.content_count} adet</li>
          <li><strong>İçerik Türü:</strong> {contract.content_type}</li>
          <li><strong>Platform:</strong> {contract.platform}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">4. Reklam ve Tanıtım Kullanım Hakkı</h2>
        <p>
          Marka, Influencer tarafından üretilen içerikleri süresiz olarak tüm platformlarda (Meta, TikTok, Google/YouTube, web sitesi, tüm dijital ve basılı mecralar) kullanma hakkına sahiptir. Marka içerikleri düzenleyebilir, kırpabilir, metin veya müzik ekleyebilir. Influencer bu kullanımlara itiraz etmeyeceğini peşinen kabul ve taahhüt eder.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">5. Teslim Süresi ve Gecikme Yaptırımı</h2>
        <p>
          İçerikler, ürünün Influencer'a tesliminden itibaren en geç <strong>5 iş günü</strong> içinde markaya teslim edilmelidir. {contract.delivery_deadline && `(${new Date(contract.delivery_deadline).toLocaleDateString('tr-TR')})`} Ek 2 gün ek süre tanınabilir (toplam en fazla 7 gün). İçeriklerin süresinde teslim edilmemesi halinde ürünün perakende satış bedeli Influencer'dan tahsil edilecektir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">6. İçerik Teknik Gereksinimleri</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum 30 saniye uzunluk.</li>
          <li>Minimum 1080p çözünürlük.</li>
          <li>Dikey (9:16) formatta çekim.</li>
          <li>UGC (Kullanıcı Tarafından Oluşturulan İçerik) formatında, ürünün net bir şekilde gösterilmesi ve doğal bir şekilde kullanılması zorunludur.</li>
          <li>İçerikte rakip marka adı, logosu veya etiketi <strong>görünmemelidir</strong>.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">7. Onay Süreci</h2>
        <p>
          İçerikler yayınlanmadan önce onay için Markaya gönderilmelidir. Marka 2 iş günü içinde geri dönüş yapar. Marka en fazla 2 revizyon talep etme hakkına sahiptir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">8. İçerik Paylaşımı</h2>
        <p>
          Influencer içerikleri kendi profilinde paylaşabilir ancak zorunlu değildir. Paylaşım yapılması durumunda içerik en az 60 gün profilde kalmalıdır. Erken silinmesi durumunda ürün bedeli talep edilir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">9. Kargo ve Ürün Teslimi</h2>
        <p>
          Kargo masrafları Marka tarafından karşılanır. Ürünün hasarlı ulaşması halinde 48 saat içinde bildirilmelidir. Sözleşme ihlali durumunda ürün iade edilmelidir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">10. Rakip Kısıtlaması</h2>
        <p>
          Influencer, ürün teslim tarihinden itibaren 30 gün boyunca aynı kategorideki rakip markalarla iş birliği yapmamayı kabul eder.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">11. İstatistik Paylaşımı</h2>
        <p>
          Eğer Influencer içeriği profilinde paylaşırsa, paylaşımdan 7 gün sonra izlenme, beğeni ve kaydetme istatistiklerinin ekran görüntülerini Marka ile paylaşmalıdır. Paylaşım yapılmazsa bu zorunluluk aranmaz.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">12. Genel Hükümler</h2>
        <p>
          İşbu sözleşmeden doğacak uyuşmazlıklarda Türk Hukuku uygulanacak olup, İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>
      </section>

      {contract.notes && (
        <section className="space-y-2 mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
          <h2 className="text-base font-semibold text-brand-800">Özel Notlar</h2>
          <p className="text-brand-900">{contract.notes}</p>
        </section>
      )}
    </div>
  );
}
