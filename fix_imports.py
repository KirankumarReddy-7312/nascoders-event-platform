import re

FILE = "src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the multiple Loader2 imports
content = content.replace('import { Loader2, useState, useEffect } from "react";', 'import { useState, useEffect } from "react";')
content = content.replace('import { Loader2, motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";')
content = content.replace('import { Loader2, useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";')
content = content.replace('import { Loader2, useLanguage } from "@/context/LanguageContext";', 'import { useLanguage } from "@/context/LanguageContext";')

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)
