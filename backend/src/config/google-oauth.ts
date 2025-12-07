import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleUserInfo {
	email: string;
	name: string;
	picture: string;
	sub: string;
	email_verified: boolean;
}

export const verifyGoogleToken = async (
	token: string
): Promise<GoogleUserInfo> => {
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			throw new Error("Invalid token payload");
		}

		return {
			email: payload.email!,
			name: payload.name!,
			picture: payload.picture!,
			sub: payload.sub,
			email_verified: payload.email_verified!,
		};
	} catch (error) {
		throw new Error("Invalid Google token");
	}
};
