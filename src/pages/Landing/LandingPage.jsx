import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaSearch
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import styles from "./Landing.module.css";

/* ── Translations ──────────────────────────────────────── */
const T = {
  EN: {
    badge: 'Trusted by 50,000+ customers',
    heroH1a: 'Find Trusted',
    heroH1b: 'Home Services',
    heroH1c: 'Experts Near You',
    heroSub: 'Book trusted professionals instantly. Fast, secure, and reliable.',
    searchPlaceholder: 'Search services (e.g. plumber, cleaner...)',
    login: 'Login', signup: 'Sign Up', becomeProvider: 'Become a Provider', browse: 'Browse Services',
    verified: 'Verified', secure: 'Secure', guaranteed: 'Guaranteed',
    topRated: 'Top Rated Providers',
    whatWeOffer: 'WHAT WE OFFER',
    allServices: 'All Services, One Platform',
    allServicesSub: 'Browse from our wide range of verified home service professionals.',
    simpleProcess: 'SIMPLE PROCESS',
    howItWorks: 'How It Works',
    howItWorksSub: 'Get your service done in 4 easy steps. No stress, no guesswork.',
    steps: [
      { title: 'Search Service', desc: 'Tell us what service you need and your location to find the best matches nearby.' },
      { title: 'Choose Provider', desc: 'Browse verified professionals with reviews, ratings, and transparent pricing.' },
      { title: 'Book & Schedule', desc: 'Pick a time that suits you. Instant confirmation and reminders included.' },
      { title: 'Job Done!', desc: 'Your professional arrives on time. Rate your experience after the service.' },
    ],
    whyTag: 'WHY SERVICEPRO',
    whyTitle: 'The Smarter Way to Get Things Done at Home',
    why: [
      { title: 'Fast Booking', desc: 'Book a service in under 60 seconds. Professionals confirm within minutes.', icon: '⚡' },
      { title: 'Verified Pros', desc: 'Every professional is background-checked, ID-verified and trained.', icon: '🛡️' },
      { title: 'Affordable Pricing', desc: 'Transparent, competitive rates with zero hidden charges — ever.', icon: '💰' },
      { title: '24/7 Support', desc: 'Our support team is available around the clock to help you.', icon: '🎧' },
    ],
    featuredTag: 'FEATURED PROFESSIONALS',
    featuredTitle: 'Meet Our Top Providers',
    featuredSub: 'Handpicked, background-verified professionals with proven track records.',
    trustTag: 'TRUST & SAFETY',
    trustTitle: 'Your Safety Is Our Top Priority',
    trustSub: 'We take every measure to ensure that every interaction on ServicePro is safe, secure, and trustworthy.',
    trustBadge: '✅ Trusted by 12,000+ families across 50+ cities',
    trust: [
      { title: 'Verified Professionals', desc: 'Every pro passes identity verification and skill assessment.' },
      { title: 'Background Checked', desc: 'Thorough background checks on every service provider.' },
      { title: 'Secure Payments', desc: 'All transactions are encrypted and 100% secure.' },
      { title: 'Service Guarantee', desc: "Not satisfied? We'll make it right — free re-service." },
      { title: 'Data Privacy', desc: 'Your personal data is never shared or sold to third parties.' },
    ],
    pricingTag: 'TRANSPARENT PRICING',
    pricingTitle: 'Simple, Honest Pricing',
    pricingSub: 'No hidden charges. No surprises. What you see is what you pay.',
    pricingBadge: '💰 No hidden charges — guaranteed',
    startingPrice: 'Starting price',
    bookNow: 'Book Now',
    mostPopular: 'Most Popular',
    reviewsTag: 'CUSTOMER REVIEWS',
    reviewsTitle: 'What Our Customers Say',
    testimonials: [
      { text: 'ServicePro made finding a plumber so easy! The professional arrived within 45 minutes and fixed everything perfectly.', name: 'Ayasha Fernando', role: 'Homeowner, Colombo' },
      { text: 'Booked a tutor for my kids. The matching was spot-on — very professional and patient!', name: 'David Raj', role: 'Father of two' },
      { text: 'Cleaning service was excellent. The verified badge gave me confidence. Will book again!', name: 'Nadia Silva', role: 'Working Professional' },
    ],
    stats: [
      { num: '12,000+', label: 'Happy Customers' }, { num: '3,500+', label: 'Verified Providers' },
      { num: '4.9★', label: 'Average Rating' }, { num: '98%', label: 'Satisfaction Rate' },
    ],
    smartTag: 'SMART TECHNOLOGY',
    smartTitle: 'Real-Time, Every Time',
    smartSub: 'Powered by modern tech to give you the most seamless service experience possible.',
    smart: [
      { title: 'Live Tracking', desc: 'Track your professional in real-time.', icon: '📍' },
      { title: 'Chat with Provider', desc: 'Message directly inside the app.', icon: '💬' },
      { title: 'Instant Booking', desc: 'Confirm bookings in seconds.', icon: '📅' },
      { title: 'Smart Notifications', desc: 'Real-time alerts and updates.', icon: '🔔' },
    ],
    faqTag: 'FAQs',
    faqTitle: 'Frequently Asked Questions',
    faqSub: 'Everything you need to know about ServicePro.',
    faqs: [
      { q: 'How do I book a service?', a: 'Search service, choose provider, and click Book Now.' },
      { q: 'Are all providers verified?', a: 'Yes, all providers are background-checked and verified.' },
      { q: 'What payment methods are accepted?', a: 'We accept cards, mobile payments, and cash.' },
      { q: 'Can I cancel or reschedule?', a: 'Yes, easily from your dashboard.' },
      { q: 'Is my data safe?', a: 'Yes, we follow strict security standards.' },
    ],
    joinTag: 'FOR PROFESSIONALS',
    joinTitle1: 'Join as a', joinTitle2: 'Service Professional',
    joinSub: 'Turn your skills into a steady income. Join 3,500+ professionals already earning with ServicePro.',
    joinBtn: 'Start Earning Today →',
    joinSmall: 'Free to join · No commissions in first month',
    joinCards: [
      { title: 'Earn More', desc: 'Set your own rates and earn up to 3x more than agencies.' },
      { title: 'Flexible Hours', desc: 'Work when you want. Accept or decline jobs freely.' },
      { title: 'Grow Your Clientele', desc: 'Access thousands of customers instantly.' },
      { title: 'Build Reputation', desc: 'Earn reviews and climb rankings.' },
    ],
    ctaBadge: '⚡ Same-day service available',
    ctaTitle1: 'Need Help Today?', ctaTitle2: 'Book a Service Now!',
    ctaSub: 'Join thousands of happy homeowners. Verified professionals, transparent pricing, guaranteed satisfaction.',
    ctaBook: 'Book a Service →', ctaBrowse: 'Browse Services',
    ctaSmall: 'Free to browse · No hidden fees · Instant confirmation',
  },
  TA: {
    badge: '50,000+ வாடிக்கையாளர்களால் நம்பகமானது',
    heroH1a: 'நம்பகமான',
    heroH1b: 'வீட்டு சேவைகள்',
    heroH1c: 'நிபுணர்களை கண்டறியுங்கள்',
    heroSub: 'உடனடியாக நம்பகமான நிபுணர்களை பதிவு செய்யுங்கள். வேகமான, பாதுகாப்பான, நம்பகமான.',
    searchPlaceholder: 'சேவைகளை தேடுங்கள் (எ.கா. குழாய் பணி, சுத்தம்...)',
    login: 'உள்நுழைய', signup: 'பதிவு செய்ய', becomeProvider: 'சேவையாளராக சேர', browse: 'சேவைகளை பார்க்க',
    verified: 'சரிபார்க்கப்பட்டது', secure: 'பாதுகாப்பானது', guaranteed: 'உத்தரவாதம்',
    topRated: 'சிறந்த சேவையாளர்கள்',
    whatWeOffer: 'நாங்கள் வழங்குவது',
    allServices: 'அனைத்து சேவைகளும், ஒரே தளம்',
    allServicesSub: 'சரிபார்க்கப்பட்ட வீட்டு சேவை நிபுணர்களின் பரந்த வரம்பிலிருந்து தேர்வு செய்யுங்கள்.',
    simpleProcess: 'எளிய படிகள்',
    howItWorks: 'எப்படி செயல்படுகிறது',
    howItWorksSub: '4 எளிய படிகளில் உங்கள் சேவையை முடிக்கவும். எந்த சிரமமும் இல்லை.',
    steps: [
      { title: 'சேவையை தேடு', desc: 'உங்களுக்கு தேவையான சேவையை தெரிவிக்கவும், அருகிலுள்ள சிறந்த நிபுணர்களை கண்டறியவும்.' },
      { title: 'சேவையாளரை தேர்வு செய்', desc: 'மதிப்புரைகள், மதிப்பீடுகள் மற்றும் வெளிப்படையான விலையுடன் சரிபார்க்கப்பட்ட நிபுணர்களை பார்க்கவும்.' },
      { title: 'பதிவு செய் & திட்டமிடு', desc: 'உங்களுக்கு ஏற்ற நேரத்தை தேர்வு செய்யுங்கள். உடனடி உறுதிப்படுத்தல் மற்றும் நினைவூட்டல்கள் அடங்கும்.' },
      { title: 'வேலை முடிந்தது!', desc: 'உங்கள் நிபுணர் சரியான நேரத்தில் வருகிறார். சேவைக்கு பிறகு உங்கள் அனுபவத்தை மதிப்பீடு செய்யுங்கள்.' },
    ],
    whyTag: 'ஏன் சர்வீஸ்ப்ரோ',
    whyTitle: 'வீட்டு வேலைகளை செய்ய புத்திசாலித்தனமான வழி',
    why: [
      { title: 'வேகமான பதிவு', desc: '60 வினாடிகளில் சேவையை பதிவு செய்யுங்கள். நிபுணர்கள் சில நிமிடங்களில் உறுதிப்படுத்துகிறார்கள்.', icon: '⚡' },
      { title: 'சரிபார்க்கப்பட்ட நிபுணர்கள்', desc: 'ஒவ்வொரு நிபுணரும் பின்னணி சரிபார்ப்பு, அடையாள சரிபார்ப்பு மற்றும் பயிற்சி பெற்றவர்கள்.', icon: '🛡️' },
      { title: 'மலிவான விலை', desc: 'வெளிப்படையான, போட்டி விலைகள் — எந்த மறைக்கப்பட்ட கட்டணமும் இல்லை.', icon: '💰' },
      { title: '24/7 ஆதரவு', desc: 'எங்கள் ஆதரவு குழு 24 மணி நேரமும் உங்களுக்கு உதவ தயாராக உள்ளது.', icon: '🎧' },
    ],
    featuredTag: 'சிறந்த நிபுணர்கள்',
    featuredTitle: 'எங்கள் சிறந்த சேவையாளர்களை சந்தியுங்கள்',
    featuredSub: 'தேர்ந்தெடுக்கப்பட்ட, பின்னணி சரிபார்க்கப்பட்ட நிபுணர்கள்.',
    trustTag: 'நம்பிக்கை & பாதுகாப்பு',
    trustTitle: 'உங்கள் பாதுகாப்பு எங்கள் முதல் முன்னுரிமை',
    trustSub: 'ServicePro-இல் ஒவ்வொரு தொடர்பும் பாதுகாப்பானதாகவும் நம்பகமானதாகவும் இருப்பதை உறுதி செய்கிறோம்.',
    trustBadge: '✅ 50+ நகரங்களில் 12,000+ குடும்பங்களால் நம்பப்படுகிறது',
    trust: [
      { title: 'சரிபார்க்கப்பட்ட நிபுணர்கள்', desc: 'ஒவ்வொரு நிபுணரும் அடையாள சரிபார்ப்பு மற்றும் திறன் மதிப்பீட்டில் தேர்ச்சி பெறுகிறார்.' },
      { title: 'பின்னணி சரிபார்ப்பு', desc: 'ஒவ்வொரு சேவையாளரிடமும் முழுமையான பின்னணி சரிபார்ப்பு.' },
      { title: 'பாதுகாப்பான கொடுப்பனவுகள்', desc: 'அனைத்து பரிமாற்றங்களும் குறியாக்கம் செய்யப்பட்டு 100% பாதுகாப்பானவை.' },
      { title: 'சேவை உத்தரவாதம்', desc: 'திருப்தியடையவில்லையா? நாங்கள் சரிசெய்கிறோம் — இலவச மறு சேவை.' },
      { title: 'தரவு தனியுரிமை', desc: 'உங்கள் தனிப்பட்ட தரவு மூன்றாம் தரப்பினருக்கு பகிரப்படுவதில்லை.' },
    ],
    pricingTag: 'வெளிப்படையான விலை',
    pricingTitle: 'எளிய, நேர்மையான விலை',
    pricingSub: 'மறைக்கப்பட்ட கட்டணம் இல்லை. ஆச்சரியம் இல்லை. நீங்கள் பார்ப்பதுதான் நீங்கள் செலுத்துவது.',
    pricingBadge: '💰 மறைக்கப்பட்ட கட்டணம் இல்லை — உத்தரவாதம்',
    startingPrice: 'தொடக்க விலை',
    bookNow: 'இப்போது பதிவு செய்',
    mostPopular: 'மிகவும் பிரபலமானது',
    reviewsTag: 'வாடிக்கையாளர் மதிப்புரைகள்',
    reviewsTitle: 'எங்கள் வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள்',
    testimonials: [
      { text: 'ServicePro குழாய் பணிக்காரனை கண்டுபிடிக்க மிகவும் எளிதாக இருந்தது! நிபுணர் 45 நிமிடங்களில் வந்து அனைத்தையும் சரியாக சரிசெய்தார்.', name: 'ஆயேஷா பெர்னாண்டோ', role: 'வீட்டு உரிமையாளர்' },
      { text: 'என் குழந்தைகளுக்கு ஒரு ஆசிரியரை பதிவு செய்தேன். பொருத்தம் சரியாக இருந்தது — மிகவும் தொழில்முறையாக இருந்தது!', name: 'டேவிட் ராஜ்', role: 'இரு குழந்தைகளின் தந்தை' },
      { text: 'சுத்தம் செய்யும் சேவை சிறப்பாக இருந்தது. சரிபார்க்கப்பட்ட பதாகை எனக்கு நம்பிக்கையை அளித்தது. மீண்டும் பதிவு செய்வேன்!', name: 'நாடியா சில்வா', role: 'பணிபுரியும் நிபுணர்' },
    ],
    stats: [
      { num: '12,000+', label: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்' }, { num: '3,500+', label: 'சரிபார்க்கப்பட்ட சேவையாளர்கள்' },
      { num: '4.9★', label: 'சராசரி மதிப்பீடு' }, { num: '98%', label: 'திருப்தி விகிதம்' },
    ],
    smartTag: 'நவீன தொழில்நுட்பம்',
    smartTitle: 'நேரடியாக, எப்போதும்',
    smartSub: 'நவீன தொழில்நுட்பத்தால் இயக்கப்படுகிறது — மிகவும் தடையற்ற சேவை அனுபவத்திற்காக.',
    smart: [
      { title: 'நேரடி கண்காணிப்பு', desc: 'உங்கள் நிபுணரை நேரடியாக கண்காணிக்கவும்.', icon: '📍' },
      { title: 'சேவையாளருடன் அரட்டை', desc: 'நேரடியாக ஆப்பில் செய்தி அனுப்புங்கள்.', icon: '💬' },
      { title: 'உடனடி பதிவு', desc: 'வினாடிகளில் பதிவுகளை உறுதிப்படுத்துங்கள்.', icon: '📅' },
      { title: 'நேரடி அறிவிப்புகள்', desc: 'நேரடி எச்சரிக்கைகள் மற்றும் புதுப்பிப்புகள்.', icon: '🔔' },
    ],
    faqTag: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    faqSub: 'ServicePro பற்றி நீங்கள் அறிய வேண்டியவை அனைத்தும்.',
    faqs: [
      { q: 'சேவையை எப்படி பதிவு செய்வது?', a: 'சேவையை தேடி, சேவையாளரை தேர்வு செய்து, இப்போது பதிவு செய் என்பதை கிளிக் செய்யவும்.' },
      { q: 'அனைத்து சேவையாளர்களும் சரிபார்க்கப்பட்டவர்களா?', a: 'ஆம், அனைத்து சேவையாளர்களும் பின்னணி சரிபார்ப்பு மற்றும் சரிபார்க்கப்பட்டவர்கள்.' },
      { q: 'என்ன கொடுப்பனவு முறைகள் ஏற்றுக்கொள்ளப்படுகின்றன?', a: 'அட்டைகள், மொபைல் கொடுப்பனவுகள் மற்றும் பணம் ஏற்றுக்கொள்கிறோம்.' },
      { q: 'ரத்து செய்யலாமா அல்லது மாற்றி திட்டமிடலாமா?', a: 'ஆம், உங்கள் டேஷ்போர்டிலிருந்து எளிதாக செய்யலாம்.' },
      { q: 'என் தரவு பாதுகாப்பானதா?', a: 'ஆம், நாங்கள் கடுமையான பாதுகாப்பு தரங்களை பின்பற்றுகிறோம்.' },
    ],
    joinTag: 'நிபுணர்களுக்காக',
    joinTitle1: 'சேர', joinTitle2: 'சேவை நிபுணராக',
    joinSub: 'உங்கள் திறமைகளை வருமானமாக மாற்றுங்கள். ServicePro-இல் ஏற்கனவே சம்பாதிக்கும் 3,500+ நிபுணர்களுடன் சேருங்கள்.',
    joinBtn: 'இன்று சம்பாதிக்க தொடங்குங்கள் →',
    joinSmall: 'சேர இலவசம் · முதல் மாதம் கமிஷன் இல்லை',
    joinCards: [
      { title: 'அதிகமாக சம்பாதியுங்கள்', desc: 'உங்கள் சொந்த விலையை நிர்ணயிக்கவும், நிறுவனங்களை விட 3 மடங்கு அதிகமாக சம்பாதிக்கவும்.' },
      { title: 'நெகிழ்வான நேரம்', desc: 'நீங்கள் விரும்பும்போது வேலை செய்யுங்கள். வேலைகளை ஏற்கலாம் அல்லது மறுக்கலாம்.' },
      { title: 'வாடிக்கையாளர்களை அதிகரிக்கவும்', desc: 'உடனடியாக ஆயிரக்கணக்கான வாடிக்கையாளர்களை அணுகவும்.' },
      { title: 'நற்பெயரை கட்டியெழுப்புங்கள்', desc: 'மதிப்புரைகளை பெற்று தரவரிசையில் உயருங்கள்.' },
    ],
    ctaBadge: '⚡ அதே நாளில் சேவை கிடைக்கும்',
    ctaTitle1: 'இன்று உதவி தேவையா?', ctaTitle2: 'இப்போது சேவையை பதிவு செய்யுங்கள்!',
    ctaSub: 'ஆயிரக்கணக்கான மகிழ்ச்சியான வீட்டு உரிமையாளர்களுடன் சேருங்கள். சரிபார்க்கப்பட்ட நிபுணர்கள், வெளிப்படையான விலை, உத்தரவாதமான திருப்தி.',
    ctaBook: 'சேவையை பதிவு செய் →', ctaBrowse: 'சேவைகளை பார்க்க',
    ctaSmall: 'பார்க்க இலவசம் · மறைக்கப்பட்ட கட்டணம் இல்லை · உடனடி உறுதிப்படுத்தல்',
  },
  SI: {
    badge: 'ගනුදෙනුකරුවන් 50,000+ ක් විශ්වාස',
    heroH1a: 'විශ්වාසදායක',
    heroH1b: 'ගෙදර සේවාවන්',
    heroH1c: 'ප්‍රවීණයන් සොයන්න',
    heroSub: 'ක්ෂණිකව විශ්වාසදායක ප්‍රවීණයන් ලියාපදිංචි කරන්න. වේගවත්, ආරක්ෂිත, විශ්වාසදායක.',
    searchPlaceholder: 'සේවාවන් සොයන්න...',
    login: 'ලොගින්', signup: 'ලියාපදිංචි', becomeProvider: 'සේවා සපයන්නෙකු වන්න', browse: 'සේවාවන් බලන්න',
    verified: 'තහවුරු', secure: 'ආරක්ෂිත', guaranteed: 'සහතික',
    topRated: 'ඉහළ ශ්‍රේණිගත සේවා සපයන්නන්',
    whatWeOffer: 'අපි ලබා දෙන්නේ',
    allServices: 'සියලු සේවාවන්, එක් වේදිකාවක',
    allServicesSub: 'සත්‍යාපිත ගෘහ සේවා ප්‍රවීණයන්ගේ පුළුල් පරාසයකින් තෝරන්න.',
    simpleProcess: 'සරල ක්‍රියාවලිය',
    howItWorks: 'එය ක්‍රියා කරන ආකාරය',
    howItWorksSub: 'පහසු පියවර 4කින් ඔබේ සේවාව ලබා ගන්න.',
    steps: [
      { title: 'සේවාව සොයන්න', desc: 'ඔබට අවශ්‍ය සේවාව සහ ස්ථානය කියන්න.' },
      { title: 'සේවා සපයන්නා තෝරන්න', desc: 'සමාලෝචන, ශ්‍රේණිගත කිරීම් සහිත ප්‍රවීණයන් බලන්න.' },
      { title: 'ලියාපදිංචි කරන්න', desc: 'ඔබට ගැලපෙන වේලාවක් තෝරන්න.' },
      { title: 'වැඩ ඉවරයි!', desc: 'ඔබේ ප්‍රවීණයා නියමිත වේලාවට පැමිණේ.' },
    ],
    whyTag: 'ඇයි ServicePro',
    whyTitle: 'නිවසේ කටයුතු කිරීමේ වශීකාරම් ක්‍රමය',
    why: [
      { title: 'වේගවත් ලියාපදිංචිය', desc: 'තත්පර 60ක් ඇතුළත සේවාවක් ලියාපදිංචි කරන්න.', icon: '⚡' },
      { title: 'සත්‍යාපිත ප්‍රවීණයන්', desc: 'සෑම ප්‍රවීණයෙකුම පසුබිම් පරීක්ෂාවට ලක් කෙරේ.', icon: '🛡️' },
      { title: 'දැරිය හැකි මිල', desc: 'විනිවිද පෙනෙන, තරඟකාරී ශ්‍රේණිගත මිල ගණන්.', icon: '💰' },
      { title: '24/7 සහයෝගය', desc: 'අපේ සහාය කණ්ඩායම සෑම වේලාවකම ලබා ගත හැකිය.', icon: '🎧' },
    ],
    featuredTag: 'ප්‍රදර්ශිත ප්‍රවීණයන්',
    featuredTitle: 'අපේ ඉහළ සේවා සපයන්නන් හමුවන්න',
    featuredSub: 'පසුබිම් සත්‍යාපිත ප්‍රවීණයන්.',
    trustTag: 'විශ්වාසය සහ ආරක්ෂාව',
    trustTitle: 'ඔබේ ආරක්ෂාව අපේ ප්‍රථම ප්‍රමුඛතාවය',
    trustSub: 'ServicePro හි සෑම අන්තර්ක්‍රියාවක්ම ආරක්ෂිත බව සහතික කිරීමට අපි සෑම ශ්‍රේණිගතයක් ගනිමු.',
    trustBadge: '✅ නගර 50+ක පවුල් 12,000+ ක් විශ්වාස',
    trust: [
      { title: 'සත්‍යාපිත ප්‍රවීණයන්', desc: 'සෑම ප්‍රවීණයෙකුම හඳුනාගැනීමේ සත්‍යාපනය සම්මත කරයි.' },
      { title: 'පසුබිම් පරීක්ෂාව', desc: 'සෑම සේවා සපයන්නෙකුගේම සම්පූර්ණ පසුබිම් පරීක්ෂාව.' },
      { title: 'ආරක්ෂිත ගෙවීම්', desc: 'සියලු ගනුදෙනු සංකේතාංකනය කර ඇත.' },
      { title: 'සේවා සහතිකය', desc: 'සෑහීමකට පත් නොවූවා? අපි නිවැරදි කරමු.' },
      { title: 'දත්ත රහස්‍යතාව', desc: 'ඔබේ පෞද්ගලික දත්ත කිසිවිටෙකත් බෙදා නොගනිමු.' },
    ],
    pricingTag: 'විනිවිද පෙනෙන මිල',
    pricingTitle: 'සරල, අවංක මිල',
    pricingSub: 'සැඟවුණු ගාස්තු නැත. හදිසි ගාස්තු නැත.',
    pricingBadge: '💰 සැඟවුණු ගාස්තු නැත — සහතික',
    startingPrice: 'ආරම්භක මිල',
    bookNow: 'දැන් ලියාපදිංචි',
    mostPopular: 'වඩාත් ජනප්‍රිය',
    reviewsTag: 'ගනුදෙනුකරු සමාලෝchana',
    reviewsTitle: 'අපේ ගනුදෙනුකරුවන් කියන්නේ කුමක්ද',
    testimonials: [
      { text: 'ServicePro නල සේවකයෙකු සොයා ගැනීම ඉතා පහසු කළේය! ප්‍රවීණයා විනාඩි 45ක් ඇතුළත පැමිණ සියල්ල ශ්‍රේෂ්ඨ ලෙස නිරාකරණය කළේය.', name: 'ආයේෂා ෆර්නාන්දෝ', role: 'ගෙදර හිමිකාරිය' },
      { text: 'මගේ දරුවන්ට ගුරුවරයෙකු ලියාපදිංචි කළෙමි. ගැළපීම නිවැරදි විය — ඉතා වෘත්තීය!', name: 'ඩේවිඩ් රාජ්', role: 'ළමයි දෙදෙනාගේ පියා' },
      { text: 'පිරිසිදු කිරීමේ සේවාව ශ්‍රේෂ්ඨ විය. නැවත ලියාපදිංචි කරමි!', name: 'නාඩියා සිල්වා', role: 'වෘත්තිකයා' },
    ],
    stats: [
      { num: '12,000+', label: 'සතුටු ගනුදෙනුකරුවන්' }, { num: '3,500+', label: 'සත්‍යාපිත සූදානම' },
      { num: '4.9★', label: 'සාමාන්‍ය ශ්‍රේණිගත' }, { num: '98%', label: 'සෑහීම අනුපාතය' },
    ],
    smartTag: 'ස්මාර්ට් තාක්ෂණය',
    smartTitle: 'සෑම විටෙකම ලයිව්',
    smartSub: 'නවීන තාක්ෂණයෙන් ශ්‍රේෂ්ඨ සේවා අත්දැකීමක් ලබා ගන්න.',
    smart: [
      { title: 'සෘජු ලුහුබැඳීම', desc: 'ඔබේ ප්‍රවීණයා සෘජුව ලුහුබදිනවා.', icon: '📍' },
      { title: 'සේවා සපයන්නා සමඟ කතාබස්', desc: 'සෘජුව ඇප් එකෙන් පණිවිඩ යවන්න.', icon: '💬' },
      { title: 'ක්ෂණිත ලියාපදිංචිය', desc: 'තත්පරවලින් ලියාපදිංචි කිරීම් තහවුරු කරන්න.', icon: '📅' },
      { title: 'ස්මාර්ට් දැනුම්දීම්', desc: 'සෘජු ඇඟවීම් සහ යාවත්කාලීන.', icon: '🔔' },
    ],
    faqTag: 'නිතර අසන ප්‍රශ්න',
    faqTitle: 'නිතර අසන ප්‍රශ්න',
    faqSub: 'ServicePro ගැන ඔබ දැනගත යුතු සියල්ල.',
    faqs: [
      { q: 'සේවාවක් ලියාපදිංචි කරන්නේ කෙසේද?', a: 'සේවාව සොයා, සේවා සපයන්නා තෝරා, දැන් ලියාපදිංචි කරන්නේ ක්ලික් කරන්න.' },
      { q: 'සියලු සේවා සපයන්නන් සත්‍යාපිතද?', a: 'ඔව්, සියලු සේවා සපයන්නන් පසුබිම් පරීක්ෂාව සහ සත්‍යාපනය ලබා ඇත.' },
      { q: 'කුමන ගෙවීම් ක්‍රම භාවිතා කළ හැකිද?', a: 'කාඩ්, ජංගම ගෙවීම් සහ මුදල් ලබා ගනිමු.' },
      { q: 'අවලංගු හෝ නැවත සැලසුම් කළ හැකිද?', a: 'ඔව්, ඔබේ ඩෑෂ්බෝඩ් වෙතින් පහසුවෙන්.' },
      { q: 'මගේ දත්ත ආරක්ෂිතද?', a: 'ඔව්, අපි දැඩි ආරක්ෂක ප්‍රමිතීන් අනුගමනය කරමු.' },
    ],
    joinTag: 'ප්‍රවීණයන් සඳහා',
    joinTitle1: 'සේවා ප්‍රවීණයෙකු', joinTitle2: 'ලෙස සම්බන්ධ වන්න',
    joinSub: 'ඔබේ කුසලතා ආදායමක් බවට පත් කරන්න. ServicePro සමඟ දැනටමත් ඉපැයීමේ ප්‍රවීණයන් 3,500+ ට සමඟ සම්බන්ධ වන්න.',
    joinBtn: 'අද පටන් ගන්න →',
    joinSmall: 'සම්බන්ධ වීම නොමිලේ · පළමු මාසේ කොමිස් නෑ',
    joinCards: [
      { title: 'වැඩිපුර ඉපයන්න', desc: 'ඔබේ ශ්‍රේෂ්ඨ ගාස්තු සකසා නිකරුනේ 3x ඉපයන්න.' },
      { title: 'නම්‍යශීලී වේලාවන්', desc: 'ඔබට ඕනෑ වෙලාවක වැඩ කරන්න.' },
      { title: 'ගනුදෙනුකරුවන් වැඩි කරන්න', desc: 'ක්ෂණිකව දහස් ගණනක් ගනුදෙනුකරුවන් ළඟා කරන්න.' },
      { title: 'කීර්තිය ගොඩනඟන්න', desc: 'සමාලෝchana ලබා ශ්‍රේෂ්ඨ ශ්‍රේණිගත ළඟා කරන්න.' },
    ],
    ctaBadge: '⚡ එදිනම සේවා ලබා ගත හැකිය',
    ctaTitle1: 'අද උදව් අවශ්‍යද?', ctaTitle2: 'දැන් සේවාවක් ලියාපදිංචි කරන්න!',
    ctaSub: 'සතුටු ගෙදර හිමියන් දහස් ගණනකට සම්බන්ධ වන්න. සත්‍යාපිත ප්‍රවීණයන්, සහතිකගත සෑහීම.',
    ctaBook: 'සේවාවක් ලියාපදිංචි කරන්න →', ctaBrowse: 'සේවාවන් බලන්න',
    ctaSmall: 'බැලීමට නොමිලේ · සැඟවුණු ගාස්තු නෑ · ක්ෂණික තහවුරු',
  },
};


const LandingPage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [lang, setLang] = useState(() => localStorage.getItem('sp_lang') || 'EN');

  // Listen for language changes dispatched by Navbar
  useEffect(() => {
    const onLangChange = (e) => setLang(e.detail);
    window.addEventListener('sp_lang_change', onLangChange);
    return () => window.removeEventListener('sp_lang_change', onLangChange);
  }, []);

  const t = T[lang] || T.EN;

  const CATEGORY_ICONS = {
    'Plumbing':      '🔧',
    'Electrician':   '⚡',
    'Caretaker':     '👨‍⚕️',
    'Beautician':    '💄',
    'Cooking Chef':  '👨‍🍳',
    'Tutor':         '📚',
    'Helper':        '🙌',
    'Cleaner':       '🧹',
    'Cleaning':      '🧹',
    'Gardening':     '🌿',
    'Painting':      '🎨',
    'Carpentry':     '🪚',
    'AC Repair':     '❄️',
    'Pest Control':  '🐛',
    'Security':      '🛡️',
  };

  const getCategoryIcon = (cat) => CATEGORY_ICONS[cat] || '🔨';

  const doHeroSearch = () => {
    const q = heroSearch.trim();
    if (q) navigate(`/services?q=${encodeURIComponent(q)}`);
    else navigate('/services');
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/providers");
        const data = await res.json();
        setProviders(data);
      } catch (error) {
        console.error("API Error:", error);
        setProviders([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services/categories");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Categories Error:", error);
      }
    };

    fetchProviders();
    fetchCategories();
  }, []);

  return (
    <MainLayout>
      {/* HERO */}
      {/* HERO WITH VIDEO */}
<section id="hero" className={styles["video-hero"]}>

  {/* VIDEO */}
  <video autoPlay loop muted playsInline className={styles["bg-video"]}>
    <source src="https://storage.cloud.google.com/servicepro-assets/videos/HeroVideo.mp4" type="video/mp4" />
  </video>

  {/* OVERLAY */}
  <div className={styles["video-overlay"]}></div>

  <div className={`${styles["container"]} ${styles["hero-inner"]}`}>
    
    {/* LEFT */}
    <div className={styles["hero-left"]}>
      <span className={styles["badge"]}>
        <FaCheckCircle /> {t.badge}
      </span>

      <h1>
        {t.heroH1a} <br />
        <span>{t.heroH1b}</span> {t.heroH1c}
      </h1>

      <p className={styles["subtext"]}>
        {t.heroSub}
      </p>

      <div className={styles["search-box"]}>
        <input
          placeholder={t.searchPlaceholder}
          value={heroSearch}
          onChange={(e) => setHeroSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doHeroSearch()}
        />
        <button onClick={doHeroSearch}><FaSearch /></button>
      </div>

      <div className={styles["hero-buttons"]}>
        <Link to="/login" className="btn outline">{t.login}</Link>
        <Link to="/register" className="btn primary">{t.signup}</Link>
        <Link to="/provider-register" className="btn outline">{t.becomeProvider}</Link>
        <Link to="/services" className="btn outline">{t.browse}</Link>
      </div>

      <div className={styles["features"]}>
        <span><FaCheckCircle /> {t.verified}</span>
        <span><FaCheckCircle /> {t.secure}</span>
        <span><FaCheckCircle /> {t.guaranteed}</span>
      </div>
    </div>

    {/* RIGHT SIDE (NEW 🔥) */}
    <div className={styles["hero-right"]}>
      <div className={styles["hero-card"]}>

        <h3 className={styles["card-title"]}>{t.topRated}</h3>

        {["Sarah", "Mike", "Emma"].map((name, i) => (
          <div key={i} className={styles["mini-card"]}>
            <div className={styles["avatar"]}>{name[0]}</div>
            <div>
              <p>{name}</p>
              <small>4.{8 + i} ⭐</small>
            </div>
            <span>${40 + i * 10}/hr</span>
          </div>
        ))}

      </div>
    </div>

  </div>
</section>

 {/* ================= SERVICES CATEGORY (NEW) ================= */}
<section id="services" className={`section light ${styles["services-section"]}`}>
  <div className={`${styles["container"]} ${styles["services-container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.whatWeOffer}</p>
    <h2 className="section-title">{t.allServices}</h2>
    <p className={styles["subtext"]}>
      {t.allServicesSub}
    </p>

    <div className={styles["services-grid"]}>

      {categories.length > 0
        ? categories.map((item) => (
            <div
              key={item.category}
              className={styles["service-box"]}
              onClick={() => navigate(`/services?q=${encodeURIComponent(item.category)}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles["service-icon"]}>{getCategoryIcon(item.category)}</div>
              <h3>{item.category}</h3>
              <p>{item.count} service{item.count !== 1 ? 's' : ''} available</p>
            </div>
          ))
        : [
            { name: "Plumbing",      desc: "Leak fix, pipes & more",      icon: "🔧" },
            { name: "Electrician",   desc: "Wiring, repairs & fitting",   icon: "⚡" },
            { name: "Caretaker",     desc: "Elderly & patient care",      icon: "👨‍⚕️" },
            { name: "Beautician",    desc: "Hair, skin & makeup",         icon: "💄" },
            { name: "Cooking Chef",  desc: "Home & event catering",       icon: "👨‍🍳" },
            { name: "Tutor",         desc: "All subjects & levels",       icon: "📚" },
            { name: "Helper",        desc: "Moving, errands & more",      icon: "🙌" },
            { name: "Cleaner",       desc: "Deep & regular cleaning",     icon: "🧹" },
          ].map((item, i) => (
            <div key={i} className={styles["service-box"]}>
              <div className={styles["service-icon"]}>{item.icon}</div>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          ))
      }

    </div>
  </div>
