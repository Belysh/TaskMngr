export default class JwtHelper {
	static urlBase64Decode(str) {
		let output = str.replace(/-/g, '+').replace(/_/g, '/');
		switch (output.length % 4) {
			case 0:
				break;
			case 2:
				output += '==';
				break;
			case 3:
				output += '=';
				break;
			default:
				throw new Error('Illegal base64url string!');
		}

		return decodeURIComponent(escape(window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
	}

	static getUserRole(accessToken) {
		return accessToken && JwtHelper.decodeToken(accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }

	static decodeToken(token) {
		const parts = token.split('.');

		if (parts.length !== 3) throw new Error('JWT must have 3 parts');

		const decoded = JwtHelper.urlBase64Decode(parts[1]);

		if (!decoded) throw new Error('Cannot decode the token');

		return JSON.parse(decoded);
	}

	static getTokenExpirationDate(token) {
		const decoded = JwtHelper.decodeToken(token);

		if (typeof decoded.exp === 'undefined') return null;

		const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
		d.setUTCSeconds(decoded.exp);

		return d;
	}

	static isTokenExpired(token, offsetSeconds) {
		const d = JwtHelper.getTokenExpirationDate(token);
		offsetSeconds = offsetSeconds || 0;

		if (d === null) return false;

		// Token expired?
		return !(d.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
	}
}
