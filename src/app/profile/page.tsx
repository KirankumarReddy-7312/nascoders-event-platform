/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, CalendarHeart, Gift, Star, Baby, GlassWater, ArrowLeft,
  MapPin, CheckCircle2, Trophy, Target, Clock, Mail, Phone, User, 
  Sparkles, ShieldCheck, Lock, Edit3, X, FileText, Check, Award, AlertCircle, LogOut, Sun
} from "lucide-react";

const OCCASION_QUOTES: Record<string, string> = {
  Birthday: "A birthday is not just a marker of time, but a celebration of the beautiful space you occupy in our hearts. Let's make this year's journey extraordinary!",
  Anniversary: "True love is a collection of tiny, beautiful moments woven together over time. Celebrating the beautiful thread that binds your hearts forever.",
  Proposal: "In a world of billions, finding the one who makes your soul sing is a miracle. Here's to the moment that begins your forever.",
  Graduation: "The future belongs to those who believe in the beauty of their dreams. This is your moment to shine and spread your wings!",
  "Baby Shower": "A grand adventure is about to begin. Welcoming a little soul filled with wonder, laughter, and infinite love into your lives.",
  "Romantic Date": "Time stands still when you are with the one who holds your heart. Let's create an evening where only your whispers exist.",
  "Bridal Shower": "To the beautiful bride-to-be, may your path be showered with laughter, friendship, and a love that grows deeper with each passing day.",
  "Engagement Party": "Two lives, two hearts, joined together in friendship, united forever in love. Let the celebration of your journey begin!",
  Retirement: "Every ending is a brand new beginning. Cheers to a lifetime of dedication, and to the beautiful, unwritten chapters ahead.",
  Reunion: "Time changes many things, but the warmth of old friends and shared memories remains untouched. Let's gather and remember.",
  Farewell: "Goodbyes are hard, but they are also doors to new adventures. Carry our love with you, wherever the path leads.",
  Housewarming: "May your new home be filled with warmth, laughter, and beautiful memories that echo through every room.",
  Promotion: "Success is the sum of small efforts repeated day in and day out. Celebrating your brilliance and the heights you will reach!",
  Apology: "A sincere apology is the superglue of life. It can repair almost anything, restoring warmth to the hearts we cherish.",
  "1-Hour Surprise": "The most beautiful gestures are the ones that have no reason other than to see a smile on the face of someone we love.",
  Marriage: "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever."
};

