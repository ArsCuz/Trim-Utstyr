
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Equipment, Booking, DamageReport } from './types';
import BookingCalendar from './components/BookingCalendar';
import Header from './components/Header';
import SidePanel from './components/SidePanel';
import BookingModal from './components/BookingModal';

// Mock Data Generation
const generateInitialEquipment = (): Equipment[] => {
  const equipmentNames = [
    'Iphone 17 Pro #1',
    'Iphone 17 Pro #2',
    'Iphone 17 Pro Max #1',
    'Iphone 17 Pro Max #2',
    'Iphone 17 Pro Max #3',
    'Iphone 17 Pro Max #4',
    'DJI Mic Pro 2 #1',
    'DJI Mic Pro 2 #2',
    'DJI P7 Gimbal #1',
    'DJI P7 Gimbal #2',
    'Light Kit #1',
    'Light Kit #2',
  ];
  return equipmentNames.map((name, i) => ({
    id: `equip-${i + 1}`,
    name: name,
    damageHistory: [],
  }));
};

const generateInitialBookings = (equipment: Equipment[]): Booking[] => {
  // Guard against empty or insufficient equipment list to prevent crashes
  if (!equipment || equipment.length < 6) {
    return [];
  }
  const bookings: Booking[] = [];
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const users = [
    { name: 'Alex', email: 'alex@trim.media' },
    { name: 'Brian', email: 'brian@trim.media' },
    { name: 'Casey', email: 'casey@trim.media' },
    { name: 'Drew', email: 'drew@trim.media' },
    { name: 'Elliot', email: 'elliot@trim.media' },
  ];

  // Overdue and unchecked booking
  bookings.push({
    id: 'booking-1',
    equipmentId: equipment[0].id,
    userName: users[0].name,
    userEmail: users[0].email,
    startDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - 8)),
    endDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - 4)),
    isChecked: false,
  });

  // Current booking
  bookings.push({
    id: 'booking-2',
    equipmentId: equipment[2].id,
    userName: users[1].name,
    userEmail: users[1].email,
    startDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - 2)),
    endDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 3)),
  });

  // Future booking
  bookings.push({
    id: 'booking-3',
    equipmentId: equipment[5].id,
    userName: users[2].name,
    userEmail: users[2].email,
    startDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 5)),
    endDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 10)),
  });
    
  // Another future booking
  bookings.push({
    id: 'booking-4',
    equipmentId: equipment[0].id,
    userName: users[3].name,
    userEmail: users[3].email,
    startDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 2)),
    endDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 4)),
  });
    
  // Past, checked booking
  bookings.push({
    id: 'booking-5',
    equipmentId: equipment[1].id,
    userName: users[4].name,
    userEmail: users[4].email,
    startDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - 15)),
    endDate: new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - 12)),
    isChecked: true,
  });

  return bookings;
};

// --- Persistence Layer ---
const LOCAL_STORAGE_KEYS = {
  EQUIPMENT: 'trim_media_equipment',
  BOOKINGS: 'trim_media_bookings',
};

// Reviver to convert ISO date strings from localStorage back to Date objects
const dateReviver = (key: string, value: any) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (typeof value === 'string' && isoDateRegex.test(value)) {
    return new Date(value);
  }
  return value;
};

const loadInitialState = () => {
  let equipment: Equipment[];
  let bookings: Booking[];

  try {
    const savedEquipment = localStorage.getItem(LOCAL_STORAGE_KEYS.EQUIPMENT);
    if (savedEquipment) {
      equipment = JSON.parse(savedEquipment, dateReviver);
    } else {
      equipment = generateInitialEquipment();
    }

    const savedBookings = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    if (savedBookings) {
      bookings = JSON.parse(savedBookings, dateReviver);
    } else {
      bookings = generateInitialBookings(equipment);
    }
  } catch (error) {
    console.error("Failed to load data from localStorage, initializing with defaults.", error);
    equipment = generateInitialEquipment();
    bookings = generateInitialBookings(equipment);
  }

  return { equipment, bookings };
};

const { equipment: initialEquipment, bookings: initialBookings } = loadInitialState();
// --- End Persistence Layer ---


