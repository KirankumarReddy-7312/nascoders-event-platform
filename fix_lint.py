import re

FILE = "src/app/profile/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Fix unescaped entities
content = content.replace(
    '"I\'m personally overseeing vendor sourcing for your {booking.occasion.toLowerCase()} celebration. All materials are custom-made to reflect your heartfelt message."',
    '&quot;I&apos;m personally overseeing vendor sourcing for your {booking.occasion.toLowerCase()} celebration. All materials are custom-made to reflect your heartfelt message.&quot;'
)
content = content.replace(
    "We're thrilled to craft this beautiful moment for you.",
    "We&apos;re thrilled to craft this beautiful moment for you."
)
content = content.replace(
    "Guest of honor's phone",
    "Guest of honor&apos;s phone"
)

# Fix Math.random() impure call
content = content.replace(
    "Booking ID: <strong>EUPH-{Math.floor(Math.random() * 90000) + 10000}</strong><br/>",
    "Booking ID: <strong>EUPH-{booking.id || '99999'}</strong><br/>"
)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
