import re
import os

BOOK_FILE = "src/app/book/page.tsx"
PROFILE_FILE = "src/app/profile/page.tsx"

with open(BOOK_FILE, "r", encoding="utf-8") as f:
    book_content = f.read()

# 1. Add eventType state
book_content = book_content.replace(
    "const [bookingStep, setBookingStep] = useState(1);",
    "const [bookingStep, setBookingStep] = useState(1);\n  const [eventType, setEventType] = useState(\"\");"
)

# 2. Add eventType to saved data
book_content = book_content.replace(
    "id: \"EUPH-\" + Math.floor(10000 + Math.random() * 90000),",
    "id: \"EUPH-\" + Math.floor(10000 + Math.random() * 90000),\n      eventType,"
)

# 3. Update top indicators
book_content = book_content.replace(
    "{[1, 2, 3, 4].map((step) => (",
    "{[1, 2, 3, 4, 5].map((step) => ("
)
book_content = book_content.replace(
    "if (step < bookingStep) {",
    "if (step < bookingStep) {\n                            setBookingStep(step);\n                          } else if (step === 2 && eventType) {\n                            setBookingStep(2);\n                          } else if (step === 3 && eventType && selectedCity) {\n                            setBookingStep(3);\n                          } else if (step === 4 && eventType && selectedCity && selectedOccasion) {\n                            setBookingStep(4);\n                          }"
)
# remove the old setBookingStep logic inside map to avoid duplicates
book_content = re.sub(r'setBookingStep\(step\);\n\s*\} else if \(step === 2 && selectedCity\) \{\n\s*setBookingStep\(2\);\n\s*\} else if \(step === 3 && selectedCity && selectedOccasion\) \{\n\s*setBookingStep\(3\);\n\s*\}', 'setBookingStep(step);\n                          } else if (step === 2 && eventType) {\n                            setBookingStep(2);\n                          } else if (step === 3 && eventType && selectedCity) {\n                            setBookingStep(3);\n                          } else if (step === 4 && eventType && selectedCity && selectedOccasion) {\n                            setBookingStep(4);\n                          }', book_content)

book_content = book_content.replace(
    "disabled={step > bookingStep && !(step === 2 && selectedCity) && !(step === 3 && selectedCity && selectedOccasion)}",
    "disabled={step > bookingStep && !(step === 2 && eventType) && !(step === 3 && eventType && selectedCity) && !(step === 4 && eventType && selectedCity && selectedOccasion)}"
)

book_content = book_content.replace(
    "{step < 4 && (",
    "{step < 5 && ("
)

# 4. Update titles
book_content = book_content.replace(
    "{bookingStep === 1 && \"Where are we celebrating?\"}\n                  {bookingStep === 2 && \"What is the Occasion?\"}\n                  {bookingStep === 3 && \"Pick Some Fun Activities\"}\n                  {bookingStep === 4 && \"The Finer Details\"}",
    "{bookingStep === 1 && \"What kind of event?\"}\n                  {bookingStep === 2 && \"Where are we celebrating?\"}\n                  {bookingStep === 3 && \"What is the Occasion?\"}\n                  {bookingStep === 4 && \"Pick Some Fun Activities\"}\n                  {bookingStep === 5 && \"The Finer Details\"}"
)
book_content = book_content.replace(
    "{bookingStep === 1 && \"Choose a city to help us find the perfect venue.\"}\n                  {bookingStep === 2 && \"Select one of our beautifully crafted event types.\"}\n                  {bookingStep === 3 && \"Add some excitement with our curated games and activities.\"}\n                  {bookingStep === 4 && \"Tell us exactly how you want this memory to unfold.\"}",
    "{bookingStep === 1 && \"Select whether this is a surprise or a common event.\"}\n                  {bookingStep === 2 && \"Choose a city to help us find the perfect venue.\"}\n                  {bookingStep === 3 && \"Select one of our beautifully crafted event types.\"}\n                  {bookingStep === 4 && \"Add some excitement with our curated games and activities.\"}\n                  {bookingStep === 5 && \"Tell us exactly how you want this memory to unfold.\"}"
)

# 5. Shift all step numbers
# Step 1 -> 2
book_content = book_content.replace("{bookingStep === 1 && (", "{bookingStep === 2 && (")
book_content = book_content.replace("key=\"step1\"", "key=\"step2\"")
book_content = book_content.replace("onClick={() => setBookingStep(2)}", "onClick={() => setBookingStep(3)}")
# Step 2 -> 3
book_content = book_content.replace("{bookingStep === 2 && (", "{bookingStep === 3 && (")
book_content = book_content.replace("key=\"step2\"", "key=\"step3\"")
book_content = book_content.replace("onClick={() => setBookingStep(1)}", "onClick={() => setBookingStep(2)}")
book_content = book_content.replace("onClick={() => setBookingStep(3)}", "onClick={() => setBookingStep(4)}")
# Step 3 -> 4
book_content = book_content.replace("{bookingStep === 3 && (", "{bookingStep === 4 && (")
book_content = book_content.replace("key=\"step3\"", "key=\"step4\"")
book_content = book_content.replace("onClick={() => setBookingStep(2)}", "onClick={() => setBookingStep(3)}")
book_content = book_content.replace("onClick={() => setBookingStep(4)}", "onClick={() => setBookingStep(5)}")
# Step 4 -> 5
book_content = book_content.replace("{bookingStep === 4 && (", "{bookingStep === 5 && (")
book_content = book_content.replace("key=\"step4\"", "key=\"step5\"")
book_content = book_content.replace("onClick={() => setBookingStep(3)}", "onClick={() => setBookingStep(4)}")

