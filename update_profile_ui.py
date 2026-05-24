import re

with open("src/app/profile/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# I want to replace the `return (` of the `BookingDashboardItem` up to the end of the first div block, but it's easier to just replace specific classes and elements.
# Or better, just rewrite the entire BookingDashboardItem return.

# Let's use a regex to replace the BookingDashboardItem component.
old_component_pattern = r"const BookingDashboardItem = \({ booking, getOccasionQuote, onEdit, isCompleted }:.*?\n    </div>\n  \);\n};"
# Wait, parsing this with regex is hard due to nested divs.
# I'll just do string replacement on the classes to make it "more professional and positive".

# Current wrapping div:
# <div className="bg-white border border-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-stone-200/30 relative overflow-hidden">
new_wrapper = '<div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200/50 rounded-3xl p-8 md:p-10 shadow-lg shadow-stone-200/50 relative overflow-hidden transition-all hover:shadow-xl">'

# Remove the amber blur:
# <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
new_blur = '<div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px]" />'

# Heartwarming occasion quote:
# <motion.div \n          initial={{ opacity: 0, y: 10 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ delay: 0.2 }}\n          className="bg-amber-50/40 border border-amber-150/40 rounded-2xl p-5 mb-8 text-center italic relative overflow-hidden"\n        >
old_quote = 'className="bg-amber-50/40 border border-amber-150/40 rounded-2xl p-5 mb-8 text-center italic relative overflow-hidden"'
new_quote = 'className="bg-stone-50 border border-stone-100 rounded-2xl p-6 mb-8 text-center italic relative overflow-hidden"'

# Event Heading Badge
old_badge = 'text-[10px] font-bold text-amber-700 bg-amber-100/60 tracking-wider uppercase mb-3 border border-amber-250/20'
new_badge = 'text-xs font-semibold text-emerald-700 bg-emerald-50 tracking-wider uppercase mb-3 border border-emerald-200/50'

# ID badge
old_id = 'text-xs font-semibold px-4 py-2 bg-stone-50 rounded-xl border border-stone-200/60 text-stone-655 font-mono'
new_id = 'text-xs font-semibold px-4 py-2 bg-white rounded-xl border border-stone-200/60 text-stone-500 font-mono shadow-sm'

content = content.replace('<div className="bg-white border border-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-stone-200/30 relative overflow-hidden">', new_wrapper)
content = content.replace('<div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />', new_blur)
content = content.replace(old_quote, new_quote)
content = content.replace(old_badge, new_badge)
content = content.replace(old_id, new_id)

with open("src/app/profile/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Profile UI updated.")
