import re

PROFILE_FILE = "src/app/profile/page.tsx"

with open(PROFILE_FILE, "r", encoding="utf-8") as f:
    profile_content = f.read()

# 1. Add activeTab state
active_tab_code = """
  // Tabs State
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
"""
profile_content = re.sub(r'(const \[allBookings, setAllBookings\] = useState<any\[\]>\(\[\]\);)', r'\1\n' + active_tab_code, profile_content)

# 2. Update fetching logic to be user-specific
# We find the useEffect that fetches bookings:
#     // Retrieve all bookings
#     const existingBookingsStr = localStorage.getItem("activeBookings");
#     if (existingBookingsStr) {
#       const parsed = JSON.parse(existingBookingsStr);
#       setAllBookings(parsed);
#     }
# Wait, I need to check how it looks currently.

fetch_logic = """
    // Retrieve all bookings for user
    let userEmail = "guest";
    const sessionStr = localStorage.getItem("euphoria_session");
    if (sessionStr) {
      try { userEmail = JSON.parse(sessionStr).email; } catch(e) {}
    }
    const storageKey = `activeBookings_${userEmail}`;
    const existingBookingsStr = localStorage.getItem(storageKey);
    if (existingBookingsStr) {
      const parsed = JSON.parse(existingBookingsStr);
      setAllBookings(parsed);
    }
"""

profile_content = re.sub(r'const existingBookingsStr = localStorage\.getItem\("activeBookings"\);\s*if \(existingBookingsStr\) \{\s*const parsed = JSON\.parse\(existingBookingsStr\);\s*setAllBookings\(parsed\);\s*\}', fetch_logic.strip(), profile_content)

# 3. Add tabs to UI and filter bookings
# Where to add the tabs? Right before mapping allBookings in RIGHT DASHBOARD CONTENT
#       {/* RIGHT DASHBOARD CONTENT */}
#       <div className="lg:col-span-8">
#         {allBookings && allBookings.length > 0 ? (

tabs_ui = """{/* RIGHT DASHBOARD CONTENT */}
            <div className="lg:col-span-8">
              
              <div className="flex items-center gap-4 mb-8 border-b border-stone-200">
                <button 
                  onClick={() => setActiveTab("upcoming")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "upcoming" ? "text-amber-600" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Upcoming Events
                  {activeTab === "upcoming" && (
                    <motion.layoutId className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("completed")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "completed" ? "text-amber-600" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Completed Events
                  {activeTab === "completed" && (
                    <motion.layoutId className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
              </div>

              {(() => {
                const now = Date.now();
                const filteredBookings = allBookings.filter(b => {
                  const eventTime = new Date(`${b.targetDate}T${b.targetTime || "00:00"}`).getTime();
                  return activeTab === "upcoming" ? eventTime > now : eventTime <= now;
                });
                
                return filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <BookingDashboardItem 
                      key={b.id} 
                      booking={b} 
                      getOccasionQuote={getOccasionQuote}
                      isCompleted={activeTab === "completed"}
                      onEdit={(b_to_edit) => {
"""

profile_content = profile_content.replace(
"""{/* RIGHT DASHBOARD CONTENT */}
            <div className="lg:col-span-8">
              {allBookings && allBookings.length > 0 ? (
                allBookings.map((b) => (
                  <BookingDashboardItem 
                    key={b.id} 
                    booking={b} 
                    getOccasionQuote={getOccasionQuote} 
                    onEdit={(b_to_edit) => {""", tabs_ui)

# 4. Modify BookingDashboardItem to accept isCompleted and hide timers if completed
# Replace `onEdit: (b: any) => void` with `onEdit: (b: any) => void, isCompleted?: boolean` in the type definition of BookingDashboardItem
profile_content = profile_content.replace(
  "onEdit: (b: any) => void }", 
  "onEdit: (b: any) => void, isCompleted?: boolean }"
)

profile_content = profile_content.replace(
  "const BookingDashboardItem = ({ booking, getOccasionQuote, onEdit }:",
  "const BookingDashboardItem = ({ booking, getOccasionQuote, onEdit, isCompleted }:"
)

# Hide timers if completed, and show Feedback button instead
timers_grid_re = r'\{\/\* TIMERS GRID \*\/}.*?\{\/\* Logistic Specs Summary \*\/}'
# I don't want to break the regex if it's too long, so I'll insert a conditional check inside the TIMERS GRID div directly if I can, or just replace the whole section.
# A simpler way is to replace `        {/* TIMERS GRID */}\n        <div className="grid md:grid-cols-2 gap-6 mb-8">`
# with `        {/* TIMERS GRID */}\n        {!isCompleted ? (\n        <div className="grid md:grid-cols-2 gap-6 mb-8">`
# And add `) : (<div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between"><div className="space-y-1"><h4 className="font-semibold text-stone-800">Event Completed</h4><p className="text-sm text-stone-500">We hope it was memorable!</p></div><button className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800">Provide Feedback</button></div>)}\n        {/* Logistic Specs Summary */}`

profile_content = profile_content.replace(
  "{/* TIMERS GRID */}\n        <div className=\"grid md:grid-cols-2 gap-6 mb-8\">",
  "{/* TIMERS GRID */}\n        {!isCompleted ? (\n        <div className=\"grid md:grid-cols-2 gap-6 mb-8\">"
)

profile_content = profile_content.replace(
  "        {/* Logistic Specs Summary */}",
  """        ) : (
          <div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2.5xl flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-stone-800">Event Completed</h4>
              <p className="text-sm text-stone-500">We hope it was memorable! Tell us about your experience.</p>
            </div>
            <button className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800">Provide Feedback</button>
          </div>
        )}
        
        {/* Logistic Specs Summary */}"""
)

# And fix the end of `filteredBookings.map` because we replaced `allBookings.map`
# The original was:
#                 ))
#               ) : (
#                 <div className="bg-white border border-stone-100 rounded-[2.5rem] p-12 text-center shadow-sm">
profile_content = profile_content.replace(
"""                  />
                ))
              ) : (""",
"""                  />
                ))
              ) : ("""
)
# Wait, let's fix it by regex since `allBookings.length > 0 ? (` was closed properly but now we have `(() => { return ... })()` wrapper.
# Actually I added `(() => { ... return ... })()` so I must close the IIFE.
# Instead of IIFE, I can just do:
#              {(() => { ... return filteredBookings.length > 0 ? ( ... ) : ( ... ) })()}

profile_content = re.sub(
  r'                  />\s*\)\)\s*\)\s*:\s*\(',
  '                  />\n                ))\n              ) : (',
  profile_content
)

# Replace the closing of the `allBookings` ternary:
#               )}
#             </div>
profile_content = re.sub(
  r'              \)\}\s*<\/div>',
  '              ) })()}\n            </div>',
  profile_content
)

with open(PROFILE_FILE, "w", encoding="utf-8") as f:
    f.write(profile_content)
