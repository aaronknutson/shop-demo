// Maintenance tips and automotive advice

export const maintenanceTipsData = [
  {
    id: 1,
    slug: 'when-to-change-oil',
    title: 'When to Change Your Engine Oil',
    category: 'Maintenance',
    excerpt: 'Learn the optimal oil change intervals for your vehicle and why regular oil changes are crucial for engine health.',
    content: `
# When to Change Your Engine Oil

Regular oil changes are one of the most important maintenance tasks for your vehicle. Here's what you need to know:

## Recommended Intervals

- **Conventional Oil**: Every 3,000-5,000 miles
- **Synthetic Blend**: Every 5,000-7,500 miles
- **Full Synthetic**: Every 7,500-10,000 miles

## Factors That Affect Oil Change Frequency

- **Driving Conditions**: Stop-and-go traffic, short trips, or towing requires more frequent changes
- **Climate**: Extreme heat or cold can affect oil breakdown
- **Vehicle Age**: Older vehicles may need more frequent oil changes
- **Driving Style**: Aggressive driving degrades oil faster

## Signs You Need an Oil Change

- Dark, dirty oil on the dipstick
- Engine noise or knocking
- Oil change light is on
- Excessive exhaust smoke
- Oil smell inside the cabin

Always consult your owner's manual for manufacturer-specific recommendations.
    `,
    readTime: '3 min read',
    tags: ['oil change', 'maintenance', 'engine care']
  },
  {
    id: 2,
    slug: 'brake-warning-signs',
    title: 'Warning Signs Your Brakes Need Attention',
    category: 'Safety',
    excerpt: "Don't ignore these critical warning signs that indicate your brakes need professional inspection.",
    content: `
# Warning Signs Your Brakes Need Attention

Your brakes are your vehicle's most important safety system. Watch for these warning signs:

## Audible Signs

- **Squealing or Squeaking**: Often indicates worn brake pads
- **Grinding**: Metal-on-metal contact - immediate attention needed
- **Clicking**: Could indicate loose brake hardware

## Physical Signs

- **Vibration**: Warped rotors need resurfacing or replacement
- **Soft Pedal**: May indicate air in brake lines or fluid leak
- **Hard Pedal**: Could signal vacuum or booster issues
- **Pulling**: Uneven brake wear or caliper problems

## Visual Indicators

- Brake warning light illuminated
- Visible brake pad wear (less than 1/4 inch remaining)
- Brake fluid leaks under the vehicle
- Rusty or scored rotors

## What To Do

If you notice any of these signs, schedule a brake inspection immediately. Delaying brake service can lead to:

- Reduced stopping power
- Longer stopping distances
- More expensive repairs
- Safety hazards

We recommend brake inspections at least annually or every 12,000 miles.
    `,
    readTime: '4 min read',
    tags: ['brakes', 'safety', 'warning signs']
  },
  {
    id: 3,
    slug: 'check-engine-light-guide',
    title: 'What Your Check Engine Light Really Means',
    category: 'Diagnostics',
    excerpt: 'Understanding check engine light codes and when you should be concerned.',
    content: `
# What Your Check Engine Light Really Means

The check engine light can indicate various issues. Here's what you need to know:

## Types of Check Engine Lights

- **Steady Light**: Issue detected, schedule diagnosis soon
- **Flashing Light**: Severe problem, stop driving immediately
- **Light Turns Off**: Temporary issue, but still get it checked

## Common Causes

### Minor Issues
- Loose gas cap
- Faulty oxygen sensor
- Mass airflow sensor problems
- Spark plug issues

### Serious Issues
- Catalytic converter failure
- Transmission problems
- Major engine damage
- Emissions system failure

## What To Do

1. **Don't Panic**: Not always an emergency
2. **Check Gas Cap**: Ensure it's tight
3. **Note Symptoms**: Any performance changes?
4. **Get Diagnosed**: Professional scan within a week
5. **Flashing Light**: Stop driving immediately

## Why Professional Diagnosis Matters

- Multiple codes may be present
- Related vs. unrelated issues
- Accurate code interpretation
- Prevent unnecessary repairs

We offer comprehensive diagnostic services with detailed explanations of all issues found.
    `,
    readTime: '5 min read',
    tags: ['diagnostics', 'check engine light', 'troubleshooting']
  },
  {
    id: 4,
    slug: 'tire-maintenance-guide',
    title: 'Essential Tire Maintenance Tips',
    category: 'Maintenance',
    excerpt: 'Proper tire care extends tire life, improves fuel economy, and keeps you safe.',
    content: `
# Essential Tire Maintenance Tips

Proper tire maintenance is crucial for safety and vehicle performance.

## Regular Checks

### Tire Pressure
- Check monthly and before long trips
- Use recommended PSI (found on door jamb sticker)
- Check when tires are cold
- Don't forget the spare tire

### Tread Depth
- Legal minimum: 2/32 inch
- Safe minimum: 4/32 inch
- Use penny test: Insert penny into tread; if you see Lincoln's head, replace tire

### Visual Inspection
- Cracks or bulges in sidewalls
- Uneven wear patterns
- Objects embedded in tread
- Valve stem condition

## Tire Rotation

- Every 5,000-7,500 miles
- Promotes even wear
- Extends tire life
- Improves handling

## Alignment

Get alignment checked if you notice:
- Vehicle pulling to one side
- Uneven tire wear
- Steering wheel off-center
- After hitting curb or pothole

## When to Replace

Replace tires when:
- Tread depth below 4/32 inch
- Age over 6 years (regardless of tread)
- Visible damage or bulges
- Excessive or uneven wear

Proper tire maintenance can extend tire life by 25% or more while keeping you safer on the road.
    `,
    readTime: '4 min read',
    tags: ['tires', 'maintenance', 'safety']
  },
  {
    id: 5,
    slug: 'winter-car-prep',
    title: 'Preparing Your Car for Winter',
    category: 'Seasonal',
    excerpt: 'Essential steps to winterize your vehicle for cold weather driving.',
    content: `
# Preparing Your Car for Winter

Get your vehicle ready for winter weather with these essential steps:

## Battery Check

- Cold weather reduces battery capacity
- Have battery tested if over 3 years old
- Clean terminals and connections
- Keep battery charged

## Cooling System

- Check antifreeze concentration (should protect to -30°F)
- Inspect hoses and belts
- Test thermostat operation
- Flush system if needed

## Tires

- Consider winter tires in harsh climates
- Check tread depth (critical for snow/ice)
- Maintain proper inflation (decreases in cold)
- All-season tires minimum in moderate climates

## Fluids

- Use winter-grade windshield washer fluid
- Check oil viscosity for cold weather
- Top off all fluids
- Replace wiper blades

## Emergency Kit

Keep in your vehicle:
- Blanket and warm clothes
- Flashlight with batteries
- Ice scraper and snow brush
- Jumper cables
- Sand or cat litter for traction
- Phone charger
- Water and snacks

## Before Winter Hits

Schedule a pre-winter inspection to catch potential issues before they leave you stranded in the cold.
    `,
    readTime: '5 min read',
    tags: ['winter', 'seasonal', 'preparation']
  }
];

// Get tip by slug
export const getTipBySlug = (slug) => {
  return maintenanceTipsData.find(tip => tip.slug === slug);
};

// Get tips by category
export const getTipsByCategory = (category) => {
  return maintenanceTipsData.filter(tip => tip.category === category);
};

export default maintenanceTipsData;
