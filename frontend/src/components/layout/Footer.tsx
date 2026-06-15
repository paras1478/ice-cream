import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Flavors" },
    { href: "/products?category=classics", label: "Classic Flavors" },
    { href: "/products?category=seasonal", label: "Seasonal Specials" },
    { href: "/products?isFeatured=true", label: "Featured" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/careers", label: "Careers" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
};

const socialLinks = [
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ice text-white text-xl font-bold">
                🍦
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Scoop</span>
                <span className="text-secondary">Heaven</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
              Artisan ice cream made with love and the finest ingredients.
              Discover your perfect scoop today.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>123 Ice Cream Lane, Sweet City, SC 12345</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>hello@scoopheaven.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-primary hover:text-white transition-colors dark:bg-dark-border dark:text-gray-400"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ScoopHeaven. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <img src="/visa.svg" alt="Visa" className="h-6 opacity-60" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6 opacity-60" />
            <img src="/stripe.svg" alt="Stripe" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
