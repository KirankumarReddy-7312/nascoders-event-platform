"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "EN" | "HI" | "BN" | "TE" | "TA" | "KN" | "ML";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  EN: {
    "Discover the Magic": "Discover the Magic",
    "Explore Surprises": "Explore Surprises",
    "Book Now": "Book Now",
    "View Details": "View Details",
    "Reveal Quote": "Reveal Quote",
    "Join Euphoria": "Join Euphoria",
    "Your emotional memory space": "Your emotional memory space",
    "FULL NAME": "FULL NAME",
    "MOBILE NUMBER": "MOBILE NUMBER",
    "Continue": "Continue",
    "Login": "Login",
    "Sign up": "Sign up",
    "Dashboard": "Dashboard",
    "Home": "Home",
    "About Us": "About Us",
    "Contact": "Contact",
    "Plan Unforgettable": "Plan Unforgettable",
    "Celebrations.": "Celebrations.",
    "Crafted with Love": "Crafted with Love",
    "Curated Details": "Curated Details",
    "Meet Our Team": "Meet Our Team",
    "Logout": "Logout",
    "Budget Planner": "Budget Planner",
    "Interactive Budget Planner": "Interactive Budget Planner",
    "Marriage": "Marriage",
    "Grand wedding celebrations": "Grand wedding celebrations",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever."
  },
  HI: {
    "Discover the Magic": "जादू की खोज करें",
    "Explore Surprises": "आश्चर्य का अन्वेषण करें",
    "Book Now": "अभी बुक करें",
    "View Details": "विवरण देखें",
    "Reveal Quote": "उद्धरण देखें",
    "Join Euphoria": "यूफोरिया से जुड़ें",
    "Your emotional memory space": "आपका भावनात्मक स्मृति स्थान",
    "FULL NAME": "पूरा नाम",
    "MOBILE NUMBER": "मोबाइल नंबर",
    "Continue": "जारी रखें",
    "Login": "लॉग इन",
    "Sign up": "साइन अप",
    "Dashboard": "डैशबोर्ड",
    "Home": "होम",
    "About Us": "हमारे बारे में",
    "Contact": "संपर्क करें",
    "Plan Unforgettable": "अविस्मरणीय योजना बनाएं",
    "Celebrations.": "समारोह।",
    "Crafted with Love": "प्यार से बनाया गया",
    "Curated Details": "क्यूरेटेड विवरण",
    "Meet Our Team": "हमारी टीम से मिलें",
    "Logout": "लॉग आउट",
    "Budget Planner": "बजट योजनाकार",
    "Interactive Budget Planner": "इंटरैक्टिव बजट योजनाकार",
    "Marriage": "विवाह",
    "Grand wedding celebrations": "भव्य विवाह समारोह",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "दो दिल, एक प्यार, जीवनभर के खूबसूरत वादे। आपके हमेशा के सफर की शुरुआत का जश्न।"
  },
  TE: {
    "Discover the Magic": "మ్యాజిక్ కనుగొనండి",
    "Explore Surprises": "ఆశ్చర్యాలను అన్వేషించండి",
    "Book Now": "ఇప్పుడే బుక్ చేయండి",
    "View Details": "వివరాలు చూడండి",
    "Reveal Quote": "కోట్ చూడండి",
    "Join Euphoria": "యుఫోరియాలో చేరండి",
    "Your emotional memory space": "మీ భావోద్వేగ జ్ఞాపకాల ప్రదేశం",
    "FULL NAME": "పూర్తి పేరు",
    "MOBILE NUMBER": "మొబైల్ నంబర్",
    "Continue": "కొనసాగించు",
    "Login": "లాగిन",
    "Sign up": "సైన్ అప్",
    "Dashboard": "డాష్‌బోర్డ్",
    "Home": "హోమ్",
    "About Us": "మా గురించి",
    "Contact": "సంప్రదించండి",
    "Plan Unforgettable": "మరపురాని ప్లాన్ చేయండి",
    "Celebrations.": "వేడుకలు.",
    "Crafted with Love": "ప్రేమతో రూపొందించబడింది",
    "Curated Details": "క్యూరేటెడ్ వివరాలు",
    "Meet Our Team": "మా బృందాన్ని కలవండి",
    "Logout": "లాగ్అవుట్",
    "Budget Planner": "బడ్జెట్ ప్లానర్",
    "Interactive Budget Planner": "ఇంటరాక్టివ్ బడ్జెట్ ప్లానర్",
    "Marriage": "వివాహం",
    "Grand wedding celebrations": "భవ్య వివాహ వేడుకలు",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "రెండు హృదయాలు, ఒక ప్రేమ, జీవితకాలం అందమైన వాగ్దానాలు. మీ నిరంతర ప్రయాణానికి ఒక వేడుక."
  },
  TA: {
    "Discover the Magic": "மேஜிக்கை கண்டறியுங்கள்",
    "Explore Surprises": "ஆச்சரியங்களை ஆராயுங்கள்",
    "Book Now": "இப்போது பதிவு செய்",
    "View Details": "விவரங்களை பார்க்க",
    "Reveal Quote": "மேற்கோளைக் காண்க",
    "Join Euphoria": "யூபோரியாவில் சேரவும்",
    "Your emotional memory space": "உங்கள் உணர்ச்சிபூர்வமான நினைவக இடம்",
    "FULL NAME": "முழு பெயர்",
    "MOBILE NUMBER": "மொபைல் எண்",
    "Continue": "தொடரவும்",
    "Login": "உள்நுழைய",
    "Sign up": "பதிவு செய்ய",
    "Dashboard": "டாஷ்போர்டு",
    "Home": "முகப்பு",
    "About Us": "எங்களை பற்றி",
    "Contact": "தொடர்பு கொள்ள",
    "Plan Unforgettable": "மறக்க முடியாத திட்டமிடுங்கள்",
    "Celebrations.": "கொண்டாட்டங்கள்.",
    "Crafted with Love": "காதலுடன் வடிவமைக்கப்பட்டது",
    "Curated Details": "தொகுக்கப்பட்ட விவரங்கள்",
    "Meet Our Team": "எங்கள் குழுவை சந்திக்கவும்",
    "Logout": "வெளியேறு",
    "Budget Planner": "பட்ஜெட் திட்டமிடுபவர்",
    "Interactive Budget Planner": "ஊடாடும் பட்ஜெட் திட்டமிடுபவர்",
    "Marriage": "திருமணம்",
    "Grand wedding celebrations": "பிரம்மாண்ட திருமண கொண்டாட்டங்கள்",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "இரு இதயங்கள், ஒரு காதல், வாழ்நாள் முழுவதும் அழகான வாக்குறுதிகள். உங்கள் தொடக்கத்தின் கொண்டாட்டம்."
  },
  KN: {
    "Discover the Magic": "ಮ್ಯಾಜಿಕ್ ಅನ್ವೇಷಿಸಿ",
    "Explore Surprises": "ಆಶ್ಚರ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    "Book Now": "ಈಗ ಬುಕ್ ಮಾಡಿ",
    "View Details": "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "Reveal Quote": "ಉಲ್ಲೇಖವನ್ನು ವೀಕ್ಷಿಸಿ",
    "Join Euphoria": "ಯುಫೋರಿಯಾ ಸೇರಿ",
    "Your emotional memory space": "ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಸ್ಮರಣೆ ಸ್ಥಳ",
    "FULL NAME": "ಪೂರ್ಣ ಹೆಸರು",
    "MOBILE NUMBER": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    "Continue": "ಮುಂದುವರಿಸಿ",
    "Login": "ಲಾಗಿನ್",
    "Sign up": "ಸೈನ್ ಅಪ್",
    "Dashboard": "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    "Home": "ಮುಖಪುಟ",
    "About Us": "ನಮ್ಮ ಬಗ್ಗೆ",
    "Contact": "ಸಂಪರ್ಕಿಸಿ",
    "Plan Unforgettable": "ಮರೆಯಲಾಗದ ಯೋಜನೆ ಮಾಡಿ",
    "Celebrations.": "ಆಚರಣೆಗಳು.",
    "Crafted with Love": "ಪ್ರೀತಿಯಿಂದ ರಚಿಸಲಾಗಿದೆ",
    "Curated Details": "ಕ್ಯುರೇಟೆಡ್ ವಿವರಗಳು",
    "Meet Our Team": "ನಮ್ಮ ತಂಡವನ್ನು ಭೇಟಿ ಮಾಡಿ",
    "Logout": "ಲಾಗ್ಔಟ್",
    "Budget Planner": "ಬಜೆಟ್ ಪ್ಲಾನರ್",
    "Interactive Budget Planner": "ಸಂವಾದಾತ್ಮಕ ಬಜೆಟ್ ಪ್ಲಾನರ್",
    "Marriage": "ವಿವಾಹ",
    "Grand wedding celebrations": "ಭವ್ಯ ವಿವಾಹ ಆಚರಣೆಗಳು",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "ಎರಡು हृदयಗಳು, ಒಂದು ಪ್ರೀತಿ, ಜೀವಮಾನದ ಸುಂದರ ಭರವಸೆಗಳು. ನಿಮ್ಮ ಸುಂದರ ಪಯಣದ ಆರಂಭದ ಆಚರಣೆ."
  },
  ML: {
    "Discover the Magic": "മാന്ത്രികത കണ്ടെത്തുക",
    "Explore Surprises": "അത്ഭുതങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക",
    "Book Now": "ഇപ്പോൾ ബുക്ക് ചെയ്യുക",
    "View Details": "വിശദാംശങ്ങൾ കാണുക",
    "Reveal Quote": "കോട്ട് കാണുക",
    "Join Euphoria": "യൂഫോറിയയിൽ ചേരുക",
    "Your emotional memory space": "നിങ്ങളുടെ വൈകാരിക മെമ്മറി ഇടം",
    "FULL NAME": "പൂർണ്ണമായ പേര്",
    "MOBILE NUMBER": "മൊബൈൽ നമ്പർ",
    "Continue": "തുടരുക",
    "Login": "ലോഗിൻ",
    "Sign up": "സൈൻ അപ്പ്",
    "Dashboard": "ഡാഷ്ബോർഡ്",
    "Home": "ഹോം",
    "About Us": "ഞങ്ങളെക്കുറിച്ച്",
    "Contact": "ബന്ധപ്പെടുക",
    "Plan Unforgettable": "മറക്കാനാവാത്ത പ്ലാൻ ചെയ്യുക",
    "Celebrations.": "ആഘോഷങ്ങൾ.",
    "Crafted with Love": "സ്നേഹത്തോടെ നിർമ്മിച്ചത്",
    "Curated Details": "ക്യുറേറ്റഡ് വിശദാംശങ്ങൾ",
    "Meet Our Team": "ഞങ്ങളുടെ ടീമിനെ കാണുക",
    "Logout": "ലോഗൗട്ട്",
    "Budget Planner": "ബജറ്റ് പ്ലാനർ",
    "Interactive Budget Planner": "ഇന്ററാക്ടീവ് ബജറ്റ് പ്ലാനർ",
    "Marriage": "വിവാഹം",
    "Grand wedding celebrations": "ഗംഭീരമായ വിവാഹ ആഘോഷങ്ങൾ",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "രണ്ട് ഹൃദയങ്ങൾ, ഒരു പ്രണയം, ജീവിതകാലത്തെ മനോഹരമായ വാഗ്ദാനങ്ങൾ. നിങ്ങളുടെ ഒപ്പമുള്ള യാത്രയുടെ തുടക്കം."
  },
  BN: {
    "Discover the Magic": "জাদু আবিষ্কার করুন",
    "Explore Surprises": "আশ্চর্যগুলি অন্বেষণ করুন",
    "Book Now": "এখন বুক করুন",
    "View Details": "বিবরণ দেখুন",
    "Reveal Quote": "উক্তিটি দেখুন",
    "Join Euphoria": "ইউফোরিয়ায় যোগ দিন",
    "Your emotional memory space": "আপনার আবেগপূর্ণ মেমরি স্পেস",
    "FULL NAME": "পুরো নাম",
    "MOBILE NUMBER": "মোবাইল নম্বর",
    "Continue": "চালিয়ে যান",
    "Login": "লগইন",
    "Sign up": "সাইন আপ",
    "Dashboard": "ড্যাশবোর্ড",
    "Home": "বাড়ি",
    "About Us": "আমাদের সম্পর্কে",
    "Contact": "যোগাযোগ",
    "Plan Unforgettable": "অবিস্মরণীয় পরিকল্পনা করুন",
    "Celebrations.": "উদযাপন।",
    "Crafted with Love": "ভালবাসা দিয়ে তৈরি",
    "Curated Details": "সংগৃহীত বিবরণ",
    "Meet Our Team": "আমাদের দলের সাথে দেখা করুন",
    "Logout": "লগআউট",
    "Budget Planner": "বাজেট প্ল্যানার",
    "Interactive Budget Planner": "ইন্টারেক্টিভ বাজেট প্ল্যানার",
    "Marriage": "বিবাহ",
    "Grand wedding celebrations": "অনিন্দ্যসুন্দর বিবাহ উদযাপন",
    "Two hearts, one love, a lifetime of beautiful promises. Celebrating the beginning of your forever.": "দুটি হৃদয়, একটি প্রেম, সারাজীবনের সুন্দর প্রতিশ্রুতি। আপনাদের চিরন্তন যাত্রা উদযাপনে।"
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("EN");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
