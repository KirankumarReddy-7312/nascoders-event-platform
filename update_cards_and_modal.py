import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Grid
content = content.replace(
    'className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"',
    'className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"'
)

# 2. Update Details Modal
modal_start = content.find('{/* DETAILS MODAL */}')
modal_end = content.find('{/* 1. HERO SECTION */}')

if modal_start != -1 and modal_end != -1:
    new_modal = """{/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }} 
              className={`${selectedDetails.color} rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-white max-h-[90vh] overflow-y-auto`}
            >
              <button onClick={() => setSelectedDetails(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -z-10" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[60px] -z-10" />
              
              <h2 className="text-3xl font-serif mb-2 flex items-center gap-3 relative z-10">
                <Star className="w-6 h-6 fill-current text-white/50" /> {t(selectedDetails.name)} Experience
              </h2>
              <p className="text-white/80 text-sm mb-8 italic relative z-10">&quot;{t(selectedDetails.quote)}&quot;</p>
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-lg font-medium tracking-wide uppercase border-b border-white/20 pb-2">How We Bring It To Life</h3>
                
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-lg">Initial Discovery & Vision</h4>
                    <p className="text-white/70 text-sm mt-1">We listen to your ideas, style preferences, and the emotion you want to evoke. We brainstorm creative, unique concepts specifically for this occasion.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-lg">Venue & Vendor Sourcing</h4>
                    <p className="text-white/70 text-sm mt-1">Our team scours our premium network to secure the perfect location, top-tier caterers, and specialized vendors to match your theme.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-lg">Complete Logistic Coordination</h4>
                    <p className="text-white/70 text-sm mt-1">We handle all the stressful details—timelines, permits, decor assembly, and backup plans—so you don&apos;t have to lift a finger.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-lg">The Secret Setup</h4>
                    <p className="text-white/70 text-sm mt-1">For surprises, absolute discretion is our priority. Our team executes the flawless setup behind the scenes right before the arrival.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold text-lg">The Grand Reveal & Execution</h4>
                    <p className="text-white/70 text-sm mt-1">The moment of truth. An event concierge ensures everything goes according to the timeline while you enjoy the euphoria of the reveal.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">6</div>
                  <div>
                    <h4 className="font-semibold text-lg">Memories Capture</h4>
                    <p className="text-white/70 text-sm mt-1">Our professional photographers and videographers discreetly capture raw, genuine reactions so you can relive the magic forever.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4 relative z-10">
                <button 
                  onClick={() => { setSelectedDetails(null); handleBookClick(selectedDetails.name); }} 
                  className="flex-1 px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
                >
                  Book This Experience
                </button>
                <button 
                  onClick={() => setSelectedDetails(null)} 
                  className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      """
    
    content = content[:modal_start] + new_modal + content[modal_end:]
    
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully updated cards grid and Details Modal!")
else:
    print("Could not find boundaries.")
