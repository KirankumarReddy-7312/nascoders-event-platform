"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { 
  Heart, CalendarHeart, Gift, Star, Baby, GlassWater, ArrowLeft,
  MapPin, CheckCircle2, Trophy, Target, Clock, Mail, Phone, User, 
  Sparkles, ShieldCheck, Lock, Edit3, X, FileText, Check, Award, AlertCircle, LogOut, Sun, Globe, Menu
} from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const loadSession = () => {
      const session = localStorage.getItem("euphoria_session");
      if (session) {
        setUser(JSON.parse(session));
      } else {
        setUser(null);
      }
    };
    loadSession();
    window.addEventListener("euphoria_sessionChanged", loadSession);
    return () => window.removeEventListener("euphoria_sessionChanged", loadSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("euphoria_session");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = ["home", "planning", "about", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("Home"), href: "/" },
    { name: t("Budget Planner"), href: "/#planning" },
    { name: t("About Us"), href: "/#about" },
    { name: t("Contact"), href: "/#contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    
    if (href === "/") {
      if (window.location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      if (window.location.pathname === "/") {
        const elem = document.getElementById(targetId);
        if (elem) {
          e.preventDefault();
          window.scrollTo({
            top: elem.offsetTop - 80,
            behavior: "smooth"
          });
        }
      }
    }
  };

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-3 shadow-sm" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="flex items-center gap-2 group">
          <div className="text-amber-600 transition-transform duration-500 group-hover:rotate-45">
            <Sun className="w-6 h-6" />
          </div>
          <span className="font-serif font-medium text-xl text-stone-800 tracking-wide">Euphoria</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {pathname !== "/profile" && navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                  isActive ? "text-amber-700 border-b-2 border-amber-200 pb-1" : "text-stone-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          

          {user ? (
            <div className="flex items-center gap-5">
              <Link 
                href="/profile" 
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
              >
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                My Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium bg-amber-50 text-amber-700 px-5 py-2.5 rounded-full hover:bg-amber-100 transition-colors shadow-sm"
              >
                {t("Logout")}
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                {t("Login")}
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-stone-800 text-white px-6 py-2.5 rounded-full hover:bg-stone-700 transition-all hover:shadow-lg hover:shadow-stone-800/10 active:scale-95"
              >
                {t("Sign up")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-stone-600" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFAF0]/95 backdrop-blur-md flex flex-col px-6 py-8">
          <div className="flex justify-between items-center mb-12">
            <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="flex items-center gap-2">
              <Sun className="text-amber-600 w-6 h-6" />
              <span className="font-serif font-medium text-xl text-stone-800">Euphoria</span>
            </Link>
            <button className="p-2 text-stone-600" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-lg font-medium">
            {pathname !== "/profile" && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="border-b border-stone-200/50 pb-4 text-stone-700"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-stone-200/50 pb-4 text-stone-700 font-medium"
                >
                  My Profile Dashboard
                </Link>
                <div className="border-b border-stone-200/50 pb-4 text-stone-500 text-sm font-light">
                  Logged in as <span className="font-medium text-stone-800">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 text-center bg-amber-700 text-white py-3.5 rounded-xl font-medium"
                >
                  {t("Logout")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="border-b border-stone-200/50 pb-4 text-stone-700" onClick={() => setMobileMenuOpen(false)}>
                  {t("Login")}
                </Link>
                <Link
                  href="/signup"
                  className="mt-4 text-center bg-stone-800 text-white py-3.5 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("Sign up")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
