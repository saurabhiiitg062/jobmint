export interface Job {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  postName: string;
  vacancy?: number;
  salary?: string;
  qualification: string;
  fee?: string;
  ageLimit?: string;
  applicationFee?: string;
  selectionProcess?: string;
  importantDates?: {
    applyStart?: string;
    applyLastDate?: string;
    feePaymentLastDate?: string;
    examDate?: string;
    admitCardRelease?: string;
    resultDeclaration?: string;
  };
  importantLinks?: {
    applyOnline?: string;
    downloadNotification?: string;
    officialWebsite?: string;
    downloadAdmitCard?: string;
    downloadResult?: string;
    downloadAnswerKey?: string;
  };
  notificationPdf?: string;
  applicationStartDate?: string;
  applicationLastDate?: string;
  examDate?: string;
  category: string; // Latest Job, Admit Card, Result, Answer Key, Syllabus, Admission, Scheme
  state?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}
