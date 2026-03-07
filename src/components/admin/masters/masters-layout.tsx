"use client";

import { useState } from "react";
import MastersToolbar from "./masters-toolbar";
import MastersTable from "./masters-table";
import MasterModal from "./master-modal";

export default function MastersLayout() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMasterId, setEditingMasterId] = useState<string | null>(null);

  const handleAddMaster = () => {
    setEditingMasterId(null);
    setIsModalOpen(true);
  };

  const handleEditMaster = (id: string) => {
    setEditingMasterId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMasterId(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <MastersToolbar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddClick={handleAddMaster}
      />

      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6">
        <MastersTable
          activeFilter={activeFilter}
          onEditClick={handleEditMaster}
        />
      </div>

      {isModalOpen && (
        <MasterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          masterId={editingMasterId}
        />
      )}
    </div>
  );
}
