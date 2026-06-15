import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Font loaded via CSS @import in globals.css
const inter = { variable: "--font-inter", className: "font-sans" };

export const metadata: Metadata = {
  title: {
    default: "ScoopHeaven - Artisan Ice Cream Delivered",
    template: "%s | ScoopHeaven",
  },
  description:
    "Discover artisan ice cream made with premium ingredients. 50+ flavors, free delivery on orders over $50. Order online at ScoopHeaven.",
  keywords: [
    "ice cream",
    "artisan",
    "delivery",
    "flavors",
    "gelato",
    "sorbet",
    "dessert",
  ],
  authors: [{ name: "ScoopHeaven" }],
  creator: "ScoopHeaven",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "ScoopHeaven - Artisan Ice Cream Delivered",
    description:
      "50+ handcrafted ice cream flavors delivered to your door. Premium ingredients, amazing taste.",
    siteName: "ScoopHeaven",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScoopHeaven - Artisan Ice Cream",
    description: "50+ handcrafted ice cream flavors delivered to your door.",
    creator: "@scoopheaven",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
