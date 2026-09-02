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
] as const;

export const quickLinks = [
  { label: "Student Portal", href: "/portal/dashboard" },
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
    image: "/images/hero/hero-clinical-infant-care.jpg",
    title: "We train the real health professionals",
    description:
      "Certificate and Diploma programmes in nursing and midwifery. Registered with the Ministry of Education and Sports. Accredited by UNMC and NCHE.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "Student Portal",
    secondaryHref: "/portal",
    alt: "Midwifery students observing infant care practice on a training mannequin",
  },
  {
    id: "2",
    image: "/images/hero/hero-hospital-ward.jpg",
    title: "Real hospital placements",
    description:
      "Clinical rotations at Mbale Referral Hospital and partner sites — you learn where care actually happens.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Nursing students providing bedside care to a patient in a hospital ward",
  },
  {
    id: "3",
    image: "/images/hero/hero-instrument-training.jpg",
    title: "Skills you can use on day one",
    description:
      "From sterile technique to surgical instruments — our instructors guide you through every step in the skills lab.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Instructors demonstrating surgical instrument handling to nursing students",
  },
  {
    id: "4",
    image: "/images/hero/hero-injection-practice.jpg",
    title: "Learning by doing",
    description:
      "You will practise injections, wound care, and patient procedures on mannequins before stepping onto the ward.",
    cta: "Apply Now",
    href: "/admissions",
    secondaryCta: "View Programmes",
    secondaryHref: "/academics",
    alt: "Instructor guiding a student through injection technique on a clinical mannequin",
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
    image: "/images/programs/diploma-nursing-direct.jpg",
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
    image: "/images/programs/diploma-nursing-extension.jpg",
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
    image: "/images/programs/certificate-nursing.jpg",
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
    image: "/images/programs/diploma-midwifery-direct.jpg",
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
    image: "/images/programs/diploma-midwifery-extension.jpg",
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
    image: "/images/programs/certificate-midwifery.jpg",
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
    image: "/images/campus-news/graduation-celebrations.jpg",
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
    image: "/images/events-staff.jpg",
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

export const galleryItems = [
  {
    id: "campus-wide",
    src: "/images/gallery/campus-aerial-wide.jpg",
    alt: "Wide aerial view of MBSNM campus and surrounding Mbale landscape",
    caption: "Our campus in Mbale",
    category: "Campus",
    featured: true,
  },
  {
    id: "staff-nurse-desk-calendar",
    src: "/images/gallery/staff-nurse-desk-calendar.jpg",
    alt: "MBSNM nursing staff member at her office desk with the school calendar",
    caption: "Nursing staff at MBSNM",
    category: "Staff",
  },
  {
    id: "staff-nurses-trio",
    src: "/images/gallery/staff-nurses-trio.jpg",
    alt: "Three MBSNM nurses in white uniforms seated together",
    caption: "Our nursing team",
    category: "Staff",
  },
  {
    id: "staff-admin-desk",
    src: "/images/gallery/staff-admin-desk.jpg",
    alt: "MBSNM administrative staff member working at her desk",
    caption: "Student services office",
    category: "Staff",
  },
  {
    id: "staff-clinical-lead",
    src: "/images/gallery/staff-clinical-lead.jpg",
    alt: "MBSNM clinical staff member at his desk with laptop",
    caption: "Clinical leadership",
    category: "Staff",
  },
  {
    id: "staff-nurse-office",
    src: "/images/gallery/staff-nurse-office.jpg",
    alt: "MBSNM nurse seated at her office desk",
    caption: "Nursing administration",
    category: "Staff",
  },
  {
    id: "staff-nurse-laptop",
    src: "/images/gallery/staff-nurse-laptop.jpg",
    alt: "MBSNM nurse working at a laptop in the office",
    caption: "Faculty at work",
    category: "Staff",
  },
  {
    id: "staff-leadership-desk",
    src: "/images/gallery/staff-leadership-desk.jpg",
    alt: "MBSNM leadership team member at his desk",
    caption: "School leadership",
    category: "Staff",
  },
  {
    id: "staff-office-collaboration",
    src: "/images/gallery/staff-office-collaboration.jpg",
    alt: "Two MBSNM staff members reviewing documents together at a desk",
    caption: "Office team at work",
    category: "Staff",
  },
  {
    id: "students-building",
    src: "/images/gallery/students-building-front.jpg",
    alt: "Nursing students in green uniforms posing in front of the MBSNM building",
    caption: "Students at the main building",
    category: "People",
  },
  {
    id: "school-bus",
    src: "/images/gallery/school-bus-group.jpg",
    alt: "Students lined up in front of the MBSNM school bus",
    caption: "MBSNM school bus and students",
    category: "Life",
  },
  {
    id: "classroom",
    src: "/images/gallery/classroom-training.jpg",
    alt: "Instructor leading a classroom training session with nursing students",
    caption: "Classroom training session",
    category: "Training",
  },
  {
    id: "clinical-demo",
    src: "/images/gallery/clinical-demonstration.jpg",
    alt: "Clinical demonstration with a training mannequin watched by nursing students",
    caption: "Clinical skills demonstration",
    category: "Training",
  },
  {
    id: "nursing-group",
    src: "/images/gallery/nursing-students-group.jpg",
    alt: "Group portrait of nursing students in blue uniforms",
    caption: "Our nursing students",
    category: "People",
  },
  {
    id: "graduation",
    src: "/images/graduates-celebration.jpg",
    alt: "Graduates celebrating at MBSNM",
    caption: "Graduation celebrations",
    category: "Graduation",
  },
  {
    id: "ward",
    src: "/images/hero/hero-hospital-ward.jpg",
    alt: "Hospital ward placement",
    caption: "Hospital ward placements",
    category: "Training",
  },
  {
    id: "skills-lab",
    src: "/images/learning-pillars-clinical.jpg",
    alt: "Skills laboratory on campus",
    caption: "Skills laboratory",
    category: "Facilities",
  },
  {
    id: "students",
    src: "/images/hero/raw/students-celebration.jpg",
    alt: "Students celebrating on campus",
    caption: "Student life at MBSNM",
    category: "Life",
  },
  {
    id: "graduates",
    src: "/images/graduates.jpg",
    alt: "MBSNM graduates in uniform",
    caption: "Proud graduates",
    category: "Graduation",
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
