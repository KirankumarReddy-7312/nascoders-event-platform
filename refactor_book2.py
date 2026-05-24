import os
import re

BOOK_FILE = "src/app/book/page.tsx"

with open(BOOK_FILE, "r", encoding="utf-8") as f:
    book_content = f.read()

# 1. Fix OCCASIONS list order
occasions_str = """const OCCASIONS = [
  { name: "Birthday", icon: Gift },
  { name: "Anniversary", icon: CalendarHeart },
  { name: "Marriage", icon: Heart },
  { name: "Proposal", icon: Heart },
  { name: "Graduation", icon: Star },
  { name: "Baby Shower", icon: Baby },
  { name: "Romantic Date", icon: GlassWater },
  { name: "Bridal Shower", icon: Heart },
  { name: "Engagement Party", icon: CalendarHeart },
  { name: "Retirement", icon: Trophy },
  { name: "Reunion", icon: Target },
  { name: "Farewell", icon: MapPin },
  { name: "Housewarming", icon: MapPin },
  { name: "Promotion", icon: Star },
  { name: "Apology", icon: Heart },
  { name: "Just Because", icon: Gift }
];"""

book_content = re.sub(r'const OCCASIONS = \[.*?\];', occasions_str, book_content, flags=re.DOTALL)

# 2. Update activeBookings saving logic
# Find:
#     const existingBookingsStr = localStorage.getItem("activeBookings");
#     const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
#     const updatedBookings = [...existingBookings, bookingData];
#     localStorage.setItem("activeBookings", JSON.stringify(updatedBookings));
# Replace with session-aware logic

saving_logic = """
    let userEmail = "guest";
    const sessionStr = localStorage.getItem("euphoria_session");
    if (sessionStr) {
      try { userEmail = JSON.parse(sessionStr).email; } catch(e) {}
    }
    const storageKey = `activeBookings_${userEmail}`;
    const existingBookingsStr = localStorage.getItem(storageKey);
    const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
    
    // Also check if there are legacy 'activeBookings' and merge them
    const legacyBookingsStr = localStorage.getItem("activeBookings");
    let legacyBookings = [];
    if (legacyBookingsStr) {
       legacyBookings = JSON.parse(legacyBookingsStr);
       localStorage.removeItem("activeBookings");
    }
    
    const updatedBookings = [...existingBookings, ...legacyBookings, bookingData];
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
"""

# Wait, in book/page.tsx I need to find the exact existing code.
old_saving_logic_re = r'const existingBookingsStr = localStorage\.getItem\("activeBookings"\);.*?localStorage\.setItem\("activeBookings", JSON\.stringify\(updatedBookings\)\);'

book_content = re.sub(old_saving_logic_re, saving_logic.strip(), book_content, flags=re.DOTALL)

with open(BOOK_FILE, "w", encoding="utf-8") as f:
    f.write(book_content)
