import React from 'react';
import { Equipment, Booking } from '../types';
import EquipmentList from './EquipmentList';
import OverdueItems from './OverdueItems';
import ReturnedItems from './ReturnedItems';

interface SidePanelProps {
  equipment: Equipment[];
  overdueItems: Booking[];
  returnedItems: Booking[];
  onUpdateEquipmentName: (id: string, newName: string) => void;
  onApproveReturn: (bookingId: string) => void;
  onReportDamage: (bookingId: string, description: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ equipment, overdueItems, returnedItems, onUpdateEquipmentName, onApproveReturn, onReportDamage }) => {
  return (
    <aside className="w-full lg:w-96 lg:max-w-sm flex-shrink-0 flex flex-col gap-8">
      <EquipmentList
        equipment={equipment}
        onUpdateEquipmentName={onUpdateEquipmentName}
      />
      <OverdueItems
        overdueItems={overdueItems}
        equipmentList={equipment}
      />
      <ReturnedItems
        returnedItems={returnedItems}
        equipmentList={equipment}
        onApproveReturn={onApproveReturn}
        onReportDamage={onReportDamage}
      />
    </aside>
  );
};

export default SidePanel;
