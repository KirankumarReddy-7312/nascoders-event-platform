import re

FILE = "src/app/book/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add CUSTOMIZATIONS data structure after GAMES
data_to_insert = """const GAMES = [
  "No Games Needed",
  "Couple Trivia Quiz",
  "Treasure Hunt",
  "Musical Chairs",
  "Karaoke Setup",
  "Board Games Lounge",
  "Photo Booth Props"
];

const CUSTOMIZATIONS: Record<string, {name: string, price: number, isFromBudget: boolean}[]> = {
  "Marriage": [
    { name: "Premium Photography", price: 15000, isFromBudget: false },
    { name: "Drone Videography", price: 12000, isFromBudget: false },
    { name: "Bridal Makeup", price: 10000, isFromBudget: true },
    { name: "Live Band / DJ", price: 20000, isFromBudget: false },
    { name: "Gourmet Catering", price: 30000, isFromBudget: false }
  ],
  "Birthday": [
    { name: "Themed 3-Tier Cake", price: 5000, isFromBudget: true },
    { name: "Magic Show", price: 8000, isFromBudget: false },
    { name: "Polaroid Photo Booth", price: 6000, isFromBudget: false },
    { name: "Premium Return Gifts", price: 12000, isFromBudget: false }
  ],
  "Anniversary": [
    { name: "Private Violinist", price: 8000, isFromBudget: false },
    { name: "Customized Ring Box", price: 3000, isFromBudget: true },
    { name: "Champagne Tower", price: 15000, isFromBudget: false }
  ],
  "Default": [
    { name: "Professional Photographer", price: 8000, isFromBudget: false },
    { name: "Live Music/DJ", price: 15000, isFromBudget: false },
    { name: "Premium Catering", price: 20000, isFromBudget: false },
    { name: "Welcome Drinks", price: 5000, isFromBudget: true }
  ]
};
"""
content = content.replace('const GAMES = [\n  "No Games Needed",\n  "Couple Trivia Quiz",\n  "Treasure Hunt",\n  "Musical Chairs",\n  "Karaoke Setup",\n  "Board Games Lounge",\n  "Photo Booth Props"\n];', data_to_insert)

# 2. Add selectedCustomizations state
state_to_insert = """  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);"""
content = content.replace('  const [selectedGames, setSelectedGames] = useState<string[]>([]);', state_to_insert)

# 3. Add toggleCustomization function
func_to_insert = """  const toggleGame = (game: string) => {
    if (game === "No Games Needed") {
      setSelectedGames(["No Games Needed"]);
      return;
    }
    
    setSelectedGames(prev => {
      const filtered = prev.filter(g => g !== "No Games Needed");
      if (filtered.includes(game)) {
        return filtered.filter(g => g !== game);
      } else {
        return [...filtered, game];
      }
    });
  };

  const toggleCustomization = (cust: string) => {
    setSelectedCustomizations(prev => {
      if (prev.includes(cust)) {
        return prev.filter(c => c !== cust);
      } else {
        return [...prev, cust];
      }
    });
  };"""
content = content.replace("""  const toggleGame = (game: string) => {
    if (game === "No Games Needed") {
      setSelectedGames(["No Games Needed"]);
      return;
    }
    
    setSelectedGames(prev => {
      const filtered = prev.filter(g => g !== "No Games Needed");
      if (filtered.includes(game)) {
        return filtered.filter(g => g !== game);
      } else {
        return [...filtered, game];
      }
    });
  };""", func_to_insert)

# 4. Modify calculateQuote to include Customizations
quote_to_insert = """      let vibeCost = 0;
      if (vibe) vibeCost = 6000;
      
      let customizationsCost = 0;
      const occasionCusts = CUSTOMIZATIONS[selectedOccasion] || CUSTOMIZATIONS["Default"];
      selectedCustomizations.forEach(cust => {
        const item = occasionCusts.find(c => c.name === cust);
        if (item && !item.isFromBudget) {
          customizationsCost += item.price;
        }
      });
      
      const subtotal = (base * locationMul) + detailCost + gamesCost + vibeCost + customizationsCost;"""
content = content.replace("""      let vibeCost = 0;
      if (vibe) vibeCost = 6000;
      
      const subtotal = (base * locationMul) + detailCost + gamesCost + vibeCost;""", quote_to_insert)

# Also update the return of calculateQuote
content = content.replace('gamesCost, vibeCost, budgetMultiplier, subtotal, discount, total };', 'gamesCost, vibeCost, customizationsCost, budgetMultiplier, subtotal, discount, total };')

# 5. Fix navigation steps logic
# We need to change step checks: 
# step 1..6 array in the timeline
content = content.replace('{[1, 2, 3, 4, 5].map((step) => (', '{[1, 2, 3, 4, 5, 6].map((step) => (')
content = content.replace('{step < 5 && (', '{step < 6 && (')

# Button logic inside timeline
content = re.sub(
    r'\} else if \(step === 4 && eventType && selectedCity && selectedOccasion\) \{\s*setBookingStep\(4\);\s*\}',
    '} else if (step === 4 && eventType && selectedCity && selectedOccasion) { setBookingStep(4); } else if (step === 5 && eventType && selectedCity && selectedOccasion) { setBookingStep(5); } else if (step === 6 && eventType && selectedCity && selectedOccasion) { setBookingStep(6); }',
    content
)
content = re.sub(
    r'disabled=\{step > bookingStep && !\(step === 2 && eventType\) && !\(step === 3 && eventType && selectedCity\) && !\(step === 4 && eventType && selectedCity && selectedOccasion\)\}',
    'disabled={step > bookingStep && !(step === 2 && eventType) && !(step === 3 && eventType && selectedCity) && !(step === 4 && eventType && selectedCity && selectedOccasion) && !(step === 5 && eventType && selectedCity && selectedOccasion) && !(step === 6 && eventType && selectedCity && selectedOccasion)}',
    content
)

