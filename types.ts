
// Fix: Add missing User interface for the Login component.
export interface User {
  email: string;
  name: string;
  role: 'admin' | 'student';
}

export interface DamageReport {
  date: Date;
  description: string;
  reportedByEmail: string;
  bookingId: string;
}

export interface Equipment {
  id: string;
  name: string;
  damageHistory: DamageReport[];
}

export interface Booking {
  id: string;
  equipmentId: string;
  userName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  isChecked?: boolean;
}
