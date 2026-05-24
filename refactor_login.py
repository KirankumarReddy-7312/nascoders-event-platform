import re

LOGIN_FILE = "src/app/login/page.tsx"

with open(LOGIN_FILE, "r", encoding="utf-8") as f:
    login_content = f.read()

# Replace:
#       // Store active user session
#       localStorage.setItem(
#         "euphoria_session",
#         JSON.stringify({
#           name: userName,
#           email: email,
#         })
#       );
#
#       // Redirect to profile and refresh navbar state
#       window.location.href = "/profile";

migration_logic = """
      // Store active user session
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: userName,
          email: email,
        })
      );
      
      // Migrate guest bookings to user account
      const guestBookingsStr = localStorage.getItem("activeBookings");
      if (guestBookingsStr) {
        try {
          const guestBookings = JSON.parse(guestBookingsStr);
          if (guestBookings && guestBookings.length > 0) {
             const userStorageKey = `activeBookings_${email}`;
             const existingUserBookingsStr = localStorage.getItem(userStorageKey);
             const existingUserBookings = existingUserBookingsStr ? JSON.parse(existingUserBookingsStr) : [];
             const mergedBookings = [...existingUserBookings, ...guestBookings];
             localStorage.setItem(userStorageKey, JSON.stringify(mergedBookings));
             localStorage.removeItem("activeBookings"); // clear guest bookings
          }
        } catch (e) {
          console.error("Migration error", e);
        }
      }

      // Redirect to profile and refresh navbar state
      window.location.href = "/profile";
"""

login_content = re.sub(
    r'// Store active user session.*?window\.location\.href = "/profile";',
    migration_logic.strip(),
    login_content,
    flags=re.DOTALL
)

with open(LOGIN_FILE, "w", encoding="utf-8") as f:
    f.write(login_content)