interface ModalState {
  isOpen: boolean;
  booking?: Booking;
  slotInfo?: { equipmentId: string; date: Date };
}

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  });
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });
  
  // Use a ref to hold the latest bookings to prevent stale state in callbacks.
  const bookingsRef = useRef(bookings);
  useEffect(() => {
    bookingsRef.current = bookings;
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));
  }, []);

  const handleNewBookingClick = useCallback(() => {
    setModalState({ isOpen: true });
  }, []);

  const handleSelectSlot = useCallback((equipmentId: string, date: Date) => {
    setModalState({ isOpen: true, slotInfo: { equipmentId, date } });
  }, []);

  const handleSelectBooking = useCallback((booking: Booking) => {
    setModalState({ isOpen: true, booking });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false });
  }, []);

  const handleUpdateEquipmentName = useCallback((id: string, newName: string) => {
    setEquipment(prev => prev.map(e => e.id === id ? { ...e, name: newName } : e));
  }, []);
  
  const handleSaveBooking = useCallback((bookingData: Omit<Booking, 'id'> & { id?: string }): boolean => {
      const { startDate: newStart, endDate: newEnd, equipmentId } = bookingData;

      // Use the ref for the conflict check to ensure it has the latest data
      const hasConflict = bookingsRef.current.some(existingBooking => {
          if (bookingData.id && existingBooking.id === bookingData.id) {
              return false; // Don't check against self when editing
          }
          if (existingBooking.equipmentId !== equipmentId) {
              return false; // Only check bookings for the same equipment
          }
          return newStart <= existingBooking.endDate && newEnd >= existingBooking.startDate;
      });

      if (hasConflict) {
          return false;
      }

      if (bookingData.id) {
          const { id, ...dataToUpdate } = bookingData;
          setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...dataToUpdate } : b)));
      } else {
          const newBooking: Booking = {
              ...bookingData,
              id: `booking-${Date.now()}`,
              isChecked: false,
          };
          setBookings(prev => [...prev, newBooking]);
      }

      closeModal();
      return true;
  }, [closeModal]);
    
  const handleDeleteBooking = useCallback((bookingId: string) => {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      closeModal();
  }, [closeModal]);

  const handleApproveReturn = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const todayDate = new Date();
        const today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()));

        const updatedBooking = { ...b, isChecked: true };
        
        // If approved before the official end date, update it to today
        if (b.endDate > today) {
          updatedBooking.endDate = today;
        }
        
        return updatedBooking;
      }
      return b;
    }));
  }, []);

  const handleReportDamage = useCallback((bookingId: string, description: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !description.trim()) return;

    const newReport: DamageReport = {
      date: new Date(),
      description: description.trim(),
      reportedByEmail: booking.userEmail,
      bookingId: booking.id,
    };

    setEquipment(prev => prev.map(e => 
      e.id === booking.equipmentId 
        ? { ...e, damageHistory: [newReport, ...e.damageHistory] } 
        : e
    ));

    handleApproveReturn(bookingId);
  }, [bookings, handleApproveReturn]);
  
  const { overdueItems, returnedItems } = useMemo(() => {
    const todayDate = new Date();
    const today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()));

    // Overdue items have an end date in the past and are not checked in
    const overdue = bookings.filter(b => b.endDate < today && !b.isChecked);
    
    // Items pending inspection are any bookings that have started but not been checked in.
    // This includes overdue items and current items that could be returned early.
    const forInspection = bookings.filter(b => b.startDate <= today && !b.isChecked);

    return {
      overdueItems: overdue,
      returnedItems: forInspection,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-brand-bg text-brand-text font-sans">
      <main className="flex-grow flex flex-col lg:flex-row gap-8">
        <div className="flex-grow flex flex-col min-w-0">
          <Header
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onNewBooking={handleNewBookingClick}
          />
          <BookingCalendar
            currentDate={currentDate}
            equipment={equipment}
            bookings={bookings}
            onSelectSlot={handleSelectSlot}
            onSelectBooking={handleSelectBooking}
          />
        </div>
        <SidePanel
          equipment={equipment}
          overdueItems={overdueItems}
          returnedItems={returnedItems}
          onUpdateEquipmentName={handleUpdateEquipmentName}
          onApproveReturn={handleApproveReturn}
          onReportDamage={handleReportDamage}
        />
      </main>
      {modalState.isOpen && (
        <BookingModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSave={handleSaveBooking}
          onDelete={handleDeleteBooking}
          booking={modalState.booking}
          slotInfo={modalState.slotInfo}
          equipmentList={equipment}
        />
      )}
    </div>
  );
};

export default App;
