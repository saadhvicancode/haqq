export type Specialisation =
  | "domestic-violence"
  | "divorce"
  | "posh"
  | "property"
  | "cyber"
  | "sexual-violence"
  | "mental-health"
  | "counselling"
  | "muslim-personal-law"
  | "crisis-shelter"
  | "crisis"
  | "safety"
  | "all";

export interface DirectoryEntry {
  id: string;
  name: string;
  type: "ngo" | "lawyer" | "sakhi" | "helpline";
  specialisations: Specialisation[];
  states: string[];
  languages: string[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  hours?: string;
  isFree: boolean;
  isVerified: boolean;
  description: string;
}

export const directory: DirectoryEntry[] = [
  {
    id: "majlis-manch",
    name: "Majlis Manch",
    type: "ngo",
    specialisations: ["domestic-violence", "divorce", "posh", "sexual-violence"],
    states: ["Maharashtra"],
    languages: ["Hindi", "Marathi", "English"],
    email: "majlislaw@gmail.com",
    isFree: true,
    isVerified: true,
    description:
      "All-women legal team providing free representation and guidance for DV and sexual violence survivors since 1991. Based in Mumbai.",
  },
  {
    id: "icall-tiss",
    name: "iCall — TISS",
    type: "helpline",
    specialisations: ["domestic-violence", "mental-health", "counselling"],
    states: ["All India"],
    languages: ["Hindi", "English"],
    phone: "9152987821",
    hours: "Mon–Sat 8am–10pm",
    isFree: true,
    isVerified: true,
    description:
      "Free psychosocial counselling by phone and chat. Handles DV, trauma, workplace issues. Run by Tata Institute of Social Sciences.",
  },
  {
    id: "ncw-helpline",
    name: "NCW Helpline",
    type: "helpline",
    specialisations: ["domestic-violence", "posh", "divorce", "property"],
    states: ["All India"],
    languages: ["Hindi", "English"],
    phone: "7827170170",
    hours: "24/7",
    isFree: true,
    isVerified: true,
    description:
      "National Commission for Women's helpline. Legal guidance, complaint registration, referrals to local support.",
  },
  {
    id: "vandrevala-foundation",
    name: "Vandrevala Foundation",
    type: "helpline",
    specialisations: ["domestic-violence", "mental-health", "crisis"],
    states: ["All India"],
    languages: ["Hindi", "English", "Gujarati", "Bengali", "Kannada", "Tamil", "Telugu", "Malayalam", "Marathi", "Odia"],
    phone: "9999666555",
    whatsapp: "9999666555",
    hours: "24/7",
    isFree: true,
    isVerified: true,
    description:
      "24/7 crisis support for DV, abuse, mental health. Available in 10+ Indian languages via call or WhatsApp.",
  },
  {
    id: "sakhi-delhi",
    name: "Sakhi One-Stop Centre — Delhi",
    type: "sakhi",
    specialisations: ["domestic-violence", "sexual-violence", "crisis-shelter"],
    states: ["Delhi"],
    languages: ["Hindi", "English"],
    phone: "181",
    isFree: true,
    isVerified: true,
    description:
      "Government One-Stop Centre providing medical, legal, psychosocial support and police coordination under one roof.",
  },
  {
    id: "pcvc-chennai",
    name: "PCVC Chennai",
    type: "ngo",
    specialisations: ["domestic-violence", "sexual-violence", "counselling"],
    states: ["Tamil Nadu"],
    languages: ["Tamil", "English"],
    phone: "04424640050",
    isFree: true,
    isVerified: true,
    description:
      "Prevention of Crime and Victim Care — Tamil Nadu's leading DV and interpersonal violence support organisation since 2001.",
  },
  {
    id: "shaheen-hyderabad",
    name: "Shaheen Women Resource Centre",
    type: "ngo",
    specialisations: ["domestic-violence", "divorce", "muslim-personal-law"],
    states: ["Telangana"],
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    website: "shaheencollective.org",
    isFree: true,
    isVerified: true,
    description:
      "Hyderabad-based centre serving Muslim women and communities. Runs Sakhi OSC. Specialises in DV and abandonment cases.",
  },
  {
    id: "nalsa",
    name: "NALSA — Free Legal Aid",
    type: "helpline",
    specialisations: ["domestic-violence", "divorce", "property", "posh", "all"],
    states: ["All India"],
    languages: ["All Indian languages"],
    website: "nalsa.gov.in",
    isFree: true,
    isVerified: true,
    description:
      "Every woman has the right to a FREE lawyer through NALSA. Visit any District Legal Services Authority office — no income proof required for women in distress.",
  },
  {
    id: "cyber-crime-helpline",
    name: "Cyber Crime Helpline",
    type: "helpline",
    specialisations: ["cyber"],
    states: ["All India"],
    languages: ["Hindi", "English"],
    phone: "1930",
    website: "cybercrime.gov.in",
    hours: "24/7",
    isFree: true,
    isVerified: true,
    description:
      "National cyber crime reporting portal and helpline. Report online harassment, image-based abuse, stalking.",
  },
  {
    id: "women-helpline-181",
    name: "Women Helpline 181",
    type: "helpline",
    specialisations: ["domestic-violence", "safety", "crisis"],
    states: ["All India"],
    languages: ["Hindi", "English"],
    phone: "181",
    hours: "24/7",
    isFree: true,
    isVerified: true,
    description:
      "Government 24/7 women's helpline. Emergency referrals to police, hospitals, legal aid, and One-Stop Centres.",
  },
];

export const ALL_STATES = [
  "All India",
  "Delhi",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
];
