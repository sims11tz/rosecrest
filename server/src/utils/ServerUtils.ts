export default class ServerUtils {
	static myInstance: ServerUtils;
	static get() { if (ServerUtils.myInstance == null) { ServerUtils.myInstance = new ServerUtils(); } return this.myInstance; }
}
