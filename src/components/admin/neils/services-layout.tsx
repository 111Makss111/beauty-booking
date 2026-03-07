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
    <div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-500">
      <ServicesToolbar
        selectedCategory="all"
        onCategoryChange={() => {}}
        showOnlyActive={showOnlyActive}
        onActiveToggle={setShowOnlyActive}
        onAddClick={handleAddService}
      />

      <div className="bg-transparent lg:bg-white/60 lg:backdrop-blur-md rounded-none lg:rounded-[2rem] border-0 lg:border border-white shadow-none lg:shadow-sm p-0 lg:p-6">
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
