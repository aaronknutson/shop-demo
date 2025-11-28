const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDemoCustomer() {
  try {
    console.log('Creating demo customer account...');

    // Check if demo customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: 'demo@customer.com' },
    });

    if (existingCustomer) {
      console.log('Demo customer already exists!');
      console.log('Email: demo@customer.com');
      console.log('Password: Demo123!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Demo123!', 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: 'demo@customer.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '214-555-0123',
        active: true,
      },
    });

    console.log('Demo customer created successfully!');
    console.log('ID:', customer.id);

    // Create sample vehicles
    const vehicle1 = await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        year: 2018,
        make: 'Toyota',
        model: 'Camry',
        vin: '4T1B11HK5JU123456',
        licensePlate: 'ABC1234',
        mileage: 65000,
        isPrimary: true,
        notes: 'Daily driver',
      },
    });

    const vehicle2 = await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        year: 2015,
        make: 'Honda',
        model: 'Civic',
        vin: '2HGFB2F56FH123456',
        licensePlate: 'XYZ5678',
        mileage: 82000,
        isPrimary: false,
        notes: 'Spouse vehicle',
      },
    });

    console.log('Created 2 sample vehicles');

    // Create sample service history
    const serviceHistory = await prisma.serviceRecord.createMany({
      data: [
        {
          customerId: customer.id,
          serviceDate: new Date('2024-10-15'),
          serviceType: 'Oil Change',
          description: 'Conventional oil change with filter replacement',
          mileage: 63000,
          cost: 45.99,
          vehicleInfo: '2018 Toyota Camry',
          technician: 'Mike Johnson',
          notes: 'Recommended tire rotation at next service',
        },
        {
          customerId: customer.id,
          serviceDate: new Date('2024-08-20'),
          serviceType: 'Brake Service',
          description: 'Front brake pad replacement and rotor resurfacing',
          mileage: 60500,
          cost: 285.00,
          vehicleInfo: '2018 Toyota Camry',
          technician: 'Sarah Martinez',
          notes: 'Rear brakes at 40% - monitor for next service',
        },
        {
          customerId: customer.id,
          serviceDate: new Date('2024-06-05'),
          serviceType: 'AC Service',
          description: 'AC system inspection and recharge',
          mileage: 58000,
          cost: 125.00,
          vehicleInfo: '2018 Toyota Camry',
          technician: 'Mike Johnson',
          notes: 'System cooling properly',
        },
        {
          customerId: customer.id,
          serviceDate: new Date('2024-09-10'),
          serviceType: 'Oil Change',
          description: 'Synthetic oil change with filter replacement',
          mileage: 80000,
          cost: 65.99,
          vehicleInfo: '2015 Honda Civic',
          technician: 'Carlos Rodriguez',
          notes: 'All fluids checked and topped off',
        },
        {
          customerId: customer.id,
          serviceDate: new Date('2024-07-15'),
          serviceType: 'Tire Service',
          description: 'Tire rotation and wheel balance',
          mileage: 78500,
          cost: 55.00,
          vehicleInfo: '2015 Honda Civic',
          technician: 'Sarah Martinez',
          notes: 'Tread depth good on all tires',
        },
      ],
    });

    console.log('Created 5 sample service records');

    // Create a future appointment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        customerName: 'John Doe',
        email: 'demo@customer.com',
        phone: '214-555-0123',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vehicleYear: 2018,
        serviceType: 'Oil Change',
        appointmentDate: futureDate,
        appointmentTime: '10:00',
        duration: 60,
        notes: 'Request synthetic oil',
        status: 'confirmed',
      },
    });

    console.log('Created upcoming appointment');

    console.log('\n========================================');
    console.log('Demo Customer Account Details:');
    console.log('========================================');
    console.log('Email: demo@customer.com');
    console.log('Password: Demo123!');
    console.log('Name: John Doe');
    console.log('Phone: 214-555-0123');
    console.log('Vehicles: 2 (2018 Toyota Camry, 2015 Honda Civic)');
    console.log('Service Records: 5');
    console.log('Upcoming Appointments: 1');
    console.log('========================================');

  } catch (error) {
    console.error('Error creating demo customer:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoCustomer();
