import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# The header to replace is:
header_pattern = r'<div className="text-center mb-16">.*?Exclusive Pricing Configuration.*?</div>'
header_replacement = """<div className="text-center mb-16">
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
            </div>"""

content = re.sub(header_pattern, header_replacement, content, flags=re.DOTALL)

# Now wrap the grid
grid_start_idx = content.find('<div className="grid lg:grid-cols-12 gap-12 items-start">')
if grid_start_idx != -1:
    event_planner_ui = """
          {plannerMode === "Event" ? (
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden mb-24">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-stone-800 mb-6">Describe Your Dream Event</h3>
                <textarea 
                  value={customEventStyle}
                  onChange={(e) => setCustomEventStyle(e.target.value)}
                  placeholder="e.g. I want a 1920s Great Gatsby themed party with gold balloons, a champagne tower, live jazz band, and personalized vintage invitations for 50 guests..."
                  className="w-full h-40 p-5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-700 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all resize-none mb-8"
                />
                
                <div className="flex flex-col items-center">
                  <button 
                    type="button"
                    disabled={isGeneratingPrice || customEventStyle.trim().length < 10}
                    onClick={handleGenerateCustomPrice}
                    className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-3 ${
                      isGeneratingPrice || customEventStyle.trim().length < 10 ? "bg-stone-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-105 hover:shadow-amber-500/30"
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
"""
    content = content[:grid_start_idx] + event_planner_ui + content[grid_start_idx:]
    
    # We also need to close the parenthesis for the conditional after the grid
    # Find the end of the section
    section_end = content.find('</section>', grid_start_idx)
    content = content[:section_end] + "          )}\n" + content[section_end:]

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
