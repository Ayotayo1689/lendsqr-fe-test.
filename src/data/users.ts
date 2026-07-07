import type { User, UserStatus } from '../types';

const organizations = ['Lendsqr', 'Irorun', 'Lendstar', 'Finova', 'Credify'];
const firstNames = ['Grace', 'Tosin', 'Debby', 'Adedeji', 'Aisha', 'Emeka', 'Mariam', 'Kunle', 'Nora', 'Victor'];
const lastNames = ['Effiom', 'Dokunmu', 'Ogana', 'Balogun', 'Okafor', 'Ibrahim', 'Eze', 'Cole', 'Adewale', 'Johnson'];
const statuses: UserStatus[] = ['Inactive', 'Pending', 'Blacklisted', 'Active'];
const sectors = ['FinTech', 'Healthcare', 'Education', 'Retail', 'Media'];

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function generateUsers(count = 500): User[] {
  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 3) % lastNames.length];
    const organization = organizations[index % organizations.length];
    const username = `${firstName} ${lastName}`;
    const slug = `${firstName}.${lastName}.${index + 1}`.toLowerCase();
    const status = statuses[index % statuses.length];
    const month = 3 + (index % 3);
    const day = 1 + (index % 28);
    const hour = 10 + (index % 6);
    const hasLoan = index % 4 === 0 || index % 7 === 0;
    const hasSavings = index % 3 !== 0;

    return {
      id: `user-${pad(index + 1, 3)}`,
      organization,
      username,
      fullName: username,
      email: `${slug}@${organization.toLowerCase()}.com`,
      phoneNumber: `0${7000000000 + index * 4921}`.slice(0, 11),
      dateJoined: `2020-${pad(month)}-${pad(day)}T${pad(hour)}:00:00.000Z`,
      status,
      accountNumber: `${913245678 + index}`,
      bankName: index % 2 === 0 ? 'Providus Bank' : 'GTBank',
      tier: ((index % 3) + 1) as 1 | 2 | 3,
      balance: 120000 + index * 3750,
      bvn: `0706078${pad(index % 1000, 3)}`,
      gender: index % 2 === 0 ? 'Female' : 'Male',
      maritalStatus: index % 5 === 0 ? 'Married' : 'Single',
      children: index % 4 === 0 ? '2' : 'None',
      residence: index % 2 === 0 ? "Parent's Apartment" : 'Own Apartment',
      education: {
        level: index % 3 === 0 ? 'B.Sc' : 'HND',
        employmentStatus: index % 6 === 0 ? 'Self-employed' : 'Employed',
        sector: sectors[index % sectors.length],
        duration: `${1 + (index % 8)} years`,
        officeEmail: `${slug}@workmail.com`,
        monthlyIncome: [200000 + index * 500, 400000 + index * 700],
        loanRepayment: 20000 + index * 250,
      },
      socials: {
        twitter: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        facebook: username,
        instagram: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      },
      guarantors: [
        {
          fullName: 'Debby Ogana',
          phoneNumber: '07060780922',
          email: 'debby@gmail.com',
          relationship: 'Sister',
        },
        {
          fullName: 'Victor Johnson',
          phoneNumber: '08160780928',
          email: 'victor@gmail.com',
          relationship: 'Brother',
        },
      ],
      hasLoan,
      hasSavings,
    };
  });
}

export const usersSeed = generateUsers();
