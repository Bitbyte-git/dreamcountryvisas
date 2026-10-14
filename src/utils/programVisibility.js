// Temporarily hidden programs. Keep their content and images for reactivation.
export const HIDDEN_PROGRAM_PATHS = new Set(['/residency/spain']);

export function isProgramVisible(path) {
  return !HIDDEN_PROGRAM_PATHS.has(String(path || '').replace(/\/+$/, '').toLowerCase());
}

export function isSpainResidencyHidden() {
  return !isProgramVisible('/residency/spain');
}

export function isPublicReviewVisible(review) {
  if (!isSpainResidencyHidden()) return true;
  return String(review.country || '').toLowerCase() !== 'spain' &&
    !/residence in spain|spain.*(?:residency|golden visa)/i.test(review.program || '');
}
