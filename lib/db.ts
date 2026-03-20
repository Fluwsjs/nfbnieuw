import { PrismaClient } from '@prisma/client';
import type { Booking } from '../types/booking';

const prisma = new PrismaClient();

// In een echte applicatie zou dit een database connectie zijn
let bookings: Booking[] = [];

export async function saveBooking(booking: Booking): Promise<Booking> {
  const savedBooking = await prisma.booking.create({
    data: {
      id: booking.id,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      treatment: booking.treatment,
      date: new Date(booking.date),
      time: booking.time,
      duration: booking.duration,
      price: booking.price,
      notes: booking.notes,
      createdAt: booking.createdAt,
      customer: {
        create: {
          firstName: booking.customer.firstName,
          lastName: booking.customer.lastName,
          email: booking.customer.email,
          phone: booking.customer.phone,
          notes: booking.customer.notes,
        },
      },
    },
    include: {
      customer: true,
    },
  });

  return savedBooking as unknown as Booking;
}

export async function getBookings(): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
    },
  });
  return bookings as unknown as Booking[];
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });
  return booking as unknown as Booking;
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      customer: true,
    },
  });
  return bookings as unknown as Booking[];
} 