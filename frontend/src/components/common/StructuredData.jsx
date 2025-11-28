import { Helmet } from 'react-helmet-async';
import { CONTACT_INFO } from '../../config/contact';

function StructuredData({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

// Local Business Schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": CONTACT_INFO.businessName,
    "image": "https://autoshopdemo.com/logo.png",
    "description": `Expert auto repair services in ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state}. Trusted since ${CONTACT_INFO.established} for quality service, honest pricing, and reliable car care.`,
    "url": "https://autoshopdemo.com",
    "telephone": CONTACT_INFO.phone.href.replace('tel:', ''),
    "email": CONTACT_INFO.email.display,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT_INFO.address.street,
      "addressLocality": CONTACT_INFO.address.city,
      "addressRegion": CONTACT_INFO.address.state,
      "postalCode": CONTACT_INFO.address.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7767,
      "longitude": -96.7970
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "foundingDate": CONTACT_INFO.established,
    "areaServed": {
      "@type": "City",
      "name": CONTACT_INFO.address.city,
      "sameAs": `https://en.wikipedia.org/wiki/${CONTACT_INFO.address.city}`
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Auto Repair Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Oil Change"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Brake Service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Engine Repair"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Transmission Service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AC & Heating Repair"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/autoshopdemomotive",
      "https://www.instagram.com/autoshopdemomotive"
    ]
  };

  return <StructuredData data={schema} />;
}

// Review Schema
export function ReviewsSchema({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": reviews.map((review, index) => ({
      "@type": "Review",
      "position": index + 1,
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "reviewBody": review.comment,
      "datePublished": review.createdAt,
      "itemReviewed": {
        "@type": "AutomotiveBusiness",
        "name": CONTACT_INFO.businessName
      }
    }))
  };

  return <StructuredData data={schema} />;
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <StructuredData data={schema} />;
}

// FAQ Schema
export function FAQSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <StructuredData data={schema} />;
}

export default StructuredData;
