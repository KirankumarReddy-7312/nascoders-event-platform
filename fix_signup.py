import re

SIGNUP_FILE = "src/app/signup/page.tsx"

with open(SIGNUP_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Replace type="email" label to "Email or Mobile Number"
content = content.replace('type="email"', 'type="text"')
content = content.replace('Email address', 'Email or Mobile Number')
content = content.replace('placeholder="name@example.com"', 'placeholder="name@example.com or 10-digit mobile"')

# Update validation
content = content.replace(
    'if (!/\\S+@\\S+\\.\\S+/.test(email)) {',
    'if (!/\\S+@\\S+\\.\\S+/.test(email) && !/^\\d{10}$/.test(email)) {'
)
content = content.replace(
    'setError("Please enter a valid email address.");',
    'setError("Please enter a valid email or 10-digit mobile number.");'
)

social_login_func = """
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const email = `${provider.toLowerCase()}user@example.com`;
      const userName = `${provider} User`;
      
      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({
          name: userName,
          email: email,
        })
      );
      
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
             localStorage.removeItem("activeBookings");
          }
        } catch (e) {}
      }
      window.location.href = "/profile";
    }, 1000);
  };
"""

content = re.sub(
    r'(const handleSubmit = \(e: React\.FormEvent\) => \{.*?\n  \};\n)',
    r'\1\n' + social_login_func.strip() + '\n',
    content,
    flags=re.DOTALL
)

content = content.replace(
    '<button className="w-full bg-white border border-stone-200',
    '<button onClick={() => handleSocialLogin("Google")} type="button" className="w-full bg-white border border-stone-200'
)

content = content.replace(
    '<button className="w-full bg-stone-800 text-white',
    '<button onClick={() => handleSocialLogin("Apple")} type="button" className="w-full bg-stone-800 text-white'
)

with open(SIGNUP_FILE, "w", encoding="utf-8") as f:
    f.write(content)
