import React, { useState } from 'react';
import { Booking, Equipment } from '../types';
import { generateReminderEmail } from '../services/geminiService';

interface OverdueItemsProps {
  overdueItems: Booking[];
  equipmentList: Equipment[];
}

const AlertIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const OverdueItems: React.FC<OverdueItemsProps> = ({ overdueItems, equipmentList }) => {
    const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<{ bookingId: string, content: string } | null>(null);
    
    const equipmentMap = new Map(equipmentList.map(e => [e.id, e.name]));

    const handleSendReminder = async (booking: Booking) => {
        setLoadingEmail(booking.id);
        setGeneratedEmail(null);
        const equipmentName = equipmentMap.get(booking.equipmentId) || 'Unknown Equipment';
        const emailContent = await generateReminderEmail(equipmentName, booking.userEmail, booking.endDate);
        setGeneratedEmail({ bookingId: booking.id, content: emailContent });
        setLoadingEmail(null);
    };

    return (
        <div className="bg-brand-surface rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertIcon className="w-6 h-6 text-yellow-400"/>
                Overdue Items
            </h2>
            {overdueItems.length === 0 ? (
                <p className="text-brand-subtle">No equipment is currently overdue.</p>
            ) : (
                <div className="overflow-y-auto max-h-64 pr-2">
                    <ul className="space-y-3">
                        {overdueItems.map(booking => {
                            const equipmentName = equipmentMap.get(booking.equipmentId) || 'Unknown';
                            return (
                                <li key={booking.id} className="bg-brand-secondary/50 p-3 rounded-lg">
                                    <div className="font-semibold">{equipmentName}</div>
                                    <div className="text-sm text-brand-subtle">{booking.userEmail}</div>
                                    <div className="text-xs text-red-400">Due: {booking.endDate.toLocaleDateString()}</div>
                                    <button
                                        onClick={() => handleSendReminder(booking)}
                                        disabled={loadingEmail === booking.id}
                                        className="mt-2 w-full text-sm bg-yellow-500 text-black font-bold py-1 px-3 rounded-md hover:bg-yellow-400 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {loadingEmail === booking.id ? 'Generating...' : 'Generate Reminder'}
                                    </button>
                                    {generatedEmail?.bookingId === booking.id && (
                                        <div className="mt-3 p-2 bg-brand-bg rounded-md">
                                            <h4 className="font-bold text-sm mb-1">Generated Email Preview:</h4>
                                            <pre className="whitespace-pre-wrap text-xs text-brand-subtle bg-black/20 p-2 rounded">{generatedEmail.content}</pre>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OverdueItems;
