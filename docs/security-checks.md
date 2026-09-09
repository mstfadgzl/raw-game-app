# Proxy güvenlik kontrolü

`server/src/upstream-url.js` istemci yolunu yapılandırılmış `RAWG_BASE_URL`
ile sınırlar. `/api/games` gibi göreli yollar kabul edilir; dış host, `..`,
URL kodlu `%2e`, ters bölü ve boş yol reddedilir. Gelen sorgudaki `key`
parametresi silinip server anahtarı eklenir.

RAWG’nin JSON yanıtı istemciye döndürülmeden önce iç içe URL değerlerinden
`key` parametresi çıkarılır. Böylece RAWG’nin sayfalama bağlantıları mobil
uygulamaya API anahtarını taşımaz.

Kontrol:

```text
node --test server/test/proxy-security.mjs
```

Bu kontrol üç senaryoyu kapsar: güvenli yol ve anahtar değişimi, dış host/yol
geçişi reddi, iç içe sayfalama URL’lerinden anahtar temizleme.
