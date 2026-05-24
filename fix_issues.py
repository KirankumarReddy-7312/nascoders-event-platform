import re

def fix_page_tsx():
    FILE = "src/app/page.tsx"
    with open(FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix handleLoginSubmit to prevent hardcoding and read form inputs
    new_handle_login = """
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("fullname") as string || "User";
    const email = formData.get("email") as string || "user@example.com";

    // Simulate successful login
    localStorage.setItem("euphoria_session", JSON.stringify({ name, email }));
    window.dispatchEvent(new Event("euphoria_sessionChanged"));
    setIsLoginOpen(false);
    
    if (pendingBookingType) {
      router.push(`/book?occasion=${pendingBookingType}`);
    } else {
      // Just let the session event update the UI
    }
  };
"""
    content = re.sub(
        r'  const handleLoginSubmit = \(e: React\.FormEvent\) => \{.*?\n  \};\n',
        new_handle_login.lstrip('\n') + '\n',
        content,
        flags=re.DOTALL
    )

    # 2. Add Email field to Join Euphoria Modal and name/email attributes
    old_modal_form = """<form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("FULL NAME")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input required type="text" placeholder="e.g. David Smith" className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-stone-700" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("MOBILE NUMBER")}</label>
                  <div className="flex bg-stone-50/50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                    <div className="px-3 py-3 border-r border-stone-200 text-sm font-bold text-stone-600 bg-stone-100/50">IN +91</div>
                    <input required type="tel" placeholder="98765 43210" className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none font-medium text-stone-700" />
                  </div>
                </div>"""
                
    new_modal_form = """<form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("FULL NAME")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input required name="fullname" type="text" placeholder="e.g. David Smith" className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-stone-700" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("EMAIL ADDRESS")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input required name="email" type="email" placeholder="e.g. you@example.com" className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-stone-700" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mb-2 block">{t("MOBILE NUMBER")}</label>
                  <div className="flex bg-stone-50/50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
                    <div className="px-3 py-3 border-r border-stone-200 text-sm font-bold text-stone-600 bg-stone-100/50">IN +91</div>
                    <input required name="mobile" type="tel" placeholder="98765 43210" className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none font-medium text-stone-700" />
                  </div>
                </div>"""
    content = content.replace(old_modal_form, new_modal_form)

    # 3. Add dispatchEvent to inline signup
    inline_auth_replace = """localStorage.setItem("euphoria_session", JSON.stringify(sessionData));
                        setUser(sessionData);"""
    inline_auth_new = """localStorage.setItem("euphoria_session", JSON.stringify(sessionData));
                        window.dispatchEvent(new Event("euphoria_sessionChanged"));
                        setUser(sessionData);"""
    content = content.replace(inline_auth_replace, inline_auth_new)

    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)

def fix_profile_tsx():
    FILE = "src/app/profile/page.tsx"
    with open(FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix duplicate key warning
    content = content.replace('key={b.id}', 'key={`${b.id}-${index}`}')
    # Add index to map if needed
    content = content.replace('filteredBookings.map((b) => (', 'filteredBookings.map((b, index) => (')

    # 2. Add From email in Notification Modal
    old_email_preview = """<div>
                        <div className="text-sm font-semibold text-stone-800">Euphoria Celebrations</div>
                        <div className="text-xs text-stone-500">To: {booking.contactEmail || "you@example.com"}</div>
                      </div>"""
    new_email_preview = """<div>
                        <div className="text-sm font-semibold text-stone-800">Euphoria Celebrations</div>
                        <div className="text-[10px] text-stone-400">From: kirankumarreddy7312@gmail.com</div>
                        <div className="text-xs text-stone-500">To: {booking.contactEmail || "you@example.com"}</div>
                      </div>"""
    content = content.replace(old_email_preview, new_email_preview)

    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)

def fix_social_buttons(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Fix Google Button
    google_old = '<button onClick={() => handleSocialLogin("Google")} type="button" className="w-full bg-white border border-stone-200 text-stone-700 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors shadow-sm">'
    google_new = '<button disabled={isLoading} onClick={() => handleSocialLogin("Google")} type="button" className="w-full bg-white border border-stone-200 text-stone-700 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-50">'
    content = content.replace(google_old, google_new)

    # 2. Fix Apple Button
    apple_old = '<button onClick={() => handleSocialLogin("Apple")} type="button" className="w-full bg-stone-800 text-white py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-stone-700 transition-colors shadow-sm">'
    apple_new = '<button disabled={isLoading} onClick={() => handleSocialLogin("Apple")} type="button" className="w-full bg-stone-800 text-white py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-stone-700 transition-colors shadow-sm disabled:opacity-50">'
    content = content.replace(apple_old, apple_new)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_page_tsx()
    fix_profile_tsx()
    fix_social_buttons("src/app/login/page.tsx")
    fix_social_buttons("src/app/signup/page.tsx")