</section>


{/* ================= HOW IT WORKS (NEW) ================= */}
<section id="how-it-works" className={`section ${styles["how-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.simpleProcess}</p>
    <h2 className="section-title">{t.howItWorks}</h2>
    <p className={styles["subtext"]}>  
      {t.howItWorksSub}
    </p>

    <div className={styles["steps-wrapper"]}>

      {t.steps.map((step, i) => (
        <div key={i} className={styles["step-card"]}>

          <div className={styles["step-icon-box"]}>{['🔍','👤','📅','✅'][i]}</div>
          <div className={styles["step-number"]}>0{i + 1}</div>

          <h3>{step.title}</h3>
          <p>{step.desc}</p>

        </div>
      ))}

    </div>
  </div>
</section>   

{/* ================= WHY SERVICEPRO ================= */}
<section id="why-servicepro" className={`section light ${styles["why-pro-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.whyTag}</p>
    <h2 className="section-title">
      {t.whyTitle}
    </h2>

    <div className={styles["why-grid"]}>

      {t.why.map((item, i) => (
        <div key={i} className={styles["why-pro-card"]}>
          <div className={styles["why-icon"]}>{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>


{/* ================= TOP PROVIDERS ================= */}
<section id="providers" className={`section ${styles["providers-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.featuredTag}</p>
    <h2 className="section-title">{t.featuredTitle}</h2>
    <p className={styles["subtext"]}>
      {t.featuredSub}
    </p>

    <div className={styles["providers-grid"]}>

      {Array.isArray(providers) && providers.map((pro) => (
        <div key={pro._id} className={styles["provider-card"]}>

          <div className={styles["provider-img"]}>
            <img src={pro.image} alt={pro.name} />
            <span className={styles["badge-top"]}>{pro.badge}</span>
          </div>

          <div className={styles["provider-info"]}>
            <h3>{pro.name}</h3>
            <p className={styles["role"]}>{pro.service}</p>

            <div className={styles["provider-meta"]}>
              ⭐ {pro.rating} ({pro.reviews})
              <span className={styles["price"]}>${pro.price}/hr</span>
            </div>

            <Link to="/booking" className="btn primary">{t.bookNow}</Link>
          </div>

        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= TRUST & SAFETY ================= */}
<section id="trust-safety" className={styles["trust-section"]}>
  <div className={`${styles["container"]} ${styles["trust-wrapper"]}`}>

    {/* LEFT */}
    <div className={styles["trust-left"]}>
      <p className={styles["section-tag"]}>{t.trustTag}</p>

      <h2>
        {t.trustTitle}
      </h2>

      <p className={styles["subtext"]}>
        {t.trustSub}
      </p>

      <div className={styles["trust-badge"]}>
        {t.trustBadge}
      </div>
    </div>

    {/* RIGHT */}
    <div className={styles["trust-right"]}>

      {t.trust.map((item, i) => (
        <div key={i} className={styles["trust-card"]}>
          <div className={styles["trust-icon"]}>✔</div>
          <div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= PRICING ================= */}
<section id="pricing" className={`section light ${styles["pricing-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.pricingTag}</p>
    <h2 className="section-title">{t.pricingTitle}</h2>
    <p className={styles["subtext"]}>
      {t.pricingSub}
    </p>

    <div className={styles["price-badge"]}>
      {t.pricingBadge}
    </div>

    <div className={styles["pricing-grid"]}>

      {[
        {
          name: "Plumbing",
          price: "Rs. 1,500",
          features: [
            "Leak detection & fix",
            "Pipe installation",
            "Drain unclogging",
            "Tap replacement",
          ],
        },
        {
          name: "Electrician",
          price: "Rs. 1,200",
          popular: true,
          features: [
            "Wiring & rewiring",
            "Switch & socket fix",
            "Fan installation",
            "MCB/fuse repair",
          ],
        },
        {
          name: "Cleaning",
          price: "Rs. 1,000",
          features: [
            "Full home cleaning",
            "Kitchen deep clean",
            "Bathroom sanitizing",
            "Carpet cleaning",
          ],
        },
        {
          name: "Tutor",
          price: "Rs. 800",
          features: [
            "Home tutoring",
            "All grade levels",
            "Flexible scheduling",
            "Progress reports",
          ],
        },
      ].map((plan, i) => (
        <div
          key={i}
          className={`${styles["pricing-card"]} ${plan.popular ? styles["popular"] : ""}`}
        >

          {plan.popular && <span className={styles["popular-badge"]}>{t.mostPopular}</span>}

          <h3>{plan.name}</h3>
          <h2>{plan.price}</h2>
          <p className="sub">{t.startingPrice}</p>

          <ul>
            {plan.features.map((f, idx) => (
              <li key={idx}>✔ {f}</li>
            ))}
          </ul>

          <Link to="/booking" className="btn primary">{t.bookNow}</Link>

        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= TESTIMONIALS ================= */}
<section id="testimonials" className={`section light ${styles["testimonials-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.reviewsTag}</p>
    <h2 className="section-title">{t.reviewsTitle}</h2>

    <div className={styles["testimonial-grid"]}>

      {t.testimonials.map((tt, i) => (
        <div key={i} className={styles["testimonial-card"]}>
          <div className={styles["stars"]}>⭐⭐⭐⭐⭐</div>
          <p>"{tt.text}"</p>

          <div className={styles["user"]}>
            <div className={styles["avatar"]}>{tt.name[0]}</div>
            <div>
              <h4>{tt.name}</h4>
              <small>{tt.role}</small>
            </div>
          </div>
        </div>
      ))}

    </div>

    {/* STATS */}
    <div className={styles["stats"]}>
      {t.stats.map((s, i) => (
        <div key={i}><h2>{s.num}</h2><p>{s.label}</p></div>
      ))}
    </div>

  </div>
</section>

{/* ================= SMART TECH ================= */}
<section id="smart-tech" className={`section ${styles["smart-section"]}`}>
  <div className={`${styles["container"]} ${styles["center"]}`}>

    <p className={styles["section-tag"]}>{t.smartTag}</p>
    <h2 className="section-title center">{t.smartTitle}</h2>
    <p className={styles["subtext"]}>
      {t.smartSub}
    </p>

    <div className={`grid-4 ${styles["smart-grid"]}`}>

      {t.smart.map((item, i) => (
        <div key={i} className={styles["smart-card"]}>
          <div className={styles["smart-icon"]}>{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= FAQ ================= */}
<section id="faq" className={`section light ${styles["faq-section"]}`}>
  <div className={styles["container"]}>

    <p className={`${styles["section-tag"]} center`}>{t.faqTag}</p>
    <h2 className="section-title center">{t.faqTitle}</h2>
    <p className={`${styles["subtext"]} center`}>
      {t.faqSub}
    </p>

    <div className={styles["faq-list"]}>

      {t.faqs.map((item, i) => (
        <div
          key={i}
          className={`${styles["faq-item"]} ${activeFAQ === i ? styles["active"] : ""}`}
          onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
        >
          <div className={styles["faq-question"]}>
            {item.q}
            <span>{activeFAQ === i ? "▲" : "▼"}</span>
          </div>

          {activeFAQ === i && (
            <div className={styles["faq-answer"]}>{item.a}</div>
          )}
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= JOIN AS PROFESSIONAL ================= */}
<section id="join-professional" className={`section ${styles["join-section"]}`}>
  <div className={`${styles["container"]} ${styles["join-wrapper"]}`}>

    {/* LEFT */}
    <div className={styles["join-left"]}>
      <p className={styles["section-tag"]}>{t.joinTag}</p>

      <h2>
        {t.joinTitle1} <br />
        <span>{t.joinTitle2}</span>
      </h2>

      <p className={styles["subtext"]}>
        {t.joinSub}
      </p>

      <button className={`btn primary ${styles["join-btn"]}`}>
        {t.joinBtn}
      </button>

      <small>{t.joinSmall}</small>
    </div>

    {/* RIGHT */}
    <div className={styles["join-right"]}>

      {t.joinCards.map((item, i) => (
        <div key={i} className={styles["join-card"]}>
          <div className={styles["join-icon"]}>★</div>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= FINAL CTA ================= */}
<section className={styles["cta-banner"]}>
  <div className={`${styles["container"]} ${styles["cta-wrapper"]}`}>

    {/* LEFT CONTENT */}
    <div className={styles["cta-left"]}>

      <span className={styles["cta-badge"]}>{t.ctaBadge}</span>

      <h2>
        {t.ctaTitle1} <br />
        {t.ctaTitle2}
      </h2>

      <p>
        {t.ctaSub}
      </p>

      <div className={styles["cta-buttons"]}>
        <Link to="/booking" className="btn primary">{t.ctaBook}</Link>
        <Link to="/services" className="btn outline">{t.ctaBrowse}</Link>
      </div>

      <small>
        {t.ctaSmall}
      </small>

    </div>

    {/* RIGHT IMAGE */}
    <div className={styles["cta-right"]}>
      <img src="https://storage.cloud.google.com/servicepro-assets/images/service-common.png" alt="Service" />
    </div>

  </div>
</section>

    </MainLayout>
  );
};

export default LandingPage;