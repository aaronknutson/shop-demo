import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useContactForm } from "../hooks/useApi";
import { useToast } from "../contexts/ToastContext";
import { CONTACT_INFO } from "../config/contact";

// Validation schema
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 digits"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

function Contact() {
  const { showSuccess, showError } = useToast();
  const contactMutation = useContactForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      await contactMutation.mutateAsync(data);
      showSuccess("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Auto Shop Demo Dallas | Get in Touch</title>
        <meta
          name='description'
          content='Contact Auto Shop Demo for all your auto repair needs in Dallas, TX. Call, email, or visit us today!'
        />
      </Helmet>

      {/* Page Header */}
      <section className='bg-gradient-primary text-white py-16'>
        <div className='container-custom text-center'>
          <h1 className='mb-4'>Contact Us</h1>
          <p className='text-xl text-gray-100 max-w-3xl mx-auto'>
            Get in touch with us for all your auto repair needs
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div>
              <h2 className='mb-6'>Send Us a Message</h2>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                  <label htmlFor='name' className='label-field'>
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    {...register("name")}
                    className='input-field'
                    placeholder='John Doe'
                  />
                  {errors.name && (
                    <p className='error-message'>{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='email' className='label-field'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    {...register("email")}
                    className='input-field'
                    placeholder='john@example.com'
                  />
                  {errors.email && (
                    <p className='error-message'>{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='phone' className='label-field'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    {...register("phone")}
                    className='input-field'
                    placeholder='(214) 555-0123'
                  />
                  {errors.phone && (
                    <p className='error-message'>{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='message' className='label-field'>
                    Message
                  </label>
                  <textarea
                    id='message'
                    {...register("message")}
                    rows='5'
                    className='textarea-field'
                    placeholder='Tell us how we can help...'></textarea>
                  {errors.message && (
                    <p className='error-message'>{errors.message.message}</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={contactMutation.isPending}
                  className='btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'>
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className='mb-6'>Get in Touch</h2>
              <div className='space-y-6'>
                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaMapMarkerAlt className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Location</h3>
                      <p className='text-gray-700'>
                        {CONTACT_INFO.address.street}
                        <br />
                        {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaPhone className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Phone</h3>
                      <a
                        href={CONTACT_INFO.phone.href}
                        className='text-primary hover:text-primary-dark font-medium'>
                        {CONTACT_INFO.phone.display}
                      </a>
                    </div>
                  </div>
                </div>

                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaEnvelope className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>Email</h3>
                      <a
                        href={CONTACT_INFO.email.href}
                        className='text-primary hover:text-primary-dark font-medium'>
                        {CONTACT_INFO.email.display}
                      </a>
                    </div>
                  </div>
                </div>

                <div className='card'>
                  <div className='flex items-start gap-4'>
                    <FaClock className='text-2xl text-primary mt-1 flex-shrink-0' />
                    <div>
                      <h3 className='text-lg font-semibold mb-2'>
                        Business Hours
                      </h3>
                      <div className='space-y-1 text-gray-700'>
                        <p>
                          <span className='font-medium'>{CONTACT_INFO.hours.weekday.days}:</span>{" "}
                          {CONTACT_INFO.hours.weekday.hours}
                        </p>
                        <p>
                          <span className='font-medium'>{CONTACT_INFO.hours.saturday.days}:</span>{" "}
                          {CONTACT_INFO.hours.saturday.hours}
                        </p>
                        <p>
                          <span className='font-medium'>{CONTACT_INFO.hours.sunday.days}:</span>{" "}
                          {CONTACT_INFO.hours.sunday.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
