import re

def remove_social_login(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define regex pattern to match from `<div className="space-y-4 mb-8">` down to `</div>` 
    # of the "or continue with email" separator
    pattern = r'<div className="space-y-4 mb-8">.*?(?:Continue with Google).*?(?:Continue with Apple).*?</button>\s*</div>\s*<div className="relative mb-8">.*?<span className="px-4 bg-white text-stone-400 font-medium font-serif italic">or continue with email</span>\s*</div>\s*</div>'
    
    # Actually, a simpler way is string replacement or regex with DOTALL
    pattern = r'<div className="space-y-4 mb-8">.*?<span className="px-4 bg-white text-stone-400 font-medium font-serif italic">or continue with email</span>\s*</div>\s*</div>'
    
    new_content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
remove_social_login('src/app/login/page.tsx')
remove_social_login('src/app/signup/page.tsx')

