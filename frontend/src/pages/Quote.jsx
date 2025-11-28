import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuoteRequest } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';

// Validation schema
const quoteSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  vehicleMake: yup.string(),
  vehicleModel: yup.string(),
  vehicleYear: yup.number().integer().min(1900).max(new Date().getFullYear() + 1),
  serviceType: yup.string().required('Service type is required'),
  preferredDate: yup.date(),
  message: yup.string()
});

function Quote() {
  const { showSuccess, showError } = useToast();
  const quoteMutation = useQuoteRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(quoteSchema)
  });

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Engine Repair',
    'Transmission Service',
    'AC/Heating',
    'Diagnostics',
    'Alignment',
    'State Inspection',
    'Electrical System',
    'Preventive Maintenance',
    'Other'
  ];

  const onSubmit = async (data) => {
    try {
      await quoteMutation.mutateAsync(data);
      showSuccess('Quote request submitted successfully! We\'ll contact you shortly.');
      reset();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit quote request. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Get a Free Quote - Auto Shop Demo Dallas</title>
        <meta name="description" content="Request a free quote for auto repair services from Auto Shop Demo in Dallas, TX. Fast, honest estimates for all your car care needs." />
      </Helmet>

      {/* Page Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="mb-4">Request a Quote</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Get a free, no-obligation quote for your auto repair needs
          </p>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="label-field">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="input-field"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="error-message">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="label-field">Email</label>
                        <input
                          type="email"
                          id="email"
                          {...register('email')}
                          className="input-field"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="error-message">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="label-field">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          {...register('phone')}
                          className="input-field"
                          placeholder="(214) 555-0123"
                        />
                        {errors.phone && (
                          <p className="error-message">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Vehicle Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="vehicleYear" className="label-field">Year</label>
                      <input
                        type="number"
                        id="vehicleYear"
                        {...register('vehicleYear')}
                        className="input-field"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                      {errors.vehicleYear && (
                        <p className="error-message">{errors.vehicleYear.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vehicleMake" className="label-field">Make</label>
                      <input
                        type="text"
                        id="vehicleMake"
                        {...register('vehicleMake')}
                        className="input-field"
                        placeholder="Toyota"
                      />
                    </div>

                    <div>
                      <label htmlFor="vehicleModel" className="label-field">Model</label>
                      <input
                        type="text"
                        id="vehicleModel"
                        {...register('vehicleModel')}
                        className="input-field"
                        placeholder="Camry"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Service Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="serviceType" className="label-field">Service Type</label>
                      <select
                        id="serviceType"
                        {...register('serviceType')}
                        className="input-field"
                      >
                        <option value="">Select a service...</option>
                        {serviceTypes.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      {errors.serviceType && (
                        <p className="error-message">{errors.serviceType.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="preferredDate" className="label-field">Preferred Date (Optional)</label>
                      <input
                        type="date"
                        id="preferredDate"
                        {...register('preferredDate')}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="label-field">Additional Details (Optional)</label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows="4"
                        className="textarea-field"
                        placeholder="Describe the issue or service needed..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={quoteMutation.isPending}
                  className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {quoteMutation.isPending ? 'Submitting...' : 'Request Quote'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Quote;