const OCCASIONS_DATA = [
  { name: "Birthday", img: "/birthday.png", color: "bg-blue-900" },
  { name: "Anniversary", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop", color: "bg-rose-900" },
  { name: "Marriage", img: "/marriage-occasion.jpg", color: "bg-amber-950" },
  { name: "Proposal", img: "/proposal.jpg", color: "bg-stone-900" },
  { name: "Graduation", img: "/graduate.png", color: "bg-indigo-900" },
  { name: "Romantic Date", img: "/romantic-date.jpg", color: "bg-red-900" },
  { name: "Engagement Party", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop", color: "bg-purple-900" },
  { name: "Retirement", img: "/retirement.jpg", color: "bg-emerald-900" },
  { name: "Reunion", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop", color: "bg-amber-900" },
  { name: "Farewell", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop", color: "bg-slate-900" },
  { name: "Apology", img: "/apology.png", color: "bg-gray-800" },
  { name: "1-Hour Surprise", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop", color: "bg-yellow-900" }
];



const getOccasionQuote = (occasion: string) => {
  return OCCASION_QUOTES[occasion] || "Celebrating the beautiful moments that make life truly extraordinary and memorable.";
};

const BookingDashboardItem = ({ booking, getOccasionQuote, onEdit, isCompleted }: { booking: any, getOccasionQuote: (occ: string) => string, onEdit: (b: any) => void, isCompleted?: boolean }) => {
  const [eventTimeLeft, setEventTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [editTimeLeft, setEditTimeLeft] = useState("03h 00m 00s");
  const [isEditWindowActive, setIsEditWindowActive] = useState(true);

  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // 1. Surprise Date Countdown
      if (booking.targetDate) {
        const eventDateTime = new Date(`${booking.targetDate}T${booking.targetTime || "00:00"}`).getTime();
        const distance = eventDateTime - now;
        
        if (distance <= 0) {
          setEventTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setEventTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }

      // 2. Edit window countdown (3 hours = 3 * 3600 * 1000 = 10,800,000 ms)
      const editDeadline = booking.bookingTimestamp + 3 * 3600 * 1000;
      const timeLeftMs = editDeadline - now;

      if (timeLeftMs <= 0) {
        setIsEditWindowActive(false);
        setEditTimeLeft("Expired");
      } else {
        setIsEditWindowActive(true);
        const hrs = Math.floor(timeLeftMs / (1000 * 60 * 60));
        const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
        setEditTimeLeft(`${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  return (
    <div className="space-y-8 mb-12">
      {/* Event Summary and Live Countdown Card */}
      <div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200/50 rounded-3xl p-8 md:p-10 shadow-lg shadow-stone-200/50 relative overflow-hidden transition-all hover:shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px]" />
        
        {/* Event Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 tracking-wider uppercase mb-3 border border-emerald-200/50">
              <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" /> {booking.eventType || "Celebration"}
            </div>
            <h1 className="text-3xl font-serif text-stone-850 font-medium mb-1">
              {booking.occasion} {booking.eventType === "Common Event" ? "Celebration" : "Surprise"}
            </h1>
            <p className="text-stone-500 text-sm font-light">
              {booking.eventType === "Common Event" ? "Celebrating" : "Surprising"} <span className="font-semibold text-stone-700">{booking.targetPerson}</span> {booking.relationship && `• (${booking.relationship})`}
            </p>
          </div>
          <div className="text-xs font-semibold px-4 py-2 bg-white rounded-xl border border-stone-200/60 text-stone-500 font-mono shadow-sm">
            ID: {booking.id}
          </div>
        </div>

        {/* HEARTWARMING OCCASION QUOTE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-50 border border-stone-100 rounded-2xl p-6 mb-8 text-center italic relative overflow-hidden"
        >
          <div className="absolute -top-3 -left-3 text-7xl font-serif text-amber-500/10 pointer-events-none select-none">“</div>
          <p className="text-stone-700 font-serif text-sm relative z-10 leading-relaxed md:px-6">
            "{getOccasionQuote(booking.occasion)}"
          </p>
          <div className="absolute -bottom-10 -right-3 text-7xl font-serif text-amber-500/10 pointer-events-none select-none">”</div>
        </motion.div>

        {/* TIMERS GRID */}
        {!isCompleted ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Event Countdown */}
          <div className="bg-stone-50 border border-stone-100 rounded-2.5xl p-6">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-4">
              <Clock className="w-4 h-4 text-amber-600" /> Time Until Event
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-center">
                <span className="text-3xl font-serif font-bold text-stone-800">{eventTimeLeft.days}</span>
                <span className="text-[9px] text-stone-400 uppercase font-bold block mt-0.5">Days</span>
              </div>
              <span className="text-stone-300 text-lg font-light">:</span>
              <div className="text-center">
                <span className="text-3xl font-serif font-bold text-stone-800">
                  {eventTimeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] text-stone-400 uppercase font-bold block mt-0.5">Hours</span>
              </div>
              <span className="text-stone-300 text-lg font-light">:</span>
              <div className="text-center">
                <span className="text-3xl font-serif font-bold text-stone-800">
                  {eventTimeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] text-stone-400 uppercase font-bold block mt-0.5">Mins</span>
              </div>
              <span className="text-stone-300 text-lg font-light">:</span>
              <div className="text-center">
                <span className="text-3xl font-serif font-bold text-stone-800">
                  {eventTimeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] text-stone-400 uppercase font-bold block mt-0.5">Secs</span>
              </div>
            </div>
          </div>

          {/* Edit Window Grace Period Countdown */}
          <div className="bg-stone-50 border border-stone-100 rounded-2.5xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                  <Edit3 className="w-4 h-4 text-amber-655" /> Edit Grace Window
                </div>
                {isEditWindowActive ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">
                    OPEN
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded border border-rose-200">
                    LOCKED
                  </span>
                )}
            </div>
              <p className="text-xs text-stone-500 font-light mb-4">
                You have exactly 3 hours post-booking to modify address, time, note, or guest wish details.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              {isEditWindowActive ? (
                <>
                  <div className="font-mono text-stone-800 text-lg font-bold">
                    {editTimeLeft}
                  </div>
                  <button 
                    onClick={() => onEdit(booking)}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Modify Details
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-900 text-xs p-3 rounded-xl font-light">
                  <Lock className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                  <span>Event specifications locked. Handcrafted sourcing in progress.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        ) : (
          <div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2.5xl flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-stone-800">Event Completed</h4>
              <p className="text-sm text-stone-500">We hope it was memorable! Tell us about your experience.</p>
            </div>
            <button className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800">Provide Feedback</button>
          </div>
        )}
        
        {/* Logistic Specs Summary */}
        <div className="border-t border-stone-100 pt-6 grid sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 mt-0.5 shrink-0 border border-stone-100">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Destination Address</p>
              <p className="font-medium text-stone-700 leading-tight mt-0.5">{booking.venueAddress}</p>
              <p className="text-xs text-stone-400 mt-0.5">{booking.city}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 mt-0.5 shrink-0 border border-stone-100">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Event Date & Time</p>
              <p className="font-medium text-stone-700 leading-tight mt-0.5">
                {new Date(booking.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{booking.targetTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 mt-0.5 shrink-0 border border-stone-100">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Vibe Style</p>
              <p className="font-medium text-stone-700 leading-tight mt-0.5">{booking.vibe}</p>
              <p className="text-xs text-stone-400 mt-0.5">{booking.guestCount} Attendants ({booking.budgetRange} tier)</p>
            </div>
          </div>
        </div>
      </div>

      {/* itemized digital quote invoice */}
      <div className="bg-stone-900 border border-stone-850 rounded-[2.5rem] p-8 text-stone-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex justify-between items-start border-b border-stone-800 pb-5 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-450 font-serif text-sm">
              <Award className="w-4.5 h-4.5" /> EUPHORIA CELEBRATIONS
            </div>
            <h3 className="text-xl font-serif text-white tracking-wide">Exclusive Vendor Invoice</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 block font-mono">INVOICE: #{booking.id}</span>
            <span className="text-[10px] text-stone-500 block font-mono">DATED: {new Date(booking.bookingTimestamp).toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-light text-stone-400 mb-6">
          <div className="flex justify-between">
            <span>Base Occasion Sourcing ({booking.occasion})</span>
            <span className="font-mono text-stone-200">₹{booking.priceDetails?.base?.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Location Multiplier ({booking.city})</span>
            <span className="font-mono text-stone-200">x {booking.priceDetails?.locationMul}</span>
          </div>
          <div className="flex justify-between">
            <span>Games & Activities upgrade ({booking.games?.length} selected)</span>
            <span className="font-mono text-stone-200">+ ₹{booking.priceDetails?.gamesCost?.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Aesthetic Vibe setup ({booking.vibe})</span>
            <span className="font-mono text-stone-200">+ ₹{booking.priceDetails?.vibeCost?.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Budget Tier Modifier ({booking.budgetRange})</span>
            <span className="font-mono text-stone-200">x {booking.priceDetails?.budgetMultiplier}</span>
          </div>
          <div className="border-t border-stone-800 pt-4 flex justify-between text-sm text-stone-300 font-normal">
            <span>Subtotal</span>
            <span className="font-mono text-stone-200">₹{booking.priceDetails?.subtotal?.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-emerald-400 font-semibold bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 fill-current" /> VIP Registry Savings (15% applied)</span>
            <span className="font-mono">- ₹{booking.priceDetails?.discount?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-stone-850 pt-5 flex justify-between items-baseline">
          <div>
            <span className="font-serif text-lg text-stone-100 font-medium">Grand Total (Rupees)</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Sourced vendor cost basis inclusive of all taxes</span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-serif text-amber-400 font-semibold tracking-wide">
              ₹{booking.priceDetails?.total?.toLocaleString("en-IN")}
            </span>
            <div className="text-[9px] text-stone-500 font-mono mt-1">15% SAVINGS LOCKED</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function ProfilePage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  const [user, setUser] = useState<any>(null);
  
  // UI states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [greeting, setGreeting] = useState("Welcome back");

  // Modal form states
  const [editTargetPerson, setEditTargetPerson] = useState("");
  const [editYourName, setEditYourName] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editContactPhone, setEditContactPhone] = useState("");
  const [editRelationship, setEditRelationship] = useState("");
  const [editVibe, setEditVibe] = useState("");
  const [editGuestCount, setEditGuestCount] = useState("");
  const [editBudgetRange, setEditBudgetRange] = useState("");
  const [editTargetDate, setEditTargetDate] = useState("");
  const [editTargetTime, setEditTargetTime] = useState("");
  const [editVenueAddress, setEditVenueAddress] = useState("");
  const [editGuestPhone, setEditGuestPhone] = useState("");
  const [editSecretNote, setEditSecretNote] = useState("");
  const [editWishMessage, setEditWishMessage] = useState("");

  // Determine Greeting based on time of day
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);


  // Load Session and Booking
  const loadSessionAndBooking = async () => {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("euphoria_session");
      if (!sessionStr) {
        setUser(null);
        window.location.href = "/login";
        return;
      }
      
      const sessionObj = JSON.parse(sessionStr);
      setUser(sessionObj);
      
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          // Filter bookings for this user
          const userKey = sessionObj.email || sessionObj.phone;
          const userBookingsRaw = data.bookings.filter((b: any) => b.userEmail === userKey);
          
          // Map to fullDetails format if it exists, otherwise use raw booking
          const loadedBookings = userBookingsRaw.map((b: any) => b.fullDetails ? b.fullDetails : b);
          
          setAllBookings(loadedBookings);
          if (loadedBookings.length > 0) {
            setBooking(loadedBookings[0]);
          } else {
            setBooking(null);
          }
        }
      } catch (err) {
        console.error("Failed to load bookings from API", err);
      }
      
      if (localStorage.getItem("showBookingNotification") === "true") {
        setShowNotificationModal(true);
        localStorage.removeItem("showBookingNotification");
      }
    }
  };


  useEffect(() => {
    loadSessionAndBooking();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSessionAndBooking();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  // Load Edit modal data
  useEffect(() => {
    if (showEditModal && booking) {
      setEditTargetPerson(booking.targetPerson || "");
      setEditYourName(booking.yourName || "");
      setEditContactEmail(booking.contactEmail || "");
      setEditContactPhone(booking.contactPhone || "");
      setEditRelationship(booking.relationship || "");
      setEditVibe(booking.vibe || "");
      setEditGuestCount(booking.guestCount || "");
      setEditBudgetRange(booking.budgetRange || "Premium");
      setEditTargetDate(booking.targetDate || "");
      setEditTargetTime(booking.targetTime || "");
      setEditVenueAddress(booking.venueAddress || "");
      setEditGuestPhone(booking.guestPhone !== "Not Provided" ? booking.guestPhone : "");
      setEditSecretNote(booking.secretNote || "");
      setEditWishMessage(booking.wishMessage || "");
    }
  }, [showEditModal, booking]);

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    // Recalculate invoice based on updated fields
    let base = 10000;
    if (booking.occasion === "Marriage") base = 35000;
    else if (["Proposal", "Romantic Date"].includes(booking.occasion)) base = 15000;
    else if (["Anniversary", "Engagement Party"].includes(booking.occasion)) base = 20000;
    
    let locationMul = 1.0;
    if (booking.city === "Mumbai" || booking.city === "Delhi") locationMul = 1.2;
    else if (booking.city === "Goa" || booking.city === "Udaipur" || booking.city === "International / Destination") locationMul = 1.3;
    
    let gamesCost = booking.games.filter((g: string) => g !== "No Games Needed").length * 3000;
    
    let vibeCost = 0;
    if (editVibe === "Luxurious & Grand") vibeCost = 12000;
    else if (editVibe === "Romantic & Emotional") vibeCost = 6000;
    else if (editVibe === "Magical & Ethereal") vibeCost = 8000;
    
    let budgetMultiplier = 1.0;
    if (editBudgetRange === "Luxury") budgetMultiplier = 1.6;
    else if (editBudgetRange === "Super Premium") budgetMultiplier = 1.35;
    else if (editBudgetRange === "Standard") budgetMultiplier = 0.9;
    
    const subtotal = Math.round((base * locationMul + gamesCost + vibeCost) * budgetMultiplier);
    const discount = Math.round(subtotal * 0.15);
    const total = subtotal - discount;

    const updatedBooking = {
      ...booking,
      targetPerson: editTargetPerson,
      yourName: editYourName,
      contactEmail: editContactEmail,
      contactPhone: editContactPhone,
      relationship: editRelationship,
      vibe: editVibe,
      guestCount: editGuestCount,
      budgetRange: editBudgetRange,
      targetDate: editTargetDate,
      targetTime: editTargetTime,
      venueAddress: editVenueAddress,
      guestPhone: editGuestPhone || "Not Provided",
      secretNote: editSecretNote,
      wishMessage: editWishMessage,
      priceDetails: { base, locationMul, gamesCost, vibeCost, budgetMultiplier, subtotal, discount, total }
    };

const sessionStr = localStorage.getItem("euphoria_session");
    if (!sessionStr) return;
    const sessionObj = JSON.parse(sessionStr);
    const userKey = sessionObj.email || sessionObj.phone;
    const storageKey = `activeBookings_${userKey}`;
    
    const existingBookingsStr = localStorage.getItem(storageKey);
    const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
    const updatedBookings = existingBookings.map((b: any) => b.id === updatedBooking.id ? updatedBooking : b);
    if (!existingBookings.find((b: any) => b.id === updatedBooking.id)) {
      updatedBookings.push(updatedBooking);
    }
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    setAllBookings(updatedBookings);

    setBooking(updatedBooking);
    setShowEditModal(false);

    // Sync session registry details
    const session = localStorage.getItem("euphoria_session");
    if (session) {
      const sessionObj = JSON.parse(session);
      localStorage.setItem("euphoria_session", JSON.stringify({
        ...sessionObj,
        name: editYourName,
        email: editContactEmail,
        phone: editContactPhone
      }));
      setUser(JSON.parse(localStorage.getItem("euphoria_session")!));
      window.dispatchEvent(new Event("euphoria_sessionChanged"));
    }

    setToastMessage("✨ Exclusive details updated successfully! Live countdown and quotes have been compiled. A confirmation email has been sent to your inbox.");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);
  };

const handleLogout = () => {
    localStorage.removeItem("euphoria_session");
    localStorage.removeItem("activeBooking");
    window.dispatchEvent(new Event("euphoria_sessionChanged"));
    window.location.href = "/";
  };



  return (
    <div className="min-h-screen bg-[#FFFAF0] pt-24 pb-20 text-stone-850">
      
      {/* Background glowing decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[100px] -z-10" />

      
      {/* AUTOMATED MAIL/WHATSAPP NOTIFICATION PREVIEW MODAL */}
      <AnimatePresence>
        {showNotificationModal && booking && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border border-stone-100 w-full max-w-4xl shadow-2xl relative my-8 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-amber-400" />
              
              <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="font-serif text-lg text-stone-800">Booking Confirmed!</h3>
                  </div>
                </div>
                <button onClick={() => setShowNotificationModal(false)} className="text-stone-400 hover:text-stone-750 p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 bg-stone-50 flex flex-col items-center justify-center min-h-[300px]">
                {/* Animated Ticket */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-6 md:p-10 shadow-lg relative max-w-md w-full text-center"
                >
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border-r-2 border-dashed border-amber-300"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border-l-2 border-dashed border-amber-300"></div>
                  
                  <Gift className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
                  <h4 className="font-serif text-2xl text-stone-800 mb-2">Ticket #EUPH-{booking.id || '99999'}</h4>
                  <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-6">{booking.occasion} Experience</p>
                  
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 text-sm leading-relaxed">
                    <strong>Our team will contact you soon!</strong><br />
                    We are crafting the perfect plan for you and will send an email automatically with the next steps.
                  </div>
                </motion.div>
              </div>
              
              <div className="p-6 border-t border-stone-100 bg-white flex justify-end">
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST OVERLAY */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4"
          >
            <div className="bg-stone-900 border border-amber-500/30 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
              </div>
              <button onClick={() => setShowSuccessToast(false)} className="text-stone-400 hover:text-white p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex justify-end">
          <div className="inline-flex items-center gap-1.5 bg-amber-100/60 border border-amber-200/50 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-800 shadow-sm">
            <Award className="w-3.5 h-3.5" /> Signature Client Dashboard
          </div>
        </div>

        {!booking ? (
          /* EMPTY STATE */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white border border-white rounded-[2rem] p-6 shadow-xl shadow-stone-200/40 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-rose-450" />
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-250 border border-amber-300 flex items-center justify-center text-amber-800 text-2xl font-serif font-bold shadow-inner mb-4 relative">
                    {user?.name?.charAt(0) || "C"}
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-stone-800 font-medium">{user?.name || "Valued Client"}</h2>
                  <p className="text-stone-400 text-xs font-light tracking-wide mb-3">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full mt-6 py-3 border border-stone-200 hover:bg-stone-50 hover:text-stone-800 text-stone-500 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-stone-250/10 max-w-2xl mx-auto my-12"
              >
                <CalendarHeart className="w-16 h-16 text-amber-600/70 mx-auto mb-6" />
                <h1 className="text-3xl font-serif text-stone-800 mb-4">No Events Yet</h1>
                <p className="text-stone-500 font-light text-sm max-w-md mx-auto leading-relaxed mb-10">
                  You haven't booked any event yet, so please explore and book an event below. Let our team of expert experience designers create a masterpiece for your loved ones.
                </p>
                <button 
                  onClick={() => {
                    document.getElementById("occasions-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Gift className="w-4.5 h-4.5" /> Explore Events
                </button>
              </motion.div>
            </div>
          </div>
        ) : (
          /* FULL PROFILE DASHBOARD */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* PROFILE CONTENT */}
            <div className="lg:col-span-4 space-y-6 sticky top-28">
              
              {/* Profile Card */}
              <div className="bg-white border border-white rounded-[2rem] p-6 shadow-xl shadow-stone-200/40 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-rose-450" />
                
                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-250 border border-amber-300 flex items-center justify-center text-amber-800 text-2xl font-serif font-bold shadow-inner mb-4 relative">
                    {user?.name?.charAt(0) || "C"}
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-serif text-stone-800 font-medium">{user?.name || "Valued Client"}</h2>
                  <p className="text-stone-400 text-xs font-light tracking-wide mb-3">{user?.email}</p>
                  
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-6">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Signature Member
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-6 space-y-4 text-xs">
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Contact Line:</span>
                    <span className="font-semibold text-stone-700">{user?.phone || "Not Provided"}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Account Tier:</span>
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">VIP GOLD</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Total Discount Saved:</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      ₹{booking.priceDetails?.discount?.toLocaleString("en-IN") || "0"} (15%)
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full mt-6 py-3 border border-stone-200 hover:bg-stone-50 hover:text-stone-800 text-stone-500 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Reset Booking Session
                </button>
              </div>

              {/* Dedicated Planner Concierge */}
              <div className="bg-white border border-stone-100 rounded-[2rem] p-6 shadow-sm">
                <p className="text-xs font-semibold text-stone-400 tracking-wider uppercase mb-4">Dedicated Concierge Lead</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg font-semibold shrink-0">
                    K
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-stone-800">Kirankumar Reddy</h4>
                    <p className="text-[10px] text-stone-400">Lead Surprise Experience Designer</p>
                  </div>
                </div>
                <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 text-[11px] text-stone-600 font-light leading-relaxed mb-4">
                  &quot;I&apos;m personally overseeing vendor sourcing for your {booking.occasion.toLowerCase()} celebration. All materials are custom-made to reflect your heartfelt message.&quot;
                </div>
                <a 
                  href="https://wa.me/916300228344" target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-xs text-center transition-all inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> Chat with Concierge on WhatsApp
                </a>
              </div>
            </div>

            {/* RIGHT DASHBOARD CONTENT */}
            <div className="lg:col-span-8">
              
              <div className="flex items-center gap-6 mb-8 border-b border-stone-200">
                <button 
                  onClick={() => setActiveTab("upcoming")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "upcoming" ? "text-amber-600" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Upcoming Events
                  {activeTab === "upcoming" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("completed")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "completed" ? "text-amber-600" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Completed Events
                  {activeTab === "completed" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
              </div>

              {(() => {
                // eslint-disable-next-line react-hooks/purity
                const now = Date.now();
                const filteredBookings = allBookings.filter(b => {
                  const eventTime = new Date(`${b.targetDate}T${b.targetTime || "00:00"}`).getTime();
                  return activeTab === "upcoming" ? eventTime > now : eventTime <= now;
                });
                
                return filteredBookings.length > 0 ? (
                  filteredBookings.map((b, index) => (
                    <BookingDashboardItem 
                      key={`${b.id}-${index}`} 
                      booking={b} 
                      getOccasionQuote={getOccasionQuote}
                      isCompleted={activeTab === "completed"}
                      onEdit={(b_to_edit) => {

                      setBooking(b_to_edit);
                      setShowEditModal(true);
                      
                      // Pre-fill edit modal with the specific booking's details
                      setEditTargetPerson(b_to_edit.targetPerson);
                      setEditYourName(b_to_edit.yourName);
                      setEditContactEmail(b_to_edit.contactEmail);
                      setEditContactPhone(b_to_edit.contactPhone);
                      setEditRelationship(b_to_edit.relationship || "");
                      setEditVibe(b_to_edit.vibe);
                      setEditGuestCount(b_to_edit.guestCount);
                      setEditBudgetRange(b_to_edit.budgetRange);
                      setEditTargetDate(b_to_edit.targetDate);
                      setEditTargetTime(b_to_edit.targetTime);
                      setEditVenueAddress(b_to_edit.venueAddress);
                      setEditGuestPhone(b_to_edit.guestPhone || "");
                      setEditSecretNote(b_to_edit.secretNote);
                      setEditWishMessage(b_to_edit.wishMessage || "");
                    }} 
                  />
                ))
              ) : (
                <div className="bg-white border border-stone-100 rounded-[2.5rem] p-12 text-center shadow-sm">
                  <h3 className="font-serif text-2xl text-stone-800 mb-2">No Active Celebrations</h3>
                  <p className="text-stone-500 font-light mb-8">You haven't booked any surprise events yet.</p>
                  <Link href="/book" className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                    <Gift className="w-4 h-4" /> Plan a Celebration
                  </Link>
                </div>
              ) })()}
              
            </div>
          </div>
        )}

        {/* Plan Another Surprise Section */}
        <div id="occasions-grid" className="mt-20 border-t border-stone-200/60 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-stone-800 mb-3">Plan Another Surprise</h2>
            <p className="text-stone-500 font-light max-w-xl mx-auto">
              Ready for the next celebration? Select an occasion below to start custom-engineering your next unforgettable moment directly from your profile.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 pb-20">
            {OCCASIONS_DATA.map((occ) => (
              <button
                key={occ.name}
                onClick={() => router.push(`/book?occasion=${occ.name}`)}
                className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-md transition-all text-left flex flex-col"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${occ.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-3">
                  <h3 className="text-white text-xs font-medium tracking-wide">
                    {occ.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* EDITING MODAL */}
      <AnimatePresence>
        {showEditModal && booking && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border border-stone-100 w-full max-w-2xl shadow-2xl relative my-8"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400" />
              
              <div className="flex justify-between items-center p-6 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-lg text-stone-800">Modify Celebration Details</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-stone-400 hover:text-stone-750 p-1.5 rounded-full hover:bg-stone-50 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdits} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left text-xs">
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Your Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editYourName} 
                      onChange={(e) => setEditYourName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Contact Email Address <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      required 
                      value={editContactEmail} 
                      onChange={(e) => setEditContactEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Contact Phone Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required 
                      pattern="[0-9+-\s]{8,15}"
                      value={editContactPhone} 
                      onChange={(e) => setEditContactPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Relationship to Guest <span className="text-red-500">*</span></label>
                    <select 
                      required 
                      value={editRelationship} 
                      onChange={(e) => setEditRelationship(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs"
                    >
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Person being surprised <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editTargetPerson} 
                      onChange={(e) => setEditTargetPerson(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Guest of honor&apos;s phone (Optional)</label>
                    <input 
                      type="tel" 
                      value={editGuestPhone} 
                      onChange={(e) => setEditGuestPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Date of Surprise <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split("T")[0]}
                      value={editTargetDate} 
                      onChange={(e) => setEditTargetDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Time of Surprise <span className="text-red-500">*</span></label>
                    <input 
                      type="time" 
                      required 
                      value={editTargetTime} 
                      onChange={(e) => setEditTargetTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Surprise Vibe Theme <span className="text-red-500">*</span></label>
                    <select 
                      required 
                      value={editVibe} 
                      onChange={(e) => setEditVibe(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs"
                    >
                      <option value="Luxurious & Grand">Luxurious & Grand (High-end setups)</option>
                      <option value="Romantic & Emotional">Romantic & Emotional (Warm & Cozy)</option>
                      <option value="Vibrant & Energetic">Vibrant & Energetic (Colorful & Playful)</option>
                      <option value="Magical & Ethereal">Magical & Ethereal (Fairy lights & Pastels)</option>
                      <option value="Intimate & Minimalist">Intimate & Minimalist (Subtle & Refined)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Expected Guest Count <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={editGuestCount} 
                      onChange={(e) => setEditGuestCount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Venue / Address Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editVenueAddress} 
                      onChange={(e) => setEditVenueAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-655">Budget Preference Tier <span className="text-red-500">*</span></label>
                    <select 
                      required 
                      value={editBudgetRange} 
                      onChange={(e) => setEditBudgetRange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 text-xs"
                    >
                      <option value="Standard">Standard (Great value)</option>
                      <option value="Super Premium">Super Premium (+35%)</option>
                      <option value="Luxury">Luxury (+60%)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-655">Secret Note for Planners <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3} 
                    required 
                    value={editSecretNote} 
                    onChange={(e) => setEditSecretNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 resize-none text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-655">Heartfelt Wish Message for Reveal Card <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3} 
                    required 
                    value={editWishMessage} 
                    onChange={(e) => setEditWishMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-medium focus:outline-none focus:border-amber-500 resize-none text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 border border-stone-200 text-stone-655 rounded-xl hover:bg-stone-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium shadow"
                  >
                    Save Specifications
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
