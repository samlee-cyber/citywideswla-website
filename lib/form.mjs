import { fields } from "./fields.mjs";
import { escape as e, renderPage, button } from "./render.mjs";
import { findPage } from "../content/pages.mjs";
import { business as b } from "../content/business.mjs";
export function renderForm({
  values = {},
  errors = {},
  message = "",
  token = "",
  available = false,
  production,
  code = 200,
} = {}) {
  if (!available) {
    const submitted = Object.entries(values).filter(
      ([key, value]) => fields[key] && value,
    );
    const details =
      code !== 200 && submitted.length
        ? `<details class="saved-details"><summary>Your entered details</summary><dl>${submitted.map(([key, value]) => `<dt>${e(fields[key].label)}</dt><dd>${e(value)}</dd>`).join("")}</dl></details>`
        : "";
    return renderPage(findPage("/request-walkthrough/"), {
      production,
      error: code !== 200,
      bodyOverride: `<section class="container call-first">${message ? `<div class="error-summary" role="alert" tabindex="-1"><h2>Your request has not been sent</h2><p>${e(message)}</p></div>` : ""}<h2>Let’s talk about your facility.</h2><p>Online requests are not available yet. Call our local team to discuss your services and arrange the next step.</p>${values.service_needed ? `<p>Service interest: <strong>${e(values.service_needed === "Commercial Cleaning & Janitorial" ? "Managed Janitorial Services" : values.service_needed)}</strong></p>` : ""}${button(`Call ${b.phone}`, `tel:${b.telephone}`)}<p class="office-note">${e(b.address.streetAddress)}<br>Long Beach, CA ${b.address.postalCode}</p>${details}</section>`,
    });
  }
  const input = (name, f) => {
    const error = errors[name];
    const attrs = `id="${name}" name="${name}"${f.required ? " required" : ""}${f.autocomplete ? ` autocomplete="${f.autocomplete}"` : ""}${error ? ` aria-invalid="true" aria-describedby="${name}-error"` : ""}`;
    let element;
    if (f.options)
      element = `<select ${attrs}><option value="">Select ${f.required ? "an option" : "if applicable"}</option>${f.options.map((v) => `<option value="${e(v)}"${values[name] === v ? " selected" : ""}>${e(name === "service_needed" && v === "Commercial Cleaning & Janitorial" ? "Managed Janitorial Services (commercial cleaning)" : v)}</option>`).join("")}</select>`;
    else if (f.type === "textarea")
      element = `<textarea ${attrs} rows="5" maxlength="${f.max}">${e(values[name])}</textarea>`;
    else
      element = `<input ${attrs} type="${f.type || "text"}" ${f.type === "number" ? 'min="1" step="1" max="999999999999"' : `maxlength="${f.max}"`} value="${e(values[name])}">`;
    return `<div class="field ${["service_needed", "facility_details"].includes(name) ? "full" : ""}"><label for="${name}">${e(f.label)} ${f.required ? "<span>(required)</span>" : "<span>(optional)</span>"}</label>${element}${error ? `<p class="field-error" id="${name}-error">${e(error)}</p>` : ""}</div>`;
  };
  const hasErrors = Object.keys(errors).length > 0;
  const errorBlock =
    hasErrors || message
      ? `<div class="error-summary" role="alert" tabindex="-1" autofocus id="form-errors"><h2>${hasErrors ? "Please check your details" : "Your request has not been sent"}</h2>${message ? `<p>${e(message)}</p>` : ""}${
          hasErrors
            ? `<ul>${Object.entries(errors)
                .map(
                  ([name, error]) =>
                    `<li>${fields[name] ? `<a href="#${name}">${e(error)}</a>` : e(error)}</li>`,
                )
                .join("")}</ul>`
            : ""
        }</div>`
      : "";
  const body = `<section class="container contact-layout"><div class="quote-panel">${errorBlock}${!available && !message ? `<p class="form-note">Online delivery is not connected yet. Please call <a href="tel:${b.telephone}">${b.phone}</a> to arrange a walkthrough.</p>` : ""}<form id="walkthrough-form" action="/request-walkthrough/" method="POST"><p class="form-note">Fields marked required help us review your request. Please do not include confidential or sensitive information.</p><input type="hidden" name="form_token" value="${e(token)}"><div class="honeypot" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div><div class="form-grid">${Object.entries(
    fields,
  )
    .map(([name, f]) => input(name, f))
    .join(
      "",
    )}</div><p class="privacy-note">We use your information to review and respond to this inquiry. Read our <a href="/privacy/">privacy notice</a>.</p><button type="submit" class="button">Request my Walkthrough <span aria-hidden="true">↗</span></button></form><p class="form-phone">Prefer to talk? <a href="tel:${b.telephone}">${b.phone}</a></p></div></section>`;
  return renderPage(findPage("/request-walkthrough/"), {
    bodyOverride: body,
    production,
    error: code !== 200,
  });
}
export function renderReceipt(receipt = null, { production } = {}) {
  const base = findPage("/request-received/");
  const page = {
    ...base,
    h1: receipt ? "Walkthrough request received" : "Your walkthrough request",
    title: receipt
      ? "Walkthrough request received | City Wide Southwest Los Angeles"
      : base.title,
  };
  const body = `<section class="container receipt"><div class="receipt-panel"><h2>${receipt ? "Thank you for telling us about your facility." : "Ready to tell us about your facility?"}</h2><p>${receipt ? "A City Wide representative will review the request and contact you to discuss priorities and next steps. This is not an appointment confirmation." : "This page does not show a confirmed submission. If you have not sent a request, start with the walkthrough form. If you already submitted one and need help, please call our local team."}</p>${receipt ? `<p>Reference: <strong>${e(receipt.request_id)}</strong></p>` : ""}<p><a href="tel:${b.telephone}">${b.phone}</a></p>${button(receipt ? "Explore Services" : "Request a Walkthrough", receipt ? "/services/" : b.contactRoute)}</div></section>`;
  return renderPage(page, {
    bodyOverride: body,
    receiptId: receipt?.request_id || "",
    production,
  });
}
