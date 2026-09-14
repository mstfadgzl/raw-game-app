import { localizeCatalogName, localizeUiText } from '../app/i18n';

describe('catalog localization', () => {
    it.each([
        ['Action', 'Aksiyon'],
        ['open-world', 'Açık Dünya'],
        ['ONLINE CO-OP', 'Çevrim İçi İş Birliği'],
        ['Strategy', 'Strateji'],
    ])('translates %s in Turkish', (name, expected) => {
        expect(localizeCatalogName('tr', name)).toBe(expected);
        expect(localizeCatalogName('en', name)).toBe(name);
    });

    it.each(['Ubisoft', 'The Witcher', 'Unknown RAWG tag'])('preserves %s', name => {
        expect(localizeCatalogName('tr', name)).toBe(name);
    });

    it('localizes screen labels without changing proper names', () => {
        expect(localizeUiText('en', 'Hakkında')).toBe('About');
        expect(localizeUiText('en', 'Ubisoft')).toBe('Ubisoft');
        expect(localizeUiText('tr', 'Hakkında')).toBe('Hakkında');
    });
});