# Fix bookingStep >= 3 and 4
book_content = book_content.replace("bookingStep >= 3", "bookingStep >= 4")
book_content = book_content.replace("bookingStep === 4", "bookingStep === 5")
book_content = book_content.replace("bookingStep === 5 && budgetRange", "bookingStep === 5 && budgetRange")

# Insert Step 1 (Event Type)
step1_code = """
                {bookingStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <button
                        type="button"
                        onClick={() => setEventType("Surprise Event")}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                          eventType === "Surprise Event" 
                            ? `${theme.border} bg-amber-50 text-amber-900 shadow-sm border-amber-500 scale-[1.02]` 
                            : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/30"
                        }`}
                      >
                        <Gift className={`w-8 h-8 ${eventType === "Surprise Event" ? "text-amber-600" : "text-stone-400"}`} />
                        <div>
                          <span className="font-bold text-lg block mb-1">Surprise Event</span>
                          <span className="text-sm font-light">Keep it a secret! We'll help you plan everything without the guest of honor knowing.</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventType("Common Event")}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                          eventType === "Common Event" 
                            ? `${theme.border} bg-amber-50 text-amber-900 shadow-sm border-amber-500 scale-[1.02]` 
                            : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/30"
                        }`}
                      >
                        <CalendarHeart className={`w-8 h-8 ${eventType === "Common Event" ? "text-amber-600" : "text-stone-400"}`} />
                        <div>
                          <span className="font-bold text-lg block mb-1">Common Event</span>
                          <span className="text-sm font-light">A regular celebration where everyone is involved in the planning process.</span>
                        </div>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        disabled={!eventType}
                        onClick={() => setBookingStep(2)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}
"""
book_content = book_content.replace("<AnimatePresence mode=\"wait\">", "<AnimatePresence mode=\"wait\">" + step1_code)

# Conditional fields based on eventType inside Step 5
book_content = book_content.replace(
    """<h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      2. Surprise Celebration Specifics
                    </h3>""",
    """<h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      2. {eventType === "Surprise Event" ? "Surprise Celebration Specifics" : "Event Specifics"}
                    </h3>"""
)

book_content = book_content.replace(
    """<label className="text-xs font-semibold text-stone-700 block">Relationship to Guest of Honor <span className="text-red-500">*</span></label>""",
    """<label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Relationship to Guest of Honor" : "Role in Event"} <span className="text-red-500">*</span></label>"""
)

person_field = """<div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Person being surprised <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={targetPerson}
                          onChange={(e) => setTargetPerson(e.target.value)}
                          placeholder="e.g. Sarah" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Guest of honor&apos;s phone (Optional)</label>
                        <input 
                          type="tel" 
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210 (Kept secret)" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                    </div>"""
new_person_field = """{eventType === "Surprise Event" && (<div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Person being surprised <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required={eventType === "Surprise Event"}
                          value={targetPerson}
                          onChange={(e) => setTargetPerson(e.target.value)}
                          placeholder="e.g. Sarah" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">Guest of honor&apos;s phone (Optional)</label>
                        <input 
                          type="tel" 
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210 (Kept secret)" 
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium transition-all" 
                        />
                      </div>
                    </div>)}"""
book_content = book_content.replace(person_field, new_person_field)

date_labels = """<label className="text-xs font-semibold text-stone-700 block">Date of Surprise <span className="text-red-500">*</span></label>"""
new_date_labels = """<label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Date of Surprise" : "Event Date"} <span className="text-red-500">*</span></label>"""
book_content = book_content.replace(date_labels, new_date_labels)

time_labels = """<label className="text-xs font-semibold text-stone-700 block">Time of Surprise <span className="text-red-500">*</span></label>"""
new_time_labels = """<label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Time of Surprise" : "Event Time"} <span className="text-red-500">*</span></label>"""
book_content = book_content.replace(time_labels, new_time_labels)

notes_section = """<h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      3. Personal Notes & Coordination
                    </h3>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">Secret note for the planners <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required 
                        value={secretNote}
                        onChange={(e) => setSecretNote(e.target.value)}
                        placeholder="Tell us how to keep it a secret, any specific instructions, food allergies, or elements to avoid..." 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">Heartfelt wish message for the guest <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required 
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        placeholder="This personal message will be printed on the keepsake card presented at the reveal moment..." 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>"""

new_notes_section = """<h3 className="text-sm font-bold tracking-wider uppercase text-stone-400 border-b border-stone-100 pb-2 pt-4 mb-4">
                      3. Personal Notes & Coordination
                    </h3>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">{eventType === "Surprise Event" ? "Secret note for the planners" : "Event Instructions & Preferences"} <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required 
                        value={secretNote}
                        onChange={(e) => setSecretNote(e.target.value)}
                        placeholder={eventType === "Surprise Event" ? "Tell us how to keep it a secret, any specific instructions, food allergies..." : "Any specific instructions, food allergies, or elements to avoid..."} 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>

                    {eventType === "Surprise Event" && (<div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700 block">Heartfelt wish message for the guest <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        required={eventType === "Surprise Event"}
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        placeholder="This personal message will be printed on the keepsake card presented at the reveal moment..." 
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-stone-800 text-sm font-medium resize-none leading-relaxed transition-all" 
                      />
                    </div>)}"""
book_content = book_content.replace(notes_section, new_notes_section)

# Remove the old step shifting check that might break since we replaced string directly.
# Wait, let's make sure the text replaces were correct.

with open(BOOK_FILE, "w", encoding="utf-8") as f:
    f.write(book_content)
