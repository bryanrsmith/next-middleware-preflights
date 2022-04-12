import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.[a-z0-9]{2,5}$/;

/** @typedef {import('next/server').NextFetchEvent} NextFetchEvent */

/**
 * Middleware function that redirects the user to an appropriate locale, determined either by the NEXT_LOCALE cookie or the user's country.
 *
 * @param {NextRequest} req
 * @param {NextFetchEvent} event
 */
export async function middleware(req) {
	if (
		req.ua?.isBot ||
		PUBLIC_FILE.test(req.nextUrl.pathname) ||
		req.nextUrl.pathname.includes('/api/')
	) {
		// ignore bots (which can use hreflang tags to select a locale), static files, and api routes
		return NextResponse.next();
	}

	const redirectTarget = getRedirectTarget(req);
	if (redirectTarget) {
		console.log(`redirecting ${req.nextUrl.href} → ${redirectTarget}`);

		return NextResponse.redirect(redirectTarget);
	}

	return NextResponse.next();
}

/**
 * Gets a locale-appropriate redirect target for the user, or null if the request should not be redirected.
 *
 * @param {NextRequest} req
 * @returns {string | null}
 */
function getRedirectTarget(req) {
	const { nextUrl } = req;
	const targetLocale = getTargetLocale(req);

	// only redirect if the target locale is different from the requested locale
	if (targetLocale !== nextUrl.locale) {
		const url = nextUrl.clone();
		url.locale = targetLocale;
		return url.href;
	}

	return null;
}

/**
 * Gets the best locale for the user, based on NEXT_LOCALE cookie or user's country.
 *
 * @param {NextRequest} req
 * @returns {string}
 */
function getTargetLocale(req) {
	const country = req.geo?.country?.toLowerCase() ?? 'us';

	const cookieLocale = req.cookies.NEXT_LOCALE;
	const geoLocale = {
		fr: 'fr',
		nl: 'nl',
	}[country];

	return cookieLocale ?? geoLocale ?? 'en';
}
