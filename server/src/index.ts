import cors from "cors";
import express, { Request, Response } from "express";
import Log from "./utils/Log";
import { NETWORK_ENDPOINTS, NETWORK_COMMANDS, NETWORK_PAYLOAD, NETWORK_STATUS_CODES, NETWORK_ERROR_PAYLOAD, NETWORK_PAYLOAD_TYPES, NETWORK_PAYLOAD_NONE } from "@shared/SharedNetworking";
import MiscUtils from "@shared/MiscUtils";
import {ServerResponseMessageObj, SERVER_RESPONSE_TYPE, ServerCallMessageObj, SendPacketObj, SERVER_CALL_TYPE, CLIENT_NODE_ACTION_STATE} from "@shared/DataTypes";
import { BeaconEP } from "./endpoints/BeaconEP";
import { Server as WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';
import { Socket } from "dgram";
import { SocketClient } from "./endpoints/socketClient";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const port = process.env.REACT_APP_SERVER_PORT || 7000;

const server_alias = process.env.SERVER_ALIAS;
const server_list = process.env.SERVER_LIST;
const location = process.env.LOCATION;
const latency = process.env.LATENCY;

const ip = process.env[server_alias+"_ip"];
const port_external = process.env[server_alias+"_port"];
const port_internal = process.env.REACT_APP_SERVER_PORT || 7000;

// app.listen(port_internal, () => { console.log(`App server now listening on port ${port_internal}`); });

Log.info("<"+server_alias+">____SERVER_ALIAS_____ ");
Log.info("<"+server_alias+"> ip : "+ip);
Log.info("<"+server_alias+"> port_external : "+port_external); 
Log.info("<"+server_alias+"> port_internal : "+port_internal);
Log.info("<"+server_alias+"> server_list : "+server_list);
Log.info("<"+server_alias+"> location : "+location); 
Log.info("<"+server_alias+"> latency : "+latency);

// Create a single HttpServer from the express app
const httpServer = createServer(app);



// Initialize the WebSocket on the HttpServer
const wss = new WebSocketServer({ server: httpServer });
SocketClient.get().setWss(wss);

wss.on('connection', (ws) => {
	ws.on('message', async (message) => {
		// Log.info(`${server_alias} Received: ${message}`);
		let serverCallObj:ServerCallMessageObj = JSON.parse(message.toString());
		// Log.info(' serverCallObj : ',serverCallObj);

		let responseObj:ServerResponseMessageObj = { callId:serverCallObj.callId } as ServerResponseMessageObj;
		switch(serverCallObj.callType)
		{
			case SERVER_CALL_TYPE.CONNECT:
				responseObj = {responseType:SERVER_RESPONSE_TYPE.WELCOME,message:"Welcome to the server"} as ServerResponseMessageObj;
			break;

			case SERVER_CALL_TYPE.PING:
				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"pong"} as ServerResponseMessageObj;
			break;

			case SERVER_CALL_TYPE.DISCONNECT:
				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"Goodbye"} as ServerResponseMessageObj;

				wss.clients.forEach((client: WebSocket) => {
					client.close();
				});
			break;

			case SERVER_CALL_TYPE.RESET:
				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"Reset"} as ServerResponseMessageObj;

				let clientResetMessage:ServerResponseMessageObj = {
					callId: -1,
					callTime: 0,
					responseType: SERVER_RESPONSE_TYPE.CLIENT_MESSAGE,
					clientState: CLIENT_NODE_ACTION_STATE.RESET,
					message: "reset your state please..."
				};
				await SocketClient.get().SendToAllClients(clientResetMessage);
			break;

			case SERVER_CALL_TYPE.SEND_PACKET:
				Log.info('SERVER_CALL_TYPE.SEND_PACKET');
				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"Packet sent"} as ServerResponseMessageObj;

				//Tell targets clients to go into listen mode
				await SocketClient.get().AllTargetClientsListenMode(serverCallObj);
				
				//Show CountDown on my clients
				await SocketClient.get().AllMyClientsShowCountDown(3);

				//Tell targets to send the packet
				serverCallObj.data.deltaCallType = serverCallObj.callType;
				serverCallObj.callType = SERVER_CALL_TYPE.PING;
				let wsResponses:ServerResponseMessageObj[] = await SocketClient.get().CallAnotherServer(serverCallObj);
				let totalTime:number = 0;
				let totalCalls:number =0;
				wsResponses.forEach((wsResponse:ServerResponseMessageObj) => {
					totalCalls++;
					totalTime += wsResponse.callTime;
				});
				responseObj.data = {totalCalls:totalCalls,totalTime:totalTime};
				responseObj.message = "pinged : "+totalCalls+"   took : "+totalTime+" ms";

				//Tell targets that they received a packet
				let serverCallObjReceived:ServerCallMessageObj = {
					...serverCallObj,
					callType:SERVER_CALL_TYPE.RELAY_TO_ALL_CLIENTS,
					data: {
						...serverCallObj.data,
						clientState:CLIENT_NODE_ACTION_STATE.RECEIVED,
						message:"I received a ping from "+server_alias,
						delta:server_alias
					}
				};
				await SocketClient.get().CallAnotherServer(serverCallObjReceived);

				//Tell my clients to show the results
				await SocketClient.get().AllMyClientsShowResults(wsResponses);

			break;

			case SERVER_CALL_TYPE.START_PACKET_STREAM:
				Log.info('SERVER_CALL_TYPE.START_PACKET_STREAM ::: ',serverCallObj);

				//Tell targets clients to go into listen mode
				await SocketClient.get().AllTargetClientsListenMode(serverCallObj);
				
				//Show CountDown on my clients
				await SocketClient.get().AllMyClientsShowCountDown(3);

			//LOOP
				let streamResponses:ServerResponseMessageObj[] = [];

				let streamTotalTime:number = 0; 
				let streamTotalCalls:number = 0;

				for(let streamX:number=0; streamX<serverCallObj.data.numPackets; streamX++)
				{
					serverCallObj.data.deltaCallType = serverCallObj.callType;
					serverCallObj.callType = SERVER_CALL_TYPE.PING;
					
					let streamResponse:ServerResponseMessageObj[] = await SocketClient.get().CallAnotherServer(serverCallObj);
					
					streamResponse.forEach((sResponse:ServerResponseMessageObj) => {
						streamResponses.push(sResponse);
						streamTotalCalls++;
						streamTotalTime += sResponse.callTime;
					});
					responseObj.data = {totalCalls:streamTotalCalls,totalTime:streamTotalTime};
					responseObj.message = "pinged : "+streamTotalCalls+"   took : "+streamTotalTime+" ms";

					//Tell targets that they received a packet
					let serverCallObjReceived2:ServerCallMessageObj = {
						...serverCallObj,
						callType:SERVER_CALL_TYPE.RELAY_TO_ALL_CLIENTS,
						data: {
							...serverCallObj.data,
							clientState:CLIENT_NODE_ACTION_STATE.RECEIVED,
							message:"I received a ping from"+server_alias,
							delta:server_alias,
							streamResponses: streamResponses
						}
					};
					await SocketClient.get().CallAnotherServer(serverCallObjReceived2);
				}

				// await MiscUtils.GhettoWait(1000);

				await SocketClient.get().AllMyClientsShowResults(streamResponses);

				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"Packet Stream Started"} as ServerResponseMessageObj;
			break;

			case SERVER_CALL_TYPE.END_PACKET_STREAM:
				Log.info('SERVER_CALL_TYPE.END_PACKET_STREAM');
				responseObj = {responseType:SERVER_RESPONSE_TYPE.MESSAGE,message:"Packet Stream Ended"} as ServerResponseMessageObj;
			break;

			case SERVER_CALL_TYPE.RELAY_TO_ALL_CLIENTS:

				let clientMessage2:ServerResponseMessageObj = {
					callId: -1,
					callTime: 0,
					responseType: SERVER_RESPONSE_TYPE.CLIENT_MESSAGE,
					clientState: serverCallObj.data.clientState,
					delta: serverCallObj.data.delta,
					message: serverCallObj.data.message,
					data: serverCallObj.data
				};
				await SocketClient.get().SendToAllClients(clientMessage2);
				
				break;

		}

		let delay:number = 0;
		if(latency != undefined && serverCallObj.callType == SERVER_CALL_TYPE.PING)
		{
			delay = parseInt(latency)/2;
		}

		// Log.info('('+server_alias+') _________________________ DELAY : '+delay);

		setTimeout(() => {
			responseObj.callId = serverCallObj.callId;
			ws.send(JSON.stringify(responseObj));
		}, delay);
		
	});

	ws.on('error', (error) => {
		console.error(`WebSocket ${server_alias} error: ${error.message}`);
	});

	ws.send(JSON.stringify({responseType:SERVER_RESPONSE_TYPE.WELCOME} as ServerResponseMessageObj));
});

app.get("/ping", (req: Request, res: Response) => {
	Log.info("GET --location="+location+" --latency="+latency+" /ping");

	return res.json({ message: "pong", location: location, latency: latency});
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


httpServer.listen(port_internal, () => {
	console.log(`Server now listening on http://127.0.0.1:${port_internal}`);
});