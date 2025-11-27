const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - comment out if you want to preserve data)
  await prisma.tip.deleteMany();
  await prisma.review.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.contact.deleteMany();

  // Seed Reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        name: 'John Smith',
        comment: 'Excellent service! They diagnosed my transmission issue quickly and had me back on the road in no time. Very professional and fair pricing.',
        rating: 5,
        service: 'Transmission Service',
        approved: true
      }
    }),
    prisma.review.create({
      data: {
        name: 'Sarah Johnson',
        comment: 'I have been bringing my car here for years. Always reliable, honest, and they stand behind their work. Highly recommend!',
        rating: 5,
        service: 'General Maintenance',
        approved: true
      }
    }),
    prisma.review.create({
      data: {
        name: 'Michael Rodriguez',
        comment: 'Great experience with brake service. They explained everything clearly and the price was very reasonable. Will definitely be back.',
        rating: 5,
        service: 'Brake Service',
        approved: true
      }
    }),
    prisma.review.create({
      data: {
        name: 'Emily Chen',
        comment: 'Best auto repair in the city! They fixed my AC quickly and efficiently. The staff is friendly and knowledgeable.',
        rating: 5,
        service: 'AC/Heating',
        approved: true
      }
    }),
    prisma.review.create({
      data: {
        name: 'David Thompson',
        comment: 'Honest and trustworthy mechanics. They took the time to show me exactly what was wrong and gave me options. Very impressed!',
        rating: 5,
        service: 'Diagnostics',
        approved: true
      }
    }),
    prisma.review.create({
      data: {
        name: 'Lisa Martinez',
        comment: 'I appreciate their transparency and excellent customer service. They go above and beyond to make sure you understand what your vehicle needs.',
        rating: 5,
        service: 'Engine Repair',
        approved: true
      }
    })
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);

  // Seed Coupons
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);

  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        title: '$20 Off Oil Change',
        description: 'Get $20 off your next oil change service. Includes up to 5 quarts of standard oil and filter replacement.',
        discount: '$20 off',
        code: 'OIL20',
        expiresAt: futureDate,
        active: true
      }
    }),
    prisma.coupon.create({
      data: {
        title: '10% Off Brake Service',
        description: 'Save 10% on any brake service including pads, rotors, and brake fluid replacement.',
        discount: '10% off',
        code: 'BRAKE10',
        expiresAt: futureDate,
        active: true
      }
    }),
    prisma.coupon.create({
      data: {
        title: 'Free Diagnostic with Repair',
        description: 'Receive a free diagnostic service when you complete any repair over $100.',
        discount: 'Free Diagnostic',
        code: 'DIAG100',
        expiresAt: futureDate,
        active: true
      }
    }),
    prisma.coupon.create({
      data: {
        title: '$50 Off AC Service',
        description: 'Get $50 off complete AC system service including recharge and leak detection.',
        discount: '$50 off',
        code: 'AC50',
        expiresAt: futureDate,
        active: true
      }
    }),
    prisma.coupon.create({
      data: {
        title: '15% Off First Visit',
        description: 'New customers receive 15% off their first service. Cannot be combined with other offers.',
        discount: '15% off',
        code: 'WELCOME15',
        expiresAt: futureDate,
        active: true
      }
    })
  ]);

  console.log(`✅ Created ${coupons.length} coupons`);

  // Seed Tips
  const tips = await Promise.all([
    prisma.tip.create({
      data: {
        slug: 'what-your-motor-oil-color-says-about-your-engine-health',
        title: 'What Your Motor Oil Color Says About Your Engine Health',
        category: 'Repair Tips',
        excerpt: 'Motor oil is essential to your engine\'s performance—it lubricates internal components, reduces friction, and helps regulate temperature. Without it, your vehicle simply wouldn\'t run.',
        content: `That's why staying on top of routine oil changes is one of the most important parts of preventive maintenance. One useful way to monitor your engine's condition is by observing the color and texture of your motor oil. Different oil colors can signal a variety of things, from normal wear to serious mechanical issues that need to be addressed quickly.

### Fresh, Amber-Colored Oil
Brand-new motor oil typically has a clear, amber or golden color and pours with a smooth, moderately thin consistency. This is exactly what you want to see right after an oil change. It means the oil is clean and ready to protect your engine from heat and friction.

### Dark and Thick Oil
If you're using a synthetic or synthetic-blend oil, you may notice it looks darker even when fresh. That's normal. However, if your conventional oil has turned very dark brown or black and has thickened significantly, it's a sign that the oil has broken down and accumulated dirt, carbon deposits, and other contaminants. This is your cue that an oil change is overdue. Continuing to drive with old, dirty oil can lead to sludge buildup and reduced engine performance.

### Milky or Frothy Oil
Oil that appears milky, frothy, or creamy in color is a major warning sign. This usually means coolant has mixed with the oil, often due to a blown head gasket, a cracked engine block, or a damaged oil cooler. If you see this, stop driving immediately and have your vehicle inspected by a professional. Driving with contaminated oil can cause severe engine damage.

### Time for an Oil Check?
Whether it's clean and amber or milky and thick, the appearance of your engine oil says a lot about your vehicle's health. Bring your vehicle in for a quick inspection or schedule an oil change today. Our team at Auto Shop Demo is here to help keep your engine running smoothly.`,
        readTime: '1.9 min read',
        tags: ['oil', 'engine', 'maintenance', 'color', 'check'],
        published: true
      }
    }),
    prisma.tip.create({
      data: {
        slug: 'what-happens-during-an-oil-change',
        title: 'What Happens During An Oil Change?',
        category: 'Repair Tips',
        excerpt: 'Ever wonder what exactly happens when you bring your car in for an oil change? Well, it\'s not just about switching out the old for new—it\'s about giving your car a little TLC to keep it running happily.',
        content: `Let me walk you through what we do when you drop your car off for an oil change.

### 1. Getting Started
First things first, we'll lift your car up on our hydraulic lift so we can get underneath and see what's going on. Safety is key, so we make sure everything is secure before we start working.

### 2. Out With the Old
Once your car is safely up, we locate the oil drain plug under your engine. We remove the plug and let the old oil drain out into a pan. This part can take a few minutes because we want to make sure every last drop of that old, dirty oil is out. While the oil is draining, we usually take a look around for any leaks or other issues that might need attention.

### 3. Fresh Filter
After the oil is drained, we replace the oil filter. The oil filter catches all the dirt and debris that builds up in your oil over time. A fresh filter ensures your new oil stays clean longer. We carefully remove the old filter, clean the area where it sits, and then install a brand-new one. We also put a little bit of fresh oil on the rubber gasket of the new filter to help it seal properly.

### 4. In With the New
Now comes the fun part—adding the new oil! We put the drain plug back in (making sure it's nice and tight) and then pour in fresh, high-quality motor oil. The amount and type of oil we use depends on what your car needs, which is specified in your owner's manual. We use the best oil for your vehicle to keep your engine running smoothly.

### 5. Checking It Twice
After we've added the new oil, we start your car and let it run for a minute. This helps the new oil circulate through the engine. Then we turn off the engine and check the oil level with the dipstick to make sure everything is just right. We also take a quick look around to make sure there are no leaks.

### 6. Final Checks
Before we lower your car back down and hand you the keys, we do a final inspection. We check your tire pressure, top off any fluids that might be low (like windshield washer fluid), and sometimes even give your windows a quick clean. We want to make sure you're ready to hit the road safely.

### Why Regular Oil Changes Are a Must
Regular oil changes are super important for keeping your car in great shape. Fresh oil keeps your engine clean, reduces wear and tear, and helps it run more efficiently. Skipping oil changes can lead to sludge buildup, decreased performance, and even serious engine damage down the road. So, keeping up with this simple maintenance task can save you a lot of headaches (and money) in the long run.

### Handy FAQs About Oil Changes

**How often should I get an oil change?**
It depends on your car and the type of oil you use. Most modern cars can go 5,000 to 7,500 miles between oil changes, but it's always best to check your owner's manual. If you're using synthetic oil, you might be able to go even longer—sometimes up to 10,000 miles.

**What's the difference between conventional and synthetic oil?**
Conventional oil is refined from crude oil and works great for most everyday driving. Synthetic oil is specially engineered to perform better in extreme temperatures and last longer. It's a bit more expensive, but it can be worth it if you want the best protection for your engine.

**Can I change the oil myself?**
You sure can, if you're comfortable doing it! But remember, it can be a bit messy, and you'll need to dispose of the old oil properly. Plus, having a professional do it means we can spot other potential issues while we're under there. It's a great excuse to let us pamper your car a little!`,
        readTime: '2.5 min read',
        tags: ['oil change', 'maintenance', 'filter', 'faq', 'synthetic'],
        published: true
      }
    }),
    prisma.tip.create({
      data: {
        slug: '5-indicators-your-suspension-requires-a-check-up',
        title: '5 Indicators Your Suspension Requires a Check Up',
        category: 'Repair Tips',
        excerpt: 'A vehicle\'s suspension system comprises various components, including springs, shock absorbers, ball joints, and struts, among others. Here are five indicators to watch out for...',
        content: `A vehicle's suspension system comprises various components, including springs, shock absorbers, ball joints, and struts, among others. These elements work together to ensure a smooth and controlled ride. However, like any other part of your vehicle, the suspension system can wear out over time and may require attention. Here are five indicators to watch out for that suggest your suspension might need a check-up.

### 1. Noticeable Drifting or Pulling While Turning
If you experience your vehicle drifting or pulling to one side during turns, it could indicate that the shock absorbers are no longer effectively keeping the vehicle's body stable against centrifugal forces. This compromises both comfort and safety, as it affects your ability to control the vehicle.

### 2. Uneven Tire Tread Wear
Uneven or accelerated wear on your tires can be a sign of suspension trouble. If you notice bald spots or the tread wearing down more on one side than the other, your suspension may not be holding the vehicle evenly. This can also lead to poor fuel efficiency and can be unsafe.

### 3. Sensation of Dips or Dives Upon Braking
A well-functioning suspension system should absorb the forward momentum during braking, keeping the vehicle level. If you feel the front of the car dipping or diving when you apply the brakes, it's likely that the shock absorbers are worn and need to be replaced.

### 4. Difficulty in Steering
If steering your vehicle becomes more difficult, especially at low speeds or when making tight turns, it could be due to issues with the suspension system. Components like the power steering pump or steering rack can be affected by a failing suspension, making the steering wheel harder to turn.

### 5. Strange Noises
Listen for unusual noises such as clunking, rattling, or squeaking when you drive over bumps or during turns. These sounds can indicate worn or damaged suspension components. It's important to have these noises checked out immediately to prevent further damage.

### Require Suspension Work?
At Auto Shop Demo, we're your go-to specialists for all things suspension-related in the city, TX. Whether it's a minor adjustment or a major overhaul, our experienced technicians are equipped to diagnose and fix any suspension issues your vehicle might have. Don't wait for a small problem to become a big one—visit us today and ensure your vehicle continues to provide a smooth, safe ride. Contact Auto Shop Demo now to schedule your suspension check-up!`,
        readTime: '2.0 min read',
        tags: ['suspension', 'maintenance', 'steering', 'tires', 'brakes'],
        published: true
      }
    }),
    prisma.tip.create({
      data: {
        slug: 'preventive-auto-maintenance-for-severe-driving',
        title: 'Preventive Auto Maintenance For Severe Driving',
        category: 'Repair Tips',
        excerpt: 'Reduce the Effects of Severe Driving On Your Car. Severe driving is often unavoidable.',
        content: `Reduce the Effects of Severe Driving On Your Car. Severe driving is often unavoidable. Whether it's the daily commute through stop-and-go traffic, frequent short trips, or driving in extreme weather conditions, these scenarios can take a toll on your vehicle. Understanding what qualifies as severe driving and how to adjust your maintenance schedule accordingly can help extend the life of your car and keep it running smoothly.

**8 Types of Severe Driving**

1. Moving quickly through curvy roads or mountainous terrain
2. Frequently driving in dusty or muddy areas
3. Operating your vehicle in very hot or cold temperatures
4. Often making short trips that don't allow the engine to fully warm up
5. Experiencing a lot of stop-and-go traffic during your daily commute
6. Regularly towing a trailer or other heavy loads
7. Driving extensively on rough, unpaved roads
8. Driving with heavier loads than usual

**Increase Your Preventive Maintenance Intervals On These Six Important Items:**

1. **Replace your motor oil and oil filters** - Severe driving conditions can cause your oil to break down faster. Consider changing your oil more frequently than the standard recommendation to keep your engine running smoothly.

2. **Top off or replace your coolant** - Extreme temperatures can put extra stress on your cooling system. Make sure your coolant is at the proper level and replace it as needed to prevent overheating.

3. **Inspect and replace your brakes** - Stop-and-go traffic and mountain driving can wear out your brakes faster. Regular inspections can catch issues before they become serious.

4. **Rotate and balance your tires** - Rough roads and heavy loads can cause uneven tire wear. Regular rotation and balancing help extend the life of your tires.

5. **Check your air filter** - Dusty or muddy conditions can clog your air filter more quickly, reducing engine efficiency. Replace it more often if you drive in these conditions.

6. **Inspect your battery** - Extreme temperatures can shorten battery life. Have your battery tested regularly to avoid unexpected failures.

Stop by Auto Shop Demo in the city for a comprehensive inspection and maintenance service tailored to your driving conditions. Our expert technicians will help you keep your vehicle in top shape, no matter what challenges the road throws your way.`,
        readTime: '1.4 min read',
        tags: ['maintenance', 'severe driving', 'preventive', 'oil', 'brakes'],
        published: true
      }
    })
  ]);

  console.log(`✅ Created ${tips.length} tips`);

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
