"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Location",
    content: "123 Ice Cream Lane, Sweet City, SC 12345",
    color: "text-primary",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    color: "text-secondary",
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@scoopheaven.com",
    color: "text-accent",
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Mon-Sun: 10am - 10pm",
    color: "text-purple-500",
  },
];

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you soon. 🍦");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-gray-100 dark:border-dark-border">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-3">
              Get in Touch 🍦
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Have a question about our ice cream? We'd love to hear from you!
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contactInfo.map(({ icon: Icon, title, content, color }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5"
                  >
                    <div className={`${color} mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-dark-text text-sm mb-1">
                      {title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {content}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl block mb-2">🗺️</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    123 Ice Cream Lane, Sweet City
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    placeholder="Tell us more..."
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-gray-700 dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <Button type="submit" loading={loading} className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
