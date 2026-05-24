import re

with open("src/app/book/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state variables
state_vars = """  const [eventType, setEventType] = useState("");
  const [surprisePurpose, setSurprisePurpose] = useState("");
  const [surpriseLocation, setSurpriseLocation] = useState("");
  const [surpriseTeamPlan, setSurpriseTeamPlan] = useState("");
  const [customSurprisePlan, setCustomSurprisePlan] = useState("");"""

content = content.replace('  const [eventType, setEventType] = useState("");', state_vars)

# 2. Modify Step 1 UI
step1_original = """                    <div className="flex justify-end">
                      <button 
                        type="button"
                        disabled={!eventType}
                        onClick={() => setBookingStep(2)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>"""

step1_new = """                    {eventType === "Surprise Event" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-10 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">What's the purpose of the surprise?</label>
                          <input type="text" value={surprisePurpose} onChange={(e) => setSurprisePurpose(e.target.value)} placeholder="e.g. 5th Anniversary, Job Promotion..." className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Where do you want to surprise them?</label>
                          <input type="text" value={surpriseLocation} onChange={(e) => setSurpriseLocation(e.target.value)} placeholder="e.g. At home, their office, a restaurant..." className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-4">Choose a Team Recommended Plan</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["Romantic Setup with Live Music", "Flash Mob Surprise", "Private Yacht Getaway", "I have my own plan"].map(plan => (
                              <button key={plan} type="button" onClick={() => setSurpriseTeamPlan(plan)} className={`p-4 rounded-xl border text-left transition-all ${surpriseTeamPlan === plan ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}>
                                {plan}
                              </button>
                            ))}
                          </div>
                        </div>
                        {surpriseTeamPlan === "I have my own plan" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Create your own surprise (We will celebrate it!)</label>
                            <textarea value={customSurprisePlan} onChange={(e) => setCustomSurprisePlan(e.target.value)} placeholder="Describe your unique vision here..." rows={4} className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        type="button"
                        disabled={!eventType || (eventType === "Surprise Event" && (!surprisePurpose || !surpriseLocation || !surpriseTeamPlan || (surpriseTeamPlan === "I have my own plan" && !customSurprisePlan)))}
                        onClick={() => setBookingStep(2)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>
                    </div>"""

if step1_original in content:
    content = content.replace(step1_original, step1_new)
else:
    print("WARNING: step1_original not found")

# 3. Add data to submitDetails
submit_orig = """      eventType,
      city: selectedCity,"""

submit_new = """      eventType,
      surprisePurpose,
      surpriseLocation,
      surpriseTeamPlan,
      customSurprisePlan,
      city: selectedCity,"""
content = content.replace(submit_orig, submit_new)

# 4. Hide Pricing Sidebar until the final step (Step 6)
sidebar_orig = """            <div className="lg:w-[400px] w-full">"""
sidebar_new = """            {bookingStep >= 6 && <div className="lg:w-[400px] w-full">"""
content = content.replace(sidebar_orig, sidebar_new)

# Close the condition for the sidebar.
# The sidebar is the second child of the main flex container.
# Let's find where the sidebar ends.
# It ends right before:
#           </div>
#         </div>
#       </section>
sidebar_end_orig = """              </div>
            </div>
          </div>
        </div>
      </section>"""
sidebar_end_new = """              </div>
            </div>
            }
          </div>
        </div>
      </section>"""
content = content.replace(sidebar_end_orig, sidebar_end_new)


# 5. Add "Edit Budget Plan" button
edit_btn_orig = """                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>"""
edit_btn_new = """                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="w-full mt-4 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    Edit Budget Plan
                  </button>
                </div>

              </div>
            </div>
            }
          </div>
        </div>
      </section>"""
content = content.replace(edit_btn_orig, edit_btn_new)


with open("src/app/book/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Budget Planner Updated.")
