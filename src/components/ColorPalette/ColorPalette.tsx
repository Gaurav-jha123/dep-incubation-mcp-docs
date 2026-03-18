import { useSyncExternalStore } from 'react';

type ColorShade = {
    scale: string;
    cssVar: `--color-${string}`;
    fallback: string;
};

type ColorGroup = {
    name: string;
    description: string;
    shades: ColorShade[];
};

const paletteGroups: ColorGroup[] = [
    {
        name: 'Neutral',
        description: 'Neutral UI, layout, and support surfaces.',
        shades: [
            { scale: '50', cssVar: '--color-neutral-50', fallback: '#fafafc' },
            { scale: '200', cssVar: '--color-neutral-200', fallback: '#ebedf5' },
            { scale: '400', cssVar: '--color-neutral-400', fallback: '#ced0db' },
            { scale: '500', cssVar: '--color-neutral-500', fallback: '#acafbf' },
            { scale: '700', cssVar: '--color-neutral-700', fallback: '#474a59' },
            { scale: '900', cssVar: '--color-neutral-900', fallback: '#1d1e26' },
        ],
    },
    {
        name: 'Success',
        description: 'Positive status, confirmation, and completion states.',
        shades: [
            { scale: '50', cssVar: '--color-success-50', fallback: '#fcfff5' },
            { scale: '200', cssVar: '--color-success-200', fallback: '#ebf3d8' },
            { scale: '400', cssVar: '--color-success-400', fallback: '#c1e288' },
            { scale: '500', cssVar: '--color-success-500', fallback: '#67a300' },
            { scale: '700', cssVar: '--color-success-700', fallback: '#528500' },
            { scale: '900', cssVar: '--color-success-900', fallback: '#396f1f' },
        ],
    },
    {
        name: 'Warning',
        description: 'Cautionary messaging and pending attention states.',
        shades: [
            { scale: '50', cssVar: '--color-warning-50', fallback: '#fffcf5' },
            { scale: '200', cssVar: '--color-warning-200', fallback: '#ffedc9' },
            { scale: '400', cssVar: '--color-warning-400', fallback: '#ffd785' },
            { scale: '500', cssVar: '--color-warning-500', fallback: '#fcaa00' },
            { scale: '700', cssVar: '--color-warning-700', fallback: '#ff9000' },
            { scale: '900', cssVar: '--color-warning-900', fallback: '#bd5800' },
        ],
    },
    {
        name: 'Danger',
        description: 'Errors, destructive actions, and critical states.',
        shades: [
            { scale: '50', cssVar: '--color-danger-50', fallback: '#fef6f6' },
            { scale: '200', cssVar: '--color-danger-200', fallback: '#fde1e1' },
            { scale: '400', cssVar: '--color-danger-400', fallback: '#fbb6b6' },
            { scale: '500', cssVar: '--color-danger-500', fallback: '#ff4242' },
            { scale: '700', cssVar: '--color-danger-700', fallback: '#e22a2a' },
            { scale: '900', cssVar: '--color-danger-900', fallback: '#ad0000' },
        ],
    },
    {
        name: 'Primary',
        description: 'Brand and key action surfaces.',
        shades: [
            { scale: '50', cssVar: '--color-primary-50', fallback: '#f5fdff' },
            { scale: '200', cssVar: '--color-primary-200', fallback: '#e1f4fa' },
            { scale: '400', cssVar: '--color-primary-400', fallback: '#a0ddee' },
            { scale: '500', cssVar: '--color-primary-500', fallback: '#009ecc' },
            { scale: '700', cssVar: '--color-primary-700', fallback: '#0086ad' },
            { scale: '900', cssVar: '--color-primary-900', fallback: '#006b8a' },
        ],
    },
];

const fallbackColors = createFallbackColors();
let cachedResolvedColors = fallbackColors;

function createFallbackColors(): Record<string, string> {
    const fallbackColors: Record<string, string> = {};

    for (const group of paletteGroups) {
        for (const shade of group.shades) {
            fallbackColors[shade.cssVar] = shade.fallback;
        }
    }

    return fallbackColors;
}

