import { Job, Blog } from '../types/index.js';

export const mockJobs: Job[] = [
  // Latest Jobs
  {
    _id: '1',
    title: 'SSC MTS & Havaldar Exam 2026 Online Form',
    slug: 'ssc-mts-havaldar-exam-2026-online-form',
    organization: 'SSC',
    postName: 'MTS & Havaldar',
    vacancy: 8326,
    salary: 'Rs. 18,000 - 22,000/-',
    qualification: '10th Pass',
    importantDates: { applyStart: '2026-06-01', applyLastDate: '2026-07-15', examDate: 'October 2026' },
    importantLinks: { applyOnline: 'https://ssc.gov.in', downloadNotification: '#' },
    category: 'Latest Job',
    state: 'Central',
    views: 125,
    status: 'published',
    publishedAt: '2026-06-20T12:00:00Z',
    createdAt: '2026-06-20T12:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z'
  },
  {
    _id: '2',
    title: 'UPSC Civil Services (IAS/IFS) Pre 2026 Apply Online',
    slug: 'upsc-civil-services-pre-2026',
    organization: 'UPSC',
    postName: 'IAS / IFS',
    vacancy: 1056,
    salary: 'Level 10 (Rs. 56,100/-)',
    qualification: 'Graduation',
    importantDates: { applyStart: '2026-05-10', applyLastDate: '2026-06-30', examDate: 'August 2026' },
    importantLinks: { applyOnline: 'https://upsc.gov.in', downloadNotification: '#' },
    category: 'Latest Job',
    state: 'Central',
    views: 450,
    status: 'published',
    publishedAt: '2026-06-18T10:00:00Z',
    createdAt: '2026-06-18T10:00:00Z',
    updatedAt: '2026-06-18T10:00:00Z'
  },
  {
    _id: '3',
    title: 'Bihar Police Constable Recruitment 2026 Online Form',
    slug: 'bihar-police-constable-recruitment-2026',
    organization: 'CSBC',
    postName: 'Constable',
    vacancy: 21391,
    salary: 'Rs. 21,700 - 69,100/-',
    qualification: '12th Pass',
    importantDates: { applyStart: '2026-06-10', applyLastDate: '2026-07-20', examDate: 'September 2026' },
    importantLinks: { applyOnline: 'https://csbc.bih.nic.in', downloadNotification: '#' },
    category: 'Latest Job',
    state: 'Bihar',
    views: 890,
    status: 'published',
    publishedAt: '2026-06-19T08:00:00Z',
    createdAt: '2026-06-19T08:00:00Z',
    updatedAt: '2026-06-19T08:00:00Z'
  },
  
  // Admit Cards
  {
    _id: '4',
    title: 'SSC CGL 2025 Tier II Admit Card Download',
    slug: 'ssc-cgl-2025-tier-ii-admit-card',
    organization: 'SSC',
    postName: 'CGL Tier II',
    vacancy: 12000,
    qualification: 'Graduation',
    importantDates: { examDate: 'July 5-8, 2026' },
    importantLinks: { downloadAdmitCard: 'https://ssc.gov.in' },
    category: 'Admit Card',
    views: 520,
    status: 'published',
    publishedAt: '2026-06-21T06:00:00Z',
    createdAt: '2026-06-21T06:00:00Z',
    updatedAt: '2026-06-21T06:00:00Z'
  },
  {
    _id: '5',
    title: 'IBPS RRB Officer Scale I & Office Assistant Admit Card 2026',
    slug: 'ibps-rrb-officer-scale-i-admit-card-2026',
    organization: 'IBPS',
    postName: 'Office Assistant',
    vacancy: 9000,
    qualification: 'Graduation',
    importantLinks: { downloadAdmitCard: 'https://ibps.in' },
    category: 'Admit Card',
    views: 310,
    status: 'published',
    publishedAt: '2026-06-15T09:00:00Z',
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-15T09:00:00Z'
  },

  // Results
  {
    _id: '6',
    title: 'UPSC Civil Services Mains Exam 2025 Result',
    slug: 'upsc-civil-services-mains-exam-2025-result',
    organization: 'UPSC',
    postName: 'IAS / IFS',
    vacancy: 1105,
    qualification: 'Graduation',
    importantLinks: { downloadResult: 'https://upsc.gov.in' },
    category: 'Result',
    views: 1200,
    status: 'published',
    publishedAt: '2026-06-21T10:00:00Z',
    createdAt: '2026-06-21T10:00:00Z',
    updatedAt: '2026-06-21T10:00:00Z'
  },
  {
    _id: '7',
    title: 'RRB NTPC CBT 1 Result & Cutoff Marks 2025',
    slug: 'rrb-ntpc-cbt-1-result-2025',
    organization: 'RRB',
    postName: 'NTPC',
    vacancy: 35281,
    qualification: '12th Pass / Graduation',
    importantLinks: { downloadResult: 'https://rrcb.gov.in' },
    category: 'Result',
    views: 2400,
    status: 'published',
    publishedAt: '2026-06-20T14:00:00Z',
    createdAt: '2026-06-20T14:00:00Z',
    updatedAt: '2026-06-20T14:00:00Z'
  },

  // Answer Keys
  {
    _id: '8',
    title: 'SSC CHSL 2026 Tier I Answer Key & Objection Form',
    slug: 'ssc-chsl-2026-tier-i-answer-key',
    organization: 'SSC',
    postName: 'CHSL Tier I',
    vacancy: 3712,
    qualification: '12th Pass',
    importantLinks: { downloadAnswerKey: 'https://ssc.gov.in' },
    category: 'Answer Key',
    views: 840,
    status: 'published',
    publishedAt: '2026-06-21T11:00:00Z',
    createdAt: '2026-06-21T11:00:00Z',
    updatedAt: '2026-06-21T11:00:00Z'
  },

  // Syllabus
  {
    _id: '9',
    title: 'DRDO CEPTAM 11 Syllabus & Exam Pattern PDF',
    slug: 'drdo-ceptam-11-syllabus',
    organization: 'DRDO',
    postName: 'CEPTAM 11 Technician',
    vacancy: 1800,
    qualification: 'Diploma',
    importantLinks: { downloadNotification: '#' },
    category: 'Syllabus',
    views: 450,
    status: 'published',
    publishedAt: '2026-06-12T08:00:00Z',
    createdAt: '2026-06-12T08:00:00Z',
    updatedAt: '2026-06-12T08:00:00Z'
  },

  // Govt Schemes
  {
    _id: '10',
    title: 'PM Kisan Samman Nidhi 17th Installment List',
    slug: 'pm-kisan-17th-installment-list',
    organization: 'Govt of India',
    postName: 'PM Kisan Scheme',
    qualification: 'All Farmers',
    importantLinks: { officialWebsite: 'https://pmkisan.gov.in' },
    category: 'Government Scheme',
    views: 3400,
    status: 'published',
    publishedAt: '2026-06-21T05:00:00Z',
    createdAt: '2026-06-21T05:00:00Z',
    updatedAt: '2026-06-21T05:00:00Z'
  }
];

