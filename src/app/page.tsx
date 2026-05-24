"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2, 
  Heart, Gift, ArrowRight, Mail, MapPin, Phone, X, Shield, Lock, User, Star, Sun,
  Check, ArrowLeft, Camera, Music, Utensils, Sparkles, Smile, PartyPopper,
  Sliders, Calculator, FileText, Trophy, Award, Building, Speaker
} from "lucide-react";

const OCCASIONS_DATA = [
  { name: "Birthday", img: "/birthday.png", desc: "Celebrate life's beautiful milestones", color: "bg-blue-900", quote: "A birthday is not just another year, but a celebration of your unique journey, filled with laughter, love, and the promise of beautiful new chapters." },
  { name: "Anniversary", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop", desc: "Honor your enduring love", color: "bg-rose-900", quote: "Two souls, one heart. Celebrating the years of shared laughter, quiet strength, and an enduring love that grows more beautiful with every sunset." },
  { name: "Marriage", img: "/marriage-occasion.jpg", desc: "Grand wedding celebrations", color: "bg-amber-950", quote: "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever." },
  { name: "Proposal", img: "/proposal.jpg", desc: "The perfect 'Yes' moment", color: "bg-stone-900", quote: "When you find the one who makes your heart beat faster and your soul feel at peace, saying 'Yes' is just the first step in a lifetime of shared dreams." },
  { name: "Graduation", img: "/graduate.png", desc: "Honor a major life milestone", color: "bg-indigo-900", quote: "Honor the late nights, the hard work, and the dedication that brought you here. Today you step into a world full of infinite possibilities." },
  { name: "Romantic Date", img: "/romantic-date.jpg", desc: "An unforgettable evening", color: "bg-red-900", quote: "An evening crafted for connection—where time slows down, candlelight flickers, and the only thing that matters is the laughter shared between you two." },
  { name: "Engagement Party", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop", desc: "Gather friends and family", color: "bg-purple-900", quote: "A toast to the beginning of forever. Celebrating the official announcement of a love story that will inspire all who witness it." },
  { name: "Retirement", img: "/retirement.jpg", desc: "Cheers to the next chapter", color: "bg-emerald-900", quote: "Cheers to a lifetime of dedication and the exciting freedom of the next chapter. May your retirement be filled with the projects and moments you love most." },
  { name: "Reunion", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop", desc: "Reconnect and reminisce", color: "bg-amber-900", quote: "Years may pass and distances grow, but true connections never fade. Reconnecting, laughing, and recreating the bonds of yesterday, today." },
  { name: "Farewell", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop", desc: "A meaningful goodbye", color: "bg-slate-900", quote: "Every goodbye is a threshold to a new beginning. We celebrate the footprints you leave behind and the exciting road that lies ahead of you." },
  { name: "Apology", img: "/apology.png", desc: "Saying sorry with grace", color: "bg-gray-800", quote: "A sincere apology is the superglue of life—it can repair almost anything. We help you express your deepest regrets with grace, warmth, and sincerity." },
  { name: "1-Hour Surprise", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop", desc: "Surprise them anytime", color: "bg-yellow-900", quote: "The best surprises are the ones that need no reason. Celebrate love, friendship, or simply the joy of today, just because they mean the world to you." }
];

const TEAM_MEMBERS = [
  { name: "Kirankumar Reddy", role: "Lead Planner", linkedin: "https://www.linkedin.com/in/l-kirankumar-reddy/" },
  { name: "Chithra", role: "Surprise Decor & Experience Designer", linkedin: "https://www.linkedin.com/in/aavula-chithra/" },
  { name: "Ramya Sree", role: "Floral Stylist & Coordinator", linkedin: "https://www.linkedin.com/in/ramya-sree-mathangi/" },
  { name: "Ajay Kumar", role: "Venue Coordinator & Vendor Lead", linkedin: "https://www.linkedin.com/in/ajay-kumar-746796408/" },
  { name: "Sumasree", role: "Guest Experience & Hospitality Specialist", linkedin: "https://www.linkedin.com/in/aavula-chithra/" },
  { name: "Purnima", role: "Creative & Visual Director", linkedin: "https://www.linkedin.com/in/manda-purnima/" },
  { name: "Aneesha", role: "Public Relations & Media Manager", linkedin: "https://www.linkedin.com/in/b-aneesha/" },
  { name: "Maneesh Kumar", role: "Event Operations & Logistics Manager", linkedin: "https://www.linkedin.com/in/sane-maneesh-kumar/" },
  { name: "Vinay", role: "Lead Event Photographer", linkedin: "https://www.linkedin.com/in/vinay-masagani-255958317/" }
];

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  // User State
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<typeof OCCASIONS_DATA[0] | null>(null);
  const [pendingBookingType, setPendingBookingType] = useState<string>("");

  // Budget Planner State
  const [plannerStep, setPlannerStep] = useState(1);
  const [plannerMode, setPlannerMode] = useState<"Budget" | "Event">("Budget");
  const [customEventStyle, setCustomEventStyle] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [generatedPrice, setGeneratedPrice] = useState<number | null>(null);
  const [plannerLocation, setPlannerLocation] = useState("");
  const [plannerOccasion, setPlannerOccasion] = useState("");
  const [plannerGuestsScale, setPlannerGuestsScale] = useState("");
  const [plannerVenueStyle, setPlannerVenueStyle] = useState("");
  const [plannerDecorTheme, setPlannerDecorTheme] = useState("");
  const [plannerAddons, setPlannerAddons] = useState<string[]>([]);
  const [inlineAuthMode, setInlineAuthMode] = useState<"login" | "signup">("signup");
  const [inlineName, setInlineName] = useState("");
  const [inlineEmail, setInlineEmail] = useState("");
  const [inlinePhone, setInlinePhone] = useState("");
  const [inlineSuccessMessage, setInlineSuccessMessage] = useState("");

  // Helper for planner pricing estimation in Rupees (₹)
  const getDeliverables = (occasion: string) => {
    switch (occasion) {
      case "Birthday":
        return ["Custom Designer Cake (Flavor of Choice)", "Balloon Arches & Venue Decor", "Digital Invitations", "Dedicated Photographer", "Personal Event Concierge"];
      case "Anniversary":
      case "Romantic Date":
      case "Proposal":
        return ["Romantic Candlelight Setup", "Premium Red Roses Bouquet", "Champagne or Sparkling Wine", "Private Violinist", "Keepsake Photo Frame"];
      case "Marriage":
      case "Engagement Party":
        return ["Full Venue Sourcing", "Grand Floral Setup", "Catering Coordination", "Entertainment (DJ/Band)", "Guest Logistics Management"];
      case "Baby Shower":
      case "Bridal Shower":
        return ["Pastel Theme Decor", "Custom Centerpieces", "Fun Interactive Games Kit", "Return Favors", "Custom Photobooth"];
      default:
        return ["Premium Venue Sourcing", "Decor & Aesthetic Setup", "Event Coordination", "Vendor Management", "Dedicated Event Concierge"];
    }
  };

  const handleGenerateCustomPrice = () => {
    setIsGeneratingPrice(true);
    setGeneratedPrice(null);
    // Simulate AI calculation or team estimation time
    setTimeout(() => {
      setIsGeneratingPrice(false);
      // Generate a random high-end price between 50k and 150k based on length of their style
      const baseCustom = 50000;
      const lengthBonus = Math.min(customEventStyle.length * 100, 100000);
      setGeneratedPrice(baseCustom + lengthBonus + Math.floor(Math.random() * 20000));
    }, 2500);
  };

  const getPlannerCalculation = () => {
    if (!plannerLocation || !plannerOccasion) {
      return { base: 0, locationMul: 1, detailCost: 0, addonCost: 0, subtotal: 0, discount: 0, total: 0 };
    }
    
    // Base Prices
    let base = 15000;
    if (plannerOccasion === "Marriage") {
      base = 45000;
    } else if (["Birthday", "Anniversary", "Engagement Party"].includes(plannerOccasion)) {
      base = 12000;
    } else if (["Graduation", "Promotion", "Farewell", "Retirement"].includes(plannerOccasion)) {
      base = 18000;
    } else if (["Baby Shower", "Bridal Shower", "Housewarming", "Reunion"].includes(plannerOccasion)) {
      base = 16000;
    }
    
    // Location Multiplier
    let locationMul = 1.0;
    switch (plannerLocation) {
      case "Mumbai": locationMul = 1.2; break;
      case "Delhi": locationMul = 1.1; break;
      case "Goa": locationMul = 1.3; break;
      case "Jaipur": locationMul = 1.1; break;
      case "Udaipur": locationMul = 1.2; break;
      case "International / Destination": locationMul = 1.8; break;
      default: locationMul = 1.0;
    }
    
    let detailCost = 0;
    // Group logic
    if (["Birthday", "Anniversary", "Engagement Party", "Marriage"].includes(plannerOccasion)) {
      // Group A
      if (plannerGuestsScale === "Medium") detailCost += 5000;
      else if (plannerGuestsScale === "Large") detailCost += 12000;
      else if (plannerGuestsScale === "Grand") detailCost += 25000;
      
      if (plannerDecorTheme === "Vibrant") detailCost += 3000;
      else if (plannerDecorTheme === "Floral") detailCost += 6000;
      else if (plannerDecorTheme === "Premium Glasshouse") detailCost += 15000;
    } else if (["Proposal", "Romantic Date", "Apology", "1-Hour Surprise"].includes(plannerOccasion)) {
      // Group B
      if (plannerVenueStyle === "Beach") detailCost += 15000;
      else if (plannerVenueStyle === "Rooftop") detailCost += 12000;
      else if (plannerVenueStyle === "Private Garden") detailCost += 8000;
      else if (plannerVenueStyle === "Cabana") detailCost += 5000;
      
      if (plannerDecorTheme === "Red Rose") detailCost += 5000;
      else if (plannerDecorTheme === "Fairy Lights") detailCost += 3000;
      else if (plannerDecorTheme === "Boho") detailCost += 6000;
      else if (plannerDecorTheme === "Candlelit") detailCost += 4000;
    } else if (["Graduation", "Promotion", "Farewell", "Retirement"].includes(plannerOccasion)) {
      // Group C
      if (plannerGuestsScale === "Team") detailCost += 8000;
      else if (plannerGuestsScale === "Corporate Gala") detailCost += 20000;
      
      if (plannerDecorTheme === "Elegant") detailCost += 4000;
      else if (plannerDecorTheme === "Nostalgic") detailCost += 3000;
      else if (plannerDecorTheme === "Black & Gold") detailCost += 6000;
    } else {
      // Group D: "Baby Shower", "Bridal Shower", "Housewarming", "Reunion"
      if (plannerGuestsScale === "Medium") detailCost += 6000;
      else if (plannerGuestsScale === "Large") detailCost += 15000;
      
      if (plannerDecorTheme === "Pastel") detailCost += 4000;
      else if (plannerDecorTheme === "Floral") detailCost += 6000;
      else if (plannerDecorTheme === "Cozy") detailCost += 3000;
    }
    
    // Addon Cost
    let addonCost = 0;
    plannerAddons.forEach(addon => {
      // Group A
      if (addon === "Musician") addonCost += 4000;
      else if (addon === "Photo") addonCost += 6000;
      else if (addon === "Video") addonCost += 8000;
      else if (addon === "Catering") addonCost += 12000;
      // Group B
      else if (addon === "Violinist") addonCost += 5000;
      else if (addon === "Drone") addonCost += 8000;
      else if (addon === "Chef Dinner") addonCost += 10000;
      // Group C
      else if (addon === "Red Carpet") addonCost += 3000;
      else if (addon === "Photo booth") addonCost += 5000;
      else if (addon === "DJ") addonCost += 10000;
      // Group D
      else if (addon === "Dessert Station") addonCost += 6000;
      else if (addon === "Hamper") addonCost += 4000;
      else if (addon === "Activity Host") addonCost += 5000;
    });
    
    const subtotal = Math.round(base * locationMul) + detailCost + addonCost;
    const discount = user ? Math.round(subtotal * 0.15) : 0;
    const total = subtotal - discount;
    
    return { base, locationMul, detailCost, addonCost, subtotal, discount, total };
  };

  const getConfigurationProgress = () => {
    let progress = 0;
    if (plannerLocation) progress += 20;
    if (plannerOccasion) progress += 20;
    
    const isGroupA = ["Birthday", "Anniversary", "Engagement Party", "Marriage"].includes(plannerOccasion);
    const isGroupB = ["Proposal", "Romantic Date", "Apology", "1-Hour Surprise"].includes(plannerOccasion);
    const isGroupC = ["Graduation", "Promotion", "Farewell", "Retirement"].includes(plannerOccasion);
    const isGroupD = plannerOccasion && !isGroupA && !isGroupB && !isGroupC;
    
    if (isGroupA && plannerGuestsScale) progress += 20;
    else if (isGroupB && plannerVenueStyle) progress += 20;
    else if (isGroupC && plannerGuestsScale) progress += 20;
    else if (isGroupD && plannerGuestsScale) progress += 20;

    if (plannerDecorTheme) progress += 20;
    
    if (plannerAddons.length > 0 || user) progress += 20;
    return progress;
  };

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

  const handleBookClick = (occasionName: string) => {
    // Check if logged in (simulate via localStorage)
    const session = localStorage.getItem("euphoria_session");
    if (!session) {
      setPendingBookingType(occasionName);
      setIsLoginOpen(true);
    } else {
      router.push(`/book?occasion=${occasionName}`);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("fullname") as string || "User";
    const email = formData.get("email") as string || "user@example.com";

    // Simulate successful login
    localStorage.setItem("euphoria_session", JSON.stringify({ name, email }));
    window.dispatchEvent(new Event("euphoria_sessionChanged"));
    setIsLoginOpen(false);
    
    if (pendingBookingType) {
      router.push(`/book?occasion=${pendingBookingType}`);
    } else {
      // Just let the session event update the UI
    }
  };


  return (
    <>
      <IntroAnimation />
      
      {/* LOGIN MODAL (Nearyou Design) */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 p-2 bg-stone-50 rounded-full text-stone-500 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center text-white shadow-sm">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{t("Join Euphoria")}</h3>
                  <p className="text-xs text-stone-400 font-medium">{t("Your emotional memory space")}</p>
                </div>
              </div>
              
              <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("FULL NAME")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input required name="fullname" type="text" placeholder="e.g. David Smith" className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-stone-700" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("EMAIL ADDRESS")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input required name="email" type="email" placeholder="e.g. you@example.com" className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-stone-700" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("MOBILE NUMBER")}</label>
                  <div className="flex bg-stone-50/50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                    <div className="px-3 py-3 border-r border-stone-200 text-sm font-bold text-stone-600 bg-stone-100/50">IN +91</div>
                    <input required name="mobile" type="tel" placeholder="98765 43210" className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none font-medium text-stone-700" />
                  </div>
                </div>
                
                <button type="submit" className="w-full mt-4 bg-rose-300 hover:bg-rose-400 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                  {t("Continue")} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              
              <div className="flex justify-center items-center gap-5 mt-6 text-[10px] font-medium text-amber-600/70">
                 <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-amber-500" /> Secure</span>
                 <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-500" /> Private</span>
                 <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-amber-500" /> Free</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }} 
              className={`${selectedDetails.color} rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-white max-h-[90vh] overflow-y-auto`}
            >
              <button onClick={() => setSelectedDetails(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -z-10" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[60px] -z-10" />
              
              <h2 className="text-3xl font-serif mb-2 flex items-center gap-3 relative z-10">
                <Star className="w-6 h-6 fill-current text-white/50" /> {t(selectedDetails.name)} Experience
              </h2>
              <p className="text-white/80 text-sm mb-8 italic relative z-10">&quot;{t(selectedDetails.quote)}&quot;</p>
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-lg font-medium tracking-wide uppercase border-b border-white/20 pb-2">How We Bring It To Life</h3>
                
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-lg">Initial Discovery & Vision</h4>
                    <p className="text-white/70 text-sm mt-1">We listen to your ideas, style preferences, and the emotion you want to evoke. We brainstorm creative, unique concepts specifically for this occasion.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-lg">Venue & Vendor Sourcing</h4>
                    <p className="text-white/70 text-sm mt-1">Our team scours our premium network to secure the perfect location, top-tier caterers, and specialized vendors to match your theme.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-lg">Complete Logistic Coordination</h4>
                    <p className="text-white/70 text-sm mt-1">We handle all the stressful details—timelines, permits, decor assembly, and backup plans—so you don&apos;t have to lift a finger.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-lg">The Secret Setup</h4>
                    <p className="text-white/70 text-sm mt-1">For surprises, absolute discretion is our priority. Our team executes the flawless setup behind the scenes right before the arrival.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold text-lg">The Grand Reveal & Execution</h4>
                    <p className="text-white/70 text-sm mt-1">The moment of truth. An event concierge ensures everything goes according to the timeline while you enjoy the euphoria of the reveal.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">6</div>
                  <div>
                    <h4 className="font-semibold text-lg">Memories Capture</h4>
                    <p className="text-white/70 text-sm mt-1">Our professional photographers and videographers discreetly capture raw, genuine reactions so you can relive the magic forever.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4 relative z-10">
                <button 
                  onClick={() => { setSelectedDetails(null); handleBookClick(selectedDetails.name); }} 
                  className="flex-1 px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
                >
                  Book This Experience
                </button>
                <button 
                  onClick={() => setSelectedDetails(null)} 
                  className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Warm Organic Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-amber-50/70 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-rose-50/60 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="text-5xl lg:text-7xl font-serif font-medium tracking-tight text-stone-800 leading-[1.1] mb-6">
              {t("Plan Unforgettable")} <br/>
              <span className="text-amber-700 italic">{t("Celebrations.")}</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-stone-600 mb-10 leading-relaxed font-light">
              From intimate anniversaries to grand proposals, we craft deeply personal experiences filled with love, warmth, and beautiful details.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#explore"
                className="bg-stone-800 text-white px-8 py-4 rounded-full font-medium hover:bg-stone-700 transition-all hover:shadow-xl hover:shadow-stone-800/10 active:scale-95 flex items-center gap-2"
              >
                {t("Explore Surprises")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8 text-sm text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                {t("Crafted with Love")}
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                {t("Curated Details")}
              </div>
            </div>
          </motion.div>

          {/* Right: Beautiful Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[650px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200/50 border border-white"
          >
             <Image 
                src="/hero.png" 
                alt="Elegant event setup" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
             <div className="absolute bottom-8 left-8 text-white">
                <p className="font-serif italic text-2xl mb-1">Aura by the Sea</p>
                <p className="font-light text-white/80 text-sm">Sunset Beach Proposal</p>
             </div>
          </motion.div>
        </div>
      </section>

            {/* EXPLORE SURPRISES SECTION (Images & Cards) */}
      <section id="explore" className="py-24 bg-white relative z-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-4 block">
              {t("Explore the Magic")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800">
              {t("Signature Experiences")}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OCCASIONS_DATA.map((occ, idx) => (
              <motion.div 
                key={occ.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative h-72 w-full perspective-[1000px]"
              >
                {/* INNER CONTAINER */}
                <div className="w-full h-full absolute transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm hover:shadow-2xl rounded-3xl">
                  
                  {/* FRONT FACE (Image + Title) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden bg-white border border-stone-100">
                    <img 
                      src={occ.img} 
                      alt={occ.name} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-serif text-white mb-2">{t(occ.name)}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{t(occ.desc)}</p>
                    </div>
                  </div>

                  {/* BACK FACE (Quote + Buttons) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden bg-white border border-stone-100 p-6 flex flex-col justify-center text-center">
                    <p className="text-stone-600 text-sm font-serif italic mb-6 px-2">&quot;{occ.quote}&quot;</p>
                    
                    <div className="flex flex-col gap-3 w-full px-2">
                      <button 
                        onClick={() => handleBookClick(occ.name)} 
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                        {t("Book Now")}
                      </button>
                      <button 
                        onClick={() => setSelectedDetails(occ)}
                        className="w-full py-3 bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-sm font-semibold transition-colors"
                      >
                        {t("Details")}
                      </button>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            ))}          </div>
        </div>
      </section>

      {/* EXCLUSIVE CELEBRATION ESTIMATOR SECTION */}
      <section id="planning" className="py-24 bg-stone-50 relative scroll-mt-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-50/40 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-4 block">
              {t("Exclusive Pricing Configuration")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">
              {t("Design Your Celebration")}
            </h2>
            
            <div className="flex justify-center mb-8">
              <div className="bg-stone-100 p-1.5 rounded-2xl inline-flex relative shadow-inner">
                <button 
                  type="button"
                  onClick={() => { setPlannerMode("Budget"); setGeneratedPrice(null); }}
                  className={`relative z-10 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${plannerMode === "Budget" ? "text-stone-800 shadow-md bg-white" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Budget Planner
                </button>
                <button 
                  type="button"
                  onClick={() => setPlannerMode("Event")}
                  className={`relative z-10 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${plannerMode === "Event" ? "text-stone-800 shadow-md bg-white" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Event Planner
                </button>
              </div>
            </div>

            <p className="text-stone-500 font-light text-lg mt-4 max-w-2xl mx-auto">
              {plannerMode === "Budget" 
                ? "Configure your signature event in real-time. Our estimator calculates vendor rates to generate a baseline quote instantly."
                : "Tell us exactly how you envision your event. Give us your custom style, and we will calculate the perfect price for our team to bring it to life!"}
            </p>
          </div>

          {plannerMode === "Event" ? (
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden mb-24">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="mb-8 border-b border-stone-100 pb-6 flex justify-between items-center">
                   <h3 className="text-2xl font-serif text-stone-800">
                     {plannerStep === 1 && "Describe Your Dream Theme"}
                     {plannerStep === 2 && "Venue & Environment"}
                     {plannerStep === 3 && "Guest Capacity"}
                     {plannerStep === 4 && "Culinary Experience"}
                     {plannerStep === 5 && "Your Custom Blueprint"}
                   </h3>
                   <div className="flex gap-2">
                     {[1,2,3,4,5].map(step => (
                       <div key={step} className={`h-2 rounded-full transition-all ${plannerStep === step ? 'w-8 bg-amber-500' : (plannerStep > step ? 'w-4 bg-amber-300' : 'w-4 bg-stone-200')}`} />
                     ))}
                   </div>
                </div>
                
                {plannerStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-stone-500 mb-6">Select a core aesthetic or theme for your celebration.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {["1920s Great Gatsby", "Bohemian Chic", "Royal Elegance", "Minimalist Modern", "Tropical Paradise", "Other"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => {
                            setSelectedTheme(theme);
                            if (theme !== "Other") setCustomEventStyle(theme);
                            else setCustomEventStyle("");
                          }}
                          className={`py-4 px-4 rounded-xl border text-sm font-medium transition-all ${
                            selectedTheme === theme 
                              ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm scale-105" 
                              : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedTheme === "Other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <textarea 
                            value={customEventStyle}
                            onChange={(e) => setCustomEventStyle(e.target.value)}
                            placeholder="e.g. I want a custom themed party with gold balloons, a champagne tower, live jazz band, and personalized vintage invitations for 50 guests..."
                            className="w-full h-32 p-5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-700 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all resize-none mb-6 mt-4"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end mt-8">
                       <button 
                         type="button" 
                         disabled={!selectedTheme || (selectedTheme === "Other" && customEventStyle.length < 5)}
                         onClick={() => setPlannerStep(2)}
                         className="px-8 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                       >
                         Next: Venue Selection
                       </button>
                    </div>
                  </motion.div>
                )}

                {plannerStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-stone-500 mb-6">Where do you envision this magical moment taking place?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {["5-Star Luxury Hotel", "Beachfront Resort", "Heritage Palace / Fort", "Private Villa & Lawn", "Yacht / Cruise", "Other Premium Venue"].map((venue) => (
                        <button
                          key={venue}
                          onClick={() => setPlannerStep(3)}
                          className={`p-6 rounded-2xl border border-stone-200 bg-white text-stone-700 font-medium hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 transition-all text-left shadow-sm hover:shadow-md`}
                        >
                          {venue}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-8">
                       <button type="button" onClick={() => setPlannerStep(1)} className="text-stone-500 hover:text-stone-800 font-medium">Back</button>
                    </div>
                  </motion.div>
                )}

                {plannerStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-stone-500 mb-6">How many guests will be attending?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        { label: "Intimate Affair", desc: "1 to 15 Guests" },
                        { label: "Small Gathering", desc: "15 to 50 Guests" },
                        { label: "Grand Celebration", desc: "50 to 200 Guests" },
                        { label: "Massive Event", desc: "200+ Guests" }
                      ].map((guest) => (
                        <button
                          key={guest.label}
                          onClick={() => setPlannerStep(4)}
                          className={`p-6 rounded-2xl border border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-all text-left shadow-sm hover:shadow-md flex flex-col`}
                        >
                          <span className="font-bold text-lg mb-1">{guest.label}</span>
                          <span className="text-sm font-light text-stone-500">{guest.desc}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-8">
                       <button type="button" onClick={() => setPlannerStep(2)} className="text-stone-500 hover:text-stone-800 font-medium">Back</button>
                    </div>
                  </motion.div>
                )}

                {plannerStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-stone-500 mb-6">What culinary experience do you prefer?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        "Multi-Cuisine Grand Buffet", 
                        "7-Course Plated Fine Dining", 
                        "Live Interactive Cooking Stations", 
                        "Artisan High Tea & Finger Foods"
                      ].map((food) => (
                        <button
                          key={food}
                          onClick={() => {
                            // Automatically trigger calculation when moving to step 5
                            setPlannerStep(5);
                            handleGenerateCustomPrice();
                          }}
                          className={`p-6 rounded-2xl border border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-all text-left shadow-sm hover:shadow-md font-medium`}
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-8">
                       <button type="button" onClick={() => setPlannerStep(3)} className="text-stone-500 hover:text-stone-800 font-medium">Back</button>
                    </div>
                  </motion.div>
                )}

                {plannerStep === 5 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-8">
                    {isGeneratingPrice ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
                        <h4 className="text-xl font-serif text-stone-800 animate-pulse">Calculating Exclusive Quote...</h4>
                        <p className="text-stone-500 mt-2 text-sm">Analyzing theme, venue, and culinary selections</p>
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
                          <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Estimated Investment</span>
                          <h4 className="text-6xl font-serif text-white mb-4 tracking-tight">₹{generatedPrice?.toLocaleString("en-IN") || "5,45,000"}</h4>
                          
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 inline-block max-w-sm mx-auto">
                            <p className="text-amber-300 text-sm flex flex-col gap-1 font-medium">
                              <Sparkles className="w-4 h-4 mx-auto mb-1" />
                              Login and book now to unlock an extra 15% VIP discount on this estimate!
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                              onClick={() => { setPlannerStep(1); setGeneratedPrice(null); }}
                              className="px-8 py-4 rounded-xl font-medium border border-stone-600 text-stone-300 hover:bg-stone-800 transition-colors"
                            >
                              Redesign Event
                            </button>
                            <Link href={`/book?custom=true&price=${generatedPrice || 545000}`} className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
<div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Configuration Panel */}
            <div className={`space-y-8 transition-all duration-500 ${plannerLocation && plannerOccasion ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto w-full"}`}>
              {/* Progress Tracker Card */}
              <div className="bg-white rounded-[2rem] p-6 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Configuration Completion</span>
                  <span className="text-sm font-serif font-semibold text-amber-600">{getConfigurationProgress()}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getConfigurationProgress()}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-400 font-light">
                  {getConfigurationProgress() === 0 && "Select a destination and occasion to begin custom-engineering."}
                  {getConfigurationProgress() > 0 && getConfigurationProgress() < 40 && "Select your guest scale and styling details."}
                  {getConfigurationProgress() >= 40 && getConfigurationProgress() < 80 && "Add custom experiences or register client profile to unlock VIP discount."}
                  {getConfigurationProgress() >= 80 && getConfigurationProgress() < 100 && "Almost there! Choose add-ons or create profile to lock 100% specs."}
                  {getConfigurationProgress() === 100 && "Perfect configuration! Lock in your baseline rate below."}
                </p>
              </div>

              {/* Card 1: Destination & Occasion */}
              <div className="bg-white rounded-[2rem] p-8 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-6">
                <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  01. Destination & Celebration Type
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase">Select Destination</label>
                    <select
                      value={plannerLocation}
                      onChange={(e) => {
                        setPlannerLocation(e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-stone-700"
                    >
                      <option value="">-- Choose Destination --</option>
                      {["Bengaluru", "Mumbai", "Delhi", "Goa", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Udaipur", "International / Destination"].map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase">Celebration Occasion</label>
                    <select
                      value={plannerOccasion}
                      onChange={(e) => {
                        setPlannerOccasion(e.target.value);
                        // Reset sub-selections when occasion changes to ensure they are valid for the group
                        setPlannerGuestsScale("");
                        setPlannerVenueStyle("");
                        setPlannerDecorTheme("");
                        setPlannerAddons([]);
                      }}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-stone-700"
                    >
                      <option value="">-- Choose Occasion --</option>
                      {OCCASIONS_DATA.map((occ) => (
                        <option key={occ.name} value={occ.name}>{t(occ.name)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: Signature Details */}
              <div className="bg-white rounded-[2rem] p-8 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] min-h-[250px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!plannerLocation || !plannerOccasion ? (
                    <motion.div
                      key="no-selection-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-3"
                    >
                      <Sliders className="w-10 h-10 mx-auto text-stone-300 animate-pulse" />
                      <p className="text-stone-400 font-light text-sm">
                        Please choose a Destination and Celebration Type above to reveal customization options.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="customization-options"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2.5 pb-4 border-b border-stone-100">
                        <Sliders className="w-5 h-5 text-amber-600" />
                        02. Personalize Celebration Details
                      </h3>

                      {/* Group A: Birthdays, Anniversaries, Marriage, Engagement */}
                      {["Birthday", "Anniversary", "Engagement Party", "Marriage"].includes(plannerOccasion) && (
                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Expected Guest Scale</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Intimate (< 10)", val: "Intimate", icon: <User className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Medium (10-30)", val: "Medium", icon: <Smile className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Large (30-50)", val: "Large", icon: <Trophy className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Grand (50+)", val: "Grand", icon: <Sparkles className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerGuestsScale(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerGuestsScale === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Setup Theme & Design</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Minimalist Elegant", val: "Minimalist", icon: <Sparkles className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Vibrant (+₹3k)", val: "Vibrant", icon: <PartyPopper className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Enchanted Floral (+₹6k)", val: "Floral", icon: <Heart className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Premium Glass (+₹15k)", val: "Premium Glasshouse", icon: <Award className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerDecorTheme(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerDecorTheme === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Add Custom Experiences (Select Multiple)</label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { label: "Live Guitarist (+₹4k)", val: "Musician", icon: <Music className="w-4 h-4 text-stone-400" /> },
                                { label: "Professional Photo (+₹6k)", val: "Photo", icon: <Camera className="w-4 h-4 text-stone-400" /> },
                                { label: "Cinematic Video (+₹8k)", val: "Video", icon: <Camera className="w-4 h-4 text-stone-400" /> },
                                { label: "Premium Catering (+₹12k)", val: "Catering", icon: <Utensils className="w-4 h-4 text-stone-400" /> }
                              ].map((opt) => {
                                const isSelected = plannerAddons.includes(opt.val);
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPlannerAddons(prev =>
                                        isSelected ? prev.filter(a => a !== opt.val) : [...prev, opt.val]
                                      );
                                    }}
                                    className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between group ${
                                      isSelected
                                        ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                        : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {opt.icon}
                                      <span>{opt.label}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Group B: Proposals & Romance */}
                      {["Proposal", "Romantic Date", "Apology", "1-Hour Surprise"].includes(plannerOccasion) && (
                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Venue Setting</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Beachfront (+₹15k)", val: "Beach", icon: <Sun className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Rooftop Lounge (+₹12k)", val: "Rooftop", icon: <Building className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Secret Garden (+₹8k)", val: "Private Garden", icon: <Heart className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Beach Cabana (+₹5k)", val: "Cabana", icon: <Sliders className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerVenueStyle(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerVenueStyle === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Aesthetic Theme</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Classic Red Roses (+₹5k)", val: "Red Rose", icon: <Heart className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Warm Fairy Lights (+₹3k)", val: "Fairy Lights", icon: <Sun className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Boho Chic Decor (+₹6k)", val: "Boho", icon: <Sliders className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Intimate Candlelit (+₹4k)", val: "Candlelit", icon: <Sparkles className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerDecorTheme(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerDecorTheme === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Add Enhancements (Select Multiple)</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Solo Violinist (+₹5k)", val: "Violinist", icon: <Music className="w-4 h-4 text-stone-400" /> },
                                { label: "Drone Shoot (+₹8k)", val: "Drone", icon: <Camera className="w-4 h-4 text-stone-400" /> },
                                { label: "Private Chef (+₹10k)", val: "Chef Dinner", icon: <Utensils className="w-4 h-4 text-stone-400" /> }
                              ].map((opt) => {
                                const isSelected = plannerAddons.includes(opt.val);
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPlannerAddons(prev =>
                                        isSelected ? prev.filter(a => a !== opt.val) : [...prev, opt.val]
                                      );
                                    }}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between group ${
                                      isSelected
                                        ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                        : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {opt.icon}
                                      <span>{opt.label}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Group C: Graduation, Promotion, Farewell, Retirement */}
                      {["Graduation", "Promotion", "Farewell", "Retirement"].includes(plannerOccasion) && (
                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Event Scale</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Family Circle", val: "Family", icon: <User className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Corporate Team (+₹8k)", val: "Team", icon: <Smile className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Grand Gala Ballroom (+₹20k)", val: "Corporate Gala", icon: <Building className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerGuestsScale(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerGuestsScale === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Styling Vibe</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Elegant Sophistication (+₹4k)", val: "Elegant", icon: <Sparkles className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Nostalgic Retro (+₹3k)", val: "Nostalgic", icon: <Sliders className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Premium Black & Gold (+₹6k)", val: "Black & Gold", icon: <Award className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerDecorTheme(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerDecorTheme === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Premium Additions (Select Multiple)</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Red Carpet (+₹3k)", val: "Red Carpet", icon: <Sparkles className="w-4 h-4 text-stone-400" /> },
                                { label: "Mirror booth (+₹5k)", val: "Photo booth", icon: <Camera className="w-4 h-4 text-stone-400" /> },
                                { label: "DJ & Sound Set (+₹10k)", val: "DJ", icon: <Speaker className="w-4 h-4 text-stone-400" /> }
                              ].map((opt) => {
                                const isSelected = plannerAddons.includes(opt.val);
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPlannerAddons(prev =>
                                        isSelected ? prev.filter(a => a !== opt.val) : [...prev, opt.val]
                                      );
                                    }}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between group ${
                                      isSelected
                                        ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                        : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {opt.icon}
                                      <span>{opt.label}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Group D: Showers & Reunions */}
                      {!["Birthday", "Anniversary", "Engagement Party", "Marriage", "Proposal", "Romantic Date", "Apology", "1-Hour Surprise", "Graduation", "Promotion", "Farewell", "Retirement"].includes(plannerOccasion) && (
                        <div className="space-y-6">
                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Gathering Scale</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Intimate Gathering", val: "Intimate", icon: <User className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Medium (+₹6k)", val: "Medium", icon: <Smile className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Large Festivity (+₹15k)", val: "Large", icon: <Trophy className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerGuestsScale(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerGuestsScale === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Theme & Vibe</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Dreamy Pastels (+₹4k)", val: "Pastel", icon: <Sparkles className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Lush Florals (+₹6k)", val: "Floral", icon: <Heart className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> },
                                { label: "Cozy Rustic (+₹3k)", val: "Cozy", icon: <Sliders className="w-3.5 h-3.5 mb-1 text-stone-400 group-hover:text-amber-500" /> }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => setPlannerDecorTheme(opt.val)}
                                  className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center group ${
                                    plannerDecorTheme === opt.val
                                      ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                  }`}
                                >
                                  {opt.icon}
                                  <span>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-stone-500 tracking-wider uppercase block mb-3">Interactive Upgrades (Select Multiple)</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: "Dessert Corner (+₹6k)", val: "Dessert Station", icon: <Utensils className="w-4 h-4 text-stone-400" /> },
                                { label: "Hampers (+₹4k)", val: "Hamper", icon: <Gift className="w-4 h-4 text-stone-400" /> },
                                { label: "Professional Host (+₹5k)", val: "Activity Host", icon: <User className="w-4 h-4 text-stone-400" /> }
                              ].map((opt) => {
                                const isSelected = plannerAddons.includes(opt.val);
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPlannerAddons(prev =>
                                        isSelected ? prev.filter(a => a !== opt.val) : [...prev, opt.val]
                                      );
                                    }}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between group ${
                                      isSelected
                                        ? "border-amber-500 bg-amber-50/50 text-amber-955 font-semibold shadow-sm"
                                        : "border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:bg-stone-50/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {opt.icon}
                                      <span>{opt.label}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 3: Exclusive Client Registry (Login/Signup) */}
              <div className="bg-white rounded-[2rem] p-8 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-6">
                <h3 className="text-xl font-serif text-stone-800 flex items-center gap-2.5 pb-4 border-b border-stone-100">
                  <Award className="w-5 h-5 text-amber-600" />
                  03. Signature Membership & Benefits
                </h3>

                {user ? (
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 text-center space-y-4">
                    <Smile className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-serif text-emerald-950">Active Client Registry: {user.name}</h4>
                    <p className="text-stone-600 font-light text-sm leading-relaxed max-w-md mx-auto">
                      Your exclusive 15% client registry discount has been validated and applied to your real-time celebration configuration quote.
                    </p>
                    <div className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-3.5 py-1.5 rounded-full">
                      15% SAVINGS LOCKED
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-6 text-sm text-stone-700 leading-relaxed font-light space-y-3">
                      <p className="font-serif text-stone-800 text-base font-semibold">Exclusive celebration custom-engineering</p>
                      <p>
                        Designing a luxury celebration is a highly collaborative journey. If this baseline configuration does not align with your expectations, do not worry.
                      </p>
                      <p className="font-medium text-amber-900">
                        Choose your preferred options, register a client profile below, and unlock a guaranteed 15% savings! Our concierge planning team will work with you to custom-engineer the event to your exact budget parameters.
                      </p>
                    </div>

                    {/* Registry Inline Form Tabs */}
                    <div className="flex bg-stone-100/80 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setInlineAuthMode("signup");
                          setInlineSuccessMessage("");
                        }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                          inlineAuthMode === "signup"
                            ? "bg-white text-stone-900 shadow-sm"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        Create Client Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineAuthMode("login");
                          setInlineSuccessMessage("");
                        }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                          inlineAuthMode === "login"
                            ? "bg-white text-stone-900 shadow-sm"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        Sign In
                      </button>
                    </div>

                    {inlineSuccessMessage && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold text-center">
                        {inlineSuccessMessage}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const sessionData = {
                          name: inlineName || "Valued Client",
                          email: inlineEmail || "client@example.com",
                          phone: inlinePhone || ""
                        };
                        localStorage.setItem("euphoria_session", JSON.stringify(sessionData));
                        window.dispatchEvent(new Event("euphoria_sessionChanged"));
                        setUser(sessionData);
                        setInlineSuccessMessage(
                          inlineAuthMode === "signup"
                            ? "Client registry profile created successfully! 15% discount applied."
                            : "Successfully signed in to client profile! 15% discount applied."
                        );
                        window.dispatchEvent(new Event("euphoria_sessionChanged"));
                      }}
                      className="space-y-4"
                    >
                      {inlineAuthMode === "signup" && (
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-1.5 block">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                              required
                              type="text"
                              value={inlineName}
                              onChange={(e) => setInlineName(e.target.value)}
                              placeholder="e.g. Kiran Kumar"
                              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors font-medium text-stone-800"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase block">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                              required
                              type="email"
                              value={inlineEmail}
                              onChange={(e) => setInlineEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors font-medium text-stone-800"
                            />
                          </div>
                        </div>

                        {inlineAuthMode === "signup" ? (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase block">Mobile Number</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                              <input
                                required
                                type="tel"
                                value={inlinePhone}
                                onChange={(e) => setInlinePhone(e.target.value)}
                                placeholder="e.g. 9876543210"
                                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors font-medium text-stone-800"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 flex flex-col justify-end">
                            <span className="text-[10px] text-stone-400 mb-2 italic">Passwordless login enabled</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                      >
                        {inlineAuthMode === "signup" ? "Register Profile & Unlock Savings" : "Sign In & Apply Savings"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Estimate Receipt Column (Sticky) */}
            {plannerLocation && plannerOccasion && (
              <div className="lg:col-span-5 lg:sticky lg:top-24 animate-fade-in">
                <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white border border-stone-800 shadow-2xl relative overflow-hidden">
                  {/* Decorative glowing gradient sphere */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[60px] pointer-events-none" />

                  <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-stone-800">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Calculator className="w-5 h-5" />
                      <span className="text-xs font-serif uppercase tracking-wider">Euphoria Surprise Planners</span>
                    </div>
                    <h3 className="font-serif text-2xl tracking-wide text-stone-100">Exclusive Estimate</h3>
                    <div className="text-[10px] text-stone-500 mt-2 font-mono flex justify-between">
                      <span>REF: EQ-2026-X82F</span>
                      <span>EST: {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Itemized list */}
                    <div className="space-y-4 text-sm font-light text-stone-400">
                      <div className="flex justify-between">
                        <span>Base Package ({t(plannerOccasion)})</span>
                        <span className="font-mono text-stone-200">₹{getPlannerCalculation().base.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Location Multiplier ({plannerLocation})</span>
                        <span className="font-mono text-stone-200">x {getPlannerCalculation().locationMul}</span>
                      </div>

                      {/* Occasion specific inputs show dynamically */}
                      {plannerGuestsScale && (
                        <div className="flex justify-between">
                          <span>Scale Adjustment ({plannerGuestsScale})</span>
                          <span className="font-mono text-stone-200">Included</span>
                        </div>
                      )}

                      {plannerVenueStyle && (
                        <div className="flex justify-between">
                          <span>Venue Style ({plannerVenueStyle})</span>
                          <span className="font-mono text-stone-200">Included</span>
                        </div>
                      )}

                      {plannerDecorTheme && (
                        <div className="flex justify-between">
                          <span>Aesthetic Theme ({plannerDecorTheme})</span>
                          <span className="font-mono text-stone-200">Included</span>
                        </div>
                      )}

                      {getPlannerCalculation().detailCost > 0 && (
                        <div className="flex justify-between">
                          <span>Customization Options</span>
                          <span className="font-mono text-stone-200">+ ₹{getPlannerCalculation().detailCost.toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      {getPlannerCalculation().addonCost > 0 && (
                        <div className="flex justify-between">
                          <span>Experience Add-ons</span>
                          <span className="font-mono text-stone-200">+ ₹{getPlannerCalculation().addonCost.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-stone-800 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-400 font-light">Subtotal</span>
                        <span className="font-mono text-stone-200">₹{getPlannerCalculation().subtotal.toLocaleString("en-IN")}</span>
                      </div>

                      {getPlannerCalculation().discount > 0 ? (
                        <div className="flex justify-between font-mono text-stone-200">
                          <span>VIP Member Discount</span>
                          <span className="text-emerald-400">-₹{getPlannerCalculation().discount.toLocaleString("en-IN")}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-xs text-amber-500 font-light">
                          <span>VIP Savings Pending</span>
                          <span>Create Profile to Save 15%</span>
                        </div>
                      )}

                      <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-stone-800">
                        <span className="font-serif text-lg text-stone-100">Grand Total</span>
                        <div className="text-right">
                          <span className="text-3xl font-serif text-amber-400 font-semibold">
                            ₹{getPlannerCalculation().total.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-stone-500 block mt-1">Direct vendor cost-basis</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/book?occasion=${plannerOccasion}&location=${plannerLocation}`);
                        }}
                        className="w-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                      >
                        Lock in baseline rate <ArrowRight className="w-4.5 h-4.5" />
                      </button>
                      <p className="text-[10px] text-stone-500 text-center mt-3 leading-relaxed">
                        This is an estimate. Final pricing may vary slightly based on direct vendor availability and customization complexity.
                      </p>
                      
                      {/* Direct Vendor Price Guarantee Trust Badge */}
                      <div className="mt-6 p-4 rounded-2xl bg-stone-800 border border-stone-800 flex items-start gap-3 text-left">
                        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-stone-200">Direct Vendor Price Guarantee</p>
                          <p className="text-[10px] text-stone-400 leading-normal font-light">
                            We partner directly with tier-1 decorators, venues, and artists. If you find a verified lower quote, we will match it and offer a 10% credit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </section>

{/* 2. ABOUT US & TEAM SECTION */}
      <section id="about" className="py-24 bg-[#FFFAF0] relative scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Dynamic Typography / About Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-sm text-amber-800 mb-6 font-medium">
                <Heart className="w-4 h-4" /> Our Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8 leading-tight">
                Crafting memories with <br/><span className="italic text-amber-700">heart and purpose.</span>
              </h2>
              
              <div className="space-y-6 text-stone-600 font-light text-lg leading-relaxed mb-10">
                <p>
                  Euphoria started with a simple observation: planning a surprise for someone you love is incredibly stressful. Finding reliable vendors, coordinating timelines, and ensuring everything remains a secret often strips the joy out of the process.
                </p>
                <p>
                  We decided to bring the human touch back to celebrating. We built a service where logistics disappear, allowing you to be completely present in the magic of the moment with your loved ones.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-serif text-2xl text-stone-800 mb-2">500+</h4>
                  <p className="text-stone-500 font-light text-sm">Smiles created across beautiful destinations.</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-stone-800 mb-2">100%</h4>
                  <p className="text-stone-500 font-light text-sm">Dedication to perfection and absolute secrecy.</p>
                </div>
              </div>
            </div>

            {/* Stylish Image/Element Layout */}
            <div className="relative h-[600px] w-full rounded-[2.5rem] bg-stone-100 border border-stone-200 flex flex-col justify-center items-center overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-rose-50" />
               
               <motion.div 
                 initial={{ rotate: -5, y: 20, opacity: 0 }}
                 whileInView={{ rotate: -5, y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="absolute left-[10%] top-[15%] w-64 h-80 bg-white p-3 shadow-xl rounded-xl z-10 border border-stone-100"
               >
                 <div className="w-full h-full bg-stone-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80" />
                 </div>
               </motion.div>

               <motion.div 
                 initial={{ rotate: 8, y: 30, opacity: 0 }}
                 whileInView={{ rotate: 8, y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="absolute right-[10%] bottom-[15%] w-64 h-80 bg-white p-3 shadow-xl rounded-xl z-20 border border-stone-100"
               >
                 <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-90" />
                 </div>
               </motion.div>
            </div>
          </div>



          {/* FUTURE CELEBRATION REWARDS SECTION */}
          <div className="border-t border-stone-200/60 pt-24 mt-8">
             <div className="max-w-4xl mx-auto">
               <div className="text-center mb-12">
                 <h3 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Future Celebration Rewards</h3>
                 <p className="text-stone-500 font-light text-lg">
                   Because every memorable moment deserves another.
                 </p>
               </div>
               
               <div className="relative rounded-[2.5rem] bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 md:p-12 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/40 rounded-full blur-[80px] -z-10 group-hover:bg-amber-300/40 transition-colors duration-700"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/40 rounded-full blur-[80px] -z-10 group-hover:bg-rose-300/40 transition-colors duration-700"></div>

                 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                   <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white rounded-full flex items-center justify-center shadow-xl shadow-amber-900/5 relative">
                     <Gift className="w-16 h-16 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute -bottom-2 -right-2 bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                       VIP
                     </div>
                   </div>

                   <div className="flex-1 text-center md:text-left">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-amber-200 text-xs font-medium text-amber-800 mb-4">
                       <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 1 Lucky Winner Every 50 Bookings
                     </div>
                     <h4 className="text-2xl md:text-3xl font-serif text-stone-800 mb-4">
                       Win a Free Premium Celebration
                     </h4>
                     <p className="text-stone-600 font-light leading-relaxed mb-8">
                       After every 50 successful bookings, we randomly select one of our clients to receive an exclusive, fully-funded VIP surprise event and feature their story on our platform.
                     </p>
                     
                     <div className="bg-white/60 rounded-2xl p-5 border border-stone-100">
                       <div className="flex justify-between items-end mb-3">
                         <span className="text-sm font-medium text-stone-700">Current Milestone Progress</span>
                         <div className="text-right">
                           <span className="text-2xl font-serif text-amber-700">42</span>
                           <span className="text-stone-400 text-sm">/50</span>
                         </div>
                       </div>
                       <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: '84%' }}
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full relative"
                         >
                           <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                         </motion.div>
                       </div>
                       <p className="text-xs text-stone-500 mt-3 text-center md:text-left">
                         Only 8 more bookings until our next giveaway!
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2.5. OUR OUTPUTS SECTION */}
      <section id="outputs" className="py-24 bg-stone-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">Our Outputs</h3>
            <p className="text-stone-500 font-light text-lg max-w-2xl mx-auto">
              A glimpse into the unforgettable moments and pure joy we&apos;ve had the honor of creating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative h-[24rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/output-1.png" alt="Birthday Celebration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Joyful Birthdays</p>
                   </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative h-[32rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/output-2.png" alt="Kids Birthday" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Magical Milestones</p>
                   </div>
                </motion.div>
             </div>

             <div className="space-y-8 md:pt-16">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative h-[40rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/output-3.png" alt="Anniversary Celebration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Romantic Anniversaries</p>
                   </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative h-[26rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/marriage.jpg" alt="Marriage Celebration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Grand Marriages</p>
                   </div>
                </motion.div>
             </div>

             <div className="space-y-8 md:pt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative h-[32rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/output-4.png" alt="Grand Celebrations" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Vibrant Gatherings</p>
                   </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative h-[24rem] rounded-[2.5rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500"
                >
                   <img src="/output-5.jpg" alt="Proud Milestones" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="font-serif text-2xl md:text-3xl">Proud Milestones</p>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 2.7. MEET OUR TEAM SECTION */}
      <section id="team" className="py-24 bg-[#FFFAF0] relative scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
             <h3 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">{t("Meet Our Team")}</h3>
             <p className="text-stone-500 font-light text-lg mb-16 max-w-2xl mx-auto">
                The passionate individuals who work tirelessly behind the scenes to make your euphoria a reality.
             </p>
             <div className="relative max-w-6xl mx-auto py-16 px-4">
                <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent -translate-x-1/2 md:block hidden"></div>
                
                <div className="space-y-12 md:space-y-24">
                  {TEAM_MEMBERS.map((member, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 20 }}
                        className={`relative flex flex-col md:flex-row items-center justify-between w-full group`}
                      >
                        <div className={`w-full md:w-[45%] flex ${isLeft ? 'md:justify-end' : 'md:justify-start'} ${isLeft ? '' : 'md:order-last'}`}>
                           <a 
                             href={member.linkedin} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className={`relative flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 w-full max-w-lg rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:bg-white/60 transition-all duration-500 focus:outline-none overflow-hidden ${isLeft ? 'sm:flex-row-reverse sm:text-right text-center' : 'sm:text-left text-center'}`}
                           >
                             <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-rose-50/0 group-hover:from-amber-50/50 group-hover:to-rose-50/50 transition-all duration-700 -z-10" />

                             <div className="w-32 h-32 shrink-0 rounded-full bg-stone-100 border-[6px] border-white shadow-lg relative overflow-hidden group-hover:-translate-y-2 transition-all duration-500">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f5f5f4&color=78716c&size=256&font-size=0.33`}
                                  alt={member.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                             </div>
                             
                             <div className="flex flex-col flex-1 z-10 w-full">
                                <h4 className="font-serif text-2xl text-stone-800 group-hover:text-amber-700 transition-colors duration-300">{member.name}</h4>
                                <p className="text-stone-500 font-medium text-xs md:text-sm tracking-widest uppercase mt-2 mb-4">{member.role}</p>
                                <div className={`w-12 h-px bg-amber-300 group-hover:w-full transition-all duration-700 ${isLeft ? 'sm:ml-auto mx-auto' : 'sm:mr-auto mx-auto'}`}></div>
                             </div>
                           </a>
                        </div>

                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 items-center justify-center z-10">
                            <div className="absolute inset-0 rounded-full bg-amber-100/50 scale-0 group-hover:scale-100 transition-transform duration-500" />
                            <div className="w-4 h-4 rounded-full bg-white border-4 border-amber-300 shadow-md group-hover:scale-125 group-hover:border-amber-400 transition-all duration-300 z-10" />
                        </div>

                        <div className="hidden md:block w-[45%]"></div>
                      </motion.div>
                    )
                  })}
                </div>
             </div>
        </div>
      </section>

      {/* 3. CONTACT US SECTION */}
      <section id="contact" className="py-24 bg-white relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">Let&apos;s Create Something Beautiful</h2>
            <p className="text-stone-500 font-light text-lg">
              Have a special request or need help planning a deeply personal surprise? We are here to listen.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="bg-[#FFFAF0] p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white font-light"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">How can we help?</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white resize-none font-light"
                    placeholder="Tell us a bit about the occasion and who you are celebrating..."
                  />
                </div>

                <button className="w-full bg-stone-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                  Send Message <Heart className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex flex-col justify-between space-y-12 lg:pl-8">
              <div className="space-y-10">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-stone-800 mb-1">Email</h4>
                    <p className="text-stone-500 font-light mb-2">We read and reply to every message.</p>
                    <a href="mailto:hello@euphoria.com" className="text-amber-700 font-medium hover:underline">hello@euphoria.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-stone-800 mb-1">Our Studio</h4>
                    <p className="text-stone-500 font-light mb-2">Stop by for a coffee and a chat.</p>
                    <p className="text-stone-800 font-medium">100 Celebration Avenue<br/>Bengaluru, KA 560001</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-stone-800 mb-1">Phone</h4>
                    <p className="text-stone-500 font-light mb-2">Available Mon-Fri, 9am to 6pm.</p>
                    <p className="text-stone-800 font-medium">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-500" />
            <span className="font-serif font-medium text-xl text-white">Euphoria</span>
          </div>
          <p className="text-stone-400 text-sm">
            © 2026 Euphoria Surprise Planners. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
