export type Language = 'en' | 'tr';

export type TranslationKey =
    | 'home'
    | 'discover'
    | 'search'
    | 'library'
    | 'settings'
    | 'settingsTitle'
    | 'appearance'
    | 'appearanceDescription'
    | 'darkMode'
    | 'lightMode'
    | 'language'
    | 'languageDescription'
    | 'english'
    | 'turkish'
    | 'account'
    | 'apiKeySession'
    | 'apiKeySessionDescription'
    | 'logout'
    | 'logoutDescription'
    | 'logoutConfirmTitle'
    | 'logoutConfirmMessage'
    | 'cancel'
    | 'confirmLogout'
    | 'about'
    | 'rawgAttribution'
    | 'version';

const dictionary: Record<Language, Record<TranslationKey, string>> = {
    en: {
        home: 'Home',
        discover: 'Discover',
        search: 'Search',
        library: 'Library',
        settings: 'Settings',
        settingsTitle: 'Settings',
        appearance: 'Appearance',
        appearanceDescription: 'Choose how the app looks.',
        darkMode: 'Dark',
        lightMode: 'Light',
        language: 'Language',
        languageDescription: 'Choose the language used across the app.',
        english: 'English',
        turkish: 'Türkçe',
        account: 'Account',
        apiKeySession: 'RAWG API session',
        apiKeySessionDescription: 'Your key is stored only on this device.',
        logout: 'Log out',
        logoutDescription: 'Return to the API key screen.',
        logoutConfirmTitle: 'Log out?',
        logoutConfirmMessage: 'You can enter your API key again whenever you want.',
        cancel: 'Cancel',
        confirmLogout: 'Log out',
        about: 'About',
        rawgAttribution: 'Powered by RAWG',
        version: 'Version 1.0.0',
    },
    tr: {
        home: 'Ana Sayfa',
        discover: 'Keşfet',
        search: 'Ara',
        library: 'Kitaplık',
        settings: 'Ayarlar',
        settingsTitle: 'Ayarlar',
        appearance: 'Görünüm',
        appearanceDescription: 'Uygulamanın görünümünü seçin.',
        darkMode: 'Koyu',
        lightMode: 'Açık',
        language: 'Dil',
        languageDescription: 'Uygulamanın kullanacağı dili seçin.',
        english: 'English',
        turkish: 'Türkçe',
        account: 'Hesap',
        apiKeySession: 'RAWG API oturumu',
        apiKeySessionDescription: 'Anahtarınız yalnızca bu cihazda saklanır.',
        logout: 'Çıkış yap',
        logoutDescription: 'API key ekranına dönün.',
        logoutConfirmTitle: 'Çıkış yapılsın mı?',
        logoutConfirmMessage: 'İstediğiniz zaman API key’inizi yeniden girebilirsiniz.',
        cancel: 'Vazgeç',
        confirmLogout: 'Çıkış yap',
        about: 'Hakkında',
        rawgAttribution: 'RAWG ile güçlendirilmiştir',
        version: 'Sürüm 1.0.0',
    },
};

