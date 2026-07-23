/**
 * Central contact configuration.
 *
 * FORMSPREE_FORM_ID: the Formspree form that receives every site form
 * (footer newsletter, suggestion box, feedback form, contact form).
 * The RECIPIENT email is configured in the Formspree dashboard
 * (https://formspree.io → form → Settings → Email), not in code.
 * To route submissions to contact@smartkitnow.com, either update the
 * recipient of this form in the dashboard or create a new form linked
 * to that address and replace the ID below.
 */
export const FORMSPREE_FORM_ID = "xanpypnb";
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

/** Public contact email shown across the site. */
export const CONTACT_EMAIL = "contact@smartkitnow.com";
