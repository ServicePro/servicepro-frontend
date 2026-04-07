import { createContext, useContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TRANSLATIONS = {
  EN: {
    /* Navbar */
    navHome: "Home",
    navServices: "Services",
    navHistory: "History",
    navReviews: "Reviews",
    navPayments: "Payments",
    navMessages: "Messages",
    navMore: "More",
    /* More dropdown */
    moreSubscription: "⭐ Subscription & Loyalty",
    moreEmergency: "🚨 Emergency Services",
    moreVideo: "🎥 Video Consultation",
    moreVR: "🥽 VR / AR Preview",
    moreSupport: "💬 Support",
    /* Notifications */
    notifTitle: "Notifications",
    notifUnread: "unread",
    notifNone: "No new messages",
    notifViewAll: "View all messages →",
    /* Profile */
    profileView: "View Profile",
    profileSettings: "Account Settings",
    profileLogout: "Logout",
    /* Dashboard hero */
    welcome: "Welcome back,",
    heroSub: "Discover trusted professionals for every need — fast, reliable, local.",
    heroExplore: "Explore Services",
    heroBecome: "Become a Provider",
    heroSearch: "Search plumbing, cleaning...",
    /* Dashboard sections */
    categories: "Categories",
    categoriesSub: "Browse what you need",
    featured: "Featured Services",
    featuredSub: "Top rated professionals",
    /* Common */
    bookNow: "Book Now",
    viewAll: "View All",
    loading: "Loading...",
    noResults: "No results found",
    search: "Search",
  },

  TA: {
    /* Navbar */
    navHome: "முகப்பு",
    navServices: "சேவைகள்",
    navHistory: "வரலாறு",
    navReviews: "மதிப்புரைகள்",
    navPayments: "கொடுப்பனவுகள்",
    navMessages: "செய்திகள்",
    navMore: "மேலும்",
    /* More dropdown */
    moreSubscription: "⭐ சந்தா & விசுவாசம்",
    moreEmergency: "🚨 அவசர சேவைகள்",
    moreVideo: "🎥 வீடியோ ஆலோசனை",
    moreVR: "🥽 VR / AR முன்னோட்டம்",
    moreSupport: "💬 ஆதரவு",
    /* Notifications */
    notifTitle: "அறிவிப்புகள்",
    notifUnread: "படிக்காதவை",
    notifNone: "புதிய செய்திகள் இல்லை",
    notifViewAll: "அனைத்து செய்திகளையும் காண →",
    /* Profile */
    profileView: "சுயவிவரம் காண",
    profileSettings: "கணக்கு அமைப்புகள்",
    profileLogout: "வெளியேறு",
    /* Dashboard hero */
    welcome: "மீண்டும் வருக,",
    heroSub: "வேகமான, நம்பகமான, உள்ளூர் நிபுணர்களை கண்டறியுங்கள் — எந்த தேவைக்கும்.",
    heroExplore: "சேவைகளை ஆராய",
    heroBecome: "வழங்குநராக ஆகுங்கள்",
    heroSearch: "குழாய், சுத்தம் தேடுங்கள்...",
    /* Dashboard sections */
    categories: "வகைகள்",
    categoriesSub: "உங்களுக்கு தேவையதை உலாவுங்கள்",
    featured: "சிறப்பு சேவைகள்",
    featuredSub: "சிறந்த நிபுணர்கள்",
    /* Common */
    bookNow: "இப்போது பதிவு செய்க",
    viewAll: "அனைத்தும் காண",
    loading: "ஏற்றுகிறது...",
    noResults: "எந்த முடிவும் கிடைக்கவில்லை",
    search: "தேடு",
  },

  SI: {
    /* Navbar */
    navHome: "මුල් පිටුව",
    navServices: "සේවා",
    navHistory: "ඉතිහාසය",
    navReviews: "සමාලෝචන",
    navPayments: "ගෙවීම්",
    navMessages: "පණිවිඩ",
    navMore: "තවත්",
    /* More dropdown */
    moreSubscription: "⭐ දායකත්වය සහ පක්ෂපාතිත්වය",
    moreEmergency: "🚨 හදිසි සේවා",
    moreVideo: "🎥 වීඩියෝ උපදේශය",
    moreVR: "🥽 VR / AR පෙරදසුන",
    moreSupport: "💬 සහාය",
    /* Notifications */
    notifTitle: "දැනුම්දීම්",
    notifUnread: "නොකියවූ",
    notifNone: "නව පණිවිඩ නොමැත",
    notifViewAll: "සියළු පණිවිඩ බලන්න →",
    /* Profile */
    profileView: "පැතිකඩ බලන්න",
    profileSettings: "ගිණුම් සැකසීම්",
    profileLogout: "පිටවීම",
    /* Dashboard hero */
    welcome: "නැවත සාදරයෙන්,",
    heroSub: "ඕනෑම අවශ්‍යතාවකට විශ්වාසදායක විශේෂඥයින් සොයාගන්න — වේගවත්, විශ්වාසනීය, දේශීය.",
    heroExplore: "සේවා ගවේෂණය කරන්න",
    heroBecome: "සේවා සපයන්නෙකු වන්න",
    heroSearch: "කඳු, පිරිසිදු කිරීම සොයන්න...",
    /* Dashboard sections */
    categories: "කාණ්ඩ",
    categoriesSub: "ඔබට අවශ්‍ය දේ බලන්න",
    featured: "විශේෂ සේවා",
    featuredSub: "ඉහළ ශ්‍රේණිගත විශේෂඥයින්",
    /* Common */
    bookNow: "දැන්ම වෙන් කරන්න",
    viewAll: "සියල්ල බලන්න",
    loading: "පූරණය වෙමින්...",
    noResults: "ප්‍රතිඵල නොමැත",
    search: "සොයන්න",
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────
const LangContext = createContext({
  lang: "EN",
  setLang: () => {},
  t: TRANSLATIONS.EN,
});

export const LangProvider = ({ children }) => {
  const [lang, _setLang] = useState(
    () => localStorage.getItem("sp_lang") || "EN"
  );

  const setLang = (newLang) => {
    _setLang(newLang);
    localStorage.setItem("sp_lang", newLang);
    window.dispatchEvent(
      new CustomEvent("sp_lang_change", { detail: newLang })
    );
  };

  /* Keep in sync when Navbar (or another component) fires the event */
  useEffect(() => {
    const handler = (e) => _setLang(e.detail);
    window.addEventListener("sp_lang_change", handler);
    return () => window.removeEventListener("sp_lang_change", handler);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);

export default LangContext;
