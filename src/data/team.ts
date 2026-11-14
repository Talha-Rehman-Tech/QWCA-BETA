export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  department: 'Finance & Accounting' | 'Information Technology & Systems';
  pill: string;
  experience: string;
  qualification: string;
  bio: string;
  image: string;
  linkedin?: string;
  featured: boolean;
}

export const teamData: TeamMemberData[] = [
  {
    id: 'qummar-waheed',
    name: 'Qummar Waheed, ACA',
    role: 'Managing Partner & Lead Consultant',
    department: 'Finance & Accounting',
    pill: 'Firm Head',
    experience: '10+ Years Experience',
    qualification: 'Associate Chartered Accountant (ACA) · ICAP Member',
    bio: 'Qummar leads the firm’s professional engagements, bringing over 10 years of specialized experience in statutory audit, direct and indirect taxation, SECP compliance, and corporate advisory. He brings seasoned expertise and steadfast commitment to professional integrity, transparent communication, and client success.',
    image: '/assets/Lead CA.webp',
    linkedin: 'https://www.linkedin.com/in/qummar-waheed-aca-ab3b3164/',
    featured: true
  },
  {
    id: 'abdul-rehman',
    name: 'Abdul Rehman',
    role: 'Accounting & Finance Manager',
    department: 'Finance & Accounting',
    pill: 'Manager',
    experience: '4+ Years Experience',
    qualification: 'Practice Manager · Client Engagements Specialist',
    bio: 'With over 4 years of hands-on experience, Abdul Rehman directs accounting operations, financial reporting, and client workflow coordination across audit engagements, statutory tax compliance, and corporate filings to ensure accuracy, regulatory adherence, and dependable turnaround.',
    image: '/assets/Abdul Rehman.webp',
    linkedin: 'https://www.linkedin.com/in/abdul-rehman-waheed-16b26324b/',
    featured: true
  },
  {
    id: 'muhammad-umer',
    name: 'Muhammad Umer',
    role: 'Software Engineer & IT Head',
    department: 'Information Technology & Systems',
    pill: 'IT Head',
    experience: '4+ Years Experience',
    qualification: 'MS in Computer Science',
    bio: 'Specializes in enterprise software engineering, system architecture, and cloud infrastructure—driving high-performance technical solutions, platform security, and digital workflow modernization for the practice and corporate clients.',
    image: '/assets/Muhammad Umer.webp',
    featured: true
  },
  {
    id: 'talha-rehman',
    name: 'Talha Rehman',
    role: 'Full Stack Engineer',
    department: 'Information Technology & Systems',
    pill: 'Full Stack',
    experience: '1+ Years Experience',
    qualification: 'BS in Computer Science',
    bio: 'Specializes in end-to-end full-stack web engineering, automated tax calculation portals, responsive interfaces, secure APIs, and cloud accounting systems.',
    image: '/assets/Talha Rehman.webp',
    linkedin: 'https://www.linkedin.com/in/talharehman23542/',
    featured: true
  }
];

