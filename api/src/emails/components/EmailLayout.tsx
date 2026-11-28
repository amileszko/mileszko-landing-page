import {
  Body,
  Container,
  Font,
  Head,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import { type ReactNode } from "react";

interface EmailLayoutProps {
  children: ReactNode
  footer: ReactNode
  preview: string
  title: string
}

const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      fontFamily: {
        body: [
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        heading: [
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        base: [
          "16px",
          { lineHeight: "1.6" },
        ],
        h1: [
          "48px",
          { lineHeight: "1.2" },
        ],
        h2: [
          "36px",
          { lineHeight: "1.3" },
        ],
        h3: [
          "24px",
          { lineHeight: "1.4" },
        ],
        h4: [
          "18px",
          { lineHeight: "1.5" },
        ],
        sm: [
          "14px",
          { lineHeight: "1.5" },
        ],
        xs: [
          "12px",
          { lineHeight: "1.4" },
        ],
      },
    },
  },
};

const EmailLayout = ({
  children,
  footer,
  preview,
  title,
}: EmailLayoutProps) => (
  <Tailwind config={tailwindConfig}>
    <Html lang="en">
      <Head>
        <title>{title}</title>
        <Font
          fallbackFontFamily={
            [
              "Arial",
              "sans-serif",
            ]
          }
          fontFamily="Inter"
          webFont={
            {
              format: "woff2",
              url: "https://fonts.gstatic.com/s/inter/v19/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
            }
          }
        />
        <style>
          {
            `
            @media (min-width: 640px) {
              .email-container {
                padding: 48px !important;
              }
            }
          `
          }
        </style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className="m-0 bg-neutral-50 p-0 font-body text-neutral-800">
        <Container
          className="email-container mx-auto"
          style={
            {
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "640px",
              padding: "24px",
            }
          }
        >
          <p
            className="m-0 font-medium text-neutral-800"
            data-skip-in-text="true"
          >
            am &gt;
          </p>
          <div className="h-8" />
          {children}
        </Container>
        <Section className="bg-neutral-900">
          <Container
            className="email-container mx-auto"
            style={
              {
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "640px",
                padding: "24px",
              }
            }
          >
            {footer}
          </Container>
        </Section>
      </Body>
    </Html>
  </Tailwind>
);

const Spacer = ({ className }: { className: string }) => (
  <div className={className} />
);

export { EmailLayout, Spacer };
