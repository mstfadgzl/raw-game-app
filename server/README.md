# RAWG API proxy

Bu küçük servis RAWG anahtarını mobil uygulamadan çıkarır. Mobil uygulama `/api/*` adreslerine istek gönderir; proxy anahtarı sunucu tarafında ekleyip isteği RAWG'ye iletir.

Proxy yalnızca göreli RAWG yollarını kabul eder. Mutlak host, yol geçişi ve
ters bölü içeren yollar reddedilir. İstemciden gelen `key` parametresi yok
sayılır; yalnızca server `.env` içindeki anahtar kullanılır. RAWG yanıtlarında
`next` veya `previous` içinde bulunan anahtarlar da mobil istemciye iletilmeden
temizlenir.

## İlk çalıştırma

1. `server/.env.example` dosyasını `server/.env` olarak kopyala.
2. `server/.env` içindeki `RAWG_API_KEY` değerini doldur.
3. Node.js 20 veya daha yeni bir sürümle çalıştır:

```text
npm run dev
```

Sağlık kontrolü:

```text
http://localhost:3000/health
```

RAWG isteği:

```text
http://localhost:3000/api/games?search=witcher&page=1
```

Android emülatöründe mobil uygulama için `10.0.2.2` kullanılabilir. USB/ADB ile bağlı debug cihazında bilgisayardaki portu cihaza yönlendirmek için:

```text
adb reverse tcp:3000 tcp:3000
```

Bu durumda mobil `.env` içindeki adres `http://127.0.0.1:3000/api/` olabilir. ADB tüneli kullanılmayacak fiziksel cihazlarda bilgisayarın aynı Wi-Fi ağındaki yerel IP adresini yazmalısın. Üretimde HTTP yerine HTTPS kullanılmalıdır.
