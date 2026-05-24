/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, CalendarHeart, Gift, Star, Baby, GlassWater, ArrowLeft,
  MapPin, CheckCircle2, Trophy, Target, Clock, Mail, Phone, User, 
  Sparkles, ShieldCheck, Award, Check
} from "lucide-react";

const CITIES = [
  "Bengaluru", "Mumbai", "Delhi", "Goa", "Pune", 
  "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Udaipur", "International / Destination"
];

const SURPRISE_SUGGESTIONS: Record<string, { purpose: string, location: string, plans: string[] }> = {
  "Birthday": { purpose: "e.g. 30th Milestone, Surprise Party", location: "e.g. Their favorite restaurant, childhood home...", plans: ["Midnight Cake & Decor", "Flash Mob Surprise", "Private Rooftop Party", "I have my own plan"] },
  "Anniversary": { purpose: "e.g. 10th Wedding Anniversary", location: "e.g. Where we first met, romantic getaway...", plans: ["Romantic Setup with Live Music", "Private Yacht Getaway", "Candlelight Beach Dinner", "I have my own plan"] },
  "Proposal": { purpose: "e.g. Popping the question!", location: "e.g. Scenic viewpoint, private beach...", plans: ["Helicopter Ride Proposal", "Romantic Setup with Live Music", "Flash Mob Surprise", "I have my own plan"] },
  "Farewell": { purpose: "e.g. Colleague moving abroad", location: "e.g. Office lounge, favorite pub...", plans: ["Surprise Office Send-off", "Video Tribute & Drinks", "Weekend Getaway", "I have my own plan"] },
  "Graduation": { purpose: "e.g. College Graduation", location: "e.g. Campus grounds, family home...", plans: ["Grand Limousine Arrival", "Luxury Dinner Party", "Surprise Alumni Meetup", "I have my own plan"] },
  "Marriage": { purpose: "e.g. Grand Wedding Surprise", location: "e.g. Banquet hall, palace...", plans: ["Grand Royal Entry", "Celebrity Artist Performance", "Fireworks & Drone Show", "I have my own plan"] },
  "Default": { purpose: "e.g. Special milestone, achievement...", location: "e.g. At home, their office, a restaurant...", plans: ["Custom Themed Setup", "Flash Mob Surprise", "Luxury Dining Experience", "I have my own plan"] }
};

const OCCASIONS = [
  { name: "Birthday", icon: Gift },
  { name: "Anniversary", icon: CalendarHeart },
  { name: "Marriage", icon: Heart },
  { name: "Proposal", icon: Heart },
  { name: "Graduation", icon: Star },
  { name: "Romantic Date", icon: GlassWater },
  { name: "Engagement Party", icon: CalendarHeart },
  { name: "Retirement", icon: Trophy },
  { name: "Reunion", icon: Target },
  { name: "Farewell", icon: MapPin },
  { name: "Apology", icon: Heart },
  { name: "1-Hour Surprise", icon: Gift }
];

const GAMES = [
  "Custom Trivia", "Scavenger Hunt", "Musical Chairs", "Karaoke Setup", 
  "Pictionary", "Charades", "Truth or Dare", "Bingo", 
  "Two Truths and a Lie", "Murder Mystery", "Mini Escape Room", 
  "Giant Jenga", "Board Game Lounge", "Video Game Tournament", "No Games Needed"
];

const CUSTOMIZATIONS: Record<string, {name: string, price: number, isFromBudget: boolean}[]> = {
  "Marriage": [
    { name: "Premium Photography", price: 15000, isFromBudget: false },
    { name: "Drone Videography", price: 12000, isFromBudget: false },
    { name: "Bridal Makeup", price: 10000, isFromBudget: true },
    { name: "Live Band / DJ", price: 20000, isFromBudget: false },
    { name: "Gourmet Catering", price: 30000, isFromBudget: false }
  ],
  "Birthday": [
    { name: "Themed 3-Tier Cake", price: 5000, isFromBudget: true },
    { name: "Magic Show", price: 8000, isFromBudget: false },
    { name: "Polaroid Photo Booth", price: 6000, isFromBudget: false },
    { name: "Premium Return Gifts", price: 12000, isFromBudget: false }
  ],
  "Anniversary": [
    { name: "Private Violinist", price: 8000, isFromBudget: false },
    { name: "Customized Ring Box", price: 3000, isFromBudget: true },
    { name: "Champagne Tower", price: 15000, isFromBudget: false }
  ],
  "Default": [
    { name: "Professional Photographer", price: 8000, isFromBudget: false },
    { name: "Live Music/DJ", price: 15000, isFromBudget: false },
    { name: "Premium Catering", price: 20000, isFromBudget: false },
    { name: "Welcome Drinks", price: 5000, isFromBudget: true }
  ]
};


