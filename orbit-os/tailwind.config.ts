import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                // No serif in the system. `font-serif` is deliberately
                // aliased to the sans stack so the ~24 existing consumers
                // convert without a rename sweep, and any new usage is
                // harmless rather than a regression.
                sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
                serif: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
                // Marketing headline voice. Italic by design — see .display-italic.
                display: ["var(--font-display)", "Georgia", "serif"],
                // Hero tagline voice. Serif, so the fallback must be one too.
                tagline: ["var(--font-tagline)", "Georgia", "serif"],
            },
            fontSize: {
                // Hero 64–72 / section 40–48 / h3 24–28, tight leading on
                // the large end, 1.5–1.6 on body.
                "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700" }],
                "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "700" }],
                "display-md": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
                "display-sm": ["1.625rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
                "stat": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
                "overline": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "600" }],
                "body-lg": ["1.125rem", { lineHeight: "1.6" }],
                "body": ["1rem", { lineHeight: "1.6" }],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                "background-alt": "hsl(var(--background-alt))",
                foreground: "hsl(var(--foreground))",
                ink: {
                    DEFAULT: "hsl(var(--ink))",
                    deep: "hsl(var(--ink-deep))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                    bg: "hsl(var(--destructive-bg))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    deep: "hsl(var(--accent-deep))",
                    // The only lime safe as small text on white.
                    ink: "hsl(var(--accent-ink))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                    bg: "hsl(var(--success-bg))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                    bg: "hsl(var(--warning-bg))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "var(--radius-input)",
                sm: "calc(var(--radius-input) - 2px)",
            },
            boxShadow: {
                "xs": "var(--shadow-xs)",
                "sm": "var(--shadow-sm)",
                "card": "var(--shadow-card)",
                "card-hover": "var(--shadow-card-hover)",
                "md": "var(--shadow-md)",
                "lg": "var(--shadow-lg)",
                "xl": "var(--shadow-xl)",
                "nav": "var(--shadow-nav)",
                "glow": "var(--shadow-glow)",
            },
            transitionTimingFunction: {
                "out-expo": "var(--ease-out)",
            },
        },
    },
    plugins: [],
};
export default config;
