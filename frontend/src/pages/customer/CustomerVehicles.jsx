import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCar, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { useToast } from '../../contexts/ToastContext';

const vehicleSchema = yup.object({
  year: yup.number().min(1900).max(new Date().getFullYear() + 1).required('Year is required'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  vin: yup.string(),
  licensePlate: yup.string(),
  mileage: yup.number().min(0),
  notes: yup.string(),
  isPrimary: yup.boolean(),
});

function CustomerVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const { getAuthAxios } = useCustomerAuth();
  const { showToast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(vehicleSchema),
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const axios = getAuthAxios();
      const response = await axios.get('/customer/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      showToast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const axios = getAuthAxios();
      if (editingVehicle) {
        await axios.patch(`/customer/vehicles/${editingVehicle.id}`, data);
        showToast('Vehicle updated successfully', 'success');
      } else {
        await axios.post('/customer/vehicles', data);
        showToast('Vehicle added successfully', 'success');
      }
      closeModal();
      loadVehicles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save vehicle', 'error');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    reset(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const axios = getAuthAxios();
      await axios.delete(`/customer/vehicles/${id}`);
      showToast('Vehicle deleted successfully', 'success');
      loadVehicles();
    } catch (error) {
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    reset({ isPrimary: false });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Vehicles - Customer Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaPlus />
            <span>Add Vehicle</span>
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FaCar className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
            <p className="text-gray-600 mb-4">Add your first vehicle to get started</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {vehicle.isPrimary && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      <FaStar className="text-xs" />
                      <span>Primary</span>
                    </span>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FaCar className="text-3xl text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
                      {vehicle.licensePlate && <p>License: {vehicle.licensePlate}</p>}
                      {vehicle.mileage && <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>}
                      {vehicle.notes && <p className="text-gray-500 italic">{vehicle.notes}</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input {...register('year')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input {...register('make')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  {errors.make && <p className="text-xs text-red-600 mt-1">{errors.make.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input {...register('model')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                {errors.model && <p className="text-xs text-red-600 mt-1">{errors.model.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN (optional)</label>
                <input {...register('vin')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate (optional)</label>
                <input {...register('licensePlate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (optional)</label>
                <input {...register('mileage')} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea {...register('notes')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex items-center">
                <input {...register('isPrimary')} type="checkbox" className="mr-2" />
                <label className="text-sm text-gray-700">Set as primary vehicle</label>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  {editingVehicle ? 'Update' : 'Add'} Vehicle
                </button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerVehicles;
