import fs from "fs/promises";
import { AppStoreServerAPIClient, Environment, SignedDataVerifier } from "@apple/app-store-server-library";

const issuerId = process.env.APPLE_ISSUER_ID;
const keyId = process.env.APPLE_KEY_ID;
const bundleId = process.env.APPLE_BUNDLE_ID;
const appAppleId = Number(process.env.APPLE_APP_APPLE_ID);

const encodedKey = (await fs.readFile(`apple_certs/SubscriptionKey_${keyId}.p8`)).toString();
const files = await fs.readdir("apple_certs");
const appleRootCAs = await Promise.all(files
	.filter(file => file.endsWith(".pem"))
	.map(file => fs.readFile(`apple_certs/${file}`)));

async function verifyInEnv(payload, env) {
	// @ts-ignore
	const verifier = new SignedDataVerifier(appleRootCAs, false, env, bundleId, env == Environment.PRODUCTION ? appAppleId : undefined);
	const result = await verifier.verifyAndDecodeAppTransaction(payload);

	if (result.bundleId != bundleId) {
		throw new Error("girl get the fuck outta here with yo nasty ass, bitch i can smell your dick cheese through this computer bitch. go take a fucking shower and go buy some listerine, you have multiple cavities");
	}

	return result;
}

export async function verify(payload) {
	let lastError = null;

	for (const env of [Environment.PRODUCTION, Environment.SANDBOX]) {
		try {
			return await verifyInEnv(payload, env);
		} catch (error) {
			lastError = error;
		}
	}

	console.error("validation failed:", lastError);
	throw lastError;
}