function areColorsEqual(left: Record<string, string>, right: Record<string, string>): boolean {
    for (const group of paletteGroups) {
        for (const shade of group.shades) {
            if (left[shade.cssVar] !== right[shade.cssVar]) {
                return false;
            }
        }
    }

    return true;
}

function getResolvedColorsSnapshot(): Record<string, string> {
    const colors = { ...fallbackColors };

    if (typeof window === 'undefined') {
        return fallbackColors;
    }

    const styles = getComputedStyle(document.documentElement);

    for (const group of paletteGroups) {
        for (const shade of group.shades) {
            const value = styles.getPropertyValue(shade.cssVar).trim();
            colors[shade.cssVar] = value || shade.fallback;
        }
    }

    if (areColorsEqual(cachedResolvedColors, colors)) {
        return cachedResolvedColors;
    }

    cachedResolvedColors = colors;

    return cachedResolvedColors;
}

function subscribeToColorChanges(onStoreChange: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const observer = new MutationObserver(() => {
        onStoreChange();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'style'],
    });

    if (document.body) {
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'data-theme', 'style'],
        });
    }

    return () => {
        observer.disconnect();
    };
}

function getRelativeLuminance(hexColor: string): number {
    const hex = hexColor.replace('#', '');

    if (hex.length !== 6) {
        return 0;
    }

    const channels = [0, 2, 4].map((index) => {
        const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;

        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function getContrastRatio(foregroundColor: string, backgroundColor: string): number {
    const foregroundLuminance = getRelativeLuminance(foregroundColor);
    const backgroundLuminance = getRelativeLuminance(backgroundColor);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);

    return (lighter + 0.05) / (darker + 0.05);
}

function getTextColor(backgroundColor: string): string {
    const darkText = '#000000';
    const lightText = '#ffffff';

    return getContrastRatio(darkText, backgroundColor) >= getContrastRatio(lightText, backgroundColor)
        ? darkText
        : lightText;
}

export function ColorPalette() {
    const resolvedColors = useSyncExternalStore(
        subscribeToColorChanges,
        getResolvedColorsSnapshot,
        () => fallbackColors,
    );

    return (
        <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,158,204,0.14),_transparent_28%),linear-gradient(180deg,_var(--color-background),_color-mix(in_srgb,_var(--color-background)_90%,_var(--color-neutral-50)))] px-6 py-10 text-foreground sm:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 rounded-[2rem] border border-border/70 bg-background p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                <header className="max-w-3xl space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-900)]">
                        Design Tokens
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Project color palette
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                        This story renders the live CSS variables defined in the app theme so Storybook stays aligned with the
                        design tokens used in the product.
                    </p>
                </header>

                <div className="grid gap-6 xl:grid-cols-2">
                    {paletteGroups.map((group) => (
                        <article
                            key={group.name}
                            className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm"
                        >
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-semibold tracking-tight">{group.name}</h2>
                                    <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
                                </div>
                                <span className="shrink-0 whitespace-nowrap rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-secondary-foreground">
                                    6 shades
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {group.shades.map((shade) => {
                                    const value = resolvedColors[shade.cssVar] ?? shade.fallback;

                                    return (
                                        <div
                                            key={shade.cssVar}
                                            className="overflow-hidden rounded-2xl border border-border/80 bg-background"
                                        >
                                            <div
                                                className="flex h-28 flex-col justify-between px-4 py-3"
                                                style={{
                                                    backgroundColor: value,
                                                    color: getTextColor(value),
                                                }}
                                            >
                                                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] leading-none">
                                                    {group.name}
                                                </span>
                                                <span className="text-2xl font-semibold leading-none">{shade.scale}</span>
                                            </div>
                                            <div className="space-y-1 px-4 py-3 text-sm">
                                                <div className="font-medium text-foreground">{value}</div>
                                                <div className="font-mono text-xs text-muted-foreground">{shade.cssVar}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
