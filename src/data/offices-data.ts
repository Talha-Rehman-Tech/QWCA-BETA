export interface OfficeLocation {
  id: 'pakistan' | 'uae' | 'china';
  country: string;
  flag: string;
  city: string;
  title: string;
  subtitle: string;
  badge: string;
  address: string;
  fullAddress: string;
  phone: string;
  phoneTel: string;
  whatsapp?: string;
  email: string;
  hours: string;
  timezone: string;
  timezoneCode: string;
  utcOffset: string;
  mapQuery: string;
  googleMapsUrl: string;
  keyServices: string[];
  liaisonLead: string;
}

export const officesData: OfficeLocation[] = [
  {
    id: 'pakistan',
    country: 'Pakistan',
    flag: '🇵🇰',
    city: 'Faisalabad & Lahore',
    title: 'Pakistan Principal Head Office',
    subtitle: 'National Practice Headquarters · ICAP Regulated Member Firm',
    badge: 'Principal Practice Firm',
    address: '20 - J Commercial Plaza, 4th Floor, Main Boulevard, Wapda City, Faisalabad, Pakistan',
    fullAddress: '20 - J Commercial Plaza, 4th Floor, Main Boulevard, Wapda City, Faisalabad, Punjab 38000, Pakistan',
    phone: '+92-41-5392192',
    phoneTel: '+92415392192',
    whatsapp: '+923008660309',
    email: 'info@qwca.pk',
    hours: 'Mon – Sat: 9:00 AM – 5:00 PM (PKT)',
    timezone: 'Asia/Karachi',
    timezoneCode: 'PKT',
    utcOffset: 'UTC+5',
    mapQuery: '20-J Commercial Plaza, Wapda City, Faisalabad, Pakistan',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20-J+Commercial+Plaza+Wapda+City+Faisalabad+Pakistan',
    keyServices: [
      'Statutory & Forensic Audits (ISA & Companies Act 2017)',
      'Direct & Indirect Taxation (FBR, PRA, SRB, KPRA)',
      'SECP Digital Incorporation & Secretarial Compliance',
      'SEZ 10-Year Income Tax Holiday & FIEDMC Approvals'
    ],
    liaisonLead: 'Qummar Waheed, ACA (Managing Partner)'
  },
  {
    id: 'uae',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    city: 'Dubai',
    title: 'UAE & Middle East Advisory Desk',
    subtitle: 'Cross-Border Corporate Tax · GCC Free Zone & Mainland Advisory',
    badge: 'Middle East Practice Desk',
    address: 'Level 14, Boulevard Plaza Tower 1, Sheikh Mohammed Bin Rashid Blvd, Downtown, Dubai, UAE',
    fullAddress: 'Level 14, Boulevard Plaza Tower 1, Sheikh Mohammed Bin Rashid Boulevard, Downtown / Business Bay, Dubai, United Arab Emirates',
    phone: '+971 4 368 0000',
    phoneTel: '+97143680000',
    whatsapp: '+971500000000',
    email: 'uae@qwca.pk',
    hours: 'Mon – Fri: 9:00 AM – 6:00 PM (GST)',
    timezone: 'Asia/Dubai',
    timezoneCode: 'GST',
    utcOffset: 'UTC+4',
    mapQuery: 'Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Boulevard+Plaza+Tower+1+Downtown+Dubai+UAE',
    keyServices: [
      'UAE Corporate Tax (Federal Decree-Law No. 47) Advisory',
      'Federal Tax Authority (FTA) VAT Filings & Audits',
      'Free Zone (DIFC, DMCC, DAFZA) & Mainland Entity Formation',
      'UAE-Pakistan Bilateral Tax Structuring & Repatriation'
    ],
    liaisonLead: 'Middle East Practice Partner'
  },
  {
    id: 'china',
    country: 'China',
    flag: '🇨🇳',
    city: 'Beijing & Shanghai',
    title: 'China & CPEC Inward Investment Desk',
    subtitle: 'FDI Advisory · Chinese Enterprise Incorporation & SEZ Entry',
    badge: 'East Asia & CPEC Desk',
    address: 'Tower B, Chaowai SOHO, Chaoyang District, Beijing, 100020, China',
    fullAddress: 'Tower B, Chaowai SOHO, Chaoyang District, Beijing, 100020, People’s Republic of China',
    phone: '+86 10 5900 0000',
    phoneTel: '+861059000000',
    whatsapp: '+8613800000000',
    email: 'china@qwca.pk',
    hours: 'Mon – Fri: 9:00 AM – 6:00 PM (CST)',
    timezone: 'Asia/Shanghai',
    timezoneCode: 'CST',
    utcOffset: 'UTC+8',
    mapQuery: 'Chaowai SOHO, Chaoyang District, Beijing, China',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chaowai+SOHO+Chaoyang+District+Beijing+China',
    keyServices: [
      'CPEC Special Economic Zones (M-3 Industrial City & AIIC) Setup',
      'Board of Investment (BOI) Branch & Liaison Office Approvals',
      'Ministry of Interior (MOI) Security Clearance Coordination',
      'Cross-Border Remittances & SBP Regulatory Compliance'
    ],
    liaisonLead: 'CPEC & Chinese Corporate Liaison Director'
  }
];
