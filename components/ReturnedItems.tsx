import React, { useState } from 'react';
import { Booking, Equipment } from '../types';

interface ReturnedItemsProps {
  returnedItems: Booking[];
  equipmentList: Equipment[];
  onApproveReturn: (bookingId: string) => void;
  onReportDamage: (bookingId: string, description: string) => void;
}

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ReturnedItems: React.FC<ReturnedItemsProps> = ({ returnedItems, equipmentList, onApproveReturn, onReportDamage }) => {
    const [reportingId, setReportingId] = useState<string | null>(null);
    const [damageDescription, setDamageDescription] = useState('');
    
    const equipmentMap = new Map(equipmentList.map(e => [e.id, e.name]));

    const handleReportClick = (bookingId: string) => {
        setReportingId(bookingId);
        setDamageDescription('');
    };

    const handleCancelReport = () => {
        setReportingId(null);
        setDamageDescription('');
    };
    
    const handleSaveReport = () => {
        if (reportingId && damageDescription.trim()) {
            onReportDamage(reportingId, damageDescription);
            handleCancelReport();
        }
    };

    return (
        <div className="bg-brand-surface rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-blue-400"/>
                Pending Inspection
            </h2>
            {returnedItems.length === 0 ? (
                <p className="text-brand-subtle">No items are pending inspection.</p>
            ) : (
                <div className="overflow-y-auto max-h-64 pr-2">
                    <ul className="space-y-3">
                        {returnedItems.map(booking => {
                            const equipmentName = equipmentMap.get(booking.equipmentId) || 'Unknown';
                            return (
                                <li key={booking.id} className="bg-brand-secondary/50 p-3 rounded-lg">
                                    <div className="font-semibold">{equipmentName}</div>
                                    <div className="text-sm text-brand-subtle">{booking.userEmail}</div>
                                    <div className="text-xs text-brand-subtle">Returned: {booking.endDate.toLocaleDateString()}</div>
                                    
                                    {reportingId === booking.id ? (
                                        <div className="mt-3 space-y-2">
                                            <textarea
                                                placeholder="Describe the damage..."
                                                value={damageDescription}
                                                onChange={e => setDamageDescription(e.target.value)}
                                                className="w-full bg-brand-bg text-brand-text p-2 rounded-md text-sm focus:ring-brand-primary focus:border-brand-primary"
                                                rows={3}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={handleCancelReport} className="text-sm bg-brand-secondary py-1 px-3 rounded-md hover:opacity-80">Cancel</button>
                                                <button onClick={handleSaveReport} className="text-sm bg-blue-500 text-white font-bold py-1 px-3 rounded-md hover:bg-blue-400">Save Report</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => onApproveReturn(booking.id)}
                                                className="w-full text-sm bg-green-600 text-white font-bold py-1 px-3 rounded-md hover:bg-green-500 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReportClick(booking.id)}
                                                className="w-full text-sm bg-red-600 text-white font-bold py-1 px-3 rounded-md hover:bg-red-500 transition-colors"
                                            >
                                                Report Damage
                                            </button>
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

export default ReturnedItems;
