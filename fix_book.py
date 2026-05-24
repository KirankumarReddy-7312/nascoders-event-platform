import re

BOOK_FILE = "src/app/book/page.tsx"

with open(BOOK_FILE, "r", encoding="utf-8") as f:
    content = f.read()

old_logic = """
    const existingBookings = JSON.parse(localStorage.getItem("activeBookings") || "[]");
    localStorage.setItem("activeBookings", JSON.stringify([bookingData, ...existingBookings]));
    localStorage.setItem("activeBooking", JSON.stringify(bookingData));
    
    // Create session if not logged in
    const session = localStorage.getItem("euphoria_session");
    if (!session) {
      localStorage.setItem("euphoria_session", JSON.stringify({
        name: yourName,
        email: contactEmail,
        phone: contactPhone,
        registeredAt: Date.now()
      }));
      // Dispatch custom event to notify components
      window.dispatchEvent(new Event("euphoria_sessionChanged"));
    }
"""

new_logic = """
    // Create session FIRST if not logged in
    let sessionStr = localStorage.getItem("euphoria_session");
    if (!sessionStr) {
      const sessionData = {
        name: yourName,
        email: contactEmail || contactPhone,
        phone: contactPhone,
        registeredAt: Date.now()
      };
      localStorage.setItem("euphoria_session", JSON.stringify(sessionData));
      window.dispatchEvent(new Event("euphoria_sessionChanged"));
      sessionStr = JSON.stringify(sessionData);
    }
    
    let userEmail = "guest";
    if (sessionStr) {
      try { userEmail = JSON.parse(sessionStr).email || JSON.parse(sessionStr).phone; } catch(e) {}
    }
    
    const storageKey = `activeBookings_${userEmail}`;
    const existingBookingsStr = localStorage.getItem(storageKey);
    const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
    
    // Also merge legacy 'activeBookings' if any
    const legacyBookingsStr = localStorage.getItem("activeBookings");
    let legacyBookings = [];
    if (legacyBookingsStr) {
       legacyBookings = JSON.parse(legacyBookingsStr);
       localStorage.removeItem("activeBookings");
    }
    
    const updatedBookings = [bookingData, ...existingBookings, ...legacyBookings];
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    localStorage.setItem("activeBooking", JSON.stringify(bookingData));
"""

# Wait, if the indentation is slightly different, simple string replace might fail. Let's use regex.
content = re.sub(
    r'const existingBookings = JSON\.parse\(localStorage\.getItem\("activeBookings"\).*?window\.dispatchEvent\(new Event\("euphoria_sessionChanged"\)\);\s*\}',
    new_logic.strip(),
    content,
    flags=re.DOTALL
)

with open(BOOK_FILE, "w", encoding="utf-8") as f:
    f.write(content)
