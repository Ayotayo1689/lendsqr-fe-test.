export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
  fullName: string;
  accountNumber: string;
  bankName: string;
  tier: 1 | 2 | 3;
  balance: number;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  residence: string;
  education: {
    level: string;
    employmentStatus: string;
    sector: string;
    duration: string;
    officeEmail: string;
    monthlyIncome: [number, number];
    loanRepayment: number;
  };
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  guarantors: Array<{
    fullName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  }>;
  hasLoan: boolean;
  hasSavings: boolean;
}

export interface UserFilters {
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  date: string;
  status: string;
}

export interface UsersQuery {
  page: number;
  pageSize: number;
  filters: UserFilters;
}

export interface UsersResponse {
  users: User[];
  total: number;
}
