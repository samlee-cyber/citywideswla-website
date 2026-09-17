import { isPublished } from "../lib/publication.mjs";
import { business, serviceCatalogue } from "./business.mjs";
const supplied = [
  "Owner implementation brief and service proposal, 2026-09-16",
  "Owner-supplied City Wide SWLA Management First Website Messaging, 2026-09-16",
  "Owner-supplied City Wide SWLA Website Refinement Brief, 2026-09-16",
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
      "Commercial Facility Management",
      "City Wide manages commercial building maintenance in Southwest Los Angeles, including managed janitorial programs and a broad range of facility services.",
      {
        h1: "Commercial Building Maintenance. Managed for You.",
        title: "Commercial Facility Management | City Wide Southwest LA",
      },
    ),
  ),
  ...[
    [
      "services",
      "Managed Services",
      "Coordinate your building maintenance through one local management partner. City Wide helps define the scope, coordinate providers and oversee agreed services, from recurring janitorial to repairs and improvement projects.",
    ],
    [
      "industries",
      "Industries",
      "Your building’s use, operating hours and access requirements shape the program. We coordinate services around the needs of offices, logistics facilities, schools, healthcare and professional spaces, automotive businesses, industrial facilities and commercial properties.",
    ],
    [
      "locations",
      "Locations",
      "Based in Long Beach, our local team manages commercial facility services across Southwest Los Angeles.",
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
    ready(
      page(`/${slug}/`, "hub", label, description, {
        navOrder: i + 1,
        ...(slug === "case-studies"
          ? { collectionType: "case-study" }
          : slug === "resources"
            ? { collectionType: "resource" }
            : {}),
      }),
    ),
  ),
  ...serviceCatalogue.map(([slug, label, summary, icon]) =>
    page(`/services/${slug}/`, "service", label, summary, {
      summary,
      label:
        slug === "commercial-cleaning" ? "Managed Janitorial Services" : label,
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
      `City Wide helps businesses in ${city} manage commercial building maintenance through one local point of contact. Explore managed janitorial programs and a broad range of facility services coordinated around your property’s needs.`,
      {
        city,
        h1: `Commercial Building Maintenance Management in ${city}.`,
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
      "City Wide Facility Solutions Southwest Los Angeles is a locally owned management company in the commercial building maintenance industry. Led by Sam Lee, our team helps businesses coordinate facility services, oversee service quality and resolve issues through one accountable relationship.",
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
      "Tell us about your facility and the services you need. Our local team will review your priorities and discuss the next step; a request does not book an appointment.",
      {
        h1: "Request a Facility Walkthrough.",
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
  title: "Managed Janitorial Services | City Wide Southwest LA",
  h1: "Commercial Janitorial Services, Backed by a Facility Management Team.",
  description:
    "Get commercial janitorial services with a fractional facility manager, a management team and a program built around your facility and budget.",
  summary:
    "City Wide manages commercial cleaning and janitorial programs throughout Southwest Los Angeles. Your managed janitorial services contract includes a fractional facility manager, a supporting management team and a facility management program to coordinate service, oversee quality and follow through on issues.",
  content: [
    {
      heading: "More support. Less day-to-day coordination.",
      paragraphs: [
        "We tailor the scope and schedule to your building and budget, giving you a competitively priced program and less day-to-day coordination to handle yourself.",
        "Your Facility Solutions Manager acts as an extension of your team, coordinating the contracted facility services and helping address maintenance needs. The role provides ongoing management support; it is not a full-time onsite employee.",
      ],
    },
    {
      heading: "What your managed janitorial contract includes",
      items: [
        "Your manager — One local contact who knows your facility and coordinates your service needs.",
        "Your team — Management support for provider coordination, communication and issue resolution.",
        "Your program — An agreed scope, service schedule and quality follow-up process built around your priorities.",
      ],
      paragraphs: [
        "Along with the agreed janitorial services, you receive a fractional facility manager, a supporting management team and a facility management program. Additional facility services are scoped and priced separately.",
      ],
    },
    {
      heading: "Cleaning scope and schedule",
      paragraphs: [
        "Build a scope around the areas your team uses and the attention each space needs. During the walkthrough, we discuss tasks, frequencies, traffic, access and expectations, then agree on a schedule around your operating requirements.",
      ],
      items: [
        "Recurring janitorial: dusting, vacuuming, trash removal and restroom cleaning.",
        "Day porter support for shared spaces, spills and supplies during business hours, where included in the agreed scope.",
        "Breakroom and common-area cleaning, with floor maintenance coordinated as needed.",
        "Planning for office common areas, logistics support spaces, schools, professional facilities and automotive showrooms.",
      ],
    },
    {
      heading: "Quality oversight and issue resolution",
      paragraphs: [
        "Your Facility Solutions Manager coordinates service providers, oversees quality and follows through on issues. Bring service concerns to your local contact so the team can review them against the agreed scope and coordinate the next steps.",
      ],
    },
    {
      heading: "Related facility services",
      paragraphs: [
        "From floor care and supplies to plumbing, HVAC and improvement projects, your City Wide contact can help define the scope and coordinate additional work as needs arise. These services and projects are scoped and priced separately from your janitorial program.",
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
// Scope and planning guidance derived from the owner’s approved service catalogue
// and management brief; no customer results, certifications or response promises.
const floorCare = pages.find((p) => p.slug === "/services/hard-floor-care/");
Object.assign(floorCare, ready(floorCare), {
  summary:
    "City Wide coordinates hard floor care for commercial buildings, including stripping, refinishing and protecting resilient tile and other hard-surface floors. We start with the floor type, its condition and how the space is used, then agree on a scope and schedule.",
  content: [
    {
      heading: "Start with the floor and the work it needs",
      paragraphs: [
        "A walkthrough helps define which surfaces and areas need attention. Tell us about worn finishes, tracked-in soil, high-traffic areas and any requirements provided by the flooring manufacturer. The proposed treatment should suit the surface and its condition.",
      ],
      items: [
        "Identify the flooring material and areas to be included.",
        "Review the existing finish, wear and desired result.",
        "Agree on the preparation, treatment and service frequency before work begins.",
      ],
    },
    {
      heading: "Coordinate access and timing",
      paragraphs: [
        "Floor work affects how people move through a building. We discuss operating hours, access, furniture, and when treated areas can be used again. Any drying or curing requirements belong in the agreed work plan; they vary with the surface and treatment.",
      ],
    },
    {
      heading: "One contact for the project",
      paragraphs: [
        "City Wide helps define the scope, coordinate the service provider and follow up on the agreed work. Raise questions or quality concerns with your local contact so the team can review them and coordinate the next steps.",
        "You can request floor care independently. It does not require a managed janitorial contract, and additional services are scoped and priced separately.",
      ],
    },
    {
      heading: "What to share when you inquire",
      items: [
        "Facility city, approximate floor area and known flooring material.",
        "Current concerns, access restrictions and preferred timing.",
        "Whether you need a one-time project or want to discuss recurring care.",
      ],
      paragraphs: [
        "A proposal reflects the actual areas, condition, work and schedule. Contact our local team to discuss your building.",
      ],
    },
  ],
});
const office = pages.find((p) => p.slug === "/industries/commercial-office/");
Object.assign(office, ready(office), {
  summary:
    "Coordinate cleaning and building maintenance around your office’s people, shared spaces and operating hours. City Wide Southwest Los Angeles provides one local management relationship for the agreed services and additional projects.",
  content: [
    {
      heading: "Plan around how your office works",
      paragraphs: [
        "Reception areas, meeting rooms, restrooms and breakrooms have different traffic and service needs. We review those spaces with you, along with access arrangements, business hours and areas that are outside the scope.",
      ],
      items: [
        "Identify shared areas and the attention each needs.",
        "Agree on service timing, building access and a point of contact.",
        "Discuss current issues and priorities for the proposed program.",
      ],
    },
    {
      heading: "Managed janitorial for everyday needs",
      paragraphs: [
        "A managed janitorial services contract includes the agreed cleaning scope, a fractional facility manager, a supporting management team and a facility management program. Your manager coordinates providers, oversees quality and follows through on service issues as an extension of your team; the role is not a full-time onsite employee.",
      ],
    },
    {
      heading: "Coordinate other building needs",
      paragraphs: [
        "Hard floor and carpet care, window washing, consumable supplies and repair projects can be discussed through the same local contact. Additional work is separately scoped and priced. You may also inquire about these services independently, without a janitorial contract.",
      ],
    },
    {
      heading: "Build a practical scope and proposal",
      paragraphs: [
        "Tell us your facility’s city, approximate size, hours and immediate concerns. A walkthrough helps align tasks and frequency with your building and budget. Competitive pricing with management built into the program applies to managed janitorial; the scope and price of other projects are agreed separately.",
      ],
    },
  ],
});
pages.push(
  ready(
    page(
      "/integrations/",
      "page",
      "Walkthrough Inquiry API",
      "Integration instructions and the public request contract for City Wide Southwest Los Angeles facility inquiries.",
      {
        h1: "Facility inquiry integration guide.",
        content: [
          {
            heading: "Availability and appropriate use",
            paragraphs: [
              "This public endpoint is for facility inquiries submitted with the prospective customer’s authorization. Online handoff is not connected yet; use the office phone number until delivery has been configured and verified. The form-config endpoint reports configuration presence, not a successful delivery test.",
            ],
          },
          {
            heading: "Submit an inquiry",
            paragraphs: [
              "POST JSON to /api/v1/walkthrough-request using Content-Type: application/json and an Idempotency-Key of 16–128 letters, digits, hyphens or underscores. Supply contact_name, work_email, company, facility_city and service_needed. All values are strings. Use the service enum in the linked specification; the janitorial value remains Commercial Cleaning & Janitorial for compatibility.",
            ],
          },
          {
            heading: "Understand the response",
            paragraphs: [
              "A 201 response means the configured intake provider acknowledged the handoff and returns a request reference. It does not book an appointment. A 422 response contains field errors; 409 indicates a key reused with different details. Missing configuration returns 503, never a simulated receipt.",
            ],
          },
          {
            heading: "Retry safely",
            paragraphs: [
              "Keep the same key and unchanged fields when retrying a transient 429, 502 or 503 response. Follow Retry-After where returned. The public endpoint accepts a maximum 16 KB body and limits each source IP to 10 attempts per 15 minutes. Browser origins must match the configured website; arbitrary browser CORS access is not enabled. Do not include confidential information.",
            ],
          },
          {
            heading: "Delivery verification",
            paragraphs: [
              "The automated contract and retry checks use test providers. Real inbox receipt, duplicate delivery prevention with the live store and analytics conversion delivery still require a configured staging destination and an approved labeled test. No production or agent-readiness certification is implied.",
            ],
          },
        ],
        relationships: ["/request-walkthrough/", "/privacy/"],
      },
    ),
  ),
);
const hubHeadings = {
  "/services/": "Managed Facility Services for Commercial Buildings.",
  "/industries/": "Facility Management Built Around Your Operation.",
  "/case-studies/": "Facility Problems. Managed Solutions.",
  "/resources/": "Practical Guidance for Managing Your Facility.",
};
for (const p of pages) if (hubHeadings[p.slug]) p.h1 = hubHeadings[p.slug];
export const navigation = (registry = pages) =>
  registry
    .filter((p) => p.navOrder && isPublished(p, registry))
    .sort((a, b) => a.navOrder - b.navOrder);
export const findPage = (slug) => pages.find((p) => p.slug === slug);