export const mockBlogs: Blog[] = [
  {
    _id: 'b1',
    title: 'How to Prepare for SSC CGL 2026 Exam: Syllabus & Study Plan',
    slug: 'how-to-prepare-ssc-cgl-2026',
    excerpt: 'Detailed preparation guide, recommended books, reference materials, and section-wise strategies to crack SSC CGL 2026.',
    content: 'SSC CGL is one of the most competitive exams in India. Learn the step by step process to clear this exam with high rank.',
    tags: ['SSC', 'Preparation', 'Study Guide'],
    views: 180,
    publishedAt: '2026-06-19T04:00:00Z',
    createdAt: '2026-06-19T04:00:00Z',
    updatedAt: '2026-06-19T04:00:00Z'
  },
  {
    _id: 'b2',
    title: 'UPSC Prelims Exam Day Guidelines: Do\'s and Don\'ts',
    slug: 'upsc-prelims-exam-day-guidelines',
    excerpt: 'Important guidelines for UPSC Civil Services Prelims candidates, dress code, allowed items, and timing tips.',
    content: 'Heading to the UPSC exam center? Make sure you read these rules carefully to avoid disqualification.',
    tags: ['UPSC', 'Exam Tips'],
    views: 290,
    publishedAt: '2026-06-17T03:00:00Z',
    createdAt: '2026-06-17T03:00:00Z',
    updatedAt: '2026-06-17T03:00:00Z'
  }
];
