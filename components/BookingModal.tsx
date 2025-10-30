
import React, { useState, useEffect } from 'react';
import { Booking, Equipment } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, 'id'> & { id?: string }) => boolean;
  onDelete: (bookingId: string) => void;
  booking?: Booking;
  slotInfo?: { equipmentId: string; date: Date };
  equipmentList: Equipment[];
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSave, onDelete, booking, slotInfo, equipmentList }) => {
  const [equipmentId, setEquipmentId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        setEquipmentId(booking.equipmentId);
        setUserName(booking.userName);
        setUserEmail(booking.userEmail);
        setStartDate(booking.startDate.toISOString().split('T')[0]);
        setEndDate(booking.endDate.toISOString().split('T')[0]);
      } else if (slotInfo) {
        setEquipmentId(slotInfo.equipmentId);
        const dateStr = slotInfo.date.toISOString().split('T')[0];
        setStartDate(dateStr);
        setEndDate(dateStr);
        setUserName('');
        setUserEmail('');
      } else {
        // Reset for a completely new booking from the header button
        setEquipmentId('');
        setUserName('');
        setUserEmail('');
        setStartDate('');
        setEndDate('');
      }
      setError('');
    }
  }, [isOpen, booking, slotInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!equipmentId || !userName || !userEmail || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    // Create dates in UTC to avoid timezone errors
    const parseDate = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (end < start) {
      setError('End date cannot be before start date.');
      return;
    }

    const bookingDataToSave: Omit<Booking, 'id'> & { id?: string } = {
      id: booking?.id, // Pass id if it exists (editing mode)
      equipmentId,
      userName,
      userEmail,
      startDate: start,
      endDate: end,
    };
    
    const isSuccess = onSave(bookingDataToSave);

    if (!isSuccess) {
        setError('Booking conflict. This equipment is already reserved for the selected dates.');
    }
    // If successful, App.tsx will call onClose which closes the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{booking ? 'Edit Booking' : 'New Booking'}</h2>
          <button onClick={onClose} className="text-brand-subtle hover:text-brand-text">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-brand-subtle">Equipment</label>
              <select
                id="equipment"
                value={equipmentId}
                onChange={e => setEquipmentId(e.target.value)}
                className="mt-1 block w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              >
                <option value="" disabled>Select Equipment</option>
                {equipmentList.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-subtle">Your Name</label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
                className="mt-1 block w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-subtle">User Email</label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                required
                className="mt-1 block w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="start-date" className="block text-sm font-medium text-brand-subtle">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="mt-1 block w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="end-date" className="block text-sm font-medium text-brand-subtle">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="mt-1 block w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <div className="mt-6 flex justify-between">
            <div>
                {booking && (
                    <button
                        type="button"
                        onClick={() => onDelete(booking.id)}
                        className="py-2 px-4 border border-red-500 text-red-500 rounded-md shadow-sm text-sm font-medium hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                )}
            </div>
            <div className='flex gap-2'>
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-brand-secondary rounded-md shadow-sm text-sm font-medium hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              >
                Save Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
