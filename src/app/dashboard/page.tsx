"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, MapPin, Clock, ArrowLeft, Sun, Bell, Settings, LogOut,
  Gift, Heart, Star, Sparkles, Navigation, PartyPopper
} from "lucide-react";

// Mock booked event data
const EVENT = {
  id: "EUPH-10492",
  type: "Birthday Surprise",
  targetPerson: "Sarah",
  location: "Aura by the Sea, Sunset Beach",
  date: new Date(new Date().getTime() + 1000 * 60 * 60 * 2 + 1000 * 60 * 30), // 2 hours 30 mins from now
  status: "upcoming", // upcoming, live, completed
  planner: "Elena Rostova",
};

export default function DashboardPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [liveStatusIndex, setLiveStatusIndex] = useState(0);

  const liveStatuses = [
    { time: "0:00", msg: "Your celebration has officially started 🎉" },
    { time: "0:15", msg: "The surprise event is now live." },
    { time: "0:30", msg: "Decorations are being arranged." },
    { time: "1:00", msg: "Guests are arriving secretly." },
    { time: "1:30", msg: "Cake delivery completed. Perfect setup." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT.date.getTime() - now;
      
      if (distance <= 0) {
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // Simulate live status updates every 10 seconds for demo purposes
        const elapsedSeconds = Math.floor(Math.abs(distance) / 1000);
        const index = Math.min(Math.floor(elapsedSeconds / 10), liveStatuses.length - 1);
        setLiveStatusIndex(index);
      } else {
        setIsLive(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isLive ? 'bg-indigo-950 text-white' : 'bg-stone-50 text-stone-800'}`}>
      
      {/* Dynamic Background */}
      {isLive ? (
        <>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-900/40 rounded-full blur-[100px] -z-10 animate-pulse" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[100px] -z-10" />
        </>
      )}

      {/* Navigation */}
      <nav className={`px-6 py-5 border-b ${isLive ? 'border-indigo-800/50 bg-indigo-950/50' : 'border-stone-200 bg-white/50'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sun className={`w-6 h-6 ${isLive ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className="font-serif font-medium text-xl">Euphoria</span>
          </Link>
          <div className="flex items-center gap-6">
            <button className={`p-2 rounded-full ${isLive ? 'hover:bg-indigo-900/50' : 'hover:bg-stone-100'}`}>
              <Bell className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-full ${isLive ? 'hover:bg-indigo-900/50' : 'hover:bg-stone-100'}`}>
              <Settings className="w-5 h-5" />
            </button>
            <Link href="/profile" className={`w-9 h-9 rounded-full flex items-center justify-center font-medium hover:scale-105 transition-transform ${isLive ? 'bg-indigo-800 text-white' : 'bg-stone-200 text-stone-800'}`}>
              D
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif mb-2">Welcome back, David.</h1>
            <p className={isLive ? 'text-indigo-200' : 'text-stone-500'}>Your beautiful moments are being crafted.</p>
          </div>
          <Link href="/book" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-sm ${isLive ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-white border border-stone-200 hover:bg-stone-50'}`}>
            <Gift className="w-4 h-4" /> Book Another Event
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Event Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              layout
              className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-xl border ${
                isLive 
                  ? 'bg-indigo-900/40 border-indigo-700/50 shadow-indigo-900/20 backdrop-blur-xl' 
                  : 'bg-white border-stone-100 shadow-stone-200/50'
              }`}
            >
              {/* Event Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 relative z-10">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    isLive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Star className="w-3 h-3 fill-current" /> Premium Booking
                  </div>
                  <h2 className="text-3xl font-serif mb-2">{EVENT.type}</h2>
                  <p className={`text-lg ${isLive ? 'text-indigo-200' : 'text-stone-500'}`}>Surprising {EVENT.targetPerson}</p>
                </div>
                <div className={`text-sm font-medium px-4 py-2 rounded-xl border ${
                  isLive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}>
                  ID: {EVENT.id}
                </div>
              </div>

              {/* Countdown / Live Area */}
              <AnimatePresence mode="wait">
                {isLive ? (
                  <motion.div 
                    key="live"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative py-12 text-center z-10"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
                    >
                      <PartyPopper className="w-64 h-64 text-amber-400" />
                    </motion.div>
                    
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 relative">
                      <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif text-amber-300 mb-4">Event Started!</h3>
                    <p className="text-xl text-indigo-100 font-light max-w-lg mx-auto">
                      The magic is unfolding right now. We are so excited for {EVENT.targetPerson}.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="countdown"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 z-10 relative"
                  >
                    <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl">
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-serif text-amber-600">{timeLeft.days}</span>
                        <span className="text-xs md:text-sm text-stone-400 uppercase tracking-widest font-medium mt-2">Days</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-serif text-amber-600">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-xs md:text-sm text-stone-400 uppercase tracking-widest font-medium mt-2">Hours</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-serif text-amber-600">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-xs md:text-sm text-stone-400 uppercase tracking-widest font-medium mt-2">Mins</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-serif text-amber-600">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-xs md:text-sm text-stone-400 uppercase tracking-widest font-medium mt-2">Secs</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Event Details Footer */}
              <div className={`mt-10 pt-6 border-t grid sm:grid-cols-2 gap-6 z-10 relative ${isLive ? 'border-indigo-700/50' : 'border-stone-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLive ? 'bg-indigo-800/50 text-indigo-300' : 'bg-stone-50 text-stone-500'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-medium ${isLive ? 'text-indigo-400' : 'text-stone-400'}`}>Date & Time</p>
                    <p className={`font-medium ${isLive ? 'text-white' : 'text-stone-700'}`}>
                      {EVENT.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {EVENT.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLive ? 'bg-indigo-800/50 text-indigo-300' : 'bg-stone-50 text-stone-500'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-medium ${isLive ? 'text-indigo-400' : 'text-stone-400'}`}>Location</p>
                    <p className={`font-medium ${isLive ? 'text-white' : 'text-stone-700'}`}>{EVENT.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Live Tracker */}
          <div className="space-y-8">
            <div className={`rounded-3xl p-6 border ${isLive ? 'bg-indigo-900/40 border-indigo-700/50 backdrop-blur-xl' : 'bg-white border-stone-100 shadow-sm'}`}>
              <h3 className={`text-lg font-serif mb-6 flex items-center gap-2 ${isLive ? 'text-white' : 'text-stone-800'}`}>
                {isLive ? <><Navigation className="w-5 h-5 text-emerald-400" /> Live Tracker</> : <><Clock className="w-5 h-5 text-amber-500" /> Event Timeline</>}
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-3 before:w-px before:bg-stone-200">
                {liveStatuses.map((status, idx) => {
                  const isActive = isLive && idx === liveStatusIndex;
                  const isPast = isLive && idx < liveStatusIndex;
                  const isFuture = !isLive || idx > liveStatusIndex;
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={isActive ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative flex gap-4 pl-10 transition-opacity ${isFuture ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className={`absolute left-[0.4rem] w-2.5 h-2.5 rounded-full ring-4 ${
                        isActive ? 'bg-emerald-400 ring-emerald-400/20' : 
                        isPast ? 'bg-indigo-400 ring-transparent' : 
                        'bg-stone-300 ring-transparent'
                      }`} />
                      <div>
                        <p className={`text-xs font-medium mb-1 ${
                          isActive ? 'text-emerald-400' : 
                          isPast ? (isLive ? 'text-indigo-300' : 'text-stone-500') : 
                          (isLive ? 'text-indigo-200' : 'text-stone-400')
                        }`}>
                          {status.time} {isActive && "• JUST NOW"}
                        </p>
                        <p className={`text-sm ${
                          isActive ? 'text-white font-medium' : 
                          isPast ? (isLive ? 'text-indigo-100' : 'text-stone-700') : 
                          (isLive ? 'text-indigo-200/50' : 'text-stone-500')
                        }`}>
                          {status.msg}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className={`rounded-3xl p-6 border ${isLive ? 'bg-indigo-900/40 border-indigo-700/50 backdrop-blur-xl' : 'bg-white border-stone-100 shadow-sm'}`}>
               <p className={`text-sm font-medium mb-2 ${isLive ? 'text-indigo-300' : 'text-stone-500'}`}>Your Dedicated Planner</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
                   {EVENT.planner.charAt(0)}
                 </div>
                 <div>
                   <h4 className={`font-medium ${isLive ? 'text-white' : 'text-stone-800'}`}>{EVENT.planner}</h4>
                   <p className={`text-xs ${isLive ? 'text-indigo-200' : 'text-stone-500'}`}>Contact Planner</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
