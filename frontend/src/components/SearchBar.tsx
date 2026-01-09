'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CitySearchResult } from '@/lib/api';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onSelectCity: (city: CitySearchResult) => void;
    searchResults: CitySearchResult[];
    loading: boolean;
    onClear: () => void;
}

export function SearchBar({
    onSearch,
    onSelectCity,
    searchResults,
    loading,
    onClear,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const [hasSelected, setHasSelected] = useState(false); // Track if user selected a city
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search - only search if user hasn't just selected a city
    useEffect(() => {
        if (hasSelected) return; // Don't search after selection

        const timer = setTimeout(() => {
            if (query.length >= 2) {
                onSearch(query);
                setIsOpen(true);
            } else {
                onClear();
                setIsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, onSearch, onClear, hasSelected]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !inputRef.current?.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = useCallback(
        (city: CitySearchResult) => {
            setHasSelected(true); // Mark as selected
            setQuery(`${city.name}, ${city.country}`);
            setIsOpen(false);
            setFocusedIndex(-1);
            onClear(); // Clear search results
            onSelectCity(city);
            inputRef.current?.blur(); // Remove focus from input
        },
        [onSelectCity, onClear]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setHasSelected(false); // Allow searching again when user types
    };

    const handleFocus = () => {
        setIsFocused(true);
        // Only open dropdown if there are results AND user hasn't just selected
        if (searchResults.length > 0 && !hasSelected) {
            setIsOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || searchResults.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0) handleSelect(searchResults[focusedIndex]);
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Search for a city..."
                style={{
                    width: '100%',
                    padding: '12px 44px 12px 20px',
                    background: isFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isFocused ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '14px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                }}
            />

            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                {loading ? (
                    <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }} />
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                )}
            </div>

            {/* Dropdown - only show if open AND has results AND not just selected */}
            {isOpen && searchResults.length > 0 && !hasSelected && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        right: 0,
                        background: 'rgba(18,9,31,0.98)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
                        zIndex: 50,
                    }}
                >
                    {searchResults.slice(0, 5).map((city, index) => (
                        <button
                            key={city.id}
                            onClick={() => handleSelect(city)}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                textAlign: 'left',
                                color: 'white',
                                background: index === focusedIndex ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '14px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'rgba(139,92,246,0.7)' }}>📍</span>
                                <span style={{ fontWeight: 500 }}>{city.name}</span>
                                {city.admin1 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{city.admin1}</span>}
                            </div>
                            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{city.country}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {isOpen && query.length >= 2 && !loading && searchResults.length === 0 && !hasSelected && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'rgba(18,9,31,0.98)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '14px',
                }}>
                    No cities found
                </div>
            )}
        </div>
    );
}
