export interface BookingCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string | null;
}

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  treatment: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes?: string | null;
  createdAt: Date;
  customer: BookingCustomer;
}