export default function BookEventPage() {
  const router = useRouter();
  const [bookingStep, setBookingStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [eventType, setEventType] = useState("");
  const [surprisePurpose, setSurprisePurpose] = useState("");
  const [surpriseLocation, setSurpriseLocation] = useState("");
  const [surpriseTeamPlan, setSurpriseTeamPlan] = useState("");
  const [customSurprisePlan, setCustomSurprisePlan] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  
  // Step 4 Form States
  const [targetPerson, setTargetPerson] = useState("");
  const [yourName, setYourName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [vibe, setVibe] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budgetRange, setBudgetRange] = useState("Premium");
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [secretNote, setSecretNote] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("Pay Total Now");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [prefilledMessage, setPrefilledMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const city = params.get("location");
      const occasion = params.get("occasion");
      if (city) {
        setSelectedCity(city);
      }
      if (occasion) {
        setSelectedOccasion(occasion);
        setPrefilledMessage(`Your choice of "${occasion}" occasion ${city ? `in ${city}` : ""} has been pre-selected. Please verify and proceed step-by-step.`);
      }
    }
  }, []);

  const toggleGame = (game: string) => {
    if (game === "No Games Needed") {
      setSelectedGames(["No Games Needed"]);
      return;
    }
    
    setSelectedGames(prev => {
      const filtered = prev.filter(g => g !== "No Games Needed");
      if (filtered.includes(game)) {
        return filtered.filter(g => g !== game);
      } else {
        return [...filtered, game];
      }
    });
  };

  const toggleCustomization = (cust: string) => {
    setSelectedCustomizations(prev => {
      if (prev.includes(cust)) {
        return prev.filter(c => c !== cust);
      } else {
        return [...prev, cust];
      }
    });
  };

  const getThemeClasses = () => {
    switch (selectedOccasion) {
      case "Birthday": return { bg1: "bg-blue-100", bg2: "bg-rose-100", border: "border-blue-400", accent: "bg-blue-600", text: "text-blue-800", shadow: "shadow-blue-900/10" };
      case "Anniversary": return { bg1: "bg-rose-100", bg2: "bg-amber-100", border: "border-rose-400", accent: "bg-rose-600", text: "text-rose-800", shadow: "shadow-rose-900/10" };
      case "Proposal": return { bg1: "bg-stone-300", bg2: "bg-amber-200", border: "border-stone-800", accent: "bg-stone-900", text: "text-stone-900", shadow: "shadow-stone-900/20" };
      case "Marriage": return { bg1: "bg-amber-100", bg2: "bg-rose-50", border: "border-amber-400", accent: "bg-amber-600", text: "text-amber-850", shadow: "shadow-amber-900/10" };
      case "Baby Shower": return { bg1: "bg-orange-100", bg2: "bg-sky-100", border: "border-orange-300", accent: "bg-orange-400", text: "text-orange-700", shadow: "shadow-orange-900/10" };
      case "Farewell": return { bg1: "bg-stone-300", bg2: "bg-stone-200", border: "border-stone-400", accent: "bg-stone-600", text: "text-stone-800", shadow: "shadow-stone-900/10" };
      case "Graduation": return { bg1: "bg-indigo-200", bg2: "bg-amber-100", border: "border-indigo-500", accent: "bg-indigo-800", text: "text-indigo-900", shadow: "shadow-indigo-900/10" };
      default: return { bg1: "bg-amber-50", bg2: "bg-rose-50", border: "border-amber-400", accent: "bg-stone-900", text: "text-stone-800", shadow: "shadow-stone-900/10" };
    }
  };
  const theme = getThemeClasses();

  // Quote Calculator Logic
  const calculateQuote = () => {
    let base = 5000;
    if (selectedOccasion === "Marriage") base = 15000;
    else if (["Proposal", "Romantic Date"].includes(selectedOccasion)) base = 8000;
    else if (["Anniversary", "Engagement Party"].includes(selectedOccasion)) base = 10000;
    
    let locationMul = 1.0;
    if (selectedCity === "Mumbai" || selectedCity === "Delhi") locationMul = 1.1;
    else if (selectedCity === "Goa" || selectedCity === "Udaipur" || selectedCity === "International / Destination") locationMul = 1.2;
    
    let gamesCost = selectedGames.filter(g => g !== "No Games Needed").length * 1500;
    
    const occasionCusts = CUSTOMIZATIONS[selectedOccasion] || CUSTOMIZATIONS["Default"];
    const customizationsCost = selectedCustomizations.reduce((sum, custName) => {
      const cust = occasionCusts.find(c => c.name === custName);
      return sum + (cust && !cust.isFromBudget ? cust.price : 0);
    }, 0);
    
    let vibeCost = 0;
    if (vibe === "Luxurious & Grand") vibeCost = 8000;
    else if (vibe === "Romantic & Emotional") vibeCost = 4000;
    else if (vibe === "Magical & Ethereal") vibeCost = 5000;
    
    let budgetMultiplier = 1.0;
    if (budgetRange === "Luxury") budgetMultiplier = 1.4;
    else if (budgetRange === "Super Premium") budgetMultiplier = 1.2;
    else if (budgetRange === "Standard") budgetMultiplier = 0.9;
    
    const subtotal = Math.round((base * locationMul + gamesCost + customizationsCost + vibeCost) * budgetMultiplier);
    const vipDiscount = Math.round(subtotal * 0.15); // Standard 15% VIP registry discount
    let total = subtotal - vipDiscount;
    let paymentDiscount = 0;
    
    if (paymentPreference === "Pay Total Now") {
      paymentDiscount = Math.round(total * 0.0099); // 0.99% discount
      total = total - paymentDiscount;
    }
    
    return { base, locationMul, gamesCost, customizationsCost, vibeCost, budgetMultiplier, subtotal, discount: vipDiscount, paymentDiscount, total };
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const priceDetails = calculateQuote();
    
    // Save details to localStorage
    const bookingData = {
      id: "EUPH-" + Math.floor(10000 + Math.random() * 90000),
      eventType,
      surprisePurpose,
      surpriseLocation,
      surpriseTeamPlan,
      customSurprisePlan,
      city: selectedCity,
      occasion: selectedOccasion,
      games: selectedGames,
      targetPerson,
      yourName,
      contactEmail,
      contactPhone,
      relationship,
      vibe,
      guestCount,
      budgetRange,
      targetDate,
      targetTime,
      venueAddress,
      guestPhone: guestPhone || "Not Provided",
      secretNote,
      wishMessage,
      bookingTimestamp: Date.now(),
      priceDetails
    };
    
    let sessionStr = localStorage.getItem("euphoria_session");
    
    let userEmail = "guest";
    if (sessionStr) {
      try { userEmail = JSON.parse(sessionStr).email || JSON.parse(sessionStr).phone; } catch(e) {}
    }
    
    if (userEmail === "guest") {
      const guestBookingsStr = localStorage.getItem("activeBookings");
      const guestBookings = guestBookingsStr ? JSON.parse(guestBookingsStr) : [];
      guestBookings.unshift(bookingData);
      localStorage.setItem("activeBookings", JSON.stringify(guestBookings));
    } else {
      const storageKey = `activeBookings_${userEmail}`;
      const existingBookingsStr = localStorage.getItem(storageKey);
      const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      
      const updatedBookings = [bookingData, ...existingBookings];
      localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    }
    
    localStorage.setItem("activeBooking", JSON.stringify(bookingData));
    
    // Redirect to profile page with newBooking flag to show success toast
    localStorage.setItem("showBookingNotification", "true");
    
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } catch (error) {
      console.error('Email failed to send', error);
    }
    
    setIsLoading(false);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] pt-24 pb-16 px-6 relative overflow-hidden flex items-center justify-center transition-colors duration-1000">
      {/* Dynamic Background Ornaments */}
      <motion.div animate={{ backgroundColor: theme.bg1 }} className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] -z-10 mix-blend-multiply transition-colors duration-1000 ${theme.bg1}`} />
      <motion.div animate={{ backgroundColor: theme.bg2 }} className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 mix-blend-multiply transition-colors duration-1000 ${theme.bg2}`} />

      <div className={`w-full ${bookingStep >= 4 ? "max-w-6xl" : "max-w-4xl"}`}>
        <Link href="/#explore" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        {prefilledMessage && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-sm font-medium flex items-center gap-3 animate-fade-in shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{prefilledMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-white overflow-hidden relative ${bookingStep >= 4 ? "lg:col-span-8" : "lg:col-span-12"}`}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-amber-500" />
            
            <div className="p-8 md:p-12">
              <div className="mb-10 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div key={step} className="flex items-center">
                      <button 
                        type="button"
                        onClick={() => {
                          if (step < bookingStep) {
                            setBookingStep(step);
                          } else if (step === 2 && eventType) {
                            setBookingStep(2);
                          } else if (step === 3 && eventType && selectedCity) {
                            setBookingStep(3);
                          } else if (step === 4 && eventType && selectedCity && selectedOccasion) { setBookingStep(4); } else if (step === 5 && eventType && selectedCity && selectedOccasion) { setBookingStep(5); } else if (step === 6 && eventType && selectedCity && selectedOccasion) { setBookingStep(6); }
                        }}
                        disabled={step > bookingStep && !(step === 2 && eventType) && !(step === 3 && eventType && selectedCity) && !(step === 4 && eventType && selectedCity && selectedOccasion) && !(step === 5 && eventType && selectedCity && selectedOccasion) && !(step === 6 && eventType && selectedCity && selectedOccasion)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          bookingStep === step 
                            ? `${theme.accent} text-white shadow-md scale-110` 
                            : bookingStep > step 
                            ? "bg-stone-855 text-white hover:bg-stone-700" 
                            : "bg-stone-100 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        {bookingStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                      </button>
                      {step < 6 && (
                        <div className={`w-8 h-px mx-2 ${bookingStep > step ? "bg-stone-800" : "bg-stone-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-3">
                  {bookingStep === 1 && "What kind of event?"}
                  {bookingStep === 2 && "Where are we celebrating?"}
                  {bookingStep === 3 && "What is the Occasion?"}
                  {bookingStep === 4 && "Occasion Customizations"}
                  {bookingStep === 5 && "Pick Some Fun Activities"}
                  {bookingStep === 6 && "The Finer Details"}
                </h1>
                <p className="text-stone-500 font-light text-lg">
                  {bookingStep === 1 && "Select whether this is a surprise or a common event."}
                  {bookingStep === 2 && "Choose a city to help us find the perfect venue."}
                  {bookingStep === 3 && "Select one of our beautifully crafted event types."}
                  {bookingStep === 4 && "Select premium customizations tailored to your occasion."}
                  {bookingStep === 5 && "Add some excitement with our curated games and activities."}
                  {bookingStep === 6 && "Tell us exactly how you want this memory to unfold."}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {bookingStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <button
                        type="button"
                        onClick={() => setEventType("Surprise Event")}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                          eventType === "Surprise Event" 
                            ? `${theme.border} bg-amber-50 text-amber-900 shadow-sm border-amber-500 scale-[1.02]` 
                            : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/30"
                        }`}
                      >
                        <Gift className={`w-8 h-8 ${eventType === "Surprise Event" ? "text-amber-600" : "text-stone-400"}`} />
                        <div>
                          <span className="font-bold text-lg block mb-1">Surprise Event</span>
                          <span className="text-sm font-light">Keep it a secret! We'll help you plan everything without the guest of honor knowing.</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventType("Common Event")}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                          eventType === "Common Event" 
                            ? `${theme.border} bg-amber-50 text-amber-900 shadow-sm border-amber-500 scale-[1.02]` 
                            : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/30"
                        }`}
                      >
                        <CalendarHeart className={`w-8 h-8 ${eventType === "Common Event" ? "text-amber-600" : "text-stone-400"}`} />
                        <div>
                          <span className="font-bold text-lg block mb-1">Common Event</span>
                          <span className="text-sm font-light">A regular celebration where everyone is involved in the planning process.</span>
                        </div>
                      </button>
                    </div>
                    {eventType === "Surprise Event" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-10 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                        {(() => {
                          const suggestions = SURPRISE_SUGGESTIONS[selectedOccasion] || SURPRISE_SUGGESTIONS["Default"];
                          return (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">What's the purpose of the surprise?</label>
                                <input type="text" value={surprisePurpose} onChange={(e) => setSurprisePurpose(e.target.value)} placeholder={suggestions.purpose} className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Where do you want to surprise them?</label>
                                <input type="text" value={surpriseLocation} onChange={(e) => setSurpriseLocation(e.target.value)} placeholder={suggestions.location} className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-stone-700 mb-4">Choose a Team Recommended Plan</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {suggestions.plans.map(plan => (
                                    <button key={plan} type="button" onClick={() => setSurpriseTeamPlan(plan)} className={`p-4 rounded-xl border text-left transition-all ${surpriseTeamPlan === plan ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}>
                                      {plan}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                        {surpriseTeamPlan === "I have my own plan" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Create your own surprise (We will celebrate it!)</label>
                            <textarea value={customSurprisePlan} onChange={(e) => setCustomSurprisePlan(e.target.value)} placeholder="Describe your unique vision here..." rows={4} className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        type="button"
                        disabled={!eventType || (eventType === "Surprise Event" && (!surprisePurpose || !surpriseLocation || !surpriseTeamPlan || (surpriseTeamPlan === "I have my own plan" && !customSurprisePlan)))}
                        onClick={() => setBookingStep(2)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: CITY */}
                {bookingStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setSelectedCity(city)}
                          className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                            selectedCity === city 
                              ? `${theme.border} bg-amber-50 text-amber-900 shadow-sm border-amber-500 scale-[1.02]` 
                              : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/30"
                          }`}
                        >
                          <MapPin className={`w-5 h-5 ${selectedCity === city ? "text-amber-600" : "text-stone-400"}`} />
                          <span className="font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        disabled={!selectedCity}
                        onClick={() => setBookingStep(3)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: OCCASION */}
                {bookingStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                      {OCCASIONS.map((occ) => {
                        const Icon = occ.icon;
                        const isActive = selectedOccasion === occ.name;
                        return (
                          <button
                            key={occ.name}
                            type="button"
                            onClick={() => setSelectedOccasion(occ.name)}
                            className={`flex flex-col items-center text-center gap-3 p-5 rounded-2xl border transition-all ${
                              isActive 
                                ? `${theme.border} ${theme.bg1} shadow-sm scale-105 border-amber-500` 
                                : "bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 text-stone-600"
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${isActive ? theme.text : "text-stone-400"}`} />
                            <span className={`font-medium text-xs leading-tight ${isActive ? theme.text : ""}`}>{occ.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" onClick={() => setBookingStep(2)} className="text-stone-500 font-medium hover:text-stone-855">
                        Back
                      </button>
                      <button 
                        type="button"
                        disabled={!selectedOccasion}
                        onClick={() => setBookingStep(5)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}

                
                {/* STEP 4: CUSTOMIZATIONS */}
                {bookingStep === 4 && (
                  <motion.div
                    key="step4cust"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {(CUSTOMIZATIONS[selectedOccasion] || CUSTOMIZATIONS["Default"]).map((cust) => {
                        const isSelected = selectedCustomizations.includes(cust.name);
                        return (
                          <button
                            key={cust.name}
                            type="button"
                            onClick={() => toggleCustomization(cust.name)}
                            className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center gap-3 ${
                              isSelected 
                                ? `${theme.border} ${theme.bg2} shadow-sm border-amber-500` 
                                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                            }`}
                          >
                            <span className={`font-medium ${isSelected ? theme.text : "text-stone-700"}`}>
                              {cust.name}
                            </span>
                            <span className="text-xs font-mono font-medium opacity-80">
                              {cust.isFromBudget ? "Included in Budget" : `+ ₹${cust.price.toLocaleString('en-IN')}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" onClick={() => setBookingStep(3)} className="text-stone-500 font-medium hover:text-stone-855">
                        Back to Occasions
                      </button>
                      <button 
                        type="button"
                        onClick={() => setBookingStep(5)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-md`}
                      >
                        {selectedCustomizations.length === 0 ? "Skip Customizations" : "Next Step"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: GAMES */}
                {bookingStep === 5 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                      {GAMES.map((game) => {
                        const isSelected = selectedGames.includes(game);
                        return (
                          <button
                            key={game}
                            type="button"
                            onClick={() => toggleGame(game)}
                            className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                              isSelected 
                                ? `${theme.border} ${theme.bg2} shadow-sm border-amber-500` 
                                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? theme.accent : "border-stone-300"}`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`font-medium text-sm leading-tight ${isSelected ? theme.text : ""}`}>{game}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" onClick={() => setBookingStep(4)} className="text-stone-500 font-medium hover:text-stone-855">
                        Back to Customizations
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (selectedGames.length === 0) toggleGame("No Games Needed");
                          setBookingStep(6);
                        }} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-md`}
                      >
                        {selectedGames.length === 0 ? "Skip Activities" : "Next Step"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: FORM DETAILS */}
                {bookingStep === 6 && (
                  <motion.form 
                    key="step5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={submitDetails} 
                    className="space-y-6 text-left"
                  >
                    <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 mb-6 flex items-start gap-3 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-stone-850 mb-1">Direct Booking Quote Verification</h4>
                        <p className="text-xs text-stone-655 font-light leading-relaxed">
                          Your satisfaction is our priority. Please fill out these final details meticulously so we can curate the most magical and exclusive experience for your loved ones.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 mb-4">
                      1. Contact & Booking Registry
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Your Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            required 
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            placeholder="e.g. David Cooper" 
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Contact Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input 
                            type="email" 
                            required 
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="david@example.com" 
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Contact Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input 
                            type="tel" 
                            required 
                            pattern="[0-9+-\s]{8,15}"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="e.g. 9876543210" 
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Relationship to Guest of Honor" : "Role in Event"} <span className="text-red-500">*</span></label>
                        <select 
                          required
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-850 text-sm font-medium transition-all"
                        >
                          <option value="">-- Select Relationship --</option>
                          <option value="Spouse">Spouse / Partner</option>
                          <option value="Friend">Close Friend</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Son / Daughter</option>
                          <option value="Colleague">Colleague / Work Partner</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      2. {eventType === "Surprise Event" ? "Surprise Celebration Specifics" : "Event Specifics"}
                    </h3>

                    {eventType === "Surprise Event" && (<div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Person being surprised <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required={eventType === "Surprise Event"}
                          value={targetPerson}
                          onChange={(e) => setTargetPerson(e.target.value)}
                          placeholder="e.g. Sarah" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Guest of honor&apos;s phone (Optional)</label>
                        <input 
                          type="tel" 
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210 (Kept secret)" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                    </div>)}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Date of Surprise" : "Event Date"} <span className="text-red-500">*</span></label>
                        <input 
                          type="date" 
                          required 
                          min={new Date().toISOString().split("T")[0]}
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Time of Surprise" : "Event Time"} <span className="text-red-500">*</span></label>
                        <input 
                          type="time" 
                          required 
                          value={targetTime}
                          onChange={(e) => setTargetTime(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Surprise Vibe / Aesthetic Theme <span className="text-red-500">*</span></label>
                        <select 
                          required
                          value={vibe}
                          onChange={(e) => setVibe(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-850 text-sm font-medium transition-all"
                        >
                          <option value="">-- Select Vibe Style --</option>
                          <option value="Luxurious & Grand">Luxurious & Grand (High-end setups)</option>
                          <option value="Romantic & Emotional">Romantic & Emotional (Warm & Cozy)</option>
                          <option value="Vibrant & Energetic">Vibrant & Energetic (Colorful & Playful)</option>
                          <option value="Magical & Ethereal">Magical & Ethereal (Fairy lights & Pastels)</option>
                          <option value="Intimate & Minimalist">Intimate & Minimalist (Subtle & Refined)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Expected Attendance (Guest Count) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          required 
                          min="1"
                          max="2000"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          placeholder="e.g. 15" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Venue / Location Address <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          placeholder="Full address, hotel room, or exact coordinates" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Budget Preference Tier <span className="text-red-500">*</span></label>
                        <select 
                          required
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-850 text-sm font-medium transition-all"
                        >
                          <option value="Standard">Standard (Great value, premium vendors)</option>
                          <option value="Super Premium">Super Premium (+35% for custom elements)</option>
                          <option value="Luxury">Luxury (+60% ultra-exclusive execution)</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      3. Personal Notes & Coordination
                    </h3>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Secret note for the planners" : "Event Instructions & Preferences"} <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required 
                        value={secretNote}
                        onChange={(e) => setSecretNote(e.target.value)}
                        placeholder={eventType === "Surprise Event" ? "Tell us how to keep it a secret, any specific instructions, food allergies..." : "Any specific instructions, food allergies, or elements to avoid..."} 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>

                    {eventType === "Surprise Event" && (<div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">Heartfelt wish message for the guest <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required={eventType === "Surprise Event"}
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        placeholder="This personal message will be printed on the keepsake card presented at the reveal moment..." 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>)}
                    
                    <h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      4. Payment Preference
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={`cursor-pointer rounded-xl border p-4 flex flex-col gap-2 transition-all ${paymentPreference === 'Pay Total Now' ? 'border-amber-500 bg-amber-50/30 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="Pay Total Now"
                            checked={paymentPreference === 'Pay Total Now'}
                            onChange={(e) => setPaymentPreference(e.target.value)}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm font-semibold text-stone-800">Pay Total Now</span>
                        </div>
                        <p className="text-xs text-stone-500 ml-6">Secure your booking instantly and receive an additional 0.99% discount on your grand total.</p>
                      </label>

                      <label className={`cursor-pointer rounded-xl border p-4 flex flex-col gap-2 transition-all ${paymentPreference === 'Pay Advance (₹1500)' ? 'border-amber-500 bg-amber-50/30 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="Pay Advance (₹1500)"
                            checked={paymentPreference === 'Pay Advance (₹1500)'}
                            onChange={(e) => setPaymentPreference(e.target.value)}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm font-semibold text-stone-800">Pay Advance (₹1,500)</span>
                        </div>
                        <p className="text-xs text-stone-500 ml-6">Reserve your slot with a minimal deposit. Pay the remaining balance 24 hours prior to the event.</p>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-stone-100">
                      <button type="button" onClick={() => setBookingStep(6)} className="text-stone-500 font-medium hover:text-stone-800">
                        Back to Games
                      </button>
                      <button type="submit" disabled={isLoading} className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-lg ${theme.shadow} flex items-center gap-2 disabled:opacity-50`}>
                        {isLoading ? "Processing..." : <><Mail className="w-4 h-4" /> Finalize & Send Estimate</>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* DYNAMIC ESTIMATE PANEL - Visible only on Steps 3 and 4 when data starts getting filled */}
          <AnimatePresence>
            {bookingStep >= 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-4 sticky top-28"
              >
                <div className="bg-stone-900 border border-stone-850 rounded-[2.5rem] p-8 text-stone-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="flex justify-between items-start border-b border-stone-800 pb-5 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-450 font-serif text-sm">
                        <Award className="w-4.5 h-4.5" /> Euphoria Surprise Planners
                      </div>
                      <h3 className="text-xl font-serif text-white tracking-wide">Exclusive Estimate</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block font-mono">REF: EQ-2026-X82F</span>
                      <span className="text-[10px] text-stone-500 block font-mono">EST: {new Date().toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</span>
                    </div>
                  </div>

                  {!selectedCity || !selectedOccasion ? (
                    <div className="text-center py-10">
                      <p className="text-stone-400 text-sm font-light">Please select a location and occasion to compile your live estimation.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 text-xs font-light text-stone-400 mb-6">
                        <div className="flex justify-between">
                          <span>Base Sourcing ({selectedOccasion})</span>
                          <span className="font-mono text-stone-200">₹{calculateQuote().base.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location Modifier ({selectedCity})</span>
                          <span className="font-mono text-stone-200">x {calculateQuote().locationMul}</span>
                        </div>
                        {selectedCustomizations.length > 0 && (
                          <div className="flex justify-between">
                            <span>Customizations ({selectedCustomizations.length})</span>
                            <span className="font-mono text-stone-200">+ ₹{calculateQuote().customizationsCost.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Activities ({selectedGames.length} selected)</span>
                          <span className="font-mono text-stone-200">+ ₹{calculateQuote().gamesCost.toLocaleString("en-IN")}</span>
                        </div>
                        {bookingStep === 5 && vibe && (
                          <div className="flex justify-between">
                            <span>Vibe Theme ({vibe})</span>
                            <span className="font-mono text-stone-200">+ ₹{calculateQuote().vibeCost.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {bookingStep === 5 && budgetRange && (
                          <div className="flex justify-between">
                            <span>Budget Tier ({budgetRange})</span>
                            <span className="font-mono text-stone-200">x {calculateQuote().budgetMultiplier}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-stone-800 pt-4 flex justify-between text-sm text-stone-300 font-normal">
                          <span>Subtotal</span>
                          <span className="font-mono text-stone-200">₹{calculateQuote().subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm text-emerald-400 font-semibold bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 fill-current" /> VIP Savings (15%)</span>
                          <span className="font-mono">- ₹{calculateQuote().discount.toLocaleString("en-IN")}</span>
                        </div>
                        {bookingStep === 5 && paymentPreference === "Pay Total Now" && calculateQuote().paymentDiscount > 0 && (
                          <div className="flex justify-between text-sm text-amber-400 font-semibold bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/30 mt-2">
                            <span>Total Payment Discount (0.99%)</span>
                            <span className="font-mono">- ₹{calculateQuote().paymentDiscount.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                      </div>

                      {/* Perks Section */}
                      {bookingStep === 5 && budgetRange && (
                        <div className="border-t border-stone-850 pt-5 mb-5">
                          <h4 className="text-stone-300 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Gift className="w-3.5 h-3.5 text-amber-500" /> What You Get
                          </h4>
                          <ul className="space-y-2 text-xs font-light text-stone-400">
                            {budgetRange === "Luxury" ? (
                              <>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Private ultra-luxury venue with exclusive access</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Cinematic videography & drone coverage</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Gourmet 7-course meal & premium champagne</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Dedicated event director & 24/7 concierge</li>
                              </>
                            ) : budgetRange === "Super Premium" ? (
                              <>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Premium reserved venue section</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Professional photography session</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Custom 3-course menu & welcome drinks</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> On-site event coordinator</li>
                              </>
                            ) : (
                              <>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Beautifully decorated standard venue</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Candid photography coverage</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Delicious celebratory cake & snacks</li>
                                <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Pre-event planning support</li>
                              </>
                            )}
                            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> All {selectedGames.filter(g => g !== "No Games Needed").length} selected activities with props</li>
                                                        {selectedCustomizations.map(c => (
                              <li key={c} className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> {c}</li>
                            ))}
                            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Complete {vibe || 'chosen'} aesthetic setup</li>
                          </ul>
                        </div>
                      )}

                      <div className="border-t border-dashed border-stone-850 pt-5 flex justify-between items-baseline">
                        <div>
                          <span className="font-serif text-lg text-stone-100 font-medium">Estimated Total</span>
                          <span className="text-[9px] text-stone-500 block mt-0.5">Sourced vendor cost basis inclusive of all taxes</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-serif text-amber-400 font-semibold tracking-wide">
                            ₹{calculateQuote().total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  <button 
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="w-full mt-4 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    Edit Budget Plan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
