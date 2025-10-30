import React, { useState, useRef, useEffect } from 'react';
import { Equipment } from '../types';

interface EquipmentListProps {
  equipment: Equipment[];
  onUpdateEquipmentName: (id: string, newName: string) => void;
}

const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onUpdateEquipmentName }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleEdit = (e: React.MouseEvent, item: Equipment) => {
        e.stopPropagation();
        setEditingId(item.id);
        setTempName(item.name);
        setExpandedId(null);
    };

    const handleSave = () => {
        if (editingId && tempName.trim()) {
            onUpdateEquipmentName(editingId, tempName.trim());
        }
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditingId(null);
        }
    };
    
    const toggleExpand = (id: string) => {
        if (editingId === id) return;
        setExpandedId(prev => (prev === id ? null : id));
    };
    
    return (
    <div className="bg-brand-surface rounded-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Equipment Inventory</h2>
      <div className="overflow-y-auto max-h-64 pr-2">
        <ul className="space-y-1">
          {equipment.map(item => (
            <li key={item.id} className="flex flex-col bg-brand-secondary/30 rounded-md">
              <div 
                className="flex items-center justify-between p-2 hover:bg-brand-secondary/50 group cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                {editingId === item.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="bg-brand-bg text-brand-text p-1 rounded-md w-full"
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span className="truncate flex-grow">{item.name}</span>
                    <div className="flex items-center flex-shrink-0">
                        <button onClick={(e) => handleEdit(e, item)} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-subtle hover:text-brand-primary mr-2" aria-label={`Edit ${item.name}`}>
                            <EditIcon className="w-4 h-4" />
                        </button>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                    </div>
                  </>
                )}
              </div>
              {expandedId === item.id && (
                <div className="p-3 border-t border-brand-secondary/50">
                    <h4 className="font-semibold text-sm mb-2">Damage History:</h4>
                    {item.damageHistory.length > 0 ? (
                        <ul className="space-y-2 text-xs">
                            {item.damageHistory.map((report, index) => (
                                <li key={index} className="bg-brand-bg/50 p-2 rounded">
                                    <p className="font-bold">{report.description}</p>
                                    <p className="text-brand-subtle">
                                        Reported on {report.date.toLocaleDateString()} by {report.reportedByEmail}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-brand-subtle text-xs">No damages reported.</p>
                    )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EquipmentList;
