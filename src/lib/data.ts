export const SCHOOL = {
  name: "Mable School of Nursing and Midwifery",
  shortName: "MBSNM",
  motto: "With GOD We Love and Serve",
  tagline: "We train the real health professionals. Join us today.",
  foundedBy: "Global Revival Evangelistic Ministries (GREM)",
  phone: "+256 700 000 000",
  email: "info@mbsnm.org",
  admissionsEmail: "admissions@mbsnm.org",
  address: "Mbale City, Eastern Uganda",
  postal: "P. O. Box Mbale, Uganda",
  website: "https://mbsnm.org",
  registration:
    "Registered with the Ministry of Education and Sports, Republic of Uganda. Accredited by the Uganda Nurses and Midwives Council (UNMC) and the National Council for Higher Education (NCHE).",
} as const;

export const mainNav = [
  {
    label: "About",
    href: "/#about",
    columns: [
      {
        title: "About MBSNM",
        links: [
          { label: "Our Story", href: "/#about" },
          { label: "Mission & Vision", href: "/#vision-mission" },
          { label: "Accreditation", href: "/contact" },
          { label: "Leadership", href: "/#about" },
          { label: "Core Values", href: "/#vision-mission" },
        ],
      },
    ],
    blurb:
      "Started by Christians of GREM to train compassionate health professionals who love and serve their communities.",
  },
  {
    label: "Programs",
    href: "/academics",
    columns: [
      {
        title: "Nursing",
        links: [
          { label: "Diploma in Nursing", href: "/academics#diploma-nursing-direct" },
          { label: "Certificate in Nursing", href: "/academics" },
          { label: "Nursing Extension", href: "/academics" },
        ],
      },
      {
        title: "Midwifery",
        links: [
          { label: "Diploma in Midwifery", href: "/academics#diploma-midwifery-direct" },
          { label: "Certificate in Midwifery", href: "/academics" },
          { label: "Midwifery Extension", href: "/academics" },
        ],
      },
    ],
    blurb:
      "With nursing and midwifery programmes that set a standard of clinical excellence, we learn by serving at MBSNM.",
  },
  {
    label: "MBSNM Online",
    href: "/portal",
  },
  {
    label: "Research & Innovation",
    href: "/#spotlight",
    columns: [
      {
        title: "Campus & Clinical",
        links: [
          { label: "Clinical Excellence", href: "/#spotlight" },
          { label: "Facilities", href: "/#spotlight" },
          { label: "Campus News", href: "/#campus-news" },
          { label: "Events", href: "/#events" },
        ],
      },
    ],
    blurb:
      "Explore graduation moments, clinical partnerships, and the learning environment that shapes MBSNM graduates.",
  },
  {
    label: "Alumni",
    href: "/#voices",
  },
  {
    label: "Career",
    href: "/admissions",
  },
] as const;

export const quickLinks = [
  { label: "Student Portal", href: "/portal" },
  { label: "Application Portal", href: "/admissions#apply" },
  { label: "Courses & Programs", href: "/academics" },
  { label: "Contact Us", href: "/contact" },
  { label: "Official Website", href: "https://mbsnm.org" },
] as const;

