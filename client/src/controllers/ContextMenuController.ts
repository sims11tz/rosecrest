export default class ContextMenuController {

	static myInstance: ContextMenuController;
	static get() { if (ContextMenuController.myInstance == null) { ContextMenuController.myInstance = new ContextMenuController(); } return this.myInstance; }

	constructor() { }

	
}