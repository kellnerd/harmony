
export default class Deezer {
	static API_BASE_URL = 'https://api.deezer.com';

	/**
	 * @param {string} albumId 
	 * @returns {Promise<DeezerRelease>}
	 */
	static getRelease(albumId) {
		return this.fetchJSON(`${this.API_BASE_URL}/album/${albumId}`);
	}

	/**
	 * @param {string} albumId 
	 * @returns {Promise<DeezerTracklistItem[]>}
	 */
	static getTracklist(albumId) {
		return this.fetchJSON(`${this.API_BASE_URL}/album/${albumId}/tracks`);
	}

	/**
	 * @param {RequestInfo} input 
	 * @param {RequestInit} [init] 
	 */
	static async fetchJSON(input, init) {
		let result = await fetch(input, init);
		return result.json();
	}
}
