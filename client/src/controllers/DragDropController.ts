export default class DragDropController {

	static myInstance: DragDropController;
	static get() { if (DragDropController.myInstance == null) { DragDropController.myInstance = new DragDropController(); } return this.myInstance; }

	constructor() { }

	private _initialized:boolean = false;
	public get initialized  () { return this._initialized; }

	private _initCalled:boolean = false;
	public async init(completeCallback: () => void)
	{
		if (this._initCalled)
		{
			console.log("DragDropController.init() already called, skipping.");
			return;
		}
		this._initCalled = true;

		console.log("_____DragDropController.INIT(*)_______________________________ ");
	}

	public StartDrag()
	{
		console.log(" _____ START DRAG ______ ");
	}

	public StopDrag()
	{
		console.log(" _____ STOP DRAG ______ ");
	}
}