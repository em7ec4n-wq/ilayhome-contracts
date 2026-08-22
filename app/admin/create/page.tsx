"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateContractPage() {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);

  const [formData, setFormData] = useState({
    influencer_name: "",
    product_detail: "",
    product_value: "",
    content_count: 1,
    content_type: "UGC Video",
    platform: "Instagram Reels",
    notes: ""
  });

  useEffect(() => {
    const password = sessionStorage.getItem("admin_pwd");
    if (!password) {
      router.push("/");
    } else {
      setPwd(password);
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        product_value: Number(formData.product_value),
        content_count: Number(formData.content_count)
      };

      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pwd}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessData({ id: data.id || data.contract?.id });
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (err) {
      alert("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/contract/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link kopyalandı!");
  };

  const shareOnWhatsApp = (id: string) => {
    const url = `${window.location.origin}/contract/${id}`;
    const text = `Merhaba! 🙏 İlay Home olarak seninle çalışmak istiyoruz. Barter sözleşmemizi aşağıdaki linkten onaylayabilirsin: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!pwd) return null;

  if (successData) {
    const contractUrl = `${window.location.origin}/contract/${successData.id}`;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sözleşme Oluşturuldu!</h2>
          <p className="text-gray-500 mb-6">Link başarıyla oluşturuldu. Influencer ile hemen paylaşabilirsiniz.</p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm break-all text-left text-gray-700 border border-gray-200">
            {contractUrl}
          </div>

          <div className="space-y-3 flex flex-col">
            <button onClick={() => copyLink(successData.id)} className="btn-secondary w-full py-3">
              Linki Kopyala
            </button>
            <button onClick={() => shareOnWhatsApp(successData.id)} className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-full py-3 rounded-lg font-medium transition-colors">
              WhatsApp ile Paylaş
            </button>
            <button onClick={() => {
              setSuccessData(null);
              setFormData({ ...formData, influencer_name: "", product_detail: "", product_value: "", notes: "" });
            }} className="btn-primary w-full py-3">
              Yeni Sözleşme Oluştur
            </button>
            <Link href="/admin" className="text-brand-600 text-sm mt-4 inline-block font-medium hover:underline">
              Dashboard'a Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12">
      <header className="max-w-2xl mx-auto mb-6 pt-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-500 hover:text-gray-800 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100">
          &larr;
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Yeni Sözleşme</h1>
      </header>

      <main className="max-w-2xl mx-auto card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Influencer Adı</label>
            <input 
              required 
              type="text" 
              className="input-field w-full" 
              placeholder="Örn: Ayşe Yılmaz"
              value={formData.influencer_name} 
              onChange={e => setFormData({...formData, influencer_name: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Detayı</label>
            <input 
              required 
              type="text" 
              className="input-field w-full" 
              placeholder="Örn: 2'li Bambu Banyo Seti" 
              value={formData.product_detail} 
              onChange={e => setFormData({...formData, product_detail: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Değeri (TL)</label>
            <input 
              required 
              type="number" 
              min="0" 
              className="input-field w-full" 
              placeholder="Örn: 1500"
              value={formData.product_value} 
              onChange={e => setFormData({...formData, product_value: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik Sayısı</label>
              <input 
                required 
                type="number" 
                min="1" 
                className="input-field w-full" 
                value={formData.content_count} 
                onChange={e => setFormData({...formData, content_count: parseInt(e.target.value)})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik Türü</label>
              <select 
                className="input-field w-full bg-white" 
                value={formData.content_type} 
                onChange={e => setFormData({...formData, content_type: e.target.value})}
              >
                <option value="UGC Video">UGC Video</option>
                <option value="Ürün Tanıtım">Ürün Tanıtım</option>
                <option value="Unboxing">Unboxing</option>
                <option value="Deneyim/Review">Deneyim/Review</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select 
              className="input-field w-full bg-white" 
              value={formData.platform} 
              onChange={e => setFormData({...formData, platform: e.target.value})}
            >
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Hepsi">Hepsi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar (İsteğe Bağlı)</label>
            <textarea 
              className="input-field w-full h-24 resize-none" 
              placeholder="Sözleşmeye eklenecek özel şartlar veya notlar..."
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-4 mt-6 text-lg"
          >
            {loading ? "Oluşturuluyor..." : "Sözleşme Oluştur"}
          </button>
        </form>
      </main>
    </div>
  );
}
