# Açılış ekranı

Uygulama açılırken `SplashScreen` navigasyon ağacının üzerinde gösterilir.
Redux kalıcılık verileri hazır olmadan kapanmaz; bu sayede kısa açılışlarda
boş ekran görünmez. Yaklaşık 1,25 saniye sonra yumuşakça kapanır ve kullanıcı
ekrana dokunarak geçebilir.

İşareti oluşturan `AppMark` dışa bağımlılığı olmayan React Native şekillerinden
oluşur. Daha sonra PNG veya SVG marka dosyası eklenirse yalnızca bu bileşenin
içi değiştirilebilir. ImageGen görseli bu aşamada kullanım kotası nedeniyle
üretilemedi; uygulama işareti bu yüzden kod tabanlı tutuldu.

Kontrol:

- Uygulamayı soğuk başlat. Koyu arka plan, oyun/pusula işareti ve metin
  görünmeli; içerik hazır olmadan splash kapanmamalı.
- Ekrana dokun. Splash kapanıp son açık sekme görünmeli.
- Sistem erişilebilirlik ayarlarında hareketi azaltı aç. Splash gecikmeden
  veya çok kısa geçişle açılıp kapanmalı.
- Uygulamayı kapatıp yeniden aç. Favoriler gibi kalıcı veriler splash sonrası
  görünmeli; içerik ekranı sıfırdan yüklenmemeli.
