import re
import os

PROFILE_FILE = "src/app/profile/page.tsx"

with open(PROFILE_FILE, "r", encoding="utf-8") as f:
    profile_content = f.read()

# 1. Create BookingDashboardItem Component
# We will extract the logic inside RIGHT DASHBOARD CONTENT into a new component.
# Then map `allBookings` to render this component.

# Let's extract from:
# {/* Event Summary and Live Countdown Card */}
# to:
# {/* PAST SURPRISES LIST */}
# Wait, actually we don't need PAST SURPRISES LIST anymore since all bookings are shown as full cards.

# First, extract the block to a string or just write a regex.
# It might be simpler to insert `BookingDashboardItem` above `ProfilePage`.
# Let's define the new component string:

dashboard_item_code = """
const BookingDashboardItem = ({ booking, getOccasionQuote, onEdit }: { booking: any, getOccasionQuote: (occ: string) => string, onEdit: (b: any) => void }) => {
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
      <div className="bg-white border border-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-stone-200/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
        
        {/* Event Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-amber-700 bg-amber-100/60 tracking-wider uppercase mb-3 border border-amber-250/20">
              <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" /> {booking.eventType || "Celebration"}
            </div>
            <h1 className="text-3xl font-serif text-stone-850 font-medium mb-1">
              {booking.occasion} {booking.eventType === "Common Event" ? "Celebration" : "Surprise"}
            </h1>
            <p className="text-stone-500 text-sm font-light">
              {booking.eventType === "Common Event" ? "Celebrating" : "Surprising"} <span className="font-semibold text-stone-700">{booking.targetPerson}</span> {booking.relationship && `• (${booking.relationship})`}
            </p>
          </div>
          <div className="text-xs font-semibold px-4 py-2 bg-stone-50 rounded-xl border border-stone-200/60 text-stone-655 font-mono">
            ID: {booking.id}
          </div>
        </div>

        {/* HEARTWARMING OCCASION QUOTE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50/40 border border-amber-150/40 rounded-2xl p-5 mb-8 text-center italic relative overflow-hidden"
        >
          <div className="absolute -top-3 -left-3 text-7xl font-serif text-amber-500/10 pointer-events-none select-none">“</div>
          <p className="text-stone-700 font-serif text-sm relative z-10 leading-relaxed md:px-6">
            "{getOccasionQuote(booking.occasion)}"
          </p>
          <div className="absolute -bottom-10 -right-3 text-7xl font-serif text-amber-500/10 pointer-events-none select-none">”</div>
        </motion.div>

        {/* TIMERS GRID */}
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
"""

# Insert BookingDashboardItem component definition right before `export default function ProfilePage() {`
profile_content = profile_content.replace(
    "export default function ProfilePage() {",
    dashboard_item_code + "\n\nexport default function ProfilePage() {"
)

# In `ProfilePage`, remove old `eventTimeLeft`, `editTimeLeft`, `isEditWindowActive` states
profile_content = re.sub(r'  // Timers State.*?  // UI states', '  // UI states', profile_content, flags=re.DOTALL)

# In `ProfilePage`, remove old `useEffect` for Timer Effect
profile_content = re.sub(r'  // Timer Effect\n  useEffect\(\(\) => \{.*?\n  \}, \[booking\]\);\n', '', profile_content, flags=re.DOTALL)

# In `ProfilePage`, remove `getOccasionQuote` inside component
profile_content = re.sub(r'  const getOccasionQuote = \(\) => \{.*?\n  \};\n', '', profile_content, flags=re.DOTALL)

# And define it outside so it can be passed in (or just use it inside `BookingDashboardItem`)
# The `getOccasionQuote` I defined in `BookingDashboardItem` calls `getOccasionQuote(booking.occasion)`
# I'll just add `getOccasionQuote` outside ProfilePage:
global_quote_func = """
const getOccasionQuote = (occasion: string) => {
  return OCCASION_QUOTES[occasion] || "Celebrating the beautiful moments that make life truly extraordinary and memorable.";
};
"""
profile_content = profile_content.replace(
    "const BookingDashboardItem = ",
    global_quote_func + "\nconst BookingDashboardItem = "
)

# Now, replace RIGHT DASHBOARD CONTENT
# Find the start of RIGHT DASHBOARD CONTENT
start_idx = profile_content.find("{/* RIGHT DASHBOARD CONTENT */}")
if start_idx != -1:
    end_idx = profile_content.find("{/* Plan Another Surprise Section */}")
    
    if end_idx != -1:
        new_right_dashboard = """{/* RIGHT DASHBOARD CONTENT */}
            <div className="lg:col-span-8">
              {allBookings && allBookings.length > 0 ? (
                allBookings.map((b) => (
                  <BookingDashboardItem 
                    key={b.id} 
                    booking={b} 
                    getOccasionQuote={getOccasionQuote} 
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
              )}
            </div>
          </div>
        )}

        """
        
        profile_content = profile_content[:start_idx] + new_right_dashboard + profile_content[end_idx:]

with open(PROFILE_FILE, "w", encoding="utf-8") as f:
    f.write(profile_content)
