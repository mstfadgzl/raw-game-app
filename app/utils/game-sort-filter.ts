import type {
    GameFilterQuery,
    GameFilterValue,
} from '@types';

export const MIN_FILTER_YEAR = 1950;
export const MAX_FILTER_YEAR = 2100;

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const resolveDateRange = (
    value: GameFilterValue,
    now: Date,
): { start: string; end: string } | null => {
    const isDateOrdering =
        value.ordering === 'released' ||
        value.ordering === '-released';

    const needsDateRange =
        value.releaseStatus !== 'all' ||
        value.startYear !== null ||
        value.endYear !== null ||
        isDateOrdering;

    if (!needsDateRange) {
        return null;
    }

    let start = `${value.startYear ?? MIN_FILTER_YEAR}-01-01`;
    let end = `${value.endYear ?? MAX_FILTER_YEAR}-12-31`;

    const today = formatDate(now);

    if (value.releaseStatus === 'released') {
        // Kullanıcı bitiş yılına gelecek bir yıl yazsa da
        // "Çıkmış oyunlar" için bugünden sonrası dahil edilmez.
        if (end > today) {
            end = today;
        }
    }

    if (value.releaseStatus === 'upcoming') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowString = formatDate(tomorrow);

        if (start < tomorrowString) {
            start = tomorrowString;
        }
    }

    return { start, end };
};

export const validateGameFilters = (
    value: GameFilterValue,
    now: Date = new Date(),
): string | null => {
    for (const year of [value.startYear, value.endYear]) {
        if (
            year !== null &&
            (
                !Number.isInteger(year) ||
                year < MIN_FILTER_YEAR ||
                year > MAX_FILTER_YEAR
            )
        ) {
            return `Yıl ${MIN_FILTER_YEAR}–${MAX_FILTER_YEAR} arasında olmalı.`;
        }
    }

    if (
        value.startYear !== null &&
        value.endYear !== null &&
        value.startYear > value.endYear
    ) {
        return 'Başlangıç yılı, bitiş yılından büyük olamaz.';
    }

    if (
        value.minMetacritic !== null &&
        (
            !Number.isInteger(value.minMetacritic) ||
            value.minMetacritic < 0 ||
            value.minMetacritic > 100
        )
    ) {
        return 'Metacritic puanı 0–100 arasında olmalı.';
    }

    const range = resolveDateRange(value, now);

    if (range && range.start > range.end) {
        return 'Yıl aralığı, seçtiğin çıkış durumuyla uyuşmuyor.';
    }

    return null;
};

export const buildGameFilterQuery = (
    value: GameFilterValue,
    now: Date = new Date(),
): GameFilterQuery => {
    const error = validateGameFilters(value, now);

    if (error) {
        throw new Error(error);
    }

    const query: GameFilterQuery = {
        ordering: value.ordering,
    };

    const range = resolveDateRange(value, now);

    if (range) {
        query.dates = `${range.start},${range.end}`;
    }

    if (value.minMetacritic !== null) {
        query.metacritic = `${value.minMetacritic},100`;
    }

    return query;
};