import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

start_explore = content.find('{OCCASIONS_DATA.map((occ, idx) => (')
end_explore = content.find('          </div>\n        </div>\n      </section>', start_explore)

if start_explore != -1 and end_explore != -1:
    new_cards = """{OCCASIONS_DATA.map((occ, idx) => (
              <motion.div 
                key={occ.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative h-72 w-full perspective-[1000px]"
              >
                {/* INNER CONTAINER */}
                <div className="w-full h-full absolute transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm hover:shadow-2xl rounded-3xl">
                  
                  {/* FRONT FACE (Image + Title) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden bg-white border border-stone-100">
                    <img 
                      src={occ.img} 
                      alt={occ.name} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-serif text-white mb-2">{t(occ.name)}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{t(occ.desc)}</p>
                    </div>
                  </div>

                  {/* BACK FACE (Quote + Buttons) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden bg-white border border-stone-100 p-6 flex flex-col justify-center text-center">
                    <p className="text-stone-600 text-lg font-serif italic mb-8 px-4">&quot;{occ.quote}&quot;</p>
                    
                    <div className="flex flex-col gap-3 w-full px-2">
                      <button 
                        onClick={() => handleBookClick(occ.name)} 
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                        {t("Book Now")}
                      </button>
                      <button 
                        onClick={() => setSelectedDetails(occ)}
                        className="w-full py-3 bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-sm font-semibold transition-colors"
                      >
                        {t("Details")}
                      </button>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            ))}"""
    
    content = content[:start_explore] + new_cards + content[end_explore:]
    
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully updated cards to flip cards!")
else:
    print("Could not find boundaries.")
