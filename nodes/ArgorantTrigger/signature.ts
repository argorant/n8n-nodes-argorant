import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Checks X-Argorant-Signature: "sha256=" plus the hex HMAC-SHA256 of the raw body with the webhook's secret.
 * Without a stored secret (a webhook made before the node kept it) nothing can be checked, so it is refused.
 */
export function verifySignature(rawBody: Buffer | string, header: string, secret: string | undefined): boolean {
	if (!secret || !header) return false;
	const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`;
	const given = header.trim();
	if (given.length !== expected.length) return false;
	return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
