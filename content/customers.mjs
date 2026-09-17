// Website permissions are recorded here only after the owner supplies evidence.
// Do not commit private proposal customer lists to this public repository.
/** @type {import('./types').Customer[]} */
export const customers = [];
export function approvedCustomers(records = customers) {
  return records
    .filter(
      (c) =>
        c.nameApproved === true &&
        c.approvalEvidence &&
        c.relationshipLabel &&
        c.relationshipStatus !== "unverified-for-web",
    )
    .map((c) => ({ ...c, logo: c.displayApproved === true ? c.logo : null }));
}
