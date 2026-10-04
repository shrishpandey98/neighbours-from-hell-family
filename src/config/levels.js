// 10 Complete Playable Levels across 5 Houses with Enhanced Room Coordinates
export const LEVELS = [
  // =========================================================
  // HOUSE 1: MAMA'S VILLA (Levels 1 - 2)
  // =========================================================
  {
    id: 1,
    houseId: 'mama',
    title: 'The Salty Chai Surprise',
    subtitle: 'Teach Mama that salt does not belong in morning tea!',
    description: 'Find the salt shaker in the kitchen pantry, tamper with Mama\'s favorite sugar jar, and hide before he sips his tea!',
    targetScore: 1000,
    timeBonusThreshold: 60,
    bonusChallenge: 'Complete without getting spotted once',
    items: [
      { id: 'salt', name: 'Salt Shaker', icon: '🧂', roomId: 'kitchen', x: 120, y: 610, desc: 'Extra salty sea salt. Guaranteed to ruin any sweet chai.' }
    ],
    hidingSpots: [
      { id: 'curtain_kitchen', name: 'Window Curtain', roomId: 'kitchen', x: 480, y: 520, width: 65, height: 120, type: 'curtain' },
      { id: 'sofa_living', name: 'Behind Large Sofa', roomId: 'living', x: 860, y: 550, width: 90, height: 95, type: 'sofa' }
    ],
    interactiveObjects: [
      {
        id: 'sugar_jar',
        name: 'Sugar Jar',
        tamperedName: 'Sugar Jar (Salty!)',
        icon: '🍯',
        roomId: 'kitchen',
        x: 320,
        y: 595,
        requiredItem: 'salt',
        isTampered: false,
        desc: 'Mama adds two giant scoops of sugar from this jar every morning.'
      }
    ],
    prankObjectives: [
      {
        id: 'salty_tea',
        title: 'Ruin Mama\'s Morning Chai',
        points: 800,
        targetObject: 'sugar_jar',
        requiredItem: 'salt',
        successDialogue: 'YEH CHAI MEIN KYA HO GAYA?! THOO THOO! 🤮',
        prankAnimation: 'spit_tea',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'living', x: 920, action: 'relaxing', duration: 7, speech: 'Cricket match shuru hone wala hai...', checkPrankId: null },
      { roomId: 'kitchen', x: 320, action: 'making_tea', duration: 9, speech: 'Chai ka waqt ho gaya!', checkPrankId: 'salty_tea' },
      { roomId: 'living', x: 920, action: 'relaxing', duration: 7, speech: 'Aah, ab aayega chai ka maza!', checkPrankId: null }
    ]
  },
  {
    id: 2,
    houseId: 'mama',
    title: 'Breaking News Chaos',
    subtitle: 'Sticky slippers and spicy morning headlines!',
    description: 'Fetch the tube of super glue from the balcony toolbox to glue Mama\'s slippers, and sprinkle chili powder inside his newspaper!',
    targetScore: 1600,
    timeBonusThreshold: 80,
    bonusChallenge: 'Pull off both pranks in a single routine loop',
    items: [
      { id: 'glue', name: 'Super Glue Tube', icon: '🧴', roomId: 'balcony', x: 980, y: 290, desc: 'Ultra-strong adhesive for slippers and soles.' },
      { id: 'chili', name: 'Hot Chili Powder', icon: '🌶️', roomId: 'kitchen', x: 140, y: 610, desc: 'Pure red mirchi powder. One sniff will cause non-stop sneezing!' }
    ],
    hidingSpots: [
      { id: 'almirah_bedroom', name: 'Wooden Wardrobe', roomId: 'bedroom', x: 140, y: 200, width: 80, height: 140, type: 'cupboard' },
      { id: 'sofa_living', name: 'Behind Large Sofa', roomId: 'living', x: 860, y: 550, width: 90, height: 95, type: 'sofa' }
    ],
    interactiveObjects: [
      {
        id: 'slippers',
        name: 'Kolhapuri Chappals',
        tamperedName: 'Slippers (Glued Tight!)',
        icon: '🩴',
        roomId: 'living',
        x: 740,
        y: 620,
        requiredItem: 'glue',
        isTampered: false,
        desc: 'Mama\'s favorite leather slippers sitting right by the sofa.'
      },
      {
        id: 'newspaper',
        name: 'Morning Newspaper',
        tamperedName: 'Newspaper (Mirchi Dusted!)',
        icon: '📰',
        roomId: 'living',
        x: 1040,
        y: 600,
        requiredItem: 'chili',
        isTampered: false,
        desc: 'Freshly delivered newspaper waiting to be opened.'
      }
    ],
    prankObjectives: [
      {
        id: 'glue_chappal',
        title: 'Super-Glue Mama\'s Slippers',
        points: 750,
        targetObject: 'slippers',
        requiredItem: 'glue',
        successDialogue: 'AREY MERA CHAPPAL FARSH PAR CHIPAK GAYA! 😱',
        prankAnimation: 'stuck_shoes',
        isCompleted: false
      },
      {
        id: 'spicy_news',
        title: 'Dust Newspaper with Chili Powder',
        points: 850,
        targetObject: 'newspaper',
        requiredItem: 'chili',
        successDialogue: 'ACHHOO! YEH AKHBAAR MEIN MIRCHI KISNE DAAL DI?! 🤧',
        prankAnimation: 'sneezing_fit',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'bedroom', x: 340, action: 'sleeping', duration: 7, speech: 'Thodi der aaram kar leta hoon...', checkPrankId: null },
      { roomId: 'living', x: 740, action: 'wear_slippers', duration: 6, speech: 'Chalo, chappal pehan kar akhbaar padhta hoon.', checkPrankId: 'glue_chappal' },
      { roomId: 'living', x: 1040, action: 'read_paper', duration: 8, speech: 'Dekhein aaj ka taaza samachar...', checkPrankId: 'spicy_news' },
      { roomId: 'balcony', x: 850, action: 'walking', duration: 6, speech: 'Taazi hawa lene chalta hoon.', checkPrankId: null }
    ]
  },

  // =========================================================
  // HOUSE 2: GUDDI MAUSI'S HAVELI (Levels 3 - 4)
  // =========================================================
  {
    id: 3,
    houseId: 'guddi',
    title: 'Slippery Soap Opera',
    subtitle: 'Give Guddi Mausi a slippery shock and fiery pickle surprise!',
    description: 'Grab the mega-slick bath soap and place it at the bathroom doorway. Then find extra black pepper to spice up her famous mango achar jar!',
    targetScore: 1600,
    timeBonusThreshold: 85,
    bonusChallenge: 'Trigger the soap slip while hiding in the bathroom cabinet',
    items: [
      { id: 'soap', name: 'Super Slick Soap', icon: '🧼', roomId: 'hallway', x: 140, y: 610, desc: 'Extremely slippery ayurvedic bathing soap.' },
      { id: 'black_pepper', name: 'Black Pepper Crushed', icon: '🫙', roomId: 'kitchen', x: 1100, y: 610, desc: 'Extra sharp kali mirch powder.' }
    ],
    hidingSpots: [
      { id: 'bath_cabinet', name: 'Laundry Basket', roomId: 'bathroom', x: 100, y: 210, width: 70, height: 110, type: 'cupboard' },
      { id: 'curtain_hall', name: 'Floral Curtain', roomId: 'hallway', x: 450, y: 530, width: 65, height: 120, type: 'curtain' }
    ],
    interactiveObjects: [
      {
        id: 'bath_floor',
        name: 'Bathroom Doorstep',
        tamperedName: 'Doorstep (Soap Trap Active!)',
        icon: '🚪',
        roomId: 'bathroom',
        x: 360,
        y: 295,
        requiredItem: 'soap',
        isTampered: false,
        desc: 'Tiled entrance to the bathroom. Perfect spot for a classic soap slide.'
      },
      {
        id: 'achar_jar',
        name: 'Mango Pickle Jar',
        tamperedName: 'Achar Jar (Super Spiced!)',
        icon: '🏺',
        roomId: 'kitchen',
        x: 820,
        y: 595,
        requiredItem: 'black_pepper',
        isTampered: false,
        desc: 'Guddi Mausi tastes a spoonful of this achar after every cooking session.'
      }
    ],
    prankObjectives: [
      {
        id: 'soap_slip',
        title: 'Rig Bathroom Doorway with Soap',
        points: 800,
        targetObject: 'bath_floor',
        requiredItem: 'soap',
        successDialogue: 'AAYI MAA! MERA KAMAR TOOT GAYA! 😱',
        prankAnimation: 'slip_fall',
        isCompleted: false
      },
      {
        id: 'spicy_achar',
        title: 'Over-Pepper the Pickle Jar',
        points: 800,
        targetObject: 'achar_jar',
        requiredItem: 'black_pepper',
        successDialogue: 'HAAAYE! ITNA TEEKHA ACHAR KISNE BANAYA?! 🥵',
        prankAnimation: 'fire_mouth',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'terrace', x: 880, action: 'gossip_phone', duration: 7, speech: 'Haan Sharma ji ki bahu ka batao...', checkPrankId: null },
      { roomId: 'bathroom', x: 360, action: 'wash_hands', duration: 6, speech: 'Haath dho kar rasoi mein jaati hoon.', checkPrankId: 'soap_slip' },
      { roomId: 'kitchen', x: 820, action: 'taste_pickle', duration: 8, speech: 'Zara aam ka achar chakhoon...', checkPrankId: 'spicy_achar' },
      { roomId: 'hallway', x: 260, action: 'inspect_mirrors', duration: 5, speech: 'Kahin dhool toh nahi jam gayi?', checkPrankId: null }
    ]
  },
  {
    id: 4,
    houseId: 'guddi',
    title: 'The Whoopee Cushion Phone Panic',
    subtitle: 'Rig Guddi Mausi\'s favorite phone gossip chair!',
    description: 'Plant a prank whoopee cushion on the phone lounge chair and crank the landline bell ringer to maximum pitch!',
    targetScore: 1700,
    timeBonusThreshold: 80,
    bonusChallenge: 'Never let suspicion bar turn yellow',
    items: [
      { id: 'whoopee', name: 'Whoopee Cushion', icon: '🎈', roomId: 'hallway', x: 120, y: 610, desc: 'Loudest comedic squeaker in existence.' },
      { id: 'ringer_wire', name: 'High-Pitch Ringer Mod', icon: '🔌', roomId: 'kitchen', x: 1120, y: 610, desc: 'Amplifies landline phone volume by 300%.' }
    ],
    hidingSpots: [
      { id: 'wardrobe_terrace', name: 'Terrace Wardrobe', roomId: 'terrace', x: 590, y: 200, width: 80, height: 140, type: 'cupboard' },
      { id: 'dining_table', name: 'Under Spice Counter', roomId: 'kitchen', x: 950, y: 570, width: 90, height: 85, type: 'table' }
    ],
    interactiveObjects: [
      {
        id: 'phone_chair',
        name: 'Velvet Gossip Chair',
        tamperedName: 'Chair (Whoopee Loaded!)',
        icon: '🪑',
        roomId: 'terrace',
        x: 880,
        y: 295,
        requiredItem: 'whoopee',
        isTampered: false,
        desc: 'Guddi Mausi plops down here for 45-minute phone calls.'
      },
      {
        id: 'telephone',
        name: 'Vintage Landline Phone',
        tamperedName: 'Phone (Screaming Loud!)',
        icon: '☎️',
        roomId: 'terrace',
        x: 1040,
        y: 280,
        requiredItem: 'ringer_wire',
        isTampered: false,
        desc: 'Connect the ringer mod so the phone shrieks when she sits.'
      }
    ],
    prankObjectives: [
      {
        id: 'whoopee_prank',
        title: 'Rig Velvet Gossip Chair with Whoopee Cushion',
        points: 850,
        targetObject: 'phone_chair',
        requiredItem: 'whoopee',
        successDialogue: 'PFFFFT! HAWW! KISNE YEH GANDI HARKAT KI?! 😳💨',
        prankAnimation: 'whoopee_fart',
        isCompleted: false
      },
      {
        id: 'loud_phone',
        title: 'Super-Charge the Landline Phone',
        points: 850,
        targetObject: 'telephone',
        requiredItem: 'ringer_wire',
        successDialogue: 'TRRRRING! MERA KAAN PHAT GAYA! 🙉',
        prankAnimation: 'ear_hurt',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'kitchen', x: 780, action: 'stirring_dal', duration: 7, speech: 'Dal mein tadka laga deti hoon.', checkPrankId: null },
      { roomId: 'hallway', x: 300, action: 'patrolling', duration: 5, speech: 'Lagta hai koi aahat aayi?', checkPrankId: null },
      { roomId: 'terrace', x: 880, action: 'sit_phone', duration: 9, speech: 'Chalo, Pammi behen ko call lagati hoon!', checkPrankId: 'whoopee_prank' },
      { roomId: 'terrace', x: 1040, action: 'answer_call', duration: 5, speech: 'Hello?! Kaun bol raha hai?!', checkPrankId: 'loud_phone' }
    ]
  },

  // =========================================================
  // HOUSE 3: PAMMI MAUSI'S ASHRAM (Levels 5 - 6)
  // =========================================================
  {
    id: 5,
    houseId: 'pammi',
    title: 'The Green Face Pack Fiasco',
    subtitle: 'Turn Pammi Mausi\'s glowing beauty cream into emerald slime!',
    description: 'Locate the green organic dye vial in the herbal dining room, sneak into her beauty vanity, and mix it inside her face cream tub!',
    targetScore: 1600,
    timeBonusThreshold: 75,
    bonusChallenge: 'Hide right behind her vanity curtain while she applies it',
    items: [
      { id: 'green_dye', name: 'Bright Green Food Dye', icon: '🧪', roomId: 'dining', x: 1100, y: 610, desc: 'Safe but ultra-pigmented fluorescent green coloring.' }
    ],
    hidingSpots: [
      { id: 'salon_curtain', name: 'Vanity Silk Curtain', roomId: 'salon', x: 120, y: 530, width: 65, height: 120, type: 'curtain' },
      { id: 'bamboo_partition', name: 'Zen Bamboo Screen', roomId: 'yogaroom', x: 420, y: 200, width: 80, height: 140, type: 'cupboard' }
    ],
    interactiveObjects: [
      {
        id: 'face_cream',
        name: 'Ayurvedic Glow Cream',
        tamperedName: 'Glow Cream (Hulk Slime Mixed!)',
        icon: '🧴',
        roomId: 'salon',
        x: 380,
        y: 595,
        requiredItem: 'green_dye',
        isTampered: false,
        desc: 'Pammi Mausi generously slathers this all over her face every evening.'
      }
    ],
    prankObjectives: [
      {
        id: 'green_face',
        title: 'Turn Glowing Face Cream Green',
        points: 1200,
        targetObject: 'face_cream',
        requiredItem: 'green_dye',
        successDialogue: 'AAYE HAYE! MERI SHAKAL HULK JAISI KYUN HO GAYI?! 😱🧟‍♀️',
        prankAnimation: 'green_face_shock',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'garden', x: 920, action: 'watering_plants', duration: 8, speech: 'Mera aloe vera kitna sundar hai...', checkPrankId: null },
      { roomId: 'dining', x: 880, action: 'herbal_tea', duration: 6, speech: 'Green tea se skin glowing rehti hai.', checkPrankId: null },
      { roomId: 'salon', x: 380, action: 'apply_cream', duration: 9, speech: 'Ab aayega mere chehre par 24-carat glow!', checkPrankId: 'green_face' }
    ]
  },
  {
    id: 6,
    houseId: 'pammi',
    title: 'Yoga Cushion Catastrophe',
    subtitle: 'Loosen the meditation stool and swap peaceful chants with party beats!',
    description: 'Find the mini wrench on the zen balcony to loosen Pammi\'s meditation folding stool, and swap her peaceful flute cassette with an obnoxious brass horn tape!',
    targetScore: 1800,
    timeBonusThreshold: 90,
    bonusChallenge: 'Execute both pranks without visiting the same room twice in a row',
    items: [
      { id: 'mini_wrench', name: 'Mini Screwdriver', icon: '🪛', roomId: 'garden', x: 1080, y: 290, desc: 'Perfect for loosening hinges and screws.' },
      { id: 'party_tape', name: 'Loud DJ Horn Cassette', icon: '📼', roomId: 'dining', x: 740, y: 610, desc: 'Ear-blasting brass horns and air horn blasts.' }
    ],
    hidingSpots: [
      { id: 'yoga_mat_roll', name: 'Behind Large Yoga Bolster', roomId: 'yogaroom', x: 550, y: 220, width: 80, height: 110, type: 'sofa' },
      { id: 'dining_curtain', name: 'Dining Drapery', roomId: 'dining', x: 1160, y: 530, width: 65, height: 120, type: 'curtain' }
    ],
    interactiveObjects: [
      {
        id: 'yoga_stool',
        name: 'Folding Meditation Stool',
        tamperedName: 'Stool (Screws Loosened!)',
        icon: '🪑',
        roomId: 'yogaroom',
        x: 320,
        y: 295,
        requiredItem: 'mini_wrench',
        isTampered: false,
        desc: 'Lightweight wooden stool where Pammi does her deep breathing lotus poses.'
      },
      {
        id: 'cassette_player',
        name: 'Zen Cassette Boombox',
        tamperedName: 'Boombox (DJ Horn Loaded!)',
        icon: '📻',
        roomId: 'yogaroom',
        x: 160,
        y: 280,
        requiredItem: 'party_tape',
        isTampered: false,
        desc: 'Plays soothing flute melodies... or earsplitting airhorns!'
      }
    ],
    prankObjectives: [
      {
        id: 'rickety_stool',
        title: 'Loosen Screws on Yoga Stool',
        points: 850,
        targetObject: 'yoga_stool',
        requiredItem: 'mini_wrench',
        successDialogue: 'DHADAM! MERA CHAKRA HIL GAYA! 💥🧘‍♀️',
        prankAnimation: 'chair_collapse',
        isCompleted: false
      },
      {
        id: 'dj_blast',
        title: 'Swap Zen Tape with DJ Airhorn',
        points: 950,
        targetObject: 'cassette_player',
        requiredItem: 'party_tape',
        successDialogue: 'BAAP RE! YEH OM KI JAGAH HONK-HONK KAUN BAJA RAHA HAI?! 🤯📢',
        prankAnimation: 'head_spin',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'salon', x: 260, action: 'hair_brush', duration: 7, speech: 'Sundarta hi sab kuch hai...', checkPrankId: null },
      { roomId: 'garden', x: 880, action: 'sun_salute', duration: 6, speech: 'Surya namaskar ka samay!', checkPrankId: null },
      { roomId: 'yogaroom', x: 160, action: 'play_music', duration: 6, speech: 'Shanti dene wala sangeet bajati hoon.', checkPrankId: 'dj_blast' },
      { roomId: 'yogaroom', x: 320, action: 'sit_meditate', duration: 9, speech: 'Om shanti... deep breath in...', checkPrankId: 'rickety_stool' }
    ]
  },

  // =========================================================
  // HOUSE 4: BEENA MAUSI'S RESIDENCY (Levels 7 - 8)
  // =========================================================
  {
    id: 7,
    houseId: 'beena',
    title: 'The Stained Sari & Toy Mouse',
    subtitle: 'Disrupt Beena Mausi\'s ultra-neat organization spree!',
    description: 'Find the blue calligraphy ink in the study to splash onto her freshly ironed white sari, and wind up a mechanical toy mouse to trigger sheer panic!',
    targetScore: 1900,
    timeBonusThreshold: 85,
    bonusChallenge: 'Avoid Beena\'s strict detection without getting past 40% suspicion',
    items: [
      { id: 'ink_bottle', name: 'Blue Ink Bottle', icon: '🖋️', roomId: 'study', x: 420, y: 290, desc: 'Vibrant washable royal blue ink.' },
      { id: 'toy_mouse', name: 'Wind-up Clockwork Mouse', icon: '🐁', roomId: 'kitchen', x: 1100, y: 610, desc: 'Runs around rapidly making squeaking sounds.' }
    ],
    hidingSpots: [
      { id: 'steel_almirah', name: 'Godrej Steel Almirah', roomId: 'bedroom', x: 1100, y: 200, width: 80, height: 140, type: 'cupboard' },
      { id: 'ironing_stand', name: 'Behind Laundry Basket', roomId: 'laundry', x: 450, y: 540, width: 70, height: 110, type: 'sofa' }
    ],
    interactiveObjects: [
      {
        id: 'ironed_sari',
        name: 'Crisp White Silk Sari',
        tamperedName: 'Silk Sari (Blue Ink Splashed!)',
        icon: '🥻',
        roomId: 'laundry',
        x: 280,
        y: 595,
        requiredItem: 'ink_bottle',
        isTampered: false,
        desc: 'Ironed with razor-sharp pleats and zero wrinkles.'
      },
      {
        id: 'mouse_spot',
        name: 'Clean Bedroom Carpet',
        tamperedName: 'Carpet (Mouse Trap Wound!)',
        icon: '🧶',
        roomId: 'bedroom',
        x: 820,
        y: 300,
        requiredItem: 'toy_mouse',
        isTampered: false,
        desc: 'Spotless floor where Beena inspects for dust bunnies.'
      }
    ],
    prankObjectives: [
      {
        id: 'ink_sari',
        title: 'Splash Ink on Pristine White Sari',
        points: 950,
        targetObject: 'ironed_sari',
        requiredItem: 'ink_bottle',
        successDialogue: 'HAI BHAGWAN! MERI MEHENGI SARI PAR NEELA DAAG?! 😱😭',
        prankAnimation: 'faint_dramatic',
        isCompleted: false
      },
      {
        id: 'mouse_fright',
        title: 'Release Wind-up Mouse on Carpet',
        points: 950,
        targetObject: 'mouse_spot',
        requiredItem: 'toy_mouse',
        successDialogue: 'CHOOOOHAAA! MERE GHAR MEIN CHUHA KAHAAN SE AAYA?! 🐭🏃‍♀️',
        prankAnimation: 'jump_chair',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'study', x: 300, action: 'filing_papers', duration: 7, speech: 'Files hamesha alphabetical honi chahiye.', checkPrankId: null },
      { roomId: 'bedroom', x: 820, action: 'inspect_floor', duration: 7, speech: 'Farsh par ek bhi dhabba nahi hona chahiye.', checkPrankId: 'mouse_fright' },
      { roomId: 'kitchen', x: 880, action: 'wipe_counter', duration: 6, speech: 'Steel ke bartan chamakne chahiye.', checkPrankId: null },
      { roomId: 'laundry', x: 280, action: 'check_sari', duration: 9, speech: 'Meri sari ki creasing bilkul perfect hai!', checkPrankId: 'ink_sari' }
    ]
  },
  {
    id: 8,
    houseId: 'beena',
    title: 'The Sour Kheer & Clockwork Confusion',
    subtitle: 'Add sour vinegar to the boiling sweet pudding and advance the clock!',
    description: 'Sneak into the pantry for raw vinegar to ruin the festive dessert, then sneak into the study to advance the vintage clock by two hours!',
    targetScore: 2000,
    timeBonusThreshold: 90,
    bonusChallenge: 'Complete the level with 100% stealth rating',
    items: [
      { id: 'vinegar', name: 'Sharp White Vinegar', icon: '🍶', roomId: 'laundry', x: 120, y: 610, desc: 'Pungent acidic vinegar. Instant milk curdler!' },
      { id: 'clock_key', name: 'Brass Clock Winder', icon: '🗝️', roomId: 'kitchen', x: 1120, y: 610, desc: 'Winds the heavy weights of the grandfather clock.' }
    ],
    hidingSpots: [
      { id: 'study_curtain', name: 'Velvet Study Drapes', roomId: 'study', x: 120, y: 220, width: 65, height: 120, type: 'curtain' },
      { id: 'almirah_bedroom', name: 'Wooden Wardrobe', roomId: 'bedroom', x: 1120, y: 200, width: 80, height: 140, type: 'cupboard' }
    ],
    interactiveObjects: [
      {
        id: 'kheer_pot',
        name: 'Simmering Sweet Kheer Pot',
        tamperedName: 'Kheer Pot (Vinegar Curdled!)',
        icon: '🍲',
        roomId: 'kitchen',
        x: 780,
        y: 595,
        requiredItem: 'vinegar',
        isTampered: false,
        desc: 'Traditional sweet cardamom rice pudding bubbling on the stove.'
      },
      {
        id: 'grandfather_clock',
        name: 'Grandfather Clock',
        tamperedName: 'Clock (Fast-Forwarded 2 Hours!)',
        icon: '🕰️',
        roomId: 'study',
        x: 480,
        y: 270,
        requiredItem: 'clock_key',
        isTampered: false,
        desc: 'Beena lives by this clock\'s exact chiming schedule.'
      }
    ],
    prankObjectives: [
      {
        id: 'sour_kheer',
        title: 'Curdle the Festive Sweet Kheer',
        points: 1000,
        targetObject: 'kheer_pot',
        requiredItem: 'vinegar',
        successDialogue: 'CHI CHI! KHEER PANEER JAISE FAT GAYI! 🤢',
        prankAnimation: 'spit_food',
        isCompleted: false
      },
      {
        id: 'clock_prank',
        title: 'Fast-Forward Grandfather Clock',
        points: 1000,
        targetObject: 'grandfather_clock',
        requiredItem: 'clock_key',
        successDialogue: 'DONG DONG! KYA?! SHAAM KE 6 BAJ GAYE AUR MAIN SO RAHI THI?! ⏰😲',
        prankAnimation: 'panic_run',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'study', x: 480, action: 'check_clock', duration: 7, speech: 'Samay ka paaband hona sabse zaroori hai.', checkPrankId: 'clock_prank' },
      { roomId: 'bedroom', x: 780, action: 'fold_bedsheet', duration: 6, speech: 'Chadar ke corners 90 degree hone chahiye.', checkPrankId: null },
      { roomId: 'kitchen', x: 780, action: 'taste_kheer', duration: 9, speech: 'Zara kheer ki meetha check karoon...', checkPrankId: 'sour_kheer' },
      { roomId: 'laundry', x: 380, action: 'check_linen', duration: 6, speech: 'Detergent ki khushboo acchi hai.', checkPrankId: null }
    ]
  },

  // =========================================================
  // HOUSE 5: MANJU MAUSI'S MAHAL (Levels 9 - 10)
  // =========================================================
  {
    id: 9,
    houseId: 'manju',
    title: 'Bollywood Bass & Bitter Barfi',
    subtitle: 'Swap her sweets with bitter gourd and crank the speakers!',
    description: 'Snatch the amplifier cable from the poster gallery to blast her disco boombox, and sneak bitter gourd (karela) slices into her royal sweet box!',
    targetScore: 2200,
    timeBonusThreshold: 85,
    bonusChallenge: 'Execute the sweets swap while Manju Mausi is dancing next door',
    items: [
      { id: 'karela', name: 'Bitter Gourd Slices', icon: '🥒', roomId: 'terrace', x: 1050, y: 290, desc: 'Extra bitter crunchy karela cuts.' },
      { id: 'amp_cable', name: 'Bass Booster Jack', icon: '🔌', roomId: 'halloffame', x: 120, y: 290, desc: 'Plugs directly into the subwoofers for maximum thump.' }
    ],
    hidingSpots: [
      { id: 'costume_trunk', name: 'Bollywood Costume Trunk', roomId: 'halloffame', x: 380, y: 220, width: 80, height: 120, type: 'cupboard' },
      { id: 'terrace_planter', name: 'Terrace Decorative Planter', roomId: 'terrace', x: 750, y: 230, width: 70, height: 110, type: 'curtain' }
    ],
    interactiveObjects: [
      {
        id: 'sweet_box',
        name: 'Kaju Katli Sweet Dabba',
        tamperedName: 'Sweet Dabba (Bitter Karela Inside!)',
        icon: '🍬',
        roomId: 'sweets',
        x: 340,
        y: 595,
        requiredItem: 'karela',
        isTampered: false,
        desc: 'Manju Mausi sneaks a sweet from this box every 3 minutes.'
      },
      {
        id: 'disco_speaker',
        name: 'Retro Disco Boombox',
        tamperedName: 'Boombox (Max Bass Overdrive!)',
        icon: '📻',
        roomId: 'dancefloor',
        x: 980,
        y: 585,
        requiredItem: 'amp_cable',
        isTampered: false,
        desc: 'Plays 80s Bollywood disco tracks at ear-splitting volume.'
      }
    ],
    prankObjectives: [
      {
        id: 'bitter_sweet',
        title: 'Disguise Bitter Gourd in Sweet Box',
        points: 1100,
        targetObject: 'sweet_box',
        requiredItem: 'karela',
        successDialogue: 'AUCK! THOO! KAJU KATLI ITNI KADVI KAISE HO GAYI?! 🤮',
        prankAnimation: 'spit_food',
        isCompleted: false
      },
      {
        id: 'bass_blast',
        title: 'Rig Disco Boombox with Bass Overdrive',
        points: 1100,
        targetObject: 'disco_speaker',
        requiredItem: 'amp_cable',
        successDialogue: 'DHIK CHIK DHIK CHIK! ALEY BAAP RE DHAMAKA HO GAYA! 💃💥',
        prankAnimation: 'disco_panic',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'terrace', x: 880, action: 'rehearsing_song', duration: 7, speech: 'Didi tera dewar deewana... haaye!', checkPrankId: null },
      { roomId: 'halloffame', x: 260, action: 'admire_hero', duration: 6, speech: 'Amitabh ji kya shaandaar dikhte hain...', checkPrankId: null },
      { roomId: 'sweets', x: 340, action: 'eat_sweet', duration: 8, speech: 'Ek chota sa kaju katli toh banta hai!', checkPrankId: 'bitter_sweet' },
      { roomId: 'dancefloor', x: 980, action: 'turn_on_disco', duration: 9, speech: 'Thoda disco music ho jaaye!', checkPrankId: 'bass_blast' }
    ]
  },
  {
    id: 10,
    houseId: 'manju',
    title: 'The Grand Family Uproar',
    subtitle: 'The ultimate 3-part prank chain: glitter, banana peel, and barking robot!',
    description: 'Pull off the greatest family prank of all time! Place a slippery banana peel on the terrace ramp, rig the rooftop glitter confetti box, and unleash the mechanical barking puppy in the dancefloor!',
    targetScore: 3000,
    timeBonusThreshold: 110,
    bonusChallenge: 'Legendary rating: Complete all 3 pranks without being detected even once',
    items: [
      { id: 'banana', name: 'Fresh Banana Peel', icon: '🍌', roomId: 'sweets', x: 140, y: 610, desc: 'Yellow, slimy, and 100% hilarious.' },
      { id: 'glitter_box', name: 'Sparkling Confetti Popper', icon: '🎉', roomId: 'halloffame', x: 500, y: 290, desc: 'Explodes into a thousand shiny glitter flakes.' },
      { id: 'robot_dog', name: 'Robo-Pup Barking Toy', icon: '🐕', roomId: 'dancefloor', x: 680, y: 610, desc: 'Mechanical barking toy that chases ankles.' }
    ],
    hidingSpots: [
      { id: 'terrace_curtain', name: 'Rooftop Shaded Canopy', roomId: 'terrace', x: 1140, y: 220, width: 70, height: 120, type: 'curtain' },
      { id: 'sweets_cupboard', name: 'Pantry Snack Cupboard', roomId: 'sweets', x: 440, y: 530, width: 80, height: 130, type: 'cupboard' },
      { id: 'disco_drape', name: 'Glitter Backdrop Curtain', roomId: 'dancefloor', x: 1160, y: 530, width: 65, height: 120, type: 'sofa' }
    ],
    interactiveObjects: [
      {
        id: 'ramp_spot',
        name: 'Terrace Wooden Step',
        tamperedName: 'Step (Banana Peel Primed!)',
        icon: '🪜',
        roomId: 'terrace',
        x: 680,
        y: 295,
        requiredItem: 'banana',
        isTampered: false,
        desc: 'The slick ramp between the hall of fame and the terrace.'
      },
      {
        id: 'glitter_rig',
        name: 'Rooftop Party Spotlight',
        tamperedName: 'Spotlight (Glitter Cannon Armed!)',
        icon: '✨',
        roomId: 'terrace',
        x: 940,
        y: 200,
        requiredItem: 'glitter_box',
        isTampered: false,
        desc: 'Rig the spotlight to shower glitter when turned on.'
      },
      {
        id: 'dance_carpet',
        name: 'Dancefloor Center Stage',
        tamperedName: 'Stage (Robo-Pup Active!)',
        icon: '🐾',
        roomId: 'dancefloor',
        x: 880,
        y: 600,
        requiredItem: 'robot_dog',
        isTampered: false,
        desc: 'Where Manju Mausi practices her famous thumkas.'
      }
    ],
    prankObjectives: [
      {
        id: 'ramp_slip',
        title: 'Plant Banana Peel on Terrace Ramp',
        points: 900,
        targetObject: 'ramp_spot',
        requiredItem: 'banana',
        successDialogue: 'WOOOAAAH! KELA KISNE PHENKA YAHAAN?! 🍌💨😵',
        prankAnimation: 'slip_fall',
        isCompleted: false
      },
      {
        id: 'glitter_blast',
        title: 'Rig Rooftop Spotlight with Glitter Cannon',
        points: 1000,
        targetObject: 'glitter_rig',
        requiredItem: 'glitter_box',
        successDialogue: 'CHHAMMAK CHHALLO! MAIN POORI GLITTER MEIN NAHAA GAYI! ✨🤩',
        prankAnimation: 'glitter_shower',
        isCompleted: false
      },
      {
        id: 'robo_pup_chase',
        title: 'Unleash Barking Robo-Pup on Dancefloor',
        points: 1100,
        targetObject: 'dance_carpet',
        requiredItem: 'robot_dog',
        successDialogue: 'BHOW BHOW! HATO HATO! YEH KUTTA MERI SAREE KHHEECH RAHA HAI! 🐕🏃‍♀️',
        prankAnimation: 'dog_chase',
        isCompleted: false
      }
    ],
    residentRoutine: [
      { roomId: 'sweets', x: 260, action: 'eating_namkeen', duration: 7, speech: 'Thoda namkeen bhi kha leti hoon.', checkPrankId: null },
      { roomId: 'terrace', x: 680, action: 'climb_step', duration: 6, speech: 'Rooftop par practice karne jaati hoon.', checkPrankId: 'ramp_slip' },
      { roomId: 'terrace', x: 940, action: 'switch_spotlight', duration: 7, speech: 'Light camera action!', checkPrankId: 'glitter_blast' },
      { roomId: 'halloffame', x: 200, action: 'admire_trophies', duration: 6, speech: 'College dance trophy... wah!', checkPrankId: null },
      { roomId: 'dancefloor', x: 880, action: 'dance_solo', duration: 10, speech: 'Ab aayega asli maza... dance pe chance!', checkPrankId: 'robo_pup_chase' }
    ]
  }
];
