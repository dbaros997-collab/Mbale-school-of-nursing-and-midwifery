export const SCHOOL = {
  name: "Mbale School of Nursing and Midwifery",
  shortName: "MBSNM",
  motto: "In God We Love and Serve",
  tagline: "We train the real health professionals.",
  foundedBy: "Global Revival Evangelistic Ministries (GREM)",
  phone: "+256 779 400 773",
  /** Primary WhatsApp / click-to-chat line */
  whatsapp: "+256 779 400 773",
  phoneAlt: "+256 787 167 575",
  email: "info@mbsnm.org",
  admissionsEmail: "admissions@mbsnm.org",
  address: "Malere, behind the Forest Road, Mbale — Uganda",
  postal: "P. O. Box — Mbale, Uganda",
  /** This new site is the official web home */
  website: "/",
  youtube: "https://www.youtube.com/channel/UC-YnxFTZ5-atVFZCGGZ91PQ",
  registration:
    "Registered with the Ministry of Education and Sports. Accredited by UNMC and NCHE.",
  aboutStory:
    "Christians from GREM started MBSNM when they saw how much Eastern Uganda needed community health care. We train nurses and midwives to serve the poor, the young, and the elderly — In God We Love and Serve.",
} as const;

/** Public Gulu University (GU) portal & website information */
export const GULU_UNIVERSITY = {
  name: "Gulu University",
  shortName: "GU",
  motto: "For Community Transformation",
  website: "https://gu.ac.ug/",
  studentPortal: "https://myportal.gu.ac.ug/",
  applicationPortal: "https://apply.gu.ac.ug/",
  helpdesk: "https://helpme.gu.ac.ug/",
  poweredBy: "HEMIS Consortium",
  about:
    "Gulu University is a public university in Northern Uganda focused on community transformation — including health sciences through its Faculty of Medicine, which trains human resources for rural-based health facilities.",
  portalIntro:
    "The GU student portal (myportal.gu.ac.ug) is the official HEMIS online account for enrolled students. Sign in to manage registration, fees, results, and other academic records.",
  portalServices: [
    {
      title: "Course registration",
      detail: "Register for semester modules and confirm your study load online.",
    },
    {
      title: "Fees & payments",
      detail: "View fee balances, payment history, and complete university fee transactions.",
    },
    {
      title: "Results & transcripts",
      detail: "Check semester results and request academic transcripts when available.",
    },
    {
      title: "Admission & enrollment",
      detail: "View admission status, acceptance details, and complete freshers enrollment steps.",
    },
    {
      title: "Academic calendar",
      detail: "Access timetables, registration deadlines, and key dates for the academic year.",
    },
    {
      title: "Student profile",
      detail: "Update contact details and manage your portal account settings.",
    },
  ],
  signInSteps: [
    "Visit the student portal at myportal.gu.ac.ug.",
    "Enter your username and password, then click Sign In.",
    "New students should follow the freshers enrollment guide published on gu.ac.ug before first login.",
    "If you forgot your password, click Forgot your Password — a reset link (OTP) is sent to your registered email.",
  ],
  admissionNote:
    "Admitted students are published on the official Gulu University website (gu.ac.ug) and through other university communication channels.",
  freshersGuide:
    "Gulu University publishes step-by-step guides for enrollment, payment, and registration at the start of each academic year — check the Notice Board on gu.ac.ug.",
} as const;

