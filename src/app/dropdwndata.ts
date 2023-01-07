export interface IFspecialisation {
  id: string;
  name: string;
}

export interface IFspecialisationSN {
  id: string;
  name: string;
  sName: string;
}

export const CONSULTATIONDURATION = [15, 20, 30, 45, 60];
export const DOCTORTYPE = [
  {
    id: '1',
    name: 'Allopathy',
  },
  {
    id: '2',
    name: 'Homeopathy',
  },
  {
    id: '3',
    name: 'Ayurvedic',
  },
  {
    id: '4',
    name: 'Yunani',
  },
  {
    id: '5',
    name: 'Naturopathy',
  },
  {
    id: '6',
    name: 'Yoga',
  },
  {
    id: '7',
    name: 'Physiotherapist',
  },
  {
    id: '8',
    name: 'Dentist',
  },
  {
    id: '9',
    name: 'Dietician',
  },
  {
    id: '10',
    name: 'Sports Medicine',
  },
];
export const UG: IFspecialisationSN[] = [
  {
    id: '1',
    name: 'MBBS-Bachelor of Medicine, Bachelor of Surgery',
    sName: 'MBBS',
  },
  { id: '2', name: 'BDS-Bachelor of Dental Surgery', sName: 'MBBS' },
  {
    id: '3',
    name: 'BAMS-Bachelor of Ayurvedic Medicine and Surgery',
    sName: 'BAMS',
  },
  {
    id: '4',
    name: 'BUMS-Bachelor of Unani Medicine and Surgery',
    sName: 'MBBS',
  },
  {
    id: '5',
    name: 'BHMS-Bachelor of Homeopathy Medicine and Surgery',
    sName: 'BHMS',
  },
  {
    id: '6',
    name: 'BYNS-Bachelor of Yoga and Naturopathy Sciences',
    sName: 'BYNS',
  },
  {
    id: '7',
    name: 'B.V.Sc & AH Bachelor of Veterinary Sciences and Animal Husbandry',
    sName: 'B.V.Sc & AH',
  },
];

export const PG: IFspecialisationSN[] = [
  { id: '1', name: 'MD-Doctor of Medicine', sName: 'MD' },
  { id: '2', name: 'MS-Master of Surgery', sName: 'MS' },
  { id: '3', name: 'DNB-Diplomate of National Board', sName: 'DNB' },
];

export const YEAROFPASSING = generateArrayOfYears();
function generateArrayOfYears() {
  var max = new Date().getFullYear();
  var min = max - 60;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}

export const BLOODGROUP = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const EXPERIENCE = Array.from({ length: 60 }, (v, k) => k + 1);
export const SPECIALISATION: IFspecialisation[] = [
  {
    id: '0',
    name: 'MBBS - General',
  },
  {
    id: '1',
    name: 'Allergy and Immunology',
  },
  {
    id: '2',
    name: 'Anatomic/Clinical Pathology',
  },
  {
    id: '3',
    name: 'Anesthesiology',
  },
  {
    id: '4',
    name: 'Cardiovascular Disease',
  },
  {
    id: '5',
    name: 'Child and Adolescent Psychiatry',
  },
  {
    id: '6',
    name: 'Critical Care Medicine',
  },
  {
    id: '7',
    name: 'Dermatology',
  },
  {
    id: '8',
    name: 'Emergency Medicine',
  },
  {
    id: '9',
    name: 'Endocrinology, Diabetes and Metabolism',
  },
  {
    id: '10',
    name: 'Family Medicine/General Practice',
  },
  {
    id: '11',
    name: 'Gastroenterology',
  },
  {
    id: '12',
    name: 'General Surgery',
  },
  {
    id: '13',
    name: 'Geriatric Medicine',
  },
  {
    id: '14',
    name: 'Hematology and Oncology',
  },
  {
    id: '15',
    name: 'Infectious Disease',
  },
  {
    id: '16',
    name: 'Internal Medicine',
  },
  {
    id: '17',
    name: 'Internal Medicine/Pediatrics',
  },
  {
    id: '18',
    name: 'Interventional Cardiology',
  },
  {
    id: '19',
    name: 'Neonatal-Perinatal Medicine',
  },
  {
    id: '20',
    name: 'Nephrology',
  },
  {
    id: '21',
    name: 'Neurological Surgery',
  },
  {
    id: '22',
    name: 'Neurology',
  },
  {
    id: '23',
    name: 'Neuroradiology',
  },
  {
    id: '24',
    name: 'Obstetrics and Gynecology',
  },
  {
    id: '25',
    name: 'Ophthalmology',
  },
  {
    id: '26',
    name: 'Orthopedic Surgery',
  },
  {
    id: '27',
    name: 'Oto Rhino laryngology',
  },
  {
    id: '28',
    name: 'Pain Medicine and Pain Management',
  },
  {
    id: '29',
    name: 'Pediatric Cardiology',
  },
  {
    id: '30',
    name: 'Pediatric Hematology/Oncology',
  },
  {
    id: '31',
    name: 'Pediatrics',
  },
  {
    id: '32',
    name: 'Physical Medicine and Rehabilitation',
  },
  {
    id: '33',
    name: 'Plastic Surgery',
  },
  {
    id: '34',
    name: 'Preventive Medicine',
  },
  {
    id: '35',
    name: 'Psychiatry',
  },
  {
    id: '36',
    name: 'Pulmonary Disease',
  },
  {
    id: '37',
    name: 'Radiation Oncology',
  },
  {
    id: '38',
    name: 'Radiology and Diagnostic Radiology',
  },
  {
    id: '39',
    name: 'Rheumatology',
  },
  {
    id: '40',
    name: 'Sports Medicine (Orthopedic Surgery)',
  },
  {
    id: '41',
    name: 'Thoracic Surgery',
  },
  {
    id: '42',
    name: 'Urology',
  },
  {
    id: '43',
    name: 'Vascular and Interventional Radiology',
  },
  {
    id: '44',
    name: 'Vascular Surger',
  },
];

export const EDITORCONFIG = {
  toolbar: [
    'undo',
    'redo',
    '|',
    'heading',
    '|',
    'bold',
    'italic',
    '|',
    'link',
    'mediaEmbed',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'indent',
    'outdent',
    '|',
    'insertTable',
    'blockQuote',
  ],
  language: 'id',
};
