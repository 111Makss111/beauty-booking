"use client";

import { useState } from "react";
import ServicesToolbar from "./services-toolbar";
import ServicesTable from "./services-table";
import ServiceModal from "./service-modal";

export default function ServicesLayout() {
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const handleAddService = () => {
    setEditingServiceId(null);
    setIsModalOpen(true);
  };

  const handleEditService = (id: string) => {
    setEditingServiceId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServiceId(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <ServicesToolbar
        selectedCategory="all"
        onCategoryChange={() => {}}
        showOnlyActive={showOnlyActive}
        onActiveToggle={setShowOnlyActive}
        onAddClick={handleAddService}
      />

      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6">
        <ServicesTable
          showOnlyActive={showOnlyActive}
          onEditClick={handleEditService}
        />
      </div>

      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          serviceId={editingServiceId}
        />
      )}
    </div>
  );
}
