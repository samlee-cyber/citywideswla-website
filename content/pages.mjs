import { business, serviceCatalogue } from "./business.mjs";
const supplied = [
  "Owner implementation brief and service proposal, 2026-09-16",
];
export { serviceCatalogue } from "./business.mjs";
export const industryCatalogue = [
  [
    "logistics-distribution",
    "Logistics & Distribution",
    "Facility care planned around access, traffic, shifts, and the spaces that support your operation.",
  ],
  [
    "commercial-office",
    "Commercial Office",
    "Cleaning and facility services for workspaces, meeting rooms, and shared areas.",
  ],
  [
    "healthcare-professional",
    "Healthcare & Professional",
    "Start with your facility’s scope, access requirements, and site protocols.",
  ],
  [
    "education",
    "Education",
    "Facility service planning around learning spaces and the people who use them.",
  ],
  [
    "automotive",
    "Automotive",
    "Care for customer-facing showrooms, offices, and shared spaces.",
  ],
  [
    "industrial-manufacturing",
    "Industrial & Manufacturing",
    "Discuss operational schedules, site access, and the facility areas in scope.",
  ],
  [
    "retail-commercial-property",
    "Retail & Commercial Property",
    "Service coordination for customer-facing spaces and commercial properties.",
  ],
];
export const resourceCatalogue = [
  ["commercial-cleaning-rfp-checklist", "Commercial Cleaning RFP Checklist"],
  ["janitorial-scope-of-work-guide", "Janitorial Scope of Work Guide"],
  ["warehouse-cleaning-checklist", "Warehouse Cleaning Checklist"],
  ["day-porter-vs-night-cleaning", "Day Porter vs. Night Cleaning"],
  [
    "commercial-cleaning-pricing-factors",
    "Commercial Cleaning Pricing Factors",
  ],
  ["transitioning-janitorial-providers", "Transitioning Janitorial Providers"],
  ["consolidating-facility-vendors", "Consolidating Facility Vendors"],
];
export const sectionsByType = {
  service: [
    "Service scope",
    "Common facility needs and types",
    "How City Wide manages delivery",
    "The walkthrough process",
    "Related services",
    "Relevant industries",
    "Service areas",
    "Related case studies",
    "Frequently asked questions",
  ],
  industry: [
    "Industry challenges",
    "Relevant services",
    "Our management approach",
    "Approved organizations",
    "Related case studies",
    "Service areas",
    "Frequently asked questions",
  ],
  location: [
    "Services available",
    "Facility types",
    "Our management model",
    "Relevant industries",
    "Local context",
    "Local case studies",
    "Nearby service areas",
    "Frequently asked questions",
  ],
  "case-study": [
    "Facility overview",
    "Challenge",
    "Objectives",
    "Services",
    "Approach",
    "Operational considerations",
    "Verified results",
    "Why it worked",
    "Related services, industries, and locations",
  ],
  resource: [
    "Direct answer",
    "Practical guidance",
    "Checklist and next steps",
    "Author and reviewer",
    "Supporting sources",
    "Related services and resources",
  ],
};
/** @returns {import('./types').Page} */
function page(slug, type, label, description, extra = {}) {
  return {
    slug,
    type,
    label,
    title: `${label} | City Wide Southwest Los Angeles`,
    h1: label,
    description,
    status: "construction",
    approval: { facts: false, content: false, evidence: [] },
    content: [],
    relationships: [],
    plannedSections: sectionsByType[type] || [],
    ...extra,
  };
}
function ready(p) {
  return {
    ...p,
    status: "published",
    approval: { facts: true, content: true, evidence: supplied },
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
  };
}
/** @type {import('./types').Page[]} */
export const pages = [
  ready(
    page(
      "/",
      "home",
      "Commercial Cleaning & Facility Services in Southwest Los Angeles",
      "One local partner managing commercial cleaning and facility services across Southwest Los Angeles. Request a facility walkthrough.",
      {
        h1: "Commercial Cleaning & Facility Services in Southwest Los Angeles.",
      },
    ),
  ),
  ...[
    [
      "services",
      "Services",
      "Facility services managed through one local point of contact. Explore commercial cleaning, building maintenance, and special projects.",
    ],
    [
      "industries",
      "Industries",
      "Find facility service planning for logistics, offices, healthcare, education, automotive, industrial, and retail environments.",
    ],
    [
      "locations",
      "Locations",
      "City Wide serves businesses across Southwest Los Angeles from our Long Beach office. Explore our initial local service areas.",
    ],
    [
      "case-studies",
      "Case Studies",
      "Explore the City Wide Southwest Los Angeles project library. Approved local case studies will appear here as they become available.",
    ],
    [
      "resources",
      "Resources",
      "Explore planned commercial cleaning checklists and facility management guides from City Wide Southwest Los Angeles.",
    ],
  ].map(([slug, label, description], i) =>
    ready(page(`/${slug}/`, "hub", label, description, { navOrder: i + 1 })),
  ),
  ...serviceCatalogue.map(([slug, label, summary, icon]) =>
    page(`/services/${slug}/`, "service", label, summary, {
      summary,
      icon,
      h1: `${label} in Southwest Los Angeles`,
      relationships: [
        "/services/",
        "/industries/",
        "/locations/",
        "/case-studies/",
        "/resources/",
      ],
    }),
  ),
  ...industryCatalogue.map(([slug, label, summary]) =>
    page(`/industries/${slug}/`, "industry", label, summary, {
      summary,
      h1: `Facility Services for ${label} in Southwest Los Angeles`,
      relationships: [
        "/services/commercial-cleaning/",
        "/services/",
        "/locations/",
        "/case-studies/",
      ],
    }),
  ),
  ...business.areas.map((city) =>
    page(
      `/locations/${city.toLowerCase().replaceAll(" ", "-")}/`,
      "location",
      city,
      `Commercial cleaning and facility services in ${city}. Discuss your property with City Wide Southwest Los Angeles.`,
      {
        city,
        h1: `Commercial Cleaning & Facility Services in ${city}`,
        relationships: [
          "/services/commercial-cleaning/",
          "/services/",
          "/industries/",
          "/case-studies/",
          "/locations/",
        ],
      },
    ),
  ),
  ...resourceCatalogue.map(([slug, label]) =>
    page(
      `/resources/${slug}/`,
      "resource",
      label,
      `A planned City Wide guide: ${label}. This resource is in development.`,
      { relationships: ["/services/commercial-cleaning/", "/resources/"] },
    ),
  ),
  ready(
    page(
      "/about/",
      "about",
      "About City Wide Southwest Los Angeles",
      "Meet owner Sam Lee and the local City Wide team. One point of contact for commercial cleaning and facility services, based in Long Beach.",
      {
        label: "About",
        navOrder: 6,
        h1: "Local ownership. Personal accountability.",
      },
    ),
  ),
  ready(
    page(
      "/request-walkthrough/",
      "action",
      "Request a Walkthrough",
      "Tell City Wide Southwest Los Angeles about your facility and service priorities. Request a commercial cleaning or facility services walkthrough.",
      {
        h1: "Request a Commercial Cleaning or Facility Services Walkthrough.",
        navOrder: 7,
      },
    ),
  ),
  ready(
    page(
      "/privacy/",
      "page",
      "Privacy Notice",
      "How City Wide Southwest Los Angeles uses information submitted through this website.",
      {
        content: [
          {
            heading: "Information you choose to share",
            paragraphs: [
              "The walkthrough form asks for contact and facility details so our local team can review your inquiry and respond. Please avoid sending sensitive personal, medical, or confidential business information.",
            ],
          },
          {
            heading: "Handling your request",
            paragraphs: [
              "When online delivery is enabled, form details are sent through our email delivery provider, Resend, to the configured local intake inbox. Our website hosting provider processes requests to operate this site. A separate security store supports rate limiting and duplicate prevention using keyed fingerprints rather than your form text.",
            ],
          },
          {
            heading: "Cookies and measurement",
            paragraphs: [
              "Essential, short-lived cookies protect form submission and show a genuine receipt. No advertising or analytics vendor is installed in this version. Optional measurement events are enabled only with explicit analytics consent and do not include form text, email addresses, or phone numbers.",
            ],
          },
          {
            heading: "Contact and questions",
            paragraphs: [
              "To ask about information you have shared, contact our local office at (562) 473-3136 or 2750 N Bellflower Boulevard, Suite 206, Long Beach, CA 90815.",
            ],
          },
        ],
      },
    ),
  ),
  page(
    "/request-received/",
    "utility",
    "Your Walkthrough Request",
    "Check the status of your City Wide walkthrough request.",
  ),
];
const cleaning = pages.find((p) => p.slug === "/services/commercial-cleaning/");
Object.assign(cleaning, ready(cleaning), {
  approval: {
    facts: true,
    content: true,
    evidence: [
      ...supplied,
      "https://gocitywide.com/commercial-cleaning/",
      "https://gocitywide.com/day-porters/",
      "https://gocitywide.com/southwestlosangeles/why-city-wide/",
    ],
  },
  summary:
    "City Wide Southwest Los Angeles manages commercial cleaning for business facilities, with a local Facility Solutions Manager coordinating the scope, service providers, communication, and quality follow-up. Request a walkthrough to discuss your spaces and priorities.",
  content: [
    {
      heading: "Service scope",
      paragraphs: [
        "Build a scope around the areas your team uses and the attention each space needs. The walkthrough is where we discuss tasks, frequencies, access, and expectations.",
      ],
      items: [
        "Recurring janitorial: dusting, vacuuming, trash removal, and restroom cleaning.",
        "Day porter support for shared spaces, spills, and supplies during business hours.",
        "Breakroom and common-area cleaning, with floor maintenance coordinated as needed.",
      ],
    },
    {
      heading: "Common facility needs and types",
      paragraphs: [
        "Office common areas, logistics support spaces, schools, professional facilities, and automotive showrooms have different traffic patterns. Tell us where cleaning affects your day, which spaces need special attention, and which areas are outside the proposed scope.",
      ],
    },
    {
      heading: "How City Wide manages delivery",
      paragraphs: [
        "Your Facility Solutions Manager represents your priorities, coordinates service providers, and oversees quality control. You have one local contact for service communication and follow-up.",
      ],
    },
    {
      heading: "The walkthrough process",
      items: [
        "Discuss your facility, current concerns, and service priorities.",
        "Review access, spaces, and the proposed work during a walkthrough when appropriate.",
        "Develop a tailored scope and proposal, including the agreed tasks and schedule.",
      ],
    },
  ],
  relationships: [
    "/services/",
    "/industries/",
    "/locations/",
    "/about/",
    "/resources/",
    "/case-studies/",
  ],
});
export const navigation = (registry = pages) =>
  registry.filter((p) => p.navOrder).sort((a, b) => a.navOrder - b.navOrder);
export const findPage = (slug) => pages.find((p) => p.slug === slug);
