"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <SpecialOffers />
        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
