// Vehicle brand specialization data

export const vehicleBrandsData = [
  {
    id: 'buick',
    slug: 'buick-repair',
    name: 'Buick',
    tagline: 'Expert Buick Repair & Service in Dallas',
    description: 'Specialized repair and maintenance services for all Buick models. Our technicians have extensive experience with Buick vehicles, from classic models to the latest Enclave, Encore, and Envision SUVs.',
    popularModels: ['Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse', 'Regal'],
    commonServices: [
      'Transmission service and repair',
      'Engine diagnostics and repair',
      'Electrical system troubleshooting',
      'Brake system service',
      'Suspension and steering',
      'AC and heating repair'
    ],
    whyChooseUs: [
      'Factory-level diagnostic equipment',
      'Experience with all Buick models',
      'Quality OEM and aftermarket parts',
      'Competitive pricing vs. dealerships'
    ]
  },
  {
    id: 'chrysler',
    slug: 'chrysler-repair',
    name: 'Chrysler',
    tagline: 'Professional Chrysler Service in Dallas',
    description: 'Complete repair and maintenance for all Chrysler vehicles. From the classic 300 to the versatile Pacifica minivan, we have the expertise to keep your Chrysler running at its best.',
    popularModels: ['300', 'Pacifica', 'Voyager', 'Aspen', 'Town & Country'],
    commonServices: [
      'Engine performance and repair',
      'Transmission diagnostics',
      'Electrical system service',
      'Brake and suspension work',
      'Climate control repair',
      'Preventive maintenance'
    ],
    whyChooseUs: [
      'Chrysler-specific expertise',
      'Advanced diagnostic tools',
      'Honest, transparent pricing',
      'Fast turnaround times'
    ]
  },
  {
    id: 'dodge',
    slug: 'dodge-repair',
    name: 'Dodge',
    tagline: 'Dodge Repair & Performance Service',
    description: 'Expert service for all Dodge vehicles, from powerful muscle cars to reliable trucks and family SUVs. We understand the performance and reliability needs of Dodge owners.',
    popularModels: ['Charger', 'Challenger', 'Durango', 'Ram 1500', 'Grand Caravan', 'Journey'],
    commonServices: [
      'Performance tuning and upgrades',
      'Engine and transmission repair',
      'Brake system service',
      'Suspension and alignment',
      'Electrical diagnostics',
      'AC and heating repair'
    ],
    whyChooseUs: [
      'Performance vehicle expertise',
      'High-performance parts available',
      'Track-ready service options',
      'Experienced with all Dodge models'
    ]
  },
  {
    id: 'fiat',
    slug: 'fiat-repair',
    name: 'Fiat',
    tagline: 'Fiat Repair Specialists in Dallas',
    description: 'Specialized service for Fiat vehicles. Our technicians understand the unique needs of Italian engineering and provide expert care for your Fiat 500, 500X, and other models.',
    popularModels: ['500', '500X', '500L', '124 Spider', 'Abarth'],
    commonServices: [
      'Engine diagnostics and repair',
      'Transmission service',
      'Electrical system troubleshooting',
      'Brake and suspension service',
      'Climate control repair',
      'Scheduled maintenance'
    ],
    whyChooseUs: [
      'European vehicle expertise',
      'Specialized diagnostic equipment',
      'Quality European parts',
      'Understanding of Italian engineering'
    ]
  },
  {
    id: 'jeep',
    slug: 'jeep-repair',
    name: 'Jeep',
    tagline: 'Jeep Service & Off-Road Specialists',
    description: 'Complete service for all Jeep models. Whether you use your Jeep for daily driving or off-road adventures, we have the expertise to keep it trail-ready and reliable.',
    popularModels: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
    commonServices: [
      '4WD and AWD system service',
      'Lift kit installation',
      'Suspension and steering',
      'Engine and transmission repair',
      'Brake system service',
      'Off-road modifications'
    ],
    whyChooseUs: [
      '4x4 and off-road expertise',
      'Modification experience',
      'Trail-ready preparation',
      'All Jeep model knowledge'
    ]
  },
  {
    id: 'ram',
    slug: 'ram-truck-repair',
    name: 'Ram Trucks',
    tagline: 'Ram Truck Repair & Service Experts',
    description: 'Professional service for Ram trucks of all sizes. From light-duty 1500s to heavy-duty 2500 and 3500 models, we provide the expertise your work truck needs.',
    popularModels: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
    commonServices: [
      'Diesel engine service',
      'Transmission and drivetrain',
      'Brake system repair',
      'Suspension and alignment',
      'Electrical diagnostics',
      'Towing package installation'
    ],
    whyChooseUs: [
      'Heavy-duty truck expertise',
      'Diesel engine specialists',
      'Commercial vehicle service',
      'Fleet service available'
    ]
  }
];

// Get brand by slug
export const getBrandBySlug = (slug) => {
  return vehicleBrandsData.find(brand => brand.slug === slug);
};

// Get all brand slugs
export const getAllBrandSlugs = () => {
  return vehicleBrandsData.map(brand => brand.slug);
};

export default vehicleBrandsData;
