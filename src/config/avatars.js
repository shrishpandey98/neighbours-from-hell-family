// 10 Original Cartoon Avatars for Player Creation
export const AVATARS = [
  {
    id: 'chintu',
    name: 'Chintu',
    title: 'The Mischief Maker',
    tagline: 'Fast feet, always carrying funny gadgets.',
    primaryColor: '#f97316',
    hatColor: '#3b82f6',
    hairColor: '#1e293b',
    skinColor: '#fcd34d',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fed7aa"/>
      <circle cx="50" cy="50" r="32" fill="#fcd34d"/>
      <!-- Cap -->
      <path d="M 22 42 Q 50 18 78 42 Z" fill="#3b82f6"/>
      <path d="M 50 24 Q 85 24 88 38" stroke="#1d4ed8" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Big cheeky eyes -->
      <ellipse cx="40" cy="52" rx="5" ry="7" fill="#1e293b"/>
      <ellipse cx="60" cy="52" rx="5" ry="7" fill="#1e293b"/>
      <circle cx="42" cy="50" r="2" fill="#fff"/>
      <circle cx="62" cy="50" r="2" fill="#fff"/>
      <!-- Sneaky smirk -->
      <path d="M 38 68 Q 50 80 66 66" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="66" cy="66" r="2.5" fill="#f97316"/>
    </svg>`
  },
  {
    id: 'pooja',
    name: 'Pooja',
    title: 'Prankster Queen',
    tagline: 'Master of traps and master of excuses.',
    primaryColor: '#ec4899',
    hatColor: '#ec4899',
    hairColor: '#451a03',
    skinColor: '#fed7aa',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fbcfe8"/>
      <!-- Pigtails -->
      <circle cx="20" cy="40" r="14" fill="#451a03"/>
      <circle cx="80" cy="40" r="14" fill="#451a03"/>
      <circle cx="50" cy="50" r="32" fill="#fed7aa"/>
      <!-- Bangs -->
      <path d="M 22 40 Q 50 20 78 40 Q 50 32 22 40 Z" fill="#451a03"/>
      <!-- Glasses -->
      <circle cx="38" cy="52" r="8" fill="none" stroke="#ec4899" stroke-width="3"/>
      <circle cx="62" cy="52" r="8" fill="none" stroke="#ec4899" stroke-width="3"/>
      <line x1="46" y1="52" x2="54" y2="52" stroke="#ec4899" stroke-width="3"/>
      <ellipse cx="38" cy="52" rx="3" ry="5" fill="#1e293b"/>
      <ellipse cx="62" cy="52" rx="3" ry="5" fill="#1e293b"/>
      <!-- Grin -->
      <path d="M 40 68 Q 50 78 60 68" stroke="#1e293b" stroke-width="3" fill="#fff" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'bunty',
    name: 'Bunty',
    title: 'The Scheming Nerd',
    tagline: 'Calculates the exact trajectory of every banana peel.',
    primaryColor: '#eab308',
    hatColor: '#10b981',
    hairColor: '#0f172a',
    skinColor: '#fed7aa',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fef08a"/>
      <circle cx="50" cy="50" r="32" fill="#fed7aa"/>
      <!-- Parted Hair -->
      <path d="M 20 42 C 25 18, 75 18, 80 42 C 60 26, 40 32, 20 42 Z" fill="#0f172a"/>
      <!-- Nerdy Square Glasses -->
      <rect x="28" y="44" width="18" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="3.5"/>
      <rect x="54" y="44" width="18" height="15" rx="3" fill="none" stroke="#0f172a" stroke-width="3.5"/>
      <line x1="46" y1="51" x2="54" y2="51" stroke="#0f172a" stroke-width="3"/>
      <circle cx="37" cy="51" r="3.5" fill="#1e293b"/>
      <circle cx="63" cy="51" r="3.5" fill="#1e293b"/>
      <!-- Sly smile -->
      <path d="M 42 68 Q 50 74 60 69" stroke="#1e293b" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    id: 'rocky',
    name: 'Rocky',
    title: 'The Cool Rogue',
    tagline: 'Never runs, he just moonwalks away from trouble.',
    primaryColor: '#8b5cf6',
    hatColor: '#6366f1',
    hairColor: '#172554',
    skinColor: '#fcd34d',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#ede9fe"/>
      <circle cx="50" cy="50" r="32" fill="#fcd34d"/>
      <!-- Backward Cap -->
      <path d="M 24 38 Q 50 20 76 38" fill="#6366f1"/>
      <rect x="20" y="32" width="60" height="12" rx="4" fill="#4f46e5"/>
      <!-- Sunglasses on Forehead -->
      <rect x="30" y="38" width="16" height="8" rx="2" fill="#0f172a"/>
      <rect x="54" y="38" width="16" height="8" rx="2" fill="#0f172a"/>
      <!-- Confident Eyes -->
      <path d="M 34 52 Q 40 48 46 52" stroke="#1e293b" stroke-width="3" fill="none"/>
      <path d="M 54 52 Q 60 48 66 52" stroke="#1e293b" stroke-width="3" fill="none"/>
      <!-- Toothpick Smirk -->
      <path d="M 42 66 Q 52 74 62 66" stroke="#1e293b" stroke-width="3" fill="none"/>
      <line x1="62" y1="67" x2="72" y2="60" stroke="#f59e0b" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'golu',
    name: 'Golu',
    title: 'The Foodie Bandit',
    tagline: 'Always pranks when snacks are on the line.',
    primaryColor: '#10b981',
    hatColor: '#ef4444',
    hairColor: '#365314',
    skinColor: '#fde68a',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#d1fae5"/>
      <!-- Chubby cheeks face -->
      <ellipse cx="50" cy="52" rx="35" ry="32" fill="#fde68a"/>
      <ellipse cx="28" cy="58" rx="8" ry="7" fill="#fca5a5" opacity="0.6"/>
      <ellipse cx="72" cy="58" rx="8" ry="7" fill="#fca5a5" opacity="0.6"/>
      <!-- Messy curly hair -->
      <circle cx="36" cy="28" r="10" fill="#365314"/>
      <circle cx="50" cy="24" r="12" fill="#365314"/>
      <circle cx="64" cy="28" r="10" fill="#365314"/>
      <!-- Big cheerful eyes -->
      <circle cx="38" cy="48" r="5" fill="#1e293b"/>
      <circle cx="62" cy="48" r="5" fill="#1e293b"/>
      <!-- Open laugh mouth with lollipop -->
      <ellipse cx="50" cy="68" rx="8" ry="7" fill="#991b1b"/>
      <circle cx="66" cy="72" r="5" fill="#ef4444"/>
      <line x1="66" y1="77" x2="68" y2="86" stroke="#fff" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'simran',
    name: 'Simran',
    title: 'The "Innocent" Angel',
    tagline: '"Who me? I was just watering the plants!"',
    primaryColor: '#06b6d4',
    hatColor: '#f43f5e',
    hairColor: '#1f2937',
    skinColor: '#fed7aa',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#cffafe"/>
      <circle cx="50" cy="50" r="32" fill="#fed7aa"/>
      <!-- Long silky hair -->
      <path d="M 22 36 C 18 65, 24 85, 26 90 C 35 30, 65 30, 74 90 C 76 85, 82 65, 78 36 Z" fill="#1f2937"/>
      <!-- Flower headband -->
      <path d="M 25 36 Q 50 25 75 36" stroke="#f43f5e" stroke-width="4" fill="none"/>
      <circle cx="32" cy="34" r="5" fill="#fbbf24"/>
      <!-- Wide innocent anime eyes -->
      <ellipse cx="38" cy="52" rx="6" ry="8" fill="#1e293b"/>
      <circle cx="37" cy="49" r="3" fill="#fff"/>
      <ellipse cx="62" cy="52" rx="6" ry="8" fill="#1e293b"/>
      <circle cx="61" cy="49" r="3" fill="#fff"/>
      <!-- Tiny sweet smile -->
      <path d="M 44 68 Q 50 72 56 68" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'chacha',
    name: 'Chacha Ji',
    title: 'The Prankster Uncle',
    tagline: 'Decades of family wedding pranks experience.',
    primaryColor: '#d97706',
    hatColor: '#b45309',
    hairColor: '#64748b',
    skinColor: '#fde68a',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fef3c7"/>
      <circle cx="50" cy="50" r="32" fill="#fde68a"/>
      <!-- Wavy salt & pepper hair -->
      <path d="M 22 42 C 22 20, 78 20, 78 42 C 60 28, 40 28, 22 42 Z" fill="#64748b"/>
      <!-- Big handlebar mustache -->
      <path d="M 32 64 Q 42 60 50 64 Q 58 60 68 64 Q 74 58 64 68 Q 50 70 36 68 Z" fill="#334155"/>
      <!-- Laughing squinting eyes -->
      <path d="M 34 50 Q 42 42 48 50" stroke="#1e293b" stroke-width="3.5" fill="none"/>
      <path d="M 52 50 Q 58 42 66 50" stroke="#1e293b" stroke-width="3.5" fill="none"/>
    </svg>`
  },
  {
    id: 'tinku',
    name: 'Tinku',
    title: 'The Rebel Dynamo',
    tagline: 'Runs like lightning and leaves glitter everywhere.',
    primaryColor: '#ef4444',
    hatColor: '#dc2626',
    hairColor: '#18181b',
    skinColor: '#fcd34d',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fee2e2"/>
      <circle cx="50" cy="50" r="32" fill="#fcd34d"/>
      <!-- Red Bandanna -->
      <path d="M 20 40 Q 50 25 80 40" stroke="#dc2626" stroke-width="12" fill="none"/>
      <circle cx="82" cy="42" r="6" fill="#b91c1c"/>
      <!-- Spiky hair peeking above bandanna -->
      <polygon points="35,28 40,16 45,28" fill="#18181b"/>
      <polygon points="48,26 53,14 58,26" fill="#18181b"/>
      <!-- Fierce smirk -->
      <ellipse cx="38" cy="54" rx="4" ry="6" fill="#1e293b"/>
      <ellipse cx="62" cy="54" rx="4" ry="6" fill="#1e293b"/>
      <path d="M 40 68 Q 50 78 64 66" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'nikki',
    name: 'Nikki',
    title: 'The Stealth Shadow',
    tagline: 'Quiet as a cat, laughs like a hyena.',
    primaryColor: '#6366f1',
    hatColor: '#312e81',
    hairColor: '#0284c7',
    skinColor: '#fed7aa',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#e0e7ff"/>
      <circle cx="50" cy="50" r="32" fill="#fed7aa"/>
      <!-- Ninja headband -->
      <rect x="20" y="34" width="60" height="12" rx="2" fill="#312e81"/>
      <circle cx="50" cy="40" r="4" fill="#a5b4fc"/>
      <!-- Electric blue hair strands -->
      <path d="M 22 46 Q 16 65 24 72" stroke="#0284c7" stroke-width="4" fill="none"/>
      <!-- Mischievous cat eyes -->
      <path d="M 34 54 Q 42 48 46 54" stroke="#1e293b" stroke-width="3" fill="none"/>
      <circle cx="41" cy="53" r="3" fill="#1e293b"/>
      <path d="M 54 54 Q 58 48 66 54" stroke="#1e293b" stroke-width="3" fill="none"/>
      <circle cx="59" cy="53" r="3" fill="#1e293b"/>
      <path d="M 42 66 Q 50 72 58 66" stroke="#1e293b" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    id: 'karan',
    name: 'Karan',
    title: 'The Secret Agent',
    tagline: 'Treats family pranks like high-stakes undercover missions.',
    primaryColor: '#0284c7',
    hatColor: '#0369a1',
    hairColor: '#1e293b',
    skinColor: '#fcd34d',
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#bae6fd"/>
      <circle cx="50" cy="50" r="32" fill="#fcd34d"/>
      <!-- Detective Fedora -->
      <path d="M 16 38 Q 50 32 84 38" stroke="#0369a1" stroke-width="6" fill="none"/>
      <path d="M 26 36 C 30 18, 70 18, 74 36 Z" fill="#0284c7"/>
      <rect x="28" y="32" width="44" height="6" fill="#0f172a"/>
      <!-- Shaded eyes -->
      <ellipse cx="38" cy="52" rx="4" ry="5" fill="#1e293b"/>
      <ellipse cx="62" cy="52" rx="4" ry="5" fill="#1e293b"/>
      <!-- Smug grin -->
      <path d="M 42 68 Q 52 74 62 66" stroke="#1e293b" stroke-width="3.5" fill="none"/>
    </svg>`
  }
];
