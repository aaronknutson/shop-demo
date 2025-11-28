import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FaCalendar,
  FaClock,
  FaCar,
  FaWrench,
  FaCheckCircle,
} from "react-icons/fa";
import { useToast } from "../contexts/ToastContext";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";
import { format, addDays, isSunday } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const schema = yup.object({
  customerName: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 digits"),
  vehicleMake: yup.string(),
  vehicleModel: yup.string(),
  vehicleYear: yup
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  serviceType: yup.string().required("Service type is required"),
  appointmentDate: yup.date().required("Date is required"),
  appointmentTime: yup.string().required("Please select a time slot"),
  notes: yup.string().max(1000),
});

const serviceTypes = [
  "Oil Change",
  "Brake Service",
  "Engine Diagnostics",
  "Transmission Service",
  "AC/Heating Service",
  "Alignment",
  "Tire Service",
  "General Maintenance",
  "Other",
];

function Appointments() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const { showSuccess: showSuccessToast, showError } = useToast();
  const { customer, isAuthenticated, getAuthAxios } = useCustomerAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedDate = watch("appointmentDate");
  const watchedVehicleYear = watch("vehicleYear");
  const watchedVehicleMake = watch("vehicleMake");
  const watchedVehicleModel = watch("vehicleModel");

  // Load customer data and vehicles when authenticated
  useEffect(() => {
    if (isAuthenticated && customer) {
      // Auto-fill customer information
      const fullName = `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();
      setValue("customerName", fullName);
      setValue("email", customer.email || "");
      setValue("phone", customer.phone || "");

      // Load vehicles
      loadVehicles();
    }
  }, [isAuthenticated, customer]);

  // Load available slots when date changes
  useEffect(() => {
    if (watchedDate) {
      loadAvailableSlots(watchedDate);
    }
  }, [watchedDate]);

  const loadVehicles = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get("/customer/vehicles");

      if (response.data.success) {
        const vehiclesList = response.data.data;
        setVehicles(vehiclesList);

        // Find primary vehicle or use first vehicle
        const primaryVehicle =
          vehiclesList.find((v) => v.isPrimary) || vehiclesList[0];

        if (primaryVehicle) {
          setSelectedVehicleId(primaryVehicle.id);
          // Auto-fill vehicle information
          setValue("vehicleYear", primaryVehicle.year, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("vehicleMake", primaryVehicle.make, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("vehicleModel", primaryVehicle.model, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      // Don't show error toast as this is optional
    }
  };

  const loadAvailableSlots = async (date) => {
    try {
      setLoadingSlots(true);
      const response = await axios.get(
        `${API_BASE}/appointments/available-slots`,
        {
          params: { date: format(new Date(date), "yyyy-MM-dd") },
        }
      );

      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
        setSelectedDate(date);
      }
    } catch (error) {
      console.error("Failed to load available slots:", error);
      showError("Failed to load available time slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (vehicle) {
      setValue("vehicleYear", vehicle.year, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("vehicleMake", vehicle.make, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("vehicleModel", vehicle.model, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Prepare request headers - include customer token if authenticated
      const headers = {};
      if (isAuthenticated) {
        const token = localStorage.getItem('customerToken');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await axios.post(`${API_BASE}/appointments`, data, { headers });

      if (response.data.success) {
        setBookedAppointment(response.data.data.appointment);
        setShowSuccess(true);
        showSuccessToast("Appointment booked successfully!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to book appointment";
      showError(errorMessage);
    }
  };

  const handleSelectTimeSlot = (time) => {
    setValue("appointmentTime", time, { shouldValidate: true });
  };

  const resetForm = () => {
    setShowSuccess(false);
    setBookedAppointment(null);
    window.location.reload();
  };

  if (showSuccess && bookedAppointment) {
    return (
      <>
        <Helmet>
          <title>Appointment Confirmed - Auto Shop Demo</title>
        </Helmet>

        <div className='min-h-screen bg-gray-50 section-padding'>
          <div className='container-custom max-w-2xl'>
            <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6'>
                <FaCheckCircle className='text-green-600 text-3xl' />
              </div>

              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Appointment Confirmed!
              </h1>

              <p className='text-lg text-gray-600 mb-8'>
                Thank you for booking with Auto Shop Demo. We've received your
                appointment request and will contact you shortly to confirm.
              </p>

              <div className='bg-gray-50 rounded-lg p-6 mb-8 text-left'>
                <h2 className='font-semibold text-gray-900 mb-4'>
                  Appointment Details:
                </h2>
                <div className='space-y-3 text-gray-700'>
                  <div className='flex items-center space-x-3'>
                    <FaCalendar className='text-primary' />
                    <span>
                      {format(
                        new Date(bookedAppointment.appointmentDate),
                        "EEEE, MMMM dd, yyyy"
                      )}
                    </span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <FaClock className='text-primary' />
                    <span>{bookedAppointment.appointmentTime}</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <FaWrench className='text-primary' />
                    <span>{bookedAppointment.serviceType}</span>
                  </div>
                  {bookedAppointment.vehicleMake && (
                    <div className='flex items-center space-x-3'>
                      <FaCar className='text-primary' />
                      <span>
                        {bookedAppointment.vehicleYear}{" "}
                        {bookedAppointment.vehicleMake}{" "}
                        {bookedAppointment.vehicleModel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <p className='text-sm text-gray-600'>
                  A confirmation email has been sent to{" "}
                  <strong>{bookedAppointment.email}</strong>
                </p>

                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button onClick={resetForm} className='btn btn-primary'>
                    Book Another Appointment
                  </button>
                  <a href='/' className='btn btn-outline'>
                    Return to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book an Appointment - Auto Shop Demo</title>
        <meta
          name='description'
          content='Schedule your auto service appointment online. Choose your preferred date and time for professional car care at Auto Shop Demo in Dallas, TX.'
        />
      </Helmet>

      <div className='min-h-screen bg-gray-50 section-padding'>
        <div className='container-custom max-w-4xl'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='mb-4'>Book an Appointment</h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Schedule your service appointment online. Choose your preferred
              date and time, and we'll take care of the rest.
            </p>
          </div>

          {/* Appointment Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='bg-white rounded-lg shadow-lg p-8'>
            {/* Personal Information */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Your Information
              </h2>
              {isAuthenticated && (
                <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800'>
                  Your account information has been auto-filled but you can edit
                  it if needed.
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label htmlFor='customerName' className='label-required'>
                    Name
                  </label>
                  <input
                    type='text'
                    id='customerName'
                    {...register("customerName")}
                    className={`input ${
                      errors.customerName ? "input-error" : ""
                    }`}
                    placeholder='John Doe'
                  />
                  {errors.customerName && (
                    <p className='error-message'>
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='email' className='label-required'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    {...register("email")}
                    className={`input ${errors.email ? "input-error" : ""}`}
                    placeholder='john@example.com'
                  />
                  {errors.email && (
                    <p className='error-message'>{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='phone' className='label-required'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    {...register("phone")}
                    className={`input ${errors.phone ? "input-error" : ""}`}
                    placeholder='214-555-0123'
                  />
                  {errors.phone && (
                    <p className='error-message'>{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Vehicle Information
              </h2>

              {/* Vehicle Selector - Only show if logged in and has multiple vehicles */}
              {isAuthenticated && vehicles.length > 1 && (
                <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <label
                    htmlFor='vehicleSelector'
                    className='block text-sm font-semibold text-gray-700 mb-2'>
                    Select Your Vehicle
                  </label>
                  <select
                    id='vehicleSelector'
                    value={selectedVehicleId || ""}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    className='input'>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                        {vehicle.isPrimary ? " (Primary)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className='text-xs text-gray-600 mt-2'>
                    Vehicle details will be auto-filled but you can edit them if
                    needed
                  </p>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label
                    htmlFor='vehicleYear'
                    className='block text-sm font-semibold text-gray-700 mb-2'>
                    Year
                  </label>
                  <select
                    id='vehicleYear'
                    {...register("vehicleYear")}
                    value={watchedVehicleYear || ""}
                    onChange={(e) =>
                      setValue("vehicleYear", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className='input'>
                    <option value=''>Select year</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1899 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor='vehicleMake' className='label'>
                    Make
                  </label>
                  <input
                    type='text'
                    id='vehicleMake'
                    {...register("vehicleMake")}
                    value={watchedVehicleMake || ""}
                    onChange={(e) =>
                      setValue("vehicleMake", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className='input'
                    placeholder='Toyota'
                  />
                </div>

                <div>
                  <label htmlFor='vehicleModel' className='label'>
                    Model
                  </label>
                  <input
                    type='text'
                    id='vehicleModel'
                    {...register("vehicleModel")}
                    value={watchedVehicleModel || ""}
                    onChange={(e) =>
                      setValue("vehicleModel", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className='input'
                    placeholder='Camry'
                  />
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div className='mb-8'>
              <label htmlFor='serviceType' className='label-required'>
                Service Type
              </label>
              <select
                id='serviceType'
                {...register("serviceType")}
                className={`input ${errors.serviceType ? "input-error" : ""}`}>
                <option value=''>Select a service</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className='error-message'>{errors.serviceType.message}</p>
              )}
            </div>

            {/* Date Selection */}
            <div className='mb-8'>
              <label htmlFor='appointmentDate' className='label-required'>
                Preferred Date
              </label>
              <Controller
                control={control}
                name='appointmentDate'
                render={({ field }) => {
                  // Parse date string to Date object properly to avoid timezone issues
                  const parseDate = (dateStr) => {
                    if (!dateStr) return null;
                    const [year, month, day] = dateStr.split("-").map(Number);
                    return new Date(year, month - 1, day);
                  };

                  return (
                    <DatePicker
                      selected={field.value ? parseDate(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          field.onChange(formattedDate);
                          setSelectedDate(formattedDate);
                        } else {
                          field.onChange(null);
                          setSelectedDate(null);
                        }
                      }}
                      filterDate={(date) => !isSunday(date)}
                      minDate={new Date()}
                      maxDate={addDays(new Date(), 60)}
                      dateFormat='EEEE, MMMM dd, yyyy'
                      placeholderText='Click to select a date'
                      className={`input w-full ${
                        errors.appointmentDate ? "input-error" : ""
                      }`}
                      calendarClassName='custom-calendar'
                      wrapperClassName='w-full'
                      showPopperArrow={false}
                      autoComplete='off'
                    />
                  );
                }}
              />
              {errors.appointmentDate && (
                <p className='error-message'>
                  {errors.appointmentDate.message}
                </p>
              )}
              <p className='text-sm text-gray-500 mt-2'>
                <FaCalendar className='inline mr-1' />
                Select any date Monday - Saturday (We're closed Sundays)
              </p>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className='mb-8'>
                <label className='label-required'>Available Time Slots</label>
                {loadingSlots ? (
                  <div className='flex items-center justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className='text-gray-500 py-4'>
                    No available slots for this date. Please select another
                    date.
                  </p>
                ) : (
                  <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        type='button'
                        onClick={() => handleSelectTimeSlot(time)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          watch("appointmentTime") === time
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary hover:bg-primary/5"
                        }`}>
                        {time}
                      </button>
                    ))}
                  </div>
                )}
                {errors.appointmentTime && (
                  <p className='error-message mt-2'>
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            )}

            {/* Additional Notes */}
            <div className='mb-8'>
              <label htmlFor='notes' className='label'>
                Additional Notes
              </label>
              <textarea
                id='notes'
                {...register("notes")}
                rows='4'
                className='input'
                placeholder='Any specific concerns or requests?'></textarea>
            </div>

            {/* Submit Button */}
            <div className='flex items-center justify-between'>
              <p className='text-sm text-gray-600'>
                We'll contact you to confirm your appointment
              </p>
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary btn-lg'>
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className='mt-8 bg-blue-50 rounded-lg p-6'>
            <h3 className='font-semibold text-gray-900 mb-2'>
              What happens next?
            </h3>
            <ul className='space-y-2 text-gray-700'>
              <li>✓ You'll receive a confirmation email immediately</li>
              <li>
                ✓ Our team will contact you within 24 hours to confirm your
                appointment
              </li>
              <li>✓ You'll receive a reminder before your scheduled service</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointments;