/** WhatsApp click-to-chat URL (wa.me) */
export function schoolWhatsAppUrl(message?: string) {
  const digits = SCHOOL.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const mainNav = [
  {
    label: "About",
    href: "/#about",
    columns: [
      {
        title: "Know Us",
        links: [
          { label: "Our Story", href: "/#about" },
          { label: "Mission & Vision", href: "/#vision-mission" },
          { label: "Core Values", href: "/#vision-mission" },
          { label: "Accreditation", href: "/contact" },
          { label: "Gulu University Portal", href: "/university-portal" },
          { label: "Contact Address", href: "/contact" },
        ],
      },
      {
        title: "Governance",
        links: [
          { label: "Leadership", href: "/#about" },
          { label: "Founded by GREM", href: "/#about" },
          { label: "Campus Life @ MBSNM", href: "/#about" },
        ],
      },
      {
        title: "Campus",
        links: [
          { label: "Visit Campus", href: "/contact" },
          { label: "Mbale City Campus", href: "/contact" },
          { label: "Clinical Training Sites", href: "/#spotlight" },
        ],
      },
    ],
    featured: {
      eyebrow: "Discover MBSNM",
      title: "Nursing and midwifery training rooted in faith and service.",
      href: "/#about",
      cta: "Explore",
    },
  },
  {
    label: "Programs",
    href: "/academics",
    columns: [
      {
        title: "Nursing",
        links: [
          { label: "Diploma in Nursing (Direct)", href: "/academics#diploma-nursing-direct" },
          { label: "Diploma in Nursing (Extension)", href: "/academics#diploma-nursing-extension" },
          { label: "Certificate in Nursing", href: "/academics#certificate-nursing" },
        ],
      },
      {
        title: "Midwifery",
        links: [
          { label: "Diploma in Midwifery (Direct)", href: "/academics#diploma-midwifery-direct" },
          { label: "Diploma in Midwifery (Extension)", href: "/academics#diploma-midwifery-extension" },
          { label: "Certificate in Midwifery", href: "/academics#certificate-midwifery" },
        ],
      },
      {
        title: "Catalogue",
        links: [
          { label: "All Programmes", href: "/academics" },
          { label: "How to Apply", href: "/admissions" },
          { label: "Entry Requirements", href: "/admissions" },
        ],
      },
    ],
    featured: {
      eyebrow: "Admissions Open",
      title: "Find the programme that fits you, then apply for the next intake.",
      href: "/academics",
      cta: "Explore",
    },
  },
  {
    label: "MBSNM Online",
    href: "/portal",
    columns: [
      {
        title: "Learning",
        links: [
          { label: "Student Portal", href: "/portal" },
          { label: "LMS Hub", href: "/portal/lms" },
          { label: "Timetable", href: "/portal/timetable" },
        ],
      },
      {
        title: "Student Services",
        links: [
          { label: "Registration", href: "/portal/registration" },
          { label: "Fees & Payments", href: "/portal/fees" },
          { label: "Documents", href: "/portal/documents" },
          { label: "Notices", href: "/portal/notices" },
          { label: "Gulu University Portal", href: "/university-portal" },
        ],
      },
    ],
    featured: {
      eyebrow: "e-Learning",
      title: "Fees, registration, and learning tools — all in one place.",
      href: "/portal",
      cta: "Open Portal",
    },
  },
  {
    label: "Career",
    href: "/admissions",
    columns: [
      {
        title: "Admissions",
        links: [
          { label: "How to Apply", href: "/admissions" },
          { label: "Online Application", href: "/admissions#apply" },
          { label: "Entry Requirements", href: "/admissions" },
          { label: "Fees & Payments", href: "/admissions" },
        ],
      },
      {
        title: "Opportunities",
        links: [
          { label: "Jobs & Careers", href: "/admissions" },
          { label: "Alumni Network", href: "/alumni" },
          { label: "Campus News", href: "/#campus-news" },
        ],
      },
    ],
    featured: {
      eyebrow: "Join MBSNM",
      title: "Take the first step toward nursing or midwifery practice.",
      href: "/admissions#apply",
      cta: "Apply Now",
    },
  },
] as const;

export const quickLinks = [
  { label: "Student Portal", href: "/portal/dashboard" },
  { label: "Gulu University Portal", href: "/university-portal" },
  { label: "Activate Account", href: "/portal/activate" },
  { label: "Application Portal", href: "/admissions#apply" },
  { label: "Track Application", href: "/admissions/track" },
  { label: "Courses & Programs", href: "/academics" },
  { label: "Contact Us", href: "/contact" },
  { label: "Official Website", href: "/" },
] as const;

export const heroSlides = [
  {
    id: "1",
    image: "/images/hero/hero-campus-aerial-wide.jpg",
    imageSharp: "/images/hero/hero-campus-aerial-wide-sharp.jpg",
    title: "We train the real health professionals",
    description:
      "Certificate and Diploma programmes in nursing and midwifery. Registered with the Ministry of Education and Sports. Accredited by UNMC and NCHE.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "Student Portal",
    secondaryHref: "/portal",
    alt: "Aerial view of Mbale School of Nursing and Midwifery campus surrounded by green landscape",
  },
  {
    id: "2",
    image: "/images/hero/hero-campus-mountains.jpg",
    imageSharp: "/images/hero/hero-campus-mountains-sharp.jpg",
    title: "A campus built for learning",
    description:
      "Modern teaching blocks, skills labs, and open grounds — set against the hills of Eastern Uganda.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Campus buildings with mountain backdrop at MBSNM",
  },
  {
    id: "3",
    image: "/images/hero/hero-campus-building.jpg",
    imageSharp: "/images/hero/hero-campus-building-sharp.jpg",
    title: "Learning that leads to real work",
    description:
      "You will spend time in skills labs and on hospital wards — not just in class. That is how we prepare you for the work ahead.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Main administration and teaching block at MBSNM campus",
  },
  {
    id: "4",
    image: "/images/hero/hero-students-celebration.jpg",
    imageSharp: "/images/hero/hero-students-celebration-sharp.jpg",
    title: "Celebrating every milestone",
    description:
      "Our graduates step out with confidence — trained to serve communities across Eastern Uganda and beyond.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Nursing and midwifery students celebrating on campus",
  },
  {
    id: "5",
    image: "/images/hero/hero-clinical-training.jpg",
    imageSharp: "/images/hero/hero-clinical-training-sharp.jpg",
    title: "Hands-on from the start",
    description:
      "Classroom teaching and clinical placements at Mbale Referral Hospital and partner sites. You practise skills where care actually happens.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Students practising clinical skills in the skills laboratory",
  },
] as const;

/** KIU-style quick highlight boxes under the hero */
export const heroQuickBoxes = [
  {
    id: "portal",
    title: "Student Portal",
    description:
      "Fees, registration, LMS, and notices — sign in with Microsoft 365 or your student account.",
    href: "/portal",
    icon: "Monitor",
  },
  {
    id: "accredited",
    title: "Recognised programmes",
    description:
      "Our programmes meet UNMC and NCHE standards — the accreditation employers and councils expect.",
    href: "/academics",
    icon: "GraduationCap",
  },
  {
    id: "clinical",
    title: "Real hospital placements",
    description:
      "You practise in wards at Mbale Referral Hospital and other approved sites — not just in simulation.",
    href: "/admissions",
    icon: "Hospital",
  },
  {
    id: "labs",
    title: "Skills labs on campus",
    description:
      "Learn procedures safely in our labs before you care for patients on the ward.",
    href: "/academics",
    icon: "FlaskConical",
  },
] as const;

export const discoveryRoles = [
  { value: "prospective", label: "Prospective Student" },
  { value: "continuing", label: "Continuing Student" },
  { value: "staff", label: "Staff" },
  { value: "alumni", label: "Alumni" },
  { value: "visitor", label: "Visitor" },
] as const;

export const discoveryTopics: Record<string, { value: string; label: string; href: string }[]> = {
  prospective: [
    { value: "apply", label: "How to Join or Apply", href: "/admissions" },
    { value: "courses", label: "Courses and Programs", href: "/academics" },
    { value: "fees", label: "Fees & Payment structure", href: "/admissions" },
    { value: "housing", label: "Student Housing", href: "/admissions" },
  ],
  continuing: [
    { value: "portal", label: "Student Portal", href: "/portal/dashboard" },
    { value: "gu-portal", label: "Gulu University Portal", href: "/university-portal" },
    { value: "timetable", label: "Timetables", href: "/portal" },
    { value: "fees", label: "Fee Balances", href: "/portal" },
    { value: "placement", label: "Clinical Placement", href: "/academics" },
  ],
  staff: [
    { value: "admin", label: "Admin Dashboard", href: "/admin" },
    { value: "contact", label: "Getting in Touch", href: "/contact" },
    { value: "news", label: "Announcements", href: "/#campus-news" },
  ],
  alumni: [
    { value: "network", label: "Alumni Network", href: "/alumni" },
    { value: "news", label: "Campus News", href: "/#campus-news" },
    { value: "contact", label: "Stay Connected", href: "/contact" },
  ],
  visitor: [
    { value: "about", label: "About MBSNM", href: "/#about" },
    { value: "visit", label: "Visit Campus", href: "/contact" },
    { value: "programs", label: "Programs", href: "/academics" },
  ],
};

export const programs = [
  {
    id: "diploma-nursing-direct",
    title: "Diploma in Nursing (Direct)",
    category: "Nursing",
    duration: "2 years",
    level: "Diploma",
    summary:
      "Comprehensive direct-entry nursing training covering clinical care, pharmacology, community health, and professional ethics.",
    requirements: [
      "Uganda Certificate of Education (UCE) with at least 5 passes including English, Biology, and Mathematics",
      "Uganda Advanced Certificate of Education (UACE) or equivalent preferred",
      "Minimum age of 18 years",
      "Medical fitness certificate",
    ],
    outcomes: [
      "Registered Nurse pathway readiness",
      "Hospital and community clinical competence",
      "Leadership and patient advocacy skills",
    ],
    image: "/images/grad1.jpg",
  },
  {
    id: "diploma-nursing-extension",
    title: "Diploma in Nursing (Extension)",
    category: "Nursing",
    duration: "18 months",
    level: "Diploma",
    summary:
      "Upgrade pathway for certified nurses seeking diploma-level competence and expanded clinical responsibility.",
    requirements: [
      "Valid Certificate in Nursing",
      "Valid practicing license / registration where applicable",
      "At least one year of clinical experience preferred",
    ],
    outcomes: [
      "Advanced clinical decision-making",
      "Ward management readiness",
      "Improved career mobility",
    ],
    image: "/images/equipment.jpg",
  },
  {
    id: "certificate-nursing",
    title: "Certificate in Nursing",
    category: "Nursing",
    duration: "2.5 years",
    level: "Certificate",
    summary:
      "Foundational nursing education focused on bedside care, infection prevention, and compassionate service.",
    requirements: [
      "UCE with passes in English, Biology, and Mathematics",
      "Good conduct recommendation",
      "Medical fitness certificate",
    ],
    outcomes: [
      "Entry-level nursing practice readiness",
      "Strong fundamentals for diploma progression",
      "Community health service capacity",
    ],
    image: "/images/computer-lab.jpg",
  },
  {
    id: "diploma-midwifery-direct",
    title: "Diploma in Midwifery (Direct)",
    category: "Midwifery",
    duration: "2 years",
    level: "Diploma",
    summary:
      "Direct-entry midwifery program preparing students for safe motherhood, antenatal, delivery, and postnatal care.",
    requirements: [
      "UCE with at least 5 passes including English, Biology, and Mathematics",
      "UACE or equivalent preferred",
      "Medical fitness certificate",
    ],
    outcomes: [
      "Skilled birth attendant competence",
      "Maternal and newborn emergency response",
      "Community midwifery leadership",
    ],
    image: "/images/graduates.jpg",
  },
  {
    id: "diploma-midwifery-extension",
    title: "Diploma in Midwifery (Extension)",
    category: "Midwifery",
    duration: "18 months",
    level: "Diploma",
    summary:
      "Extension track for practicing midwives upgrading to diploma-level midwifery practice.",
    requirements: [
      "Valid Certificate in Midwifery",
      "Valid practicing license / registration where applicable",
      "Clinical experience preferred",
    ],
    outcomes: [
      "Advanced obstetric skills",
      "Improved maternal outcomes focus",
      "Facility leadership readiness",
    ],
    image: "/images/graduation-day.jpg",
  },
  {
    id: "certificate-midwifery",
    title: "Certificate in Midwifery",
    category: "Midwifery",
    duration: "2.5 years",
    level: "Certificate",
    summary:
      "Certificate-level midwifery training emphasizing safe delivery, newborn care, and family health education.",
    requirements: [
      "UCE with passes in English, Biology, and Mathematics",
      "Good conduct recommendation",
      "Medical fitness certificate",
    ],
    outcomes: [
      "Competent midwifery support skills",
      "Pathway to diploma extension",
      "Community maternal health impact",
    ],
    image: "/images/activity-1.jpg",
  },
] as const;

export const applicationIntakes = [
  {
    id: "june-2026",
    label: "June 2026 Intake",
    shortLabel: "June 2026",
    orientationDate: "2026-06-15",
    open: true,
  },
  {
    id: "july-2026",
    label: "July 2026 Intake",
    shortLabel: "July 2026",
    orientationDate: "2026-07-15",
    open: true,
  },
] as const;

/** e.g. "June & July 2026" for open intakes */
export function openIntakesLabel(separator = " & ") {
  return applicationIntakes
    .filter((i) => i.open)
    .map((i) => i.shortLabel)
    .join(separator);
}

export const newsItems = [
  {
    id: "1",
    title: "June & July 2026 Intakes Now Open — Apply Early",
    date: "2026-06-01",
    category: "Admissions",
    excerpt:
      "We are accepting applications for the June and July 2026 intakes across nursing and midwifery programs. Apply early to secure your place.",
    image: "/images/graduation-day.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Graduation Celebrations in Mbale Town",
    date: "2025-11-18",
    category: "Events",
    excerpt:
      "Our graduands marched through Mbale town celebrating academic excellence and inspiring youth to join the nursing profession.",
    image: "/images/graduation-march.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Clinical Placements at Mbale Referral Hospital",
    date: "2025-09-05",
    category: "Academics",
    excerpt:
      "Students continue hands-on clinical training through our partnership with Mbale Referral Hospital and affiliated health facilities.",
    image: "/images/equipment.jpg",
    featured: false,
  },
  {
    id: "4",
    title: "Campus Infrastructure Upgrades Ongoing",
    date: "2025-06-12",
    category: "Campus",
    excerpt:
      "Modern classrooms, practical labs, and lighting upgrades are underway to strengthen our learning environment.",
    image: "/images/front-offices.jpg",
    featured: false,
  },
  {
    id: "5",
    title: "Principal Addresses Graduating Class",
    date: "2025-11-18",
    category: "Leadership",
    excerpt:
      "The School Principal shared a charge of excellence, integrity, and compassionate service with graduating nurses and midwives.",
    image: "/images/principal.jpg",
    featured: false,
  },
] as const;

export const events = [
  {
    id: "1",
    title: "June 2026 Intake Orientation",
    date: "2026-06-15",
    location: "Main Hall, MBSNM Campus",
    mode: "Physical",
    image: "/images/graduates.jpg",
  },
  {
    id: "1b",
    title: "July 2026 Intake Orientation",
    date: "2026-07-15",
    location: "Main Hall, MBSNM Campus",
    mode: "Physical",
    image: "/images/graduates.jpg",
  },
  {
    id: "2",
    title: "Clinical Skills Open Day",
    date: "2026-08-05",
    location: "Skills Laboratory & Computer Lab",
    mode: "Physical",
    image: "/images/equipment.jpg",
  },
  {
    id: "3",
    title: "Admissions Information Session",
    date: "2026-06-20",
    location: "Hybrid (Campus & Online)",
    mode: "Hybrid (Physical & Virtual)",
    image: "/images/front-offices.jpg",
  },
  {
    id: "4",
    title: "Chapel & Community Health Outreach",
    date: "2026-09-12",
    location: "Campus Chapel & Partner Clinics",
    mode: "Physical",
    image: "/images/activity-1.jpg",
  },
] as const;

export const spotlightArticles = [
  {
    id: "1",
    category: "Campus",
    title: "Modern Office Buildings Strengthen Student Services",
    image: "/images/front-offices.jpg",
    href: "/contact",
  },
  {
    id: "2",
    category: "Training",
    title: "Hands-on Equipment for Clinical Excellence",
    image: "/images/equipment.jpg",
    href: "/academics",
  },
  {
    id: "3",
    category: "Facilities",
    title: "Computer Lab Supports Research & Learning",
    image: "/images/computer-lab.jpg",
    href: "/academics",
  },
  {
    id: "4",
    category: "Life",
    title: "Campus Celebrations & Student Activities",
    image: "/images/dancers.jpg",
    href: "/#campus-news",
  },
  {
    id: "5",
    category: "Infrastructure",
    title: "Modern Lighting Improves Night-time Campus Safety",
    image: "/images/campus-night.jpg",
    href: "/contact",
  },
  {
    id: "6",
    category: "Community",
    title: "Guest of Honour Inspires Graduating Class",
    image: "/images/guest-honour.jpg",
    href: "/#campus-news",
  },
] as const;

export const visionMission = [
  {
    title: "Our Vision",
    text: "To build a reputable Christian health institution committed to improving the lives of communities by providing quality health services in the region.",
    image: "/images/icons/vision.png",
    imageAlt: "Telescope illustration representing vision",
    reverse: false,
  },
  {
    title: "Our Mission",
    text: "To train competent, compassionate nurses and midwives through hands-on clinical practice, rigorous academics and Christian values — serving the poor, the young and the elderly of Eastern Uganda.",
    image: "/images/icons/mission.png",
    imageAlt: "Target illustration representing mission",
    reverse: true,
  },
  {
    title: "Our Philosophy",
    text: "In God We Love and Serve — faith-centered training that raises trusted health professionals ready to heal communities with integrity and compassion.",
    image: "/images/icons/philosophy.png",
    imageAlt: "Hand holding books illustration representing philosophy",
    reverse: false,
  },
] as const;

export const coreValues = [
  {
    title: "Compassion",
    description: "Patient-centred care, always.",
  },
  {
    title: "Competence",
    description: "Clinical skill proven in practice.",
  },
  {
    title: "Faith",
    description: "Service rooted in Christian conviction.",
  },
  {
    title: "Community",
    description: "Health for the poor, young and elderly.",
  },
  {
    title: "Integrity",
    description: "Honest, accountable professionals.",
  },
] as const;

export const faqs = [
  {
    question: "When is the next intake?",
    answer:
      "We are accepting applications for the June and July 2026 intakes. Apply early — places fill up.",
  },
  {
    question: "How much is tuition?",
    answer:
      "Fees depend on your programme (certificate or diploma, direct or extension). Email admissions@mbsnm.org and we will send you the current fee list.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "We have limited places on campus and with partner hosts. Ask during your application so we can help you plan ahead.",
  },
  {
    question: "Where do students do clinical placements?",
    answer:
      "You will train at Mbale Referral Hospital and other approved sites. That is where you learn to care for real patients.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "Bring your national ID or passport, academic certificates, a passport photo, and a medical fitness letter. Extension applicants also need a valid practising licence.",
  },
  {
    question: "Is there an application fee?",
    answer:
      "Yes. The fee is UGX 20,000 and is not refundable. Pay by bank transfer using the account on the application form, then enter your reference number to finish.",
  },
  {
    question: "How does eligibility screening work?",
    answer:
      "After you pay, we check your UCE grades against the programme requirements. If you qualify, you receive a reference number and your file goes to admissions for review. If something does not match, you can update your results or call us for help.",
  },
  {
    question: "How do I track my application?",
    answer:
      "Use your reference number (for example MBSNM/APP/2026/1234) on the Track Application page. You will see whether your file is pending, qualified, or unsuccessful.",
  },
] as const;

/** Scrolling updates shown in the site-wide status bar */
export const statusBarUpdates = [
  {
    id: "intake",
    text: "June & July 2026 intakes are open — apply now",
    href: "/admissions#apply",
  },
  {
    id: "fee",
    text: "Application fee: UGX 20,000 by bank transfer (non-refundable)",
    href: "/admissions#apply",
  },
  {
    id: "interview",
    text: "Qualified applicants move to interview — track your status online",
    href: "/admissions/track",
  },
  {
    id: "accreditation",
    text: "Registered with the Ministry of Education and Sports · Accredited by UNMC & NCHE",
    href: "/academics",
  },
  {
    id: "clinical",
    text: "Clinical training at Mbale Referral Hospital and partner sites",
    href: "/academics",
  },
  {
    id: "contact",
    text: "Questions? admissions@mbsnm.org · +256 779 400 773",
    href: "/contact",
  },
  {
    id: "gu-portal",
    text: "Gulu University students — sign in at myportal.gu.ac.ug",
    href: "/university-portal",
  },
] as const;

/** Non-refundable fee required before an online application can be submitted */
export const APPLICATION_FEE_UGX = 20_000;

/** Bank account for application fee payments */
export const APPLICATION_BANK_ACCOUNT = {
  bankName: "Stanbic Bank Uganda",
  accountName: "Mbale School of Nursing and Midwifery",
  accountNumber: "9030012345678",
  branch: "Mbale Branch",
  swiftCode: "SBICUGKX",
} as const;

export type ApplicationPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  intakeId: string;
  programId: string;
  educationLevel: string;
  message: string;
  documentsLabel: string;
  academicResults: {
    uceIndexNumber: string;
    englishGrade: string;
    mathematicsGrade: string;
    biologyGrade: string;
    totalPasses: string;
    certificateLicenseRef: string;
  };
  paymentConfirmed: boolean;
  /** Applicant confirmed the non-refundable fee policy before paying */
  feePolicyAcknowledged: boolean;
  paymentMethod: "bank" | "";
  paymentReference: string;
  transactionReference: string;
  /** Auto-send email (and optional SMS) after eligibility check */
  sendNotifications: boolean;
  notifySms: boolean;
};

export const applicationSteps = [
  {
    step: 1,
    title: "Choose your programme",
    detail: "Read the entry requirements and pick nursing or midwifery.",
  },
  {
    step: 2,
    title: "Gather your documents",
    detail: "Results, ID, photo, and medical fitness letter.",
  },
  {
    step: 3,
    title: "Apply and pay the fee",
    detail: "Fill in the form, pay UGX 20,000 by bank transfer, and get instant feedback on your grades.",
  },
  {
    step: 4,
    title: "Wait for the next step",
    detail: "If you qualify, admissions will contact you about review and interview.",
  },
] as const;
