import { PassportOCRData } from '../types';

export interface SamplePassport {
  id: string;
  label: string;
  country: string;
  previewImage: string;
  data: PassportOCRData;
}

export const SAMPLE_PASSPORTS: SamplePassport[] = [
  {
    id: 'sample-saudi-traveler',
    label: 'Sample 1: Ahmed Al-Mansoor (GCC Passport)',
    country: 'Saudi Arabia',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    data: {
      fullName: 'AHMED ABDULLAH AL-MANSOOR',
      passportNumber: 'K18492048',
      nationality: 'SAUDI ARABIA',
      countryCode: 'SAU',
      dob: '1988-04-14',
      expiryDate: '2031-08-20',
      gender: 'M',
      mrzLine1: 'P<SAUAL-MANSOOR<<AHMED<ABDULLAH<<<<<<<<<<<<<<',
      mrzLine2: 'K184920484SAU8804147M3108208<<<<<<<<<<<<<<04',
      confidenceScore: 99.6
    }
  },
  {
    id: 'sample-indian-traveler',
    label: 'Sample 2: Rajesh Sharma (Indian Passport)',
    country: 'India',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    data: {
      fullName: 'RAJESH KUMAR SHARMA',
      passportNumber: 'Z5819302',
      nationality: 'INDIA',
      countryCode: 'IND',
      dob: '1992-11-03',
      expiryDate: '2030-05-18',
      gender: 'M',
      mrzLine1: 'P<INDSHARMA<<RAJESH<KUMAR<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'Z5819302<8IND9211032M3005185<<<<<<<<<<<<<<22',
      confidenceScore: 98.9
    }
  },
  {
    id: 'sample-uk-traveler',
    label: 'Sample 3: Eleanor Higgins (British Passport)',
    country: 'United Kingdom',
    previewImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    data: {
      fullName: 'ELEANOR CLAIRE HIGGINS',
      passportNumber: '910384910',
      nationality: 'BRITISH CITIZEN',
      countryCode: 'GBR',
      dob: '1995-07-22',
      expiryDate: '2032-12-09',
      gender: 'F',
      mrzLine1: 'P<GBRHIGGINS<<ELEANOR<CLAIRE<<<<<<<<<<<<<<<<',
      mrzLine2: '9103849103GBR9507228F3212096<<<<<<<<<<<<<<18',
      confidenceScore: 99.8
    }
  }
];
