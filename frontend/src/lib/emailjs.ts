/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Central EmailJS configuration. Keeping IDs in one place so the rotation
 * of any credential is a single-line edit.
 */
import emailjs from '@emailjs/browser';

export const EMAILJS_SERVICE_ID = 'service_c4smf0m';
export const EMAILJS_TEMPLATE_ID = 'template_6cxxori';
export const EMAILJS_PUBLIC_KEY = '002e-bFh3plFTrClF';

// Initialise once at module-load so any call site can simply call emailjs.send
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

export { emailjs };
