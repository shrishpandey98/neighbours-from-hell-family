// 5 Distinct Family Houses - Scaled for 1280x720 Landscape Viewport
export const HOUSES = [
  // =========================================================
  // 1. MAMA JI'S VILLA (Warm terracotta, vintage wood, cricket & chai)
  // =========================================================
  {
    id: 'mama',
    name: 'Pappu Mama',
    fullName: 'Pappu Mama',
    gender: 'Male',
    title: 'The Chai & Cricket Enthusiast',
    tagline: 'Loves his morning ginger tea, newspapers, and afternoon cricket matches.',
    themeColor: '#ea580c',
    wallColor1: '#fff7ed',
    wallColor2: '#fed7aa',
    floorColor: '#78350f',
    accentColor: '#f97316',
    resident: {
      id: 'mama',
      name: 'Mama',
      gender: 'male',
      clothingColor: '#2563eb', // Blue kurta
      trouserColor: '#f8fafc',  // White pajama
      skinColor: '#fcd34d',
      hairColor: '#475569',
      hasMustache: true,
      walkSpeed: 120,
      detectionRadius: 300,
      visionAngle: 1.05,
      suspicionRate: 1.0,
      voicePitch: 0.8
    },
    rooms: [
      { id: 'kitchen', name: 'Kitchen & Pantry', x: 40, y: 370, width: 560, height: 310, floor: 0, roomType: 'kitchen', bgPattern: 'tiles' },
      { id: 'living', name: 'Living Room', x: 620, y: 370, width: 620, height: 310, floor: 0, roomType: 'living', bgPattern: 'wallpaper' },
      { id: 'bedroom', name: 'Master Bedroom', x: 40, y: 50, width: 560, height: 310, floor: 1, roomType: 'bedroom', bgPattern: 'stripes' },
      { id: 'balcony', name: 'Terrace Balcony', x: 620, y: 50, width: 620, height: 310, floor: 1, roomType: 'balcony', bgPattern: 'brick' }
    ],
    doors: [
      { from: 'kitchen', to: 'living', x: 610, y: 580, toX: 650, toY: 580, type: 'door' },
      { from: 'living', to: 'balcony', x: 1160, y: 500, toX: 1160, toY: 180, type: 'stairs' },
      { from: 'balcony', to: 'bedroom', x: 610, y: 260, toX: 570, toY: 260, type: 'door' }
    ],
    svgPreview: `<svg viewBox="0 0 200 120">
      <rect width="200" height="120" rx="12" fill="#fff7ed"/>
      <path d="M 20 60 L 100 20 L 180 60 Z" fill="#ea580c"/>
      <rect x="35" y="60" width="130" height="52" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
      <rect x="85" y="76" width="30" height="36" fill="#78350f"/>
      <circle cx="110" cy="94" r="2.5" fill="#facc15"/>
      <rect x="48" y="70" width="24" height="24" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2"/>
      <rect x="128" y="70" width="24" height="24" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2"/>
      <text x="100" y="116" font-size="10" font-family="sans-serif" font-weight="bold" fill="#ea580c" text-anchor="middle">MAMA'S VILLA</text>
    </svg>`
  },

  // =========================================================
  // 2. GUDDI MAUSI'S HAVELI (Vibrant sky blue & yellow, phone gossip)
  // =========================================================
  {
    id: 'guddi',
    name: 'Guddi Mausi',
    fullName: 'Guddi Mausi',
    gender: 'Female',
    title: 'The Hyper-Alert Gossip Queen',
    tagline: 'Always on the telephone, eagle eyes, and lightning-fast room hops.',
    themeColor: '#0284c7',
    wallColor1: '#f0f9ff',
    wallColor2: '#bae6fd',
    floorColor: '#0369a1',
    accentColor: '#38bdf8',
    resident: {
      id: 'guddi',
      name: 'Guddi Mausi',
      gender: 'female',
      clothingColor: '#db2777', // Magenta pink saree
      trouserColor: '#9d174d',
      skinColor: '#fed7aa',
      hairColor: '#0f172a',
      hasBun: true,
      walkSpeed: 145, // Rapid walker!
      detectionRadius: 320,
      visionAngle: 1.15,
      suspicionRate: 1.3,
      voicePitch: 1.3
    },
    rooms: [
      { id: 'hallway', name: 'Front Entrance Hall', x: 40, y: 370, width: 540, height: 310, floor: 0, roomType: 'hallway', bgPattern: 'checker' },
      { id: 'kitchen', name: 'Pickle & Spice Kitchen', x: 600, y: 370, width: 640, height: 310, floor: 0, roomType: 'kitchen', bgPattern: 'tiles' },
      { id: 'bathroom', name: 'Ayurvedic Bathroom', x: 40, y: 50, width: 480, height: 310, floor: 1, roomType: 'bathroom', bgPattern: 'tiles' },
      { id: 'terrace', name: 'Phone Gossip Lounge', x: 540, y: 50, width: 700, height: 310, floor: 1, roomType: 'living', bgPattern: 'wallpaper' }
    ],
    doors: [
      { from: 'hallway', to: 'kitchen', x: 590, y: 580, toX: 630, toY: 580, type: 'door' },
      { from: 'kitchen', to: 'terrace', x: 1180, y: 500, toX: 1180, toY: 180, type: 'stairs' },
      { from: 'terrace', to: 'bathroom', x: 530, y: 260, toX: 490, toY: 260, type: 'door' }
    ],
    svgPreview: `<svg viewBox="0 0 200 120">
      <rect width="200" height="120" rx="12" fill="#f0f9ff"/>
      <path d="M 20 60 L 100 20 L 180 60 Z" fill="#0284c7"/>
      <rect x="35" y="60" width="130" height="52" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>
      <rect x="85" y="76" width="30" height="36" fill="#0c4a6e"/>
      <circle cx="110" cy="94" r="2.5" fill="#facc15"/>
      <rect x="48" y="70" width="24" height="24" fill="#f472b6" stroke="#831843" stroke-width="2"/>
      <rect x="128" y="70" width="24" height="24" fill="#f472b6" stroke="#831843" stroke-width="2"/>
      <text x="100" y="116" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0284c7" text-anchor="middle">GUDDI HAVELI</text>
    </svg>`
  },

  // =========================================================
  // 3. PAMMI MAUSI'S ASHRAM (Pastel lavender, beauty vanity & zen yoga)
  // =========================================================
  {
    id: 'pammi',
    name: 'Pammi Mausi',
    fullName: 'Pammi Mausi',
    gender: 'Female',
    title: 'The Dramatic Beauty & Yoga Guru',
    tagline: 'Obsessed with herbal face packs, meditation routines, and melodramatic sighs.',
    themeColor: '#9333ea',
    wallColor1: '#faf5ff',
    wallColor2: '#e9d5ff',
    floorColor: '#6b21a8',
    accentColor: '#c084fc',
    resident: {
      id: 'pammi',
      name: 'Pammi Mausi',
      gender: 'female',
      clothingColor: '#a855f7', // Lavender salwar kameez
      trouserColor: '#7e22ce',
      skinColor: '#fed7aa',
      hairColor: '#451a03',
      hasHairBand: true,
      walkSpeed: 105,
      detectionRadius: 280,
      visionAngle: 0.95,
      suspicionRate: 0.9,
      voicePitch: 1.1
    },
    rooms: [
      { id: 'salon', name: 'Beauty & Vanity Parlour', x: 40, y: 370, width: 580, height: 310, floor: 0, roomType: 'bedroom', bgPattern: 'curtains' },
      { id: 'dining', name: 'Herbal Dining Salon', x: 640, y: 370, width: 600, height: 310, floor: 0, roomType: 'kitchen', bgPattern: 'wallpaper' },
      { id: 'yogaroom', name: 'Yoga & Meditation Studio', x: 40, y: 50, width: 660, height: 310, floor: 1, roomType: 'living', bgPattern: 'stripes' },
      { id: 'garden', name: 'Zen Rooftop Garden', x: 720, y: 50, width: 520, height: 310, floor: 1, roomType: 'balcony', bgPattern: 'brick' }
    ],
    doors: [
      { from: 'salon', to: 'dining', x: 630, y: 580, toX: 670, toY: 580, type: 'door' },
      { from: 'dining', to: 'garden', x: 1180, y: 500, toX: 1180, toY: 180, type: 'stairs' },
      { from: 'garden', to: 'yogaroom', x: 710, y: 260, toX: 670, toY: 260, type: 'door' }
    ],
    svgPreview: `<svg viewBox="0 0 200 120">
      <rect width="200" height="120" rx="12" fill="#faf5ff"/>
      <path d="M 20 60 L 100 20 L 180 60 Z" fill="#9333ea"/>
      <rect x="35" y="60" width="130" height="52" fill="#e9d5ff" stroke="#6b21a8" stroke-width="2"/>
      <rect x="85" y="76" width="30" height="36" fill="#581c87"/>
      <circle cx="110" cy="94" r="2.5" fill="#facc15"/>
      <rect x="48" y="70" width="24" height="24" fill="#e879f9" stroke="#701a75" stroke-width="2"/>
      <rect x="128" y="70" width="24" height="24" fill="#e879f9" stroke="#701a75" stroke-width="2"/>
      <text x="100" y="116" font-size="10" font-family="sans-serif" font-weight="bold" fill="#9333ea" text-anchor="middle">PAMMI ASHRAM</text>
    </svg>`
  },

  // =========================================================
  // 4. BEENA MAUSI'S RESIDENCY (Pristine mint green, strict order)
  // =========================================================
  {
    id: 'beena',
    name: 'Beena Mausi',
    fullName: 'Beena Mausi',
    gender: 'Female',
    title: 'The Strict Organization Warden',
    tagline: 'Every towel folded to the millimeter; notices any misplaced item instantly!',
    themeColor: '#059669',
    wallColor1: '#ecfdf5',
    wallColor2: '#a7f3d0',
    floorColor: '#064e3b',
    accentColor: '#34d399',
    resident: {
      id: 'beena',
      name: 'Beena Mausi',
      gender: 'female',
      clothingColor: '#059669', // Emerald green saree
      trouserColor: '#047857',
      skinColor: '#fde68a',
      hairColor: '#0f172a',
      hasSpectacles: true,
      walkSpeed: 125,
      detectionRadius: 330,
      visionAngle: 1.15,
      suspicionRate: 1.35,
      voicePitch: 0.95
    },
    rooms: [
      { id: 'laundry', name: 'Ironing & Linen Room', x: 40, y: 370, width: 560, height: 310, floor: 0, roomType: 'hallway', bgPattern: 'checker' },
      { id: 'kitchen', name: 'Steel Storage Pantry', x: 620, y: 370, width: 620, height: 310, floor: 0, roomType: 'kitchen', bgPattern: 'tiles' },
      { id: 'study', name: 'Grandfather Clock Study', x: 40, y: 50, width: 560, height: 310, floor: 1, roomType: 'living', bgPattern: 'stripes' },
      { id: 'bedroom', name: 'Spotless Bedroom', x: 620, y: 50, width: 620, height: 310, floor: 1, roomType: 'bedroom', bgPattern: 'wallpaper' }
    ],
    doors: [
      { from: 'laundry', to: 'kitchen', x: 610, y: 580, toX: 650, toY: 580, type: 'door' },
      { from: 'laundry', to: 'study', x: 100, y: 500, toX: 100, toY: 180, type: 'stairs' },
      { from: 'study', to: 'bedroom', x: 610, y: 260, toX: 650, toY: 260, type: 'door' }
    ],
    svgPreview: `<svg viewBox="0 0 200 120">
      <rect width="200" height="120" rx="12" fill="#ecfdf5"/>
      <path d="M 20 60 L 100 20 L 180 60 Z" fill="#059669"/>
      <rect x="35" y="60" width="130" height="52" fill="#a7f3d0" stroke="#065f46" stroke-width="2"/>
      <rect x="85" y="76" width="30" height="36" fill="#064e3b"/>
      <circle cx="110" cy="94" r="2.5" fill="#facc15"/>
      <rect x="48" y="70" width="24" height="24" fill="#6ee7b7" stroke="#064e3b" stroke-width="2"/>
      <rect x="128" y="70" width="24" height="24" fill="#6ee7b7" stroke="#064e3b" stroke-width="2"/>
      <text x="100" y="116" font-size="10" font-family="sans-serif" font-weight="bold" fill="#059669" text-anchor="middle">BEENA RESIDENCY</text>
    </svg>`
  },

  // =========================================================
  // 5. MANJU MAUSI'S MAHAL (Fiery rose & gold, Bollywood disco)
  // =========================================================
  {
    id: 'manju',
    name: 'Manju Mausi',
    fullName: 'Manju Mausi',
    gender: 'Female',
    title: 'The Bollywood Party Tornado',
    tagline: 'Loud music, sweet tooth, dance moves, and completely erratic wanderings!',
    themeColor: '#e11d48',
    wallColor1: '#fff1f2',
    wallColor2: '#fecdd3',
    floorColor: '#881337',
    accentColor: '#fb7185',
    resident: {
      id: 'manju',
      name: 'Manju Mausi',
      gender: 'female',
      clothingColor: '#e11d48', // Scarlet red & gold suit
      trouserColor: '#ca8a04',
      skinColor: '#fed7aa',
      hairColor: '#1e1b4b',
      hasBangles: true,
      walkSpeed: 140,
      detectionRadius: 310,
      visionAngle: 1.2,
      suspicionRate: 1.15,
      voicePitch: 1.2
    },
    rooms: [
      { id: 'sweets', name: 'Royal Mithai Pantry', x: 40, y: 370, width: 540, height: 310, floor: 0, roomType: 'kitchen', bgPattern: 'tiles' },
      { id: 'dancefloor', name: 'Bollywood Disco Lounge', x: 600, y: 370, width: 640, height: 310, floor: 0, roomType: 'living', bgPattern: 'stripes' },
      { id: 'halloffame', name: 'Cinema & Poster Gallery', x: 40, y: 50, width: 560, height: 310, floor: 1, roomType: 'bedroom', bgPattern: 'wallpaper' },
      { id: 'terrace', name: 'Rooftop Stage & Canopy', x: 620, y: 50, width: 620, height: 310, floor: 1, roomType: 'balcony', bgPattern: 'brick' }
    ],
    doors: [
      { from: 'sweets', to: 'dancefloor', x: 590, y: 580, toX: 630, toY: 580, type: 'door' },
      { from: 'dancefloor', to: 'terrace', x: 1180, y: 500, toX: 1180, toY: 180, type: 'stairs' },
      { from: 'terrace', to: 'halloffame', x: 610, y: 260, toX: 570, toY: 260, type: 'door' }
    ],
    svgPreview: `<svg viewBox="0 0 200 120">
      <rect width="200" height="120" rx="12" fill="#fff1f2"/>
      <path d="M 20 60 L 100 20 L 180 60 Z" fill="#e11d48"/>
      <rect x="35" y="60" width="130" height="52" fill="#fecdd3" stroke="#9f1239" stroke-width="2"/>
      <rect x="85" y="76" width="30" height="36" fill="#881337"/>
      <circle cx="110" cy="94" r="2.5" fill="#facc15"/>
      <rect x="48" y="70" width="24" height="24" fill="#fb7185" stroke="#4c0519" stroke-width="2"/>
      <rect x="128" y="70" width="24" height="24" fill="#fb7185" stroke="#4c0519" stroke-width="2"/>
      <text x="100" y="116" font-size="10" font-family="sans-serif" font-weight="bold" fill="#e11d48" text-anchor="middle">MANJU MAHAL</text>
    </svg>`
  }
];
