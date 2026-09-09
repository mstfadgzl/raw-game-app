# İlk performans paketi: doğrulama

Bu dosya cihazda ölçülmüş hız artışı raporu değildir. Servis testleri ağ çağrısı
sayısını doğrular; gerçek ekran açılışı ve animasyon akıcılığı ayrıca ölçülmelidir.

## Otomatik kontroller

`node --test scripts/performance-regression.cjs`

Profil servisleri önceden her çağrıda ağ isteği gönderiyordu. Artık aynı profilin
eşzamanlı veya beş dakika içindeki tekrar çağrıları tek isteği paylaşır. Profil
türü ve kimliği birbirinden ayrıdır. Oyunlar ve profiller toplam en fazla 80
yanıt saklar. Hatalı yanıt saklanmaz; kullanıcı yenilemesi önbelleği atlar.

## Geliştirme sırasında veri bekleme süresi

- `[API network]`: ağdan okuma; yanında geçen milisaniye bulunur. Başarısız
  isteklerde de geçen süre yazılır, dolayısıyla bu satır başarı kanıtı değildir.
- `[API cache]`: geçerli önbellek kullanılmıştır, yeni ağ isteği yoktur.
- `[API shared]`: aynı adrese devam eden istek paylaşılmıştır.

Bu kayıtlar ortak önbelleği kullanan servislerle sınırlıdır; görsel yükleme,
çeviri ve henüz önbelleğe alınmayan keşif listelerini ölçmez. Yalnızca geliştirme
sürümünde yazılır; anahtar ve arama sorguları yazdırılmaz.

## Telefon karşılaştırması

1. Aynı telefonda ve aynı ağda eski/yeni sürümü karşılaştır.
2. İlk açılış için uygulama işlemini kapatıp yeniden aç; bu yalnızca uygulama
   belleğindeki veri önbelleğini sıfırlar, sistem görsel önbelleğini sıfırlamaz.
3. Aynı yaratıcı ve stüdyo profiline gir; geri dönüp beş dakika içinde tekrar aç.
4. İlk açılış ve tekrar açılışı ayrı kaydet. Her senaryoyu beş kez tekrarla;
   ortanca süreyi karşılaştır. Düğmeye dokunmadan bilginin görünmesine kadar
   geçen süreyi ekran kaydı üzerinden değerlendir.
5. Arama ve Keşfet sekmelerinde farklı yaratıcılar açıp geri dön. İlk profil
   diğerinin verisiyle değişmemeli ve hata ekranına düşmemeli.
6. Platform, tür ve etiket listelerini aşağı çekerek yenile. Beş dakikalık süre
   dolmasa bile yeni ağ isteği oluşmalı. Bağlantı yokken hata/tekrar dene akışını kontrol et.
7. Liste yüklenirken başka sekmeye geçip geri dön; yükleme animasyonları liste
   satırlarını bloke etmemeli. Son karşılaştırmayı aynı ayarlardaki release
   derlemelerinde yap; debug ve release sürelerini birbiriyle kıyaslama.

Gerçek cihaz süreleri henüz kaydedilmedi. Bu paketten sayısal bir FPS veya
yüzdelik hız artışı sonucu çıkarılmamalıdır.

## Sayfalama ve bağlantı kontrolü

- Oyun aramasında geniş sonuç veren bir kelime yazıp aşağı kaydır. İkinci ve
  sonraki sayfalar eklenmeli, aynı oyun iki kart halinde görünmemeli.
- Liste yüklenirken aramayı değiştir. Önceki aramanın oyunları yeni listeye
  karışmamalı; yeni arama listenin başından açılmalı.
- Çok oyunda yer alan bir yaratıcıyı açıp oyunlarının sonuna kaydır.
  Sonraki sayfa yüklenmeli. İnternet kesildiğinde mevcut kartlar kalmalı;
  bağlantıyı geri açıp tekrar denediğinde eksik sayfadan devam etmeli.
- Hem Arama hem Kitaplık üzerinden bir oyun aç, Hakkında bölümündeki etikete
  dokun. Etiket listesi açılmalı; geri tuşu önceki oyun ekranına dönmeli.

## Alt menü ve detay görünümü

- Dört alt sekmeye sırayla dokun. Seçili simgenin zemini kısa bir geçişle
  görünmeli; sekme adı ve seçili durumu ekran okuyucuda anlaşılır olmalı.
- Telefonun hareketi azalt/animasyonları kaldır ayarını aç. Menü simgeleri
  animasyonsuz seçilmeli. Arama klavyesi açıldığında alt menü gizlenmeli.
- Küçük ekranda ve büyük yazı ayarında simge ve yazıları kontrol et; alt
  menü sistemin hareket çubuğuna taşmamalı.
- Oyun detayında oyuncu puanı /5 olarak, Metacritic ayrı gösterilmeli.
  Çıkış tarihi ve platformlar Hakkında kartlarında görünmeli. Puanı veya
  tarihi olmayan oyunlarda uydurma değer gösterilmemeli.
- Medya sekmesinden fragmanı açıp tam ekran ve geri dönüşü kontrol et.
  Bu pakette video oynatıcısının kodu değiştirilmedi.
