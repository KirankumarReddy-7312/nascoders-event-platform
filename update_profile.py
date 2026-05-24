import re

FILE = "src/app/profile/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the layout structure
# We want to pull the tabs out of the grid and make the grid single column or remove the grid.

# 1. Update the tabs to include Account Settings
tabs_original = """              <div className="flex items-center gap-4 mb-8 border-b border-stone-200">
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
              </div>"""

tabs_new = """              <div className="flex items-center gap-6 mb-8 border-b border-stone-200">
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
                <button 
                  onClick={() => setActiveTab("account")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "account" ? "text-amber-600" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Account Settings
                  {activeTab === "account" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
              </div>"""

content = content.replace(tabs_original, tabs_new)

# 2. Re-arrange the HTML layout
# Extract the Left Sidebar content
sidebar_pattern = r'\{/\* LEFT PROFILE SIDEBAR \*/\}.*?\{/\* RIGHT DASHBOARD CONTENT \*/\}'
sidebar_match = re.search(sidebar_pattern, content, flags=re.DOTALL)
if sidebar_match:
    sidebar_content = sidebar_match.group(0)
    # Remove the <div class="lg:col-span-4..."> wrapper around the sidebar content
    sidebar_content = re.sub(r'\{/\* LEFT PROFILE SIDEBAR \*/\}\s*<div className="lg:col-span-4 space-y-6">\s*', '', sidebar_content)
    sidebar_content = sidebar_content.replace('            {/* RIGHT DASHBOARD CONTENT */}', '')
    # The last closing div of the sidebar is somewhere.
    # Actually, it's easier to just replace the whole grid.

    grid_start_pattern = r'<div className="grid lg:grid-cols-12 gap-8 items-start">\s*\{/\* LEFT PROFILE SIDEBAR \*/\}'
    content = re.sub(grid_start_pattern, '<div>\n            {/* PROFILE CONTENT */}', content)
    
    # We will remove the sidebar completely from the top and inject it inside the "account" tab rendering.
    # Wait, the sidebar content has `user`, `handleLogout`, `booking` (for discount).
    account_tab_content = """
              {activeTab === "account" && (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                  {/* Profile Card */}
                  <div className="bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col items-center text-center pt-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-250 border border-amber-300 flex items-center justify-center text-amber-800 text-3xl font-serif font-bold shadow-inner mb-4 relative">
                        {user?.name?.charAt(0) || "C"}
                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-serif text-stone-800 font-medium">{user?.name || "Valued Client"}</h2>
                      <p className="text-stone-400 text-sm font-light tracking-wide mb-4">{user?.email}</p>
                      
                      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-1.5 rounded-full text-xs font-bold text-amber-800 uppercase tracking-wider mb-8">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Signature Member
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-6 space-y-4 text-sm">
                      <div className="flex justify-between items-center text-stone-500">
                        <span>Contact Line:</span>
                        <span className="font-semibold text-stone-700">{user?.phone || "Not Provided"}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-500">
                        <span>Account Tier:</span>
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">VIP GOLD</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full mt-8 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Reset Booking Session
                    </button>
                  </div>

                  {/* Dedicated Planner Concierge */}
                  <div className="bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-400 tracking-wider uppercase mb-6">Dedicated Concierge Lead</p>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-xl font-semibold shrink-0">
                          K
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-semibold text-stone-800">Kirankumar Reddy</h4>
                          <p className="text-xs text-stone-400">Lead Surprise Experience Designer</p>
                        </div>
                      </div>
                      <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 text-sm text-stone-600 font-light leading-relaxed mb-8">
                        "I'm personally overseeing vendor sourcing for your celebrations. All materials are custom-made to reflect your heartfelt message."
                      </div>
                    </div>
                    <a 
                      href="https://wa.me/916300228344" target="_blank" rel="noopener noreferrer"
                      className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm text-center transition-all inline-flex items-center justify-center gap-2 shadow-md"
                    >
                      <Phone className="w-4 h-4" /> Chat with Concierge on WhatsApp
                    </a>
                  </div>
                </div>
              )}
"""

# Let's cleanly replace the entire body block if possible.
# Because the layout is complex, let's just do a string replacement for the exact structure.
# The `filteredBookings` logic:
# `return filteredBookings.length > 0 ? (`
# I need to wrap it inside `{activeTab !== "account" && ( ... )}`

content = content.replace(
    '{(() => {',
    account_tab_content + '\n              {activeTab !== "account" && (() => {'
)
content = content.replace(
    ') })()}',
    ') })()}'
)
# Close the newly opened conditional `activeTab !== "account" &&`
content = content.replace(
    '</Link>\n                </div>\n              ) })()}',
    '</Link>\n                </div>\n              ) })()}\n              '
) # Wait, it's safer to use regex for the end of the IIFE.

iife_end_pattern = r'\)\s*\}\)\(\)\}'
# We wrap the IIFE: `{activeTab !== "account" && (() => { ... })()}`
content = re.sub(r'\{\(\(\) => \{', '{activeTab !== "account" && (() => {', content)

# Remove the left sidebar from the grid completely
sidebar_re = r'\{/\* LEFT PROFILE SIDEBAR \*/\}.*?\{/\* RIGHT DASHBOARD CONTENT \*/\}\s*<div className="lg:col-span-8">'
content = re.sub(sidebar_re, '<div>', content, flags=re.DOTALL)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
