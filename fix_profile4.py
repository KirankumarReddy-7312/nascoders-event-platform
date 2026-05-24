import re

PROFILE_FILE = "src/app/profile/page.tsx"

with open(PROFILE_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the VIP Support button to WhatsApp
content = content.replace(
    'href="https://wa.me/1234567890"',
    'href="https://wa.me/916300228344"'
)

# 2. Add showNotificationModal state
state_regex = r'(const \[showSuccessToast, setShowSuccessToast\] = useState\(false\);)'
content = re.sub(state_regex, r'\1\n  const [showNotificationModal, setShowNotificationModal] = useState(false);', content)

# 3. Trigger it in loadSessionAndBooking
load_logic_regex = r'(if \(params\.get\("newBooking"\) === "true"\) \{)'
content = re.sub(
    load_logic_regex, 
    r'\1\n        setShowNotificationModal(true);', 
    content
)

# 4. Inject NotificationModal JSX right before {/* SUCCESS TOAST OVERLAY */}
notification_modal = """
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
                    <p className="text-xs text-stone-500">Automated notifications have been sent to your contacts.</p>
                  </div>
                </div>
                <button onClick={() => setShowNotificationModal(false)} className="text-stone-400 hover:text-stone-750 p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8 bg-stone-50">
                {/* Email Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                  <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-stone-500" />
                    <div className="text-xs text-stone-600 font-medium">Email Confirmation Sent</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-serif font-bold">E</div>
                      <div>
                        <div className="text-sm font-semibold text-stone-800">Euphoria Celebrations</div>
                        <div className="text-xs text-stone-500">To: {booking.contactEmail || "you@example.com"}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-serif text-lg text-stone-800">Your {booking.occasion} is Confirmed! 🎉</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Dear {booking.yourName},<br/><br/>
                        Get ready for something spectacular. We have received your booking for the {booking.occasion} in {booking.city}. Our concierge team is already weaving the magic.
                      </p>
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-4">
                        <div className="text-xs font-bold text-amber-800 mb-1">EVENT SUMMARY</div>
                        <div className="text-xs text-stone-700 flex justify-between mb-1"><span>Date:</span> <span>{booking.targetDate || "TBD"}</span></div>
                        <div className="text-xs text-stone-700 flex justify-between mb-1"><span>Time:</span> <span>{booking.targetTime || "TBD"}</span></div>
                        <div className="text-xs text-stone-700 flex justify-between"><span>Location:</span> <span>{booking.city}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Preview */}
                <div className="bg-[#E5DDD5] rounded-2xl shadow-sm border border-stone-200 overflow-hidden relative">
                  <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Sun className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-white">
                      <div className="text-sm font-semibold">Euphoria Concierge</div>
                      <div className="text-[10px] text-white/80">business account</div>
                    </div>
                  </div>
                  <div className="p-5 min-h-[300px]">
                    <div className="bg-white p-3 rounded-tr-xl rounded-b-xl max-w-[85%] shadow-sm relative text-xs text-stone-800 mb-3">
                      <div className="font-bold text-emerald-600 mb-1 text-[10px]">Euphoria</div>
                      Hi {booking.yourName}! 👋<br/>
                      Your VIP {booking.occasion} experience is officially locked in! We're thrilled to craft this beautiful moment for you.
                      <div className="text-[9px] text-stone-400 text-right mt-1">Just now</div>
                    </div>
                    <div className="bg-white p-3 rounded-tr-xl rounded-b-xl max-w-[85%] shadow-sm relative text-xs text-stone-800">
                      <div className="w-full h-24 bg-stone-100 rounded-lg mb-2 overflow-hidden relative">
                         <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{backgroundImage: `url(${OCCASIONS_DATA.find(o => o.name === booking.occasion)?.img || '/placeholder.jpg'})`}}></div>
                      </div>
                      Booking ID: <strong>EUPH-{Math.floor(Math.random() * 90000) + 10000}</strong><br/>
                      Our lead designer will reach out here shortly. Let the magic begin! ✨
                      <div className="text-[9px] text-stone-400 text-right mt-1">Just now</div>
                    </div>
                  </div>
                </div>
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
"""

content = content.replace("{/* SUCCESS TOAST OVERLAY */}", notification_modal + "\n      {/* SUCCESS TOAST OVERLAY */}")

with open(PROFILE_FILE, "w", encoding="utf-8") as f:
    f.write(content)
