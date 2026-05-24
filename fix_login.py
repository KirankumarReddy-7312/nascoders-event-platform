import re

LOGIN_FILE = "src/app/login/page.tsx"

with open(LOGIN_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update email label and input
content = content.replace('type="email"', 'type="text"')
content = content.replace('Email address', 'Email or Mobile Number')
content = content.replace('placeholder="name@example.com"', 'placeholder="name@example.com or 10-digit mobile"')

# 2. Update validation
# from: if (!/\S+@\S+\.\S+/.test(email)) {
# to: if (!/\S+@\S+\.\S+/.test(email) && !/^\d{10}$/.test(email)) {
content = content.replace(
    'if (!/\\S+@\\S+\\.\\S+/.test(email)) {',
    'if (!/\\S+@\\S+\\.\\S+/.test(email) && !/^\\d{10}$/.test(email)) {'
)
content = content.replace(
    'setError("Please enter a valid email address.");',
    'setError("Please enter a valid email or 10-digit mobile number.");'
)

# 3. Add handleSocialLogin
social_login_func = """
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const email = `${provider.toLowerCase()}user@example.com`;
      const userName = `${provider} User`;
      
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
    }, 1000);
  };
"""

# Insert handleSocialLogin after handleSubmit
content = re.sub(
    r'(const handleSubmit = \(e: React\.FormEvent\) => \{.*?\n  \};\n)',
    r'\1\n' + social_login_func.strip() + '\n',
    content,
    flags=re.DOTALL
)

# 4. Attach handleSocialLogin to buttons
content = content.replace(
    '<button className="w-full bg-white border border-stone-200',
    '<button onClick={() => handleSocialLogin("Google")} type="button" className="w-full bg-white border border-stone-200'
)

content = content.replace(
    '<button className="w-full bg-stone-800 text-white',
    '<button onClick={() => handleSocialLogin("Apple")} type="button" className="w-full bg-stone-800 text-white'
)

with open(LOGIN_FILE, "w", encoding="utf-8") as f:
    f.write(content)
