import re

FILE = "src/app/book/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

games_pattern = r'const GAMES = \[.*?\];'

replacement = """const GAMES = [
  "Custom Trivia", "Scavenger Hunt", "Musical Chairs", "Karaoke Setup", 
  "Pictionary", "Charades", "Truth or Dare", "Bingo", 
  "Two Truths and a Lie", "Murder Mystery", "Mini Escape Room", 
  "Giant Jenga", "Board Game Lounge", "Video Game Tournament", "No Games Needed"
];

const CUSTOMIZATIONS: Record<string, {name: string, price: number, isFromBudget: boolean}[]> = {
  "Marriage": [
    { name: "Premium Photography", price: 15000, isFromBudget: false },
    { name: "Drone Videography", price: 12000, isFromBudget: false },
    { name: "Bridal Makeup", price: 10000, isFromBudget: true },
    { name: "Live Band / DJ", price: 20000, isFromBudget: false },
    { name: "Gourmet Catering", price: 30000, isFromBudget: false }
  ],
  "Birthday": [
    { name: "Themed 3-Tier Cake", price: 5000, isFromBudget: true },
    { name: "Magic Show", price: 8000, isFromBudget: false },
    { name: "Polaroid Photo Booth", price: 6000, isFromBudget: false },
    { name: "Premium Return Gifts", price: 12000, isFromBudget: false }
  ],
  "Anniversary": [
    { name: "Private Violinist", price: 8000, isFromBudget: false },
    { name: "Customized Ring Box", price: 3000, isFromBudget: true },
    { name: "Champagne Tower", price: 15000, isFromBudget: false }
  ],
  "Default": [
    { name: "Professional Photographer", price: 8000, isFromBudget: false },
    { name: "Live Music/DJ", price: 15000, isFromBudget: false },
    { name: "Premium Catering", price: 20000, isFromBudget: false },
    { name: "Welcome Drinks", price: 5000, isFromBudget: true }
  ]
};
"""

content = re.sub(games_pattern, replacement, content, flags=re.DOTALL)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
