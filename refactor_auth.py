import os

def replace_in_file(filepath, old_text, new_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find old text in {filepath}")

# 1. Update Signup
signup_path = 'src/app/signup/page.tsx'
old_signup = """      // Store mock user details in localStorage
      const usersStr = localStorage.getItem("euphoria_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some((u: any) => u.email === email)) {
        setError("User with this email already exists");
        setIsLoading(false);
        return;
      }
      
      users.push({ name, email, password });
      localStorage.setItem("euphoria_users", JSON.stringify(users));

      localStorage.setItem(
        "euphoria_session",
        JSON.stringify({ name, email })
      );"""

new_signup = """      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("euphoria_session", JSON.stringify({ name, email, role: 'user' }));"""

replace_in_file(signup_path, old_signup, new_signup)

# 2. Update Login
login_path = 'src/app/login/page.tsx'
old_login = """      // Check for user details in localStorage
      const usersStr = localStorage.getItem("euphoria_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        setIsLoading(true);
        setTimeout(() => {
          localStorage.setItem(
            "euphoria_session",
            JSON.stringify({ name: user.name, email: user.email })
          );"""

new_login = """      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsLoading(true);
        setTimeout(() => {
          localStorage.setItem(
            "euphoria_session",
            JSON.stringify({ name: data.user.name, email: data.user.email, role: data.user.role })
          );"""

replace_in_file(login_path, old_login, new_login)

# Update the error message handling in Login
old_login_err = """        }, 1500);
      } else {
        setError("Invalid email or password.");
      }"""

new_login_err = """        }, 1500);
      } else {
        setError(data.message || "Invalid email or password.");
      }"""
replace_in_file(login_path, old_login_err, new_login_err)

print("Done phase 1")