# Text headers for steps
content = content.replace('{bookingStep === 4 && "Pick Some Fun Activities"}', '{bookingStep === 4 && "Occasion Customizations"}\n                  {bookingStep === 5 && "Pick Some Fun Activities"}')
content = content.replace('{bookingStep === 5 && "The Finer Details"}', '{bookingStep === 6 && "The Finer Details"}')

# Paragraph for steps
content = content.replace('{bookingStep === 4 && "Add some excitement with our curated games and activities."}', '{bookingStep === 4 && "Select premium customizations tailored to your occasion."}\n                  {bookingStep === 5 && "Add some excitement with our curated games and activities."}')
content = content.replace('{bookingStep === 5 && "Tell us exactly how you want this memory to unfold."}', '{bookingStep === 6 && "Tell us exactly how you want this memory to unfold."}')

# 6. Step 3 (Occasion) Next Step changes from 4 to 4 (wait, occasion was step 3, next was 4. But now 4 is customizations. So Next goes to 4. That is correct.
# Step 4 (Games) is now Step 5.
content = content.replace('onClick={() => setBookingStep(5)}', 'onClick={() => setBookingStep(6)}')
content = content.replace('{bookingStep === 5 && (', '{bookingStep === 6 && (')
content = content.replace('{/* STEP 4: FORM DETAILS */}', '{/* STEP 6: FORM DETAILS */}')
content = content.replace('{bookingStep === 4 && (', '{bookingStep === 5 && (')
content = content.replace('{/* STEP 3: GAMES */}', '{/* STEP 5: GAMES */}')
content = content.replace('Back to Games', 'Back to Games')
# Wait, back button from Form (Step 6) should go to Games (Step 5)
content = content.replace('onClick={() => setBookingStep(4)}', 'onClick={() => setBookingStep(5)}') 
# Wait, Step 5 (Games) back button should go to Customizations (Step 4)
# Did Step 4 (Games) have a back button? 
# "Back to Games" was in Step 6.
# Let's add the Customizations block explicitly.

cust_block = """
                {/* STEP 4: CUSTOMIZATIONS */}
                {bookingStep === 4 && (
                  <motion.div
                    key="step4cust"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {(CUSTOMIZATIONS[selectedOccasion] || CUSTOMIZATIONS["Default"]).map((cust) => {
                        const isSelected = selectedCustomizations.includes(cust.name);
                        return (
                          <button
                            key={cust.name}
                            type="button"
                            onClick={() => toggleCustomization(cust.name)}
                            className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center gap-3 ${
                              isSelected 
                                ? `${theme.border} ${theme.bg2} shadow-sm border-amber-500` 
                                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                            }`}
                          >
                            <span className={`font-medium ${isSelected ? theme.text : "text-stone-700"}`}>
                              {cust.name}
                            </span>
                            <span className="text-xs font-mono font-medium opacity-80">
                              {cust.isFromBudget ? "Included in Budget" : `+ ₹${cust.price.toLocaleString('en-IN')}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" onClick={() => setBookingStep(3)} className="text-stone-500 font-medium hover:text-stone-855">
                        Back to Occasions
                      </button>
                      <button 
                        type="button"
                        onClick={() => setBookingStep(5)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-md`}
                      >
                        {selectedCustomizations.length === 0 ? "Skip Customizations" : "Next Step"}
                      </button>
                    </div>
                  </motion.div>
                )}
"""
content = content.replace('{/* STEP 5: GAMES */}', cust_block + '\n                {/* STEP 5: GAMES */}')

# Fix Games back button
content = content.replace('<button type="button" onClick={() => setBookingStep(3)} className="text-stone-500 font-medium hover:text-stone-855">\n                        Back\n                      </button>', '<button type="button" onClick={() => setBookingStep(4)} className="text-stone-500 font-medium hover:text-stone-855">\n                        Back to Customizations\n                      </button>')
# Wait, the back button in Games was: `<button type="button" onClick={() => setBookingStep(3)} className="text-stone-500 font-medium hover:text-stone-855">\n                        Back to Occasions\n                      </button>`?
# In original file it might have been missing. Let's write a targeted replacement for the Games step back button if we want.

# 7. Add customizations to the invoice
invoice_cust = """                        {selectedCustomizations.length > 0 && (
                          <div className="flex justify-between">
                            <span>Customizations ({selectedCustomizations.length})</span>
                            <span className="font-mono text-stone-200">+ ₹{calculateQuote().customizationsCost.toLocaleString("en-IN")}</span>
                          </div>
                        )}"""
content = content.replace('                        <div className="flex justify-between">\n                          <span>Activities', invoice_cust + '\n                        <div className="flex justify-between">\n                          <span>Activities')

# Update invoice "What's Included"
check_cust = """                            {selectedCustomizations.map(c => (
                              <li key={c} className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> {c}</li>
                            ))}"""
content = content.replace('<li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Complete {vibe', check_cust + '\n                            <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"/> Complete {vibe')

# 8. Save the data in booking
# Find `const bookingData = {` and add selectedCustomizations
content = content.replace('selectedGames,\n      vibe,', 'selectedGames,\n      selectedCustomizations,\n      vibe,')

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
