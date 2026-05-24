import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the Explore Surprises Cards: change h-64 to h-80, and use next/image if needed.
# Since we used <img>, let's just make it h-80 to make it bigger.
content = content.replace('className="relative h-64 overflow-hidden"', 'className="relative h-80 overflow-hidden"')

# Now, we will replace the Event Planner block
event_planner_start = content.find('{plannerMode === "Event" ? (')
event_planner_end = content.find(') : (\n<div className="grid lg:grid-cols-12 gap-12 items-start">', event_planner_start)

if event_planner_start != -1 and event_planner_end != -1:
    new_event_planner = """{plannerMode === "Event" ? (
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
          """
    
    content = content[:event_planner_start] + new_event_planner + content[event_planner_end:]
    
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully updated Event Planner & Cards section!")
else:
    print("Could not find boundaries.")
