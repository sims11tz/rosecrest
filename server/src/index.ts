import cors from "cors";
import express, { Request, Response } from "express";
import Log from "./utils/Log";
import { NETWORK_ENDPOINTS, NETWORK_COMMANDS, NETWORK_PAYLOAD, NETWORK_STATUS_CODES, NETWORK_ERROR_PAYLOAD, NETWORK_PAYLOAD_TYPES, NETWORK_PAYLOAD_NONE } from "@shared/SharedNetworking";
import MiscUtils from "@shared/MiscUtils";
import { BeaconEP } from "./endpoints/BeaconEP";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.REACT_APP_SERVER_PORT || 7000;

app.listen(port, () => { console.log(`App server now listening on port ${port}`); });

Log.info(" process.env.BASE_URL : "+process.env.BASE_URL);

app.get("/ping", (req: Request, res: Response) => {
	Log.info("GET -- /ping");
	return res.json({ message: "pong" });
});

app.post("/api/:ep", async (req: Request, res: Response) => {
	try {

		Log.info("POST -- /api/:ep ", [req.params,req.body]);
		
		let result:NETWORK_PAYLOAD = new NETWORK_PAYLOAD_NONE();
		let endPointStr:string="NAE";
		let commandStr:string="NAC";

		if(!req.params.hasOwnProperty("ep") || req.params.ep.trim() == "")
		{
			result = {
				code:NETWORK_STATUS_CODES._400_BAD_REQUEST,
				message:"You are missing the endpoint parameter in the URL"
			} as NETWORK_ERROR_PAYLOAD;
		}

		if(result.code == NETWORK_STATUS_CODES._0_UNPROCESSED && !req.body.hasOwnProperty("command"))
		{
			result = {
				code:NETWORK_STATUS_CODES._400_BAD_REQUEST,
				message:"You are missing the command property in the body"
			} as NETWORK_ERROR_PAYLOAD;
		}

		
		if(result.code == NETWORK_STATUS_CODES._0_UNPROCESSED)
		{
			let command:NETWORK_COMMANDS = req.body.command as NETWORK_COMMANDS;
			if(command == undefined || !Object.values(NETWORK_COMMANDS).includes(command)) {
				result = {
					code:NETWORK_STATUS_CODES._404_NOT_FOUND,
					message:"Command not found : "+command
				} as NETWORK_ERROR_PAYLOAD;
			}
			else
			{
				endPointStr = req.params.ep;
				commandStr = command;
				switch(req.params.ep)
				{
					case NETWORK_ENDPOINTS.BEACON : result = await BeaconEP.get().route(command,req.body); break;

					default :
						result = {
							code:NETWORK_STATUS_CODES._404_NOT_FOUND,
							message:"Endpoint not found : "+req.body.ep
						} as NETWORK_ERROR_PAYLOAD;
				}
			}
		}

		if(result.type == NETWORK_PAYLOAD_TYPES.ERROR)
		{
			Log.error("ERROR{"+result.code+"} > "+endPointStr+" > "+commandStr+" > : ",result);
		}
		else
		{
			Log.info("RESPONSE{"+result.code+"} > "+endPointStr+" > "+commandStr+"> : ",MiscUtils.AddCommas(JSON.stringify(result).length));
		}

		return res.status(result.code).json(result.data);

	} catch (error) {
		Log.error('Error:', error);
		res.status(NETWORK_STATUS_CODES._500_INTERNAL_SERVER_ERROR).json({error:true,message:'Internal Server Error'});

		return false;
	}
});