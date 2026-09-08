import React, { memo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';


import {
    DEFAULT_GAME_FILTERS,
    RELEASE_OPTIONS,
    SCORE_OPTIONS,
    SORT_OPTIONS
} from '@types';

import type { GameFilterValue } from '@types';

import { validateGameFilters } from '@utils';
import { styles } from './styles';

interface GameSortFilterProps {
    value: GameFilterValue;
    onChange: (value: GameFilterValue) => void;
    disabled?: boolean;
}

interface ChoiceProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const Choice = ({
    label,
    selected,
    onPress,
}: ChoiceProps) => (
    <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [
            styles.choice,
            selected ? styles.choiceSelected : {},
            pressed ? styles.pressed : {},
        ]}
    >
        <Text
            style={[
                styles.choiceText,
                selected ? styles.choiceTextSelected : {},
            ]}
        >
            {label}
        </Text>
    </Pressable>
);

export const GameSortFilter = memo(
    ({
        value,
        onChange,
        disabled = false,
    }: GameSortFilterProps) => {
        const [visible, setVisible] = useState(false);
        const [draft, setDraft] = useState<GameFilterValue>(value);

        // Input alanlarında sayıya çevirmeden önce metin tutulur.
        const [startYearText, setStartYearText] = useState('');
        const [endYearText, setEndYearText] = useState('');
        const [error, setError] = useState<string | null>(null);

        const selectedSort = SORT_OPTIONS.find(
            option => option.value === value.ordering,
        );

        // Bu sayı oyun sayısı değil, etkin filtre grubu sayısıdır.
        const activeFilterCount =
            Number(
                value.releaseStatus !==
                DEFAULT_GAME_FILTERS.releaseStatus,
            ) +
            Number(
                value.startYear !== null ||
                value.endYear !== null,
            ) +
            Number(value.minMetacritic !== null);

        const openPanel = () => {
            setDraft({ ...value });
            setStartYearText(
                value.startYear === null
                    ? ''
                    : String(value.startYear),
            );
            setEndYearText(
                value.endYear === null
                    ? ''
                    : String(value.endYear),
            );
            setError(null);
            setVisible(true);
        };

        const closePanel = () => {
            setVisible(false);
        };

        const updateDraft = (
            changes: Partial<GameFilterValue>,
        ) => {
            setDraft(previous => ({
                ...previous,
                ...changes,
            }));
            setError(null);
        };

        const resetDraft = () => {
            setDraft({ ...DEFAULT_GAME_FILTERS });
            setStartYearText('');
            setEndYearText('');
            setError(null);
        };

        const applyFilters = () => {
            const startText = startYearText.trim();
            const endText = endYearText.trim();

            if (
                (startText !== '' && !/^\d{4}$/.test(startText)) ||
                (endText !== '' && !/^\d{4}$/.test(endText))
            ) {
                setError(
                    'Yılları dört haneli yaz veya alanı boş bırak.',
                );
                return;
            }

            const nextValue: GameFilterValue = {
                ...draft,
                startYear:
                    startText === '' ? null : Number(startText),
                endYear:
                    endText === '' ? null : Number(endText),
            };

            const validationError =
                validateGameFilters(nextValue);

            if (validationError) {
                setError(validationError);
                return;
            }

            const changed =
                nextValue.ordering !== value.ordering ||
                nextValue.releaseStatus !== value.releaseStatus ||
                nextValue.startYear !== value.startYear ||
                nextValue.endYear !== value.endYear ||
                nextValue.minMetacritic !== value.minMetacritic;

            setVisible(false);

            // Aynı seçim için gereksiz API isteği başlatma.
            if (changed) {
                onChange(nextValue);
            }
        };

        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <Pressable
                        onPress={openPanel}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityLabel={
                            `Sıralama: ${selectedSort?.label ?? 'Seç'}. ` +
                            'Sıralama ve filtre panelini aç'
                        }
                        accessibilityState={{ disabled }}
                        style={({ pressed }) => [
                            styles.sortButton,
                            disabled ? styles.disabled : {},
                            pressed ? styles.pressed : {},
                        ]}
                    >
                        <Text
                            style={styles.sortButtonText}
                            numberOfLines={1}
                        >
                            {selectedSort?.label ?? 'Sırala'}
                        </Text>

                        <Text style={styles.chevron}>⌄</Text>
                    </Pressable>

                    <Pressable
                        onPress={openPanel}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityLabel={
                            `Filtrele. ${activeFilterCount} ek filtre etkin`
                        }
                        accessibilityState={{ disabled }}
                        style={({ pressed }) => [
                            styles.filterButton,
                            activeFilterCount > 0
                                ? styles.filterButtonActive
                                : {},
                            disabled ? styles.disabled : {},
                            pressed ? styles.pressed : {},
                        ]}
                    >
                        <Text style={styles.filterButtonText}>
                            Filtrele
                        </Text>

                        {activeFilterCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {activeFilterCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>

                <Modal
                    visible={visible}
                    transparent
                    animationType="fade"
                    onRequestClose={closePanel}
                    supportedOrientations={[
                        'portrait',
                        'landscape',
                    ]}
                >
                    <KeyboardAvoidingView
                        style={styles.modalRoot}
                        behavior={
                            Platform.OS === 'ios'
                                ? 'padding'
                                : undefined
                        }
                    >
                        <Pressable
                            style={styles.backdrop}
                            onPress={closePanel}
                            accessible={false}
                        />

                        <View
                            style={styles.panel}
                            accessibilityViewIsModal
                        >
                            <View style={styles.panelHeader}>
                                <Text
                                    style={styles.panelTitle}
                                    accessibilityRole="header"
                                >
                                    Sırala ve filtrele
                                </Text>

                                <Pressable
                                    onPress={closePanel}
                                    accessibilityRole="button"
                                    accessibilityLabel="Paneli kapat"
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeText}>
                                        ×
                                    </Text>
                                </Pressable>
                            </View>

                            <ScrollView
                                style={styles.panelScroll}
                                contentContainerStyle={
                                    styles.panelContent
                                }
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <Text style={styles.sectionTitle}>
                                    Sıralama
                                </Text>

                                <View style={styles.choices}>
                                    {SORT_OPTIONS.map(option => (
                                        <Choice
                                            key={option.value}
                                            label={option.label}
                                            selected={
                                                draft.ordering ===
                                                option.value
                                            }
                                            onPress={() =>
                                                updateDraft({
                                                    ordering: option.value,
                                                })
                                            }
                                        />
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>
                                    Çıkış durumu
                                </Text>

                                <View style={styles.choices}>
                                    {RELEASE_OPTIONS.map(option => (
                                        <Choice
                                            key={option.value}
                                            label={option.label}
                                            selected={
                                                draft.releaseStatus ===
                                                option.value
                                            }
                                            onPress={() =>
                                                updateDraft({
                                                    releaseStatus:
                                                        option.value,
                                                })
                                            }
                                        />
                                    ))}
                                </View>

                                <Text style={styles.sectionTitle}>
                                    Çıkış yılı
                                </Text>

                                <View style={styles.yearRow}>
                                    <View style={styles.yearField}>
                                        <Text style={styles.inputLabel}>
                                            Başlangıç
                                        </Text>

                                        <TextInput
                                            value={startYearText}
                                            onChangeText={text => {
                                                setStartYearText(text);
                                                setError(null);
                                            }}
                                            placeholder="Örn. 2015"
                                            placeholderTextColor="#87909F"
                                            keyboardType="number-pad"
                                            maxLength={4}
                                            style={styles.input}
                                            accessibilityLabel="Başlangıç yılı"
                                        />
                                    </View>

                                    <View style={styles.yearField}>
                                        <Text style={styles.inputLabel}>
                                            Bitiş
                                        </Text>

                                        <TextInput
                                            value={endYearText}
                                            onChangeText={text => {
                                                setEndYearText(text);
                                                setError(null);
                                            }}
                                            placeholder="Örn. 2025"
                                            placeholderTextColor="#87909F"
                                            keyboardType="number-pad"
                                            maxLength={4}
                                            style={styles.input}
                                            accessibilityLabel="Bitiş yılı"
                                        />
                                    </View>
                                </View>

                                <Text style={styles.hint}>
                                    Boş bıraktığın alan yıl sınırı koymaz.
                                    Çıkmış oyunlarda üst sınır bugündür.
                                </Text>

                                <Text style={styles.sectionTitle}>
                                    Minimum Metacritic
                                </Text>

                                <View style={styles.choices}>
                                    {SCORE_OPTIONS.map(option => (
                                        <Choice
                                            key={String(option.value)}
                                            label={option.label}
                                            selected={
                                                draft.minMetacritic ===
                                                option.value
                                            }
                                            onPress={() =>
                                                updateDraft({
                                                    minMetacritic:
                                                        option.value,
                                                })
                                            }
                                        />
                                    ))}
                                </View>

                                <Text style={styles.hint}>
                                    Puan sınırı seçildiğinde Metacritic
                                    puanı olmayan oyunlar da elenir.
                                </Text>

                                {error !== null && (
                                    <Text
                                        style={styles.error}
                                        accessibilityRole="alert"
                                        accessibilityLiveRegion="polite"
                                    >
                                        {error}
                                    </Text>
                                )}

                                <Pressable
                                    onPress={resetDraft}
                                    accessibilityRole="button"
                                    style={styles.resetButton}
                                >
                                    <Text style={styles.resetText}>
                                        Varsayılanlara dön
                                    </Text>
                                </Pressable>
                            </ScrollView>

                            <View style={styles.footer}>
                                <Pressable
                                    onPress={closePanel}
                                    accessibilityRole="button"
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelText}>
                                        Vazgeç
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={applyFilters}
                                    accessibilityRole="button"
                                    style={styles.applyButton}
                                >
                                    <Text style={styles.applyText}>
                                        Uygula
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        );
    },
);

GameSortFilter.displayName = 'GameSortFilter';

export { DEFAULT_GAME_FILTERS } from '@types';
export type {
    GameFilterValue,
    GameFilterQuery,
    GameOrdering,
    ReleaseStatus,
} from '@types';
export { buildGameFilterQuery } from '@utils';