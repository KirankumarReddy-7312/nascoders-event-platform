import re

NAVBAR_FILE = "src/components/Navbar.tsx"

with open(NAVBAR_FILE, "r", encoding="utf-8") as f:
    nav_content = f.read()

# 1. Remove the Language Selector div entirely
# The Language selector looks like:
#           {/* Language Selector */}
#           <div className="relative group">
#             ...
#             </div>
#           </div>

lang_regex = r'\{\/\* Language Selector \*\/.*?</div>\s*</div>'
nav_content = re.sub(lang_regex, '', nav_content, flags=re.DOTALL)

# 2. Update the "Hello, {user.name}" Link
# Replace:
#               <Link 
#                 href="/profile" 
#                 className="text-sm font-serif italic text-stone-600 hover:text-amber-700 transition-colors border-b border-dashed border-stone-300 hover:border-amber-400 pb-0.5"
#               >
#                 Hello, {user.name}
#               </Link>
# With "My Profile" and maybe a user icon.

profile_link_regex = r'<Link\s+href="/profile"\s+className="text-sm font-serif italic text-stone-600 hover:text-amber-700 transition-colors border-b border-dashed border-stone-300 hover:border-amber-400 pb-0.5"\s*>\s*Hello, \{user\.name\}\s*</Link>'
new_profile_link = """<Link 
                href="/profile" 
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
              >
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                My Profile
              </Link>"""
nav_content = re.sub(profile_link_regex, new_profile_link, nav_content, flags=re.DOTALL)

with open(NAVBAR_FILE, "w", encoding="utf-8") as f:
    f.write(nav_content)
