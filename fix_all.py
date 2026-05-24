import re

PROFILE_FILE = "src/app/profile/page.tsx"
BOOK_FILE = "src/app/book/page.tsx"

# --- Fix Profile Page ---
with open(PROFILE_FILE, "r", encoding="utf-8") as f:
    profile_content = f.read()

new_load_logic = """
  // Load Session and Booking
  const loadSessionAndBooking = () => {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("euphoria_session");
      if (!sessionStr) {
        setUser(null);
        window.location.href = "/login";
        return;
      }
      
      const sessionObj = JSON.parse(sessionStr);
      setUser(sessionObj);
      const userKey = sessionObj.email || sessionObj.phone;
      const storageKey = `activeBookings_${userKey}`;
      
      const activeBookingsStr = localStorage.getItem(storageKey);
      let loadedBookings = [];
      if (activeBookingsStr) {
        loadedBookings = JSON.parse(activeBookingsStr);
        setAllBookings(loadedBookings);
      } else {
        setAllBookings([]);
      }
      
      if (loadedBookings.length > 0) {
        setBooking(loadedBookings[0]);
      } else {
        setBooking(null);
      }
      
      if (localStorage.getItem("showBookingNotification") === "true") {
        setShowNotificationModal(true);
        localStorage.removeItem("showBookingNotification");
      }
    }
  };
"""
profile_content = re.sub(
    r'  // Load Session and Booking\n  const loadSessionAndBooking = \(\) => \{.*?\n  \};\n',
    new_load_logic + '\n',
    profile_content,
    flags=re.DOTALL
)

new_save_edits = """
    const sessionStr = localStorage.getItem("euphoria_session");
    if (!sessionStr) return;
    const sessionObj = JSON.parse(sessionStr);
    const userKey = sessionObj.email || sessionObj.phone;
    const storageKey = `activeBookings_${userKey}`;
    
    const existingBookingsStr = localStorage.getItem(storageKey);
    const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
    const updatedBookings = existingBookings.map((b: any) => b.id === updatedBooking.id ? updatedBooking : b);
    if (!existingBookings.find((b: any) => b.id === updatedBooking.id)) {
      updatedBookings.push(updatedBooking);
    }
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    setAllBookings(updatedBookings);

    setBooking(updatedBooking);
    setShowEditModal(false);
"""
profile_content = re.sub(
    r'    const existingBookings = JSON\.parse\(localStorage\.getItem\("activeBookings"\).*?setShowEditModal\(false\);',
    new_save_edits.strip(),
    profile_content,
    flags=re.DOTALL
)

new_logout = """
  const handleLogout = () => {
    localStorage.removeItem("euphoria_session");
    localStorage.removeItem("activeBooking");
    window.dispatchEvent(new Event("euphoria_sessionChanged"));
    window.location.href = "/";
  };
"""
profile_content = re.sub(
    r'  const handleLogout = \(\) => \{.*?\n  \};\n',
    new_logout.lstrip() + '\n',
    profile_content,
    flags=re.DOTALL
)

with open(PROFILE_FILE, "w", encoding="utf-8") as f:
    f.write(profile_content)

# --- Fix Book Page ---
with open(BOOK_FILE, "r", encoding="utf-8") as f:
    book_content = f.read()

# Replace router.push with localStorage notification trigger
book_content = book_content.replace(
    'router.push("/profile?newBooking=true");',
    'localStorage.setItem("showBookingNotification", "true");\n    router.push("/profile");'
)

# Update Next Step button in Games section
old_games_btn = """<button 
                        type="button"
                        disabled={selectedGames.length === 0}
                        onClick={() => setBookingStep(5)} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 hover:opacity-90 shadow-md`}
                      >
                        Next Step
                      </button>"""
new_games_btn = """<button 
                        type="button"
                        onClick={() => {
                          if (selectedGames.length === 0) toggleGame("No Games Needed");
                          setBookingStep(5);
                        }} 
                        className={`${theme.accent} text-white px-8 py-4 rounded-xl font-medium transition-colors hover:opacity-90 shadow-md`}
                      >
                        {selectedGames.length === 0 ? "Skip Activities" : "Next Step"}
                      </button>"""
book_content = book_content.replace(old_games_btn, new_games_btn)

with open(BOOK_FILE, "w", encoding="utf-8") as f:
    f.write(book_content)
