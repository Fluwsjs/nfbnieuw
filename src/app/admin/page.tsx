"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Mail, Phone, Trash2 } from "lucide-react";

// Appointment type
interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceOption: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  notes: string;
  createdAt: string;
}

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load appointments from localStorage
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem('nfb_salon_appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Kon afspraken niet laden. Probeer de pagina te vernieuwen.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
  };
  
  // Delete an appointment
  const deleteAppointment = (id: string) => {
    if (window.confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
      try {
        const updatedAppointments = appointments.filter(app => app.id !== id);
        localStorage.setItem('nfb_salon_appointments', JSON.stringify(updatedAppointments));
        setAppointments(updatedAppointments);
        
        // Also clean up related calendar events and emails
        const calendarEvents = JSON.parse(localStorage.getItem('nfb_salon_mock_calendar') || '[]');
        const updatedEvents = calendarEvents.filter((event: any) => !event.id.includes(id));
        localStorage.setItem('nfb_salon_mock_calendar', JSON.stringify(updatedEvents));
      } catch (err) {
        console.error('Error deleting appointment:', err);
        setError('Kon afspraak niet verwijderen. Probeer het opnieuw.');
      }
    }
  };
  
  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    // First compare by date
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA > dateB) return 1;
    if (dateA < dateB) return -1;
    
    // If dates are the same, compare by time
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
    return timeA[1] - timeB[1];
  });
  
  // Group appointments by date
  const appointmentsByDate = sortedAppointments.reduce((groups: { [key: string]: Appointment[] }, app) => {
    const date = app.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(app);
    return groups;
  }, {});
  
  // Check if date is in the past
  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-medium text-[#1D1D1F]">Administratie</h1>
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-[#B99885] hover:bg-[#A98775] text-white"
        >
          Terug naar website
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>Afspraken Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="h-10 w-10 border-4 border-[#B99885] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#1D1D1F]/70">Er zijn nog geen afspraken gemaakt.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
                <div key={date} className="border rounded-lg overflow-hidden">
                  <div className="bg-[#F9F5F2] px-6 py-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#B99885]" />
                    <span className="font-medium">{formatDate(date)}</span>
                    {isPastDate(date) && (
                      <Badge variant="outline" className="ml-2 bg-gray-200">Verlopen</Badge>
                    )}
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tijd</TableHead>
                        <TableHead>Klant</TableHead>
                        <TableHead>Behandeling</TableHead>
                        <TableHead>Duur</TableHead>
                        <TableHead>Prijs</TableHead>
                        <TableHead className="text-right">Actie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-[#B99885]" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{appointment.firstName} {appointment.lastName}</span>
                              <div className="flex items-center text-xs text-gray-500">
                                <Mail className="h-3 w-3 mr-1" />
                                {appointment.email}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {appointment.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{appointment.serviceName}</span>
                              <span className="text-sm text-gray-500">{appointment.serviceOption}</span>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.duration}</TableCell>
                          <TableCell>{appointment.price}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAppointment(appointment.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Administratie Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-[#B99885] hover:bg-[#A98775] text-white h-auto py-6 flex flex-col"
              onClick={() => {
                const proceed = window.confirm('Weet je zeker dat je alle afspraken wilt verwijderen?');
                if (proceed) {
                  localStorage.removeItem('nfb_salon_appointments');
                  localStorage.removeItem('nfb_salon_mock_calendar');
                  localStorage.removeItem('nfb_salon_mock_emails');
                  setAppointments([]);
                }
              }}
            >
              <span className="text-lg">Alle afspraken verwijderen</span>
              <span className="text-xs mt-1 opacity-70">Dit verwijdert alle test data</span>
            </Button>
            
            <a href="/afspraak" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#CFAF9D] hover:bg-[#B99885] text-white h-auto py-6 flex flex-col w-full">
                <span className="text-lg">Nieuwe afspraak maken</span>
                <span className="text-xs mt-1 opacity-70">Open het boekingsformulier</span>
              </Button>
            </a>
            
            <Button 
              className="bg-[#F9F5F2] hover:bg-[#EFE5E0] text-[#1D1D1F] h-auto py-6 flex flex-col"
              onClick={() => {
                const userData = {
                  appointments: JSON.parse(localStorage.getItem('nfb_salon_appointments') || '[]'),
                  calendar: JSON.parse(localStorage.getItem('nfb_salon_mock_calendar') || '[]'),
                  emails: JSON.parse(localStorage.getItem('nfb_salon_mock_emails') || '[]')
                };
                
                // Create a downloadable JSON file
                const dataStr = JSON.stringify(userData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = 'nfb_salon_data.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
            >
              <span className="text-lg">Data exporteren</span>
              <span className="text-xs mt-1 opacity-70">Download alle gegevens als JSON</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 