// src/components/CampaignEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { CampaignDetails } from '@/pages/Dashboard/CampaignsDetailPage';

// 2. Definimos las props del componente
interface CampaignEditorProps {
  campaignDetails: CampaignDetails;
  onSave: (updatedCampaign: CampaignDetails) => void;
}

const CampaignEditor: React.FC<CampaignEditorProps> = ({ campaignDetails, onSave }) => {
  // 3. Referencia para controlar el modal de DaisyUI
  const modalRef = useRef<HTMLDialogElement>(null);

  // 4. Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<CampaignDetails>(campaignDetails);

  // Sincroniza el estado del formulario si la prop de la campaña cambia desde el padre
  useEffect(() => {
    setFormData(campaignDetails);
  }, [campaignDetails]);

  const handleOpenModal = () => {
    // Resetea el formulario con los datos originales al abrir
    setFormData(campaignDetails); 
    modalRef.current?.showModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    modalRef.current?.close(); // Cierra el modal al guardar
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <button className="btn btn-primary" onClick={handleOpenModal}>
        Editar Campaña
      </button>

      {/* Modal de DaisyUI */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Editar Campaña: {campaignDetails.name}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-24"
                required
              />
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Estado</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="Pending">Pendiente</option>
                <option value="Approved">Aprobada</option>
                <option value="Rejected">Rechazada</option>
              </select>
            </div>
            
            {/* Campo "Razón" se muestra solo si el estado es "Rechazada" */}
            <div className="form-control w-full mb-4">
            <label className="label">
                <span className="label-text">Razón</span>
            </label>
            <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-20"
                placeholder="Explica por qué la campaña fue rechazada..."
            />
            </div>

            {/* Acciones del Modal */}
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => modalRef.current?.close()}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CampaignEditor;
