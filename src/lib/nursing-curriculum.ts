import { nursingPrograms } from "@/lib/data";

export type NursingCurriculumCourse = {
  code: string;
  title: string;
  category: "Theory" | "Clinical" | "Professional";
};

export type NursingCurriculumSemester = {
  id: string;
  title: string;
  courses: NursingCurriculumCourse[];
};

export type NursingCurriculumYear = {
  title: string;
  semesters: NursingCurriculumSemester[];
};

export type NursingProgramCurriculum = {
  programId: (typeof nursingPrograms)[number]["id"];
  intro: string;
  years: NursingCurriculumYear[];
};

export const nursingProgramCurricula: Record<
  NursingProgramCurriculum["programId"],
  NursingProgramCurriculum
> = {
  "diploma-nursing-direct": {
    programId: "diploma-nursing-direct",
    intro:
      "Six-semester direct-entry diploma. Years I–II build sciences and medical–surgical competence; Year III deepens specialty nursing, leadership, and research before final UHPAB assessments.",
    years: [
      {
        title: "Year I",
        semesters: [
          {
            id: "dns-y1-s1",
            title: "Semester I",
            courses: [
              { code: "DNS101", title: "Foundations of Nursing", category: "Theory" },
              { code: "DNS102", title: "Anatomy and Physiology I", category: "Theory" },
              { code: "DNS103", title: "Introduction to Psychology", category: "Theory" },
              { code: "DNS104", title: "Basic Computer Applications", category: "Professional" },
              { code: "DNS105", title: "Professional Ethics and Christian Values", category: "Professional" },
              { code: "DNS106", title: "Foundations Clinical Practice I", category: "Clinical" },
            ],
          },
          {
            id: "dns-y1-s2",
            title: "Semester II",
            courses: [
              { code: "DNS121", title: "Anatomy and Physiology II", category: "Theory" },
              { code: "DNS122", title: "Microbiology and Immunology", category: "Theory" },
              { code: "DNS123", title: "Nutrition and Dietetics", category: "Theory" },
              { code: "DNS124", title: "Health Communication and Counselling", category: "Professional" },
              { code: "DNS125", title: "First Aid and Emergency Care", category: "Theory" },
              { code: "DNS126", title: "Foundations Clinical Practice II", category: "Clinical" },
            ],
          },
        ],
      },
      {
        title: "Year II",
        semesters: [
          {
            id: "dns-y2-s1",
            title: "Semester I",
            courses: [
              { code: "DNS201", title: "Medical–Surgical Nursing I", category: "Theory" },
              { code: "DNS202", title: "Pharmacology I", category: "Theory" },
              { code: "DNS203", title: "Pathophysiology", category: "Theory" },
              { code: "DNS204", title: "Nursing Procedures and Skills Lab I", category: "Clinical" },
              { code: "DNS205", title: "Medical–Surgical Clinical Rotation I", category: "Clinical" },
            ],
          },
          {
            id: "dns-y2-s2",
            title: "Semester II",
            courses: [
              { code: "DNS221", title: "Medical–Surgical Nursing II", category: "Theory" },
              { code: "DNS222", title: "Pharmacology II", category: "Theory" },
              { code: "DNS223", title: "Pediatric Nursing I", category: "Theory" },
              { code: "DNS224", title: "Nursing Procedures and Skills Lab II", category: "Clinical" },
              { code: "DNS225", title: "Medical–Surgical Clinical Rotation II", category: "Clinical" },
            ],
          },
        ],
      },
      {
        title: "Year III",
        semesters: [
          {
            id: "dns-y3-s1",
            title: "Semester I",
            courses: [
              { code: "DNS301", title: "Reproductive Health and Gynecology", category: "Theory" },
              { code: "DNS302", title: "Mental Health Nursing", category: "Theory" },
              { code: "DNS303", title: "Community Health Nursing I", category: "Theory" },
              { code: "DNS304", title: "Pediatric Nursing II", category: "Theory" },
              { code: "DNS305", title: "Specialty Clinical Rotation I", category: "Clinical" },
            ],
          },
          {
            id: "dns-y3-s2",
            title: "Semester II",
            courses: [
              { code: "DNS321", title: "Palliative and Geriatric Nursing", category: "Theory" },
              { code: "DNS322", title: "Health Service Management and Leadership", category: "Professional" },
              { code: "DNS323", title: "Applied Nursing Research", category: "Professional" },
              { code: "DNS324", title: "Community Health Nursing II", category: "Theory" },
              { code: "DNS325", title: "Specialty Clinical Rotation II (Preceptorship)", category: "Clinical" },
            ],
          },
        ],
      },
    ],
  },
  "diploma-nursing-extension": {
    programId: "diploma-nursing-extension",
    intro:
      "Three-semester upgrade for certificate holders. Emphasis on advanced medical–surgical care, leadership, community practice, and research aligned with diploma exit outcomes.",
    years: [
      {
        title: "Year I",
        semesters: [
          {
            id: "dne-y1-s1",
            title: "Semester I",
            courses: [
              { code: "DNE101", title: "Advanced Health Assessment", category: "Theory" },
              { code: "DNE102", title: "Advanced Medical–Surgical Nursing", category: "Theory" },
              { code: "DNE103", title: "Advanced Pharmacology and Therapeutics", category: "Theory" },
              { code: "DNE104", title: "Pathophysiology for Upgrade Students", category: "Theory" },
              { code: "DNE105", title: "Advanced Clinical Practice I", category: "Clinical" },
            ],
          },
          {
            id: "dne-y1-s2",
            title: "Semester II",
            courses: [
              { code: "DNE121", title: "Nursing Leadership and Ward Management", category: "Professional" },
              { code: "DNE122", title: "Community Health Nursing (Advanced)", category: "Theory" },
              { code: "DNE123", title: "Reproductive Health Nursing (Advanced)", category: "Theory" },
              { code: "DNE124", title: "Mental Health and Psychosocial Care", category: "Theory" },
              { code: "DNE125", title: "Advanced Clinical Practice II", category: "Clinical" },
            ],
          },
        ],
      },
      {
        title: "Year II",
        semesters: [
          {
            id: "dne-y2-s1",
            title: "Semester I",
            courses: [
              { code: "DNE201", title: "Pediatric and Adolescent Nursing (Advanced)", category: "Theory" },
              { code: "DNE202", title: "Palliative and Geriatric Nursing", category: "Theory" },
              { code: "DNE203", title: "Health Service Management", category: "Professional" },
              { code: "DNE204", title: "Applied Research and Evidence-Based Practice", category: "Professional" },
              { code: "DNE205", title: "Diploma Preceptorship and Clinical Consolidation", category: "Clinical" },
            ],
          },
        ],
      },
    ],
  },
  "certificate-nursing": {
    programId: "certificate-nursing",
    intro:
      "Five-semester certificate track. Early semesters focus on fundamentals and sciences; later semesters introduce medical–surgical, community, and reproductive health with progressive clinical hours.",
    years: [
      {
        title: "Year I",
        semesters: [
          {
            id: "cns-y1-s1",
            title: "Semester I",
            courses: [
              { code: "CNS101", title: "Introduction to Nursing Profession", category: "Professional" },
              { code: "CNS102", title: "Anatomy and Physiology I", category: "Theory" },
              { code: "CNS103", title: "Communication and Health Education", category: "Professional" },
              { code: "CNS104", title: "Basic Computer Literacy", category: "Professional" },
              { code: "CNS105", title: "First Aid and Basic Life Support", category: "Theory" },
            ],
          },
          {
            id: "cns-y1-s2",
            title: "Semester II",
            courses: [
              { code: "CNS121", title: "Foundations of Nursing Practice", category: "Theory" },
              { code: "CNS122", title: "Anatomy and Physiology II", category: "Theory" },
              { code: "CNS123", title: "Microbiology and Infection Prevention", category: "Theory" },
              { code: "CNS124", title: "Nutrition for Nurses", category: "Theory" },
              { code: "CNS125", title: "Fundamentals Clinical Practice", category: "Clinical" },
            ],
          },
        ],
      },
      {
        title: "Year II",
        semesters: [
          {
            id: "cns-y2-s1",
            title: "Semester I",
            courses: [
              { code: "CNS201", title: "Medical Nursing I", category: "Theory" },
              { code: "CNS202", title: "Surgical Nursing I", category: "Theory" },
              { code: "CNS203", title: "Pharmacology I", category: "Theory" },
              { code: "CNS204", title: "Nursing Skills Laboratory I", category: "Clinical" },
              { code: "CNS205", title: "Ward Clinical Practice I", category: "Clinical" },
            ],
          },
          {
            id: "cns-y2-s2",
            title: "Semester II",
            courses: [
              { code: "CNS221", title: "Medical Nursing II", category: "Theory" },
              { code: "CNS222", title: "Surgical Nursing II", category: "Theory" },
              { code: "CNS223", title: "Pharmacology II", category: "Theory" },
              { code: "CNS224", title: "Nursing Skills Laboratory II", category: "Clinical" },
              { code: "CNS225", title: "Ward Clinical Practice II", category: "Clinical" },
            ],
          },
        ],
      },
      {
        title: "Year III",
        semesters: [
          {
            id: "cns-y3-s1",
            title: "Semester I",
            courses: [
              { code: "CNS301", title: "Community Health Nursing", category: "Theory" },
              { code: "CNS302", title: "Reproductive Health and Family Planning", category: "Theory" },
              { code: "CNS303", title: "Pediatric Nursing (Introduction)", category: "Theory" },
              { code: "CNS304", title: "Introduction to Mental Health Nursing", category: "Theory" },
              { code: "CNS305", title: "Integrated Clinical Practice III", category: "Clinical" },
            ],
          },
        ],
      },
    ],
  },
};

export const nursingCurriculumProgramList = nursingPrograms.map((program) => ({
  id: program.id,
  title: program.title,
  duration: program.duration,
  level: program.level,
  curriculum: nursingProgramCurricula[program.id],
}));

export function isNursingCurriculumProgramId(
  value: string,
): value is NursingProgramCurriculum["programId"] {
  return value in nursingProgramCurricula;
}
