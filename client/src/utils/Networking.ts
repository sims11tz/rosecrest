import { NETWORK_ENDPOINTS, NETWORK_COMMANDS } from '@shared/SharedNetworking';

	
export default class Networking {

	static myInstance: Networking;
	static get() { if (Networking.myInstance == null) { Networking.myInstance = new Networking(); } return this.myInstance; }

	public static fetch<T>(endpoint:NETWORK_ENDPOINTS,command:NETWORK_COMMANDS, params:Object, callback: (data: T | null, error?: Error) => void) {

		fetch('http://127.0.0.1:8000/api/'+endpoint, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify({ 'command':command, ...params })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			callback(data, undefined);
		})
		.catch((error) => {
			console.error('Error:', error);
			callback(null, error);
		});

	}
}