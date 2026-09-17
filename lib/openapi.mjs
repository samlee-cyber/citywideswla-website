import { fields } from "./fields.mjs";
import { business } from "../content/business.mjs";
const jsonSchema = (ref) => ({
  "application/json": { schema: { $ref: "#/components/schemas/" + ref } },
});
export function openapi() {
  const properties = Object.fromEntries(
    Object.entries(fields).map(([name, f]) => [
      name,
      {
        type: "string",
        maxLength: f.max,
        description:
          f.label +
          (f.required ? " (required)" : " (optional; empty string allowed)"),
        ...(f.required ? { minLength: 1 } : {}),
        ...(f.options
          ? { enum: f.required ? f.options : ["", ...f.options] }
          : {}),
        ...(name === "work_email" ? { format: "email" } : {}),
        ...(name === "facility_size_sqft"
          ? { pattern: "^$|^[1-9][0-9]{0,11}$" }
          : {}),
      },
    ]),
  );
  const responses = Object.fromEntries(
    [
      ["400", "Malformed body or idempotency key"],
      ["403", "Unacceptable browser origin"],
      ["405", "Method not allowed"],
      ["409", "Key reused with different details"],
      ["413", "Request body too large"],
      ["415", "Unsupported content type"],
      ["422", "Field validation or spam rejection"],
      ["429", "Rate limit or request in progress"],
      ["502", "Handoff not confirmed"],
      ["503", "Intake or duplicate-control backend unavailable"],
    ].map(([status, description]) => [
      status,
      {
        description,
        content: jsonSchema("Error"),
        ...(status === "429"
          ? {
              headers: {
                "Retry-After": {
                  schema: { type: "integer" },
                  description: "Seconds to wait before retrying.",
                },
              },
            }
          : {}),
      },
    ]),
  );
  responses["201"] = {
    description:
      "Acknowledged intake handoff. Duplicate retries return the original reference.",
    content: jsonSchema("Receipt"),
  };
  return {
    openapi: "3.1.0",
    info: {
      title: "City Wide SWLA Walkthrough Intake",
      version: "1.0.0",
      description:
        "Request review of a commercial facility inquiry. Receipt does not confirm an appointment. No CRM or private business APIs are exposed.",
    },
    servers: [{ url: business.url }],
    paths: {
      "/api/v1/walkthrough-request": {
        post: {
          operationId: "requestFacilityWalkthrough",
          summary: "Submit a facility walkthrough request",
          description:
            "Public intake; no authentication required. No browser CORS access is granted. If Origin is present it must match this website or its configured Vercel deployment. Body limit 16,384 bytes. At most 10 attempts per source IP per 15 minutes. An in-progress identical request returns 429; obey Retry-After. Retry transient 429/502/503 failures with the same Idempotency-Key and unchanged fields. Keys and matching-content fingerprints are retained for 24 hours. Retry uncertain requests for at most 23 hours; after that contact the office before creating another request. Different data with the same key returns 409. Do not log personal data.",
          parameters: [
            {
              in: "header",
              name: "Idempotency-Key",
              required: true,
              schema: { type: "string", pattern: "^[A-Za-z0-9_-]{16,128}$" },
              description:
                "A new random UUID per logical request; reuse unchanged on retry.",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WalkthroughRequest" },
                example: {
                  contact_name: "Jordan Example",
                  work_email: "jordan@example.com",
                  company: "Fictional Example Facility",
                  facility_city: "Long Beach",
                  facility_type: "Commercial Office",
                  service_needed: "Commercial Cleaning & Janitorial",
                  facility_size_sqft: "25000",
                  service_frequency: "Not sure yet",
                  facility_details:
                    "Fictional test request. Please do not treat this example as a real inquiry.",
                },
              },
            },
          },
          responses,
        },
      },
    },
    components: {
      schemas: {
        WalkthroughRequest: {
          type: "object",
          additionalProperties: false,
          required: Object.keys(fields).filter((k) => fields[k].required),
          properties: {
            ...properties,
            website: {
              type: "string",
              maxLength: 0,
              description: "Honeypot; omit or leave empty.",
            },
          },
        },
        Receipt: {
          type: "object",
          required: ["status", "request_id", "next_step"],
          additionalProperties: false,
          properties: {
            status: { const: "received" },
            request_id: { type: "string", format: "uuid" },
            next_step: {
              const: "A City Wide representative will review the request.",
            },
          },
        },
        Error: {
          type: "object",
          required: ["status", "code", "message"],
          properties: {
            status: { const: "error" },
            code: { type: "string" },
            message: { type: "string" },
            field_errors: {
              type: "object",
              additionalProperties: { type: "string" },
            },
          },
        },
      },
    },
  };
}
