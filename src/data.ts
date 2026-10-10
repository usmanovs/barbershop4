import { Service, Stylist } from './types';

export const SHOP_INFO = {
  name: "Apex & Blade",
  tagline: "Gaithersburg's Premier Grooming Lounge",
  address: "202 Perry Pkwy, Suite 4, Gaithersburg, MD 20877",
  phone: "(301) 555-8732",
  email: "info@apexandblade.com",
  googleMapsUrl: "https://maps.google.com/?q=202+Perry+Pkwy,+Gaithersburg,+MD+20877",
  hours: [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" }
  ]
};

export const SERVICES: Service[] = [
  // Haircuts
  {
    id: "h1",
    name: "Classic Refined Cut",
    duration: 30,
    price: 45,
    category: "haircuts",
    description: "Detailed, custom haircut finished with raw neck clean-up, a luxurious warm towel, and premium styling pomade."
  },
  {
    id: "h2",
    name: "The Executive Style & Steam",
    duration: 45,
    price: 65,
    category: "haircuts",
    description: "Signature modern cut, deep conditioning hair wash, stress-relieving massage, warm neck shave, and full blow-dry."
  },
  {
    id: "h3",
    name: "Skin Fade & Edge Out",
    duration: 45,
    price: 50,
    category: "haircuts",
    description: "Crisp, ultra-clean zero or skin-level fade using professional foil clippers, finished with straight-razor detailing."
  },
  {
    id: "h4",
    name: "Neat Buzz Cut",
    duration: 20,
    price: 30,
    category: "haircuts",
    description: "Exact, single-guard clipper fade across the entire head, finished with hot towel neck trim."
  },
  // Shaves
  {
    id: "s1",
    name: "Royal Hot Towel Shave",
    duration: 45,
    price: 55,
    category: "shaves",
    description: "Traditional straight-edge razor wet shave experience. Includes essential oil prep, pre-shave steam, face massage, and cold stone soothe."
  },
  {
    id: "s2",
    name: "Beard Sculpt & Crisp Edge",
    duration: 30,
    price: 35,
    category: "shaves",
    description: "Detailed beard shaping, custom length trimming, straight-razor cheek & neck alignment, completed with natural organic beard oil."
  },
  {
    id: "s3",
    name: "The Classic Beard Setup",
    duration: 20,
    price: 25,
    category: "shaves",
    description: "Clipper trim to target length with clean neck line detailing and refreshing hydration mist."
  },
  // Treatment
  {
    id: "t1",
    name: "Charcoal Face Revival Mask",
    duration: 20,
    price: 25,
    category: "treatment",
    description: "Pore-clearing dynamic black charcoal face mask, warm soothing facial steam, and cooling age-defying botanical moisturizer."
  },
  {
    id: "t2",
    name: "Scalp Therapy Massage & Wash",
    duration: 15,
    price: 20,
    category: "treatment",
    description: "Invigorating tea tree oil scalp detox, deep hand massage, and moisturizing hair wash to restore luster."
  },
  {
    id: "t3",
    name: "The Complete Grooming Package",
    duration: 75,
    price: 110,
    category: "treatment",
    description: "The ultimate package. Includes 'The Executive Style', 'Beard Sculpt & Crisp Edge', a clarifying mini-facial, and a complimentary espresso or craft drink."
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: "m1",
    name: "Marcus Vance",
    role: "Master Barber & Founder",
    bio: "With over 12 years behind the chair, Marcus specializes in precision master shears, classic-modern transitions, and expert structure consultancy.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    specialties: ["Classic Tapers", "Master Shears", "Styling Consults"],
    rating: 4.9,
    reviewsCount: 342,
    availableDays: [1, 2, 3, 4, 5, 6] // Mon-Sat
  },
  {
    id: "s1",
    name: "Sarah Lin",
    role: "Shave Specialist & Stylist",
    bio: "Dedicated specialist in straight-razor wet shaves and detailed beard typography. Expert at matching hair flows with clean structural skin contours.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    specialties: ["Royal Shaves", "Beard Sculpting", "Skin Therapies"],
    rating: 5.0,
    reviewsCount: 218,
    availableDays: [2, 3, 4, 5, 6, 0] // Tue-Sun
  },
  {
    id: "j1",
    name: "Julian Gray",
    role: "Modern Hair Architect",
    bio: "Julian excels at modern textured crops, skin fades, and progressive styles. He keeps a sharp eye on contemporary trends inspired by urban fashion.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialties: ["Skin Fades", "Textured Crops", "Modern Blowouts"],
    rating: 4.8,
    reviewsCount: 189,
    availableDays: [3, 4, 5, 6, 0, 1] // Wed-Mon
  }
];

export const TESTIMONIALS = [
  {
    id: "r1",
    author: "Douglas K.",
    location: "Kentlands, Gaithersburg",
    text: "Absolutely the best barbershop in Montgomery County. Marcus's attention to detail is legendary. The hot towel shave was pure luxury.",
    rating: 5,
    date: "June 3, 2026"
  },
  {
    id: "r2",
    author: "Siddharth M.",
    location: "Crown Gaithersburg",
    text: "Clean, high-end, and extremely professional. Julian gave me the cleanest zero fade I've ever had. Getting an espresso when you walk in is a wonderful premium touch.",
    rating: 5,
    date: "May 28, 2026"
  },
  {
    id: "r3",
    author: "Richard B.",
    location: "Gaithersburg, MD",
    text: "Sarah treats grooming as an art form. My beard line has never stayed this crisp for this long. Well worth every penny.",
    rating: 5,
    date: "May 15, 2026"
  }
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
  "18:00", "18:30", "19:00", "19:30"
];