export const heroSlides = [
  {
    id: "1",
    image: "/images/graduation-march.jpg",
    title: "Empowering Healers of Tomorrow",
    description:
      "We equip nurses and midwives with the knowledge, skills, and confidence to serve communities with compassion and excellence.",
    cta: "Apply Now",
    href: "/admissions",
    alt: "Graduating students marching in Mbale town",
  },
  {
    id: "2",
    image: "/images/graduates.jpg",
    title: "Where Learning Creates Possibilities",
    description:
      "A space where clinical training opens new opportunities and transforms potential into professional achievement.",
    cta: "Apply Now",
    href: "/admissions",
    alt: "Graduating class of Mable School of Nursing and Midwifery",
  },
  {
    id: "3",
    image: "/images/front-offices.jpg",
    title: "Hands-on Clinical Excellence",
    description:
      "Industry-relevant nursing and midwifery programmes designed for outcome-based learning and real hospital practice.",
    cta: "Apply Now",
    href: "/admissions",
    alt: "Front offices and campus facilities at MBSNM",
  },
  {
    id: "4",
    image: "/images/admin-block.jpg",
    title: "With GOD We Love and Serve",
    description:
      "Faith-centered training that raises trusted health professionals ready for the current job market.",
    cta: "Apply Now",
    href: "/admissions",
    alt: "Administration block and campus facilities",
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
    { value: "portal", label: "Student Portal", href: "/portal" },
    { value: "timetable", label: "Timetables", href: "/portal" },
    { value: "fees", label: "Fee Balances", href: "/portal" },
    { value: "placement", label: "Clinical Placement", href: "/academics" },
  ],
  staff: [
    { value: "admin", label: "Admin Dashboard", href: "/portal" },
    { value: "contact", label: "Getting in Touch", href: "/contact" },
    { value: "news", label: "Announcements", href: "/#campus-news" },
  ],
  alumni: [
    { value: "stories", label: "Alumni Stories", href: "/#voices" },
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
    duration: "3 years",
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
    duration: "3 years",
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

export const newsItems = [
  {
    id: "1",
    title: "July 2026 Intake Now Open — Apply Early",
    date: "2026-06-01",
    category: "Admissions",
    excerpt:
      "We are accepting applications for the July 2026 intake across nursing and midwifery programs. Apply early to secure your place.",
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
    title: "July 2026 Intake Orientation",
    date: "2026-07-15",
    location: "Main Hall, MBSNM Campus",
    mode: "Physical",
  },
  {
    id: "2",
    title: "Clinical Skills Open Day",
    date: "2026-08-05",
    location: "Skills Laboratory & Computer Lab",
    mode: "Physical",
  },
  {
    id: "3",
    title: "Admissions Information Session",
    date: "2026-06-20",
    location: "Hybrid (Campus & Online)",
    mode: "Hybrid (Physical & Virtual)",
  },
  {
    id: "4",
    title: "Chapel & Community Health Outreach",
    date: "2026-09-12",
    location: "Campus Chapel & Partner Clinics",
    mode: "Physical",
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
    href: "/#voices",
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

export const testimonials = [
  {
    id: "1",
    name: "Nagudi Sarah",
    role: "Student",
    quote:
      "The clinical placements have provided invaluable hands-on experience, preparing me for the workforce. We are connected to Mbale Referral Hospital, where we have a lot of practicals.",
  },
  {
    id: "2",
    name: "Emokori Salinas",
    role: "Student",
    quote:
      "Mable School of Nursing and Midwifery laid the foundation for my successful nursing career. The skilled faculty and hands-on training prepared me for the challenges of the profession.",
  },
  {
    id: "3",
    name: "Lokwii Perry",
    role: "Alumnus",
    quote:
      "The school's emphasis on compassion and patient-centered care has made me a confident and empathetic nurse. Join the school to gain valuable knowledge that will market you worldwide.",
  },
  {
    id: "4",
    name: "Luanda Jenny",
    role: "Alumna",
    quote:
      "I'm grateful for the supportive learning environment and experienced instructors who guide us in achieving our dreams. The guidance has helped me excel.",
  },
] as const;

export const visionMission = [
  {
    title: "Our Vision",
    text: "Become the most trusted destination for quality nursing and midwifery education in Eastern Uganda — raising health professionals who love and serve with integrity.",
    image: "/images/icons/vision.png",
    imageAlt: "Telescope illustration representing vision",
    reverse: false,
  },
  {
    title: "Our Mission",
    text: "Provide an enabling training and clinical environment that equips nurses and midwives with professional knowledge, hands-on excellence, and compassionate patient care.",
    image: "/images/icons/mission.png",
    imageAlt: "Target illustration representing mission",
    reverse: true,
  },
  {
    title: "Our Philosophy",
    text: "Transforming minds and hearts to heal communities — with God we love and serve through healthcare ministry.",
    image: "/images/icons/philosophy.png",
    imageAlt: "Hand holding books illustration representing philosophy",
    reverse: false,
  },
] as const;

export const coreValues = [
  {
    title: "Compassion",
    description: "We serve patients and communities with dignity, empathy, and Christ-centered love.",
  },
  {
    title: "Excellence",
    description: "We pursue academic rigor, clinical competence, and continuous professional growth.",
  },
  {
    title: "Integrity",
    description: "We uphold honesty, accountability, and ethical standards in every learning space.",
  },
  {
    title: "Service",
    description: "We equip nurses and midwives to love and serve God through healthcare ministry.",
  },
] as const;

export const faqs = [
  {
    question: "When is the next intake?",
    answer:
      "Applications are open for the July 2026 intake. Early submission is encouraged as spaces are limited.",
  },
  {
    question: "How much is tuition?",
    answer:
      "Tuition varies by program (certificate vs diploma, direct vs extension). Contact admissions@mbsnm.org for the current fee structure and payment schedule.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "Limited on-campus and affiliated accommodation options may be available. Prospective students should inquire during application so placements can be planned early.",
  },
  {
    question: "Where do students do clinical placements?",
    answer:
      "Students gain practical experience through partnerships including Mbale Referral Hospital and other approved clinical training sites.",
  },
  {
    question: "What documents are required to apply?",
    answer:
      "National ID or passport, academic transcripts/certificates, passport photo, medical fitness certificate, and any professional licenses for extension applicants.",
  },
] as const;

export const applicationSteps = [
  {
    step: 1,
    title: "Choose your program",
    detail: "Review entry requirements and select nursing or midwifery pathways.",
  },
  {
    step: 2,
    title: "Prepare documents",
    detail: "Gather academic results, ID, photo, and medical clearance.",
  },
  {
    step: 3,
    title: "Submit online application",
    detail: "Complete the form, upload documents, and confirm your preferred course.",
  },
  {
    step: 4,
    title: "Await review & interview",
    detail: "Admissions will contact shortlisted applicants with next steps.",
  },
] as const;

export type ApplicationPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  programId: string;
  educationLevel: string;
  message: string;
  documentsLabel: string;
};