const uiTextTranslations: Record<string, string> = {
    'Kitaplığım': 'Library',
    'Oyun Kaydedildi': 'Games saved',
    'Ana Sayfa': 'Home',
    'Keşfet': 'Discover',
    'Ara': 'Search',
    'Kitaplık': 'Library',
    'Ayarlar': 'Settings',
    'Sonuç Bulunamadı': 'No results found',
    'Aradığınız kriterlere uygun oyun bulunamadı.': 'No games match your search.',
    'Hata Oluştu': 'Something went wrong',
    'Yeniden Dene': 'Try again',
    'Tekrar dene': 'Try again',
    'Geri dön': 'Go back',
    'Daha fazla oyun': 'Load more games',
    'Daha az göster': 'Show less',
    'Devamını oku': 'Read more',
    'Tamamını göster': 'Show all',
    'Oyunlar yüklenemedi.': 'Games could not be loaded.',
    'Bu kişi için oyun bulunamadı.': 'No games found for this person.',
    'Bu stüdyo için oyun bulunamadı.': 'No games found for this studio.',
    'Bu oyun için açıklama bulunmuyor.': 'No description is available for this game.',
    'Bu kişi için biyografi bulunmuyor.': 'No biography is available for this person.',
    'Bu stüdyo için henüz açıklama bulunmuyor.': 'No description is available for this studio yet.',
    'Bilgiler yenilenemedi. Önceki profil bilgileri gösteriliyor.': 'Information could not be refreshed. Showing the previous profile data.',
    'Bağlantını kontrol edip tekrar deneyebilirsin.': 'Check your connection and try again.',
    'Oyunları yüklemeyi tekrar dene': 'Try loading the games again',
    'Kaydırarak tüm oyunları keşfet.': 'Scroll to discover all games.',
    'Popüler': 'Popular',
    'En yüksek puan': 'Highest rated',
    'Yayıncı': 'Publisher',
    'Yayıncılar': 'Publishers',
    'Yayınladığı oyunlar': 'Published games',
    'Geliştirici': 'Developer',
    'Geliştiriciler': 'Developers',
    'Geliştirdiği oyunlar': 'Developed games',
    'GELİŞTİRİCİ': 'DEVELOPER',
    'GELİŞTİRİCİ STÜDYO': 'DEVELOPER STUDIO',
    'YAYINCI': 'PUBLISHER',
    'YARATICILAR': 'CREATORS',
    'Yaratıcılar': 'Creators',
    'ÇIKIŞ TARİHİ': 'RELEASE DATE',
    'PLATFORMLAR': 'PLATFORMS',
    'ORTALAMA SÜRE': 'AVERAGE PLAYTIME',
    'YAŞ DERECELENDİRMESİ': 'AGE RATING',
    'Platformlar': 'Platforms',
    'Bu alanda gösterilecek bilgi yok.': 'There is no information to show here.',
    'Oyun hakkında': 'About the game',
    'Reddit Tartışmaları': 'Reddit discussions',
    'Ekran görüntüleri': 'Screenshots',
    'Fragman': 'Trailer',
    'Mağazalar': 'Stores',
    'Satın alma seçenekleri': 'Purchase options',
    'Tüm mağazaları gör': 'See all stores',
    'Mağaza seçerek oyunun ürün sayfasını aç.': 'Choose a store to open the product page.',
    'Mağazalar yükleniyor…': 'Loading stores…',
    'Mağaza bağlantıları yüklenemedi.': 'Store links could not be loaded.',
    'Ürün sayfasına git': 'Open product page',
    'Ürün bağlantısı bulunmuyor': 'No product link available',
    'Bu oyun için mağaza bilgisi bulunamadı.': 'No store information is available for this game.',
    'Mağaza bilgileri RAWG tarafından sağlanır. Bölgeye göre satış durumu değişebilir.': 'Store information is provided by RAWG. Availability may vary by region.',
    'Çıkış': 'Release',
    'İndirme': 'Downloads',
    'Görsel bulunmuyor': 'No image available',
    'Henüz puanlanmadı': 'Not rated yet',
    'Açıklanmadı': 'Not announced',
    'Veri yok': 'No data',
    'Belirtilmemiş': 'Not specified',
    'Henüz açıklanmadı': 'Not announced yet',
    'Derecelendirilmemiş': 'Not rated',
    'saat': 'hours',
    'kişi': 'people',
    'Son 7 gün': 'Last 7 days',
    'Son 30 gün': 'Last 30 days',
    'Bu yıl': 'This year',
    'Yakında': 'Coming soon',
    'TÜMÜNÜ GÖR': 'SEE ALL',
    'RAWG ile güçlendirildi': 'Powered by RAWG',
    'Keşfet · Kaydet · Oyna': 'Discover · Save · Play',
    'Oyunları ve geliştirici bilgilerini gösterebilmek için kendi RAWG API key’inizi kullanmalısınız.': 'Use your own RAWG API key to access game and developer information.',
    'RAWG hesabınıza giriş yapıp ücretsiz API key’inizi alabilirsiniz.': 'Sign in to RAWG and get your free API key.',
    'API key’iniz yok mu?': 'Do not have an API key?',
    'Key’i doğrula ve devam et': 'Validate key and continue',
    'Göster': 'Show',
    'Gizle': 'Hide',
};

export const translateKey = (language: Language, key: TranslationKey) =>
    dictionary[language][key];

export const localizeUiText = (language: Language, text: string) => {
    if (language === 'tr') return text;

    const exact = uiTextTranslations[text.trim()];
    if (exact) {
        return text === text.trim() ? exact : text.replace(text.trim(), exact);
    }

    return text
        .replace(/(\d+) Oyun Kaydedildi/g, '$1 games saved')
        .replace(/(\d+) kişi/g, '$1 people')
        .replace(/(\d+) saat/g, '$1 hours');
};
