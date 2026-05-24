import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject selectedTheme state
if "const [selectedTheme" not in content:
    content = content.replace(
        'const [customEventStyle, setCustomEventStyle] = useState("");',
        'const [customEventStyle, setCustomEventStyle] = useState("");\n  const [selectedTheme, setSelectedTheme] = useState("");'
    )

start_explore = content.find('{/* EXPLORE SURPRISES SECTION (Images & Cards) */}')
end_planning = content.find('{/* 2. ABOUT US & TEAM SECTION */}')

if start_explore != -1 and end_planning != -1:
    grid_start = content.find('<div className="grid lg:grid-cols-12 gap-12 items-start">', start_explore, end_planning)
    
    if grid_start != -1:
        # Find the end of the budget planner code right before the closing ternary brace that we added last time
        # Let's just find the last </div> before the end of the planning section
        ternary_end = content.rfind('          </div>\n        )}', grid_start, end_planning)
        if ternary_end == -1:
             ternary_end = content.rfind('        )}', grid_start, end_planning)
             
        if ternary_end == -1:
             print("Could not find ternary end.")
        else:
             budget_planner_code = content[grid_start:ternary_end]
             
             new_sections = """      {/* EXPLORE SURPRISES SECTION (Images & Cards) */}
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OCCASIONS_DATA.map((occ, idx) => (
              <motion.div 
                key={occ.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={occ.img} 
                    alt={occ.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-serif text-white mb-2">{t(occ.name)}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{t(occ.desc)}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-stone-500 text-sm font-light italic mb-6">"{occ.quote}"</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleBookClick(occ.name)} 
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold text-center transition-colors shadow-sm"
                    >
                      {t("Book Now")}
                    </button>
                    <button 
                      onClick={() => setSelectedDetails(occ)}
                      className="flex-1 py-3 bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-sm font-semibold text-center transition-colors"
                    >
                      {t("Details")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden mb-24">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-stone-800 mb-6">Describe Your Dream Event</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {["1920s Great Gatsby", "Bohemian Chic", "Royal Elegance", "Minimalist Modern", "Tropical Paradise", "Other"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setSelectedTheme(theme);
                        if (theme !== "Other") setCustomEventStyle(theme);
                        else setCustomEventStyle("");
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        selectedTheme === theme 
                          ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm" 
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
                
                <div className="flex flex-col items-center mt-6">
                  <button 
                    type="button"
                    disabled={isGeneratingPrice || (!customEventStyle.trim() && selectedTheme !== "Other")}
                    onClick={handleGenerateCustomPrice}
                    className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-3 ${
                      isGeneratingPrice || (!customEventStyle.trim() && selectedTheme !== "Other") ? "bg-stone-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-105 hover:shadow-amber-500/30"
                    }`}
                  >
                    {isGeneratingPrice ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Calculating Custom Quote...</>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> Generate My Price</>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {generatedPrice !== null && !isGeneratingPrice && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="mt-10 p-8 w-full bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl text-center shadow-2xl relative overflow-hidden"
                      >
                        <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Estimated Investment</span>
                        <h4 className="text-5xl font-serif text-white mb-2 tracking-tight">₹{generatedPrice.toLocaleString("en-IN")}</h4>
                        <p className="text-stone-400 font-light text-sm max-w-sm mx-auto mb-6">Our elite team will execute your vision flawlessly.</p>
                        
                        <Link href={`/book?custom=true&price=${generatedPrice}`} className="inline-block bg-white text-stone-900 font-bold px-8 py-3 rounded-full hover:bg-amber-50 transition-colors">
                          Book This Custom Event
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
""" + budget_planner_code + """
          )}
        </div>
      </section>
\n"""
             
             content = content[:start_explore] + new_sections + content[end_planning:]
             with open(FILE, "w", encoding="utf-8") as f:
                 f.write(content)
             print("Successfully replaced sections.")

