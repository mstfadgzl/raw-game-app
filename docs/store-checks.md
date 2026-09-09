# Mağaza seçenekleri

Hakkında bölümünün üstündeki Satın alma seçenekleri kartı tüm mağazaları
açan bir liste gösterir. Mağaza bağlantıları yalnızca liste açıldığında
istenir; ortak beş dakikalık önbelleği kullanır. Logolar yerel PNG'dir.

`/games/{id}/stores` tüm sayfalarıyla okunur. `/stores` dizini isim ve slug
eşleştirmesinde kullanılır. Dizin yüklenemediğinde oyun detayındaki isimler
korunur. Linkler store_id üzerinden eşleştirilir, aynı link tekrarlanmaz.
Ürün bağlantısı olmayan mağazalar pasif gösterilir. Fiyat veya stok bilgisi
bu uçtan gelmediğinden fiyat/indirim bilgisi gösterilmez.

9 Eylül 2026 canlı kontrolü: `/stores` 10 mağaza döndürdü. GTA V (3498)
mağaza ucu 5 ürün bağlantısıyla 200 yanıtı verdi: Steam, PlayStation,
Epic Games, Xbox 360 ve Xbox. Bu, mağazaların güncel satış durumunu veya
eski mağaza adreslerinin hâlâ çalıştığını garanti etmez.

## Telefonda kontrol

1. GTA V → Hakkında → Satın alma seçenekleri: tüm beş mağaza görünmeli.
2. Her logoya/satıra dokun: mağaza ana sayfası yerine API'nin ürün adresi açılmalı.
3. Geri tuşuyla uygulamaya dön; mağaza listesi yerinde kalmalı. Listeyi geri
   tuşu, kapat düğmesi veya dış zemine dokunarak kapatabilmelisin.
4. Liste uzunsa aşağı kaydır. Küçük ekran/büyük yazı ayarında son satır ve
   kapatma düğmesi erişilebilir olmalı; sistem tuşlarının altına taşmamalı.
5. Önbellekte olmayan oyunda interneti kesip listeyi aç; hata ve tekrar dene
   görünmeli. İnterneti açıp yeniden dene.
6. Oyun değiştiğinde önceki oyunun mağazaları görünmemeli. Mağazası olmayan
   oyunda boş durum, bağlantısı eksik mağazada açıklama görünmeli.

Bağlantılar React Native Linking ile işletim sistemine teslim edilir.
Kurulu mağaza uygulaması ürün URL'sini destekliyorsa ve sistemin bağlantı
ayarları izin veriyorsa uygulama açılır; diğer durumlarda tarayıcı açılır.
Her mağaza için desteklenmeyen özel URL şemaları tahmin edilmez.

Kaynaklar:
- https://api.rawg.io/docs/#operation/games_stores_list
- https://developer.android.com/training/app-links/create-deeplinks
- Logo kaynakları: app/assets/stores/README.md

Otomatik kontroller sayfalama, önbellek, tekrar deneme, mağaza eşleştirmesi,
eksik ürün adresi ve geçersiz URL reddini kapsar. Telefon üzerindeki uygulama
yönlendirmesi ve görsel kontrol henüz yapılmadı.
