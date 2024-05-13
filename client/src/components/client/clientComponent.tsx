import { ReactNode, useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@mui/material";
import { CUSTOM_EVENTS } from "dataTypes/ClientDataTypes";
import SocketController from "controllers/SocketController";
import { CLIENT_NODE_ACTION_STATE, CLIENT_NODE_STATE, SERVER_CALL_TYPE, ServerCallMessageObj, ServerObj, ServerResponseMessageObj } from "@shared/DataTypes";
import AppController from "controllers/AppController";

import './clientComponent.css';
import MiscUtils from "@shared/MiscUtils";


function ClientComponent() {

	const [serverObj,setServerObj] = useState<ServerObj>({} as ServerObj);
	const serverObjRef = useRef<ServerObj>(serverObj);
	useEffect(() => {
		serverObjRef.current = serverObj;
	}, [serverObj]);

	const [consoleStr,setConsoleStr] = useState<string>('');
	
	const { clientId } = useParams();

	const [clientStatus,setClientStatus] = useState<CLIENT_NODE_STATE>(CLIENT_NODE_STATE.UNKNOWN);
	const clientStatusRef = useRef<CLIENT_NODE_STATE>(clientStatus);
	useEffect(() => {
		clientStatusRef.current = clientStatus;
	}, [clientStatus]);

	const [clientActionState,setClientActionState] = useState<CLIENT_NODE_ACTION_STATE>(CLIENT_NODE_ACTION_STATE.NONE);
	const [clientStatusContent,setClientStatusContent] = useState<ReactNode>(<div></div>);
	const [clientStatusTitle,setClientStatusTitle] = useState<string>('');
	
	
	let style:React.CSSProperties = {
		// backgroundColor: 'rgba(255, 0, 0, 0.5)',
	}

//Always tries to reach connected state and then just reflects the server state

	useEffect(() => { 

		console.log(' clientComponent init() ---- ');

		setClientStatus(CLIENT_NODE_STATE.INITIALIZING);
		setClientStatusTitle('initializing...');

		const intervalId = 0;

		const foundServerObj = AppController.get().Servers.find(serverObj => serverObj.alias === clientId);
		if (foundServerObj) {
			setServerObj(foundServerObj);
			// const intervalId = setInterval(() => {
			// 	console.log('interval... : '+heartBeatIdx);
			// 	setHeartBeatIdx(heartBeatIdx+1);
			// }, 2000);

		} else {
			setClientStatus(CLIENT_NODE_STATE.ERROR);
			setClientStatusTitle('Could not locate server alias...');
			setConsoleStr('ERROR - bad alias = '+clientId);	
		}

		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_OPEN, onServerOpen);
		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_CLOSED, onServerClosed);
		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_ERROR, onServerError);

		window.addEventListener(CUSTOM_EVENTS.SOCKET_CLIENT_MESSAGE, onClientMessage);

		return () => {
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_OPEN, onServerOpen);
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_CLOSED, onServerClosed);
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_ERROR, onServerError);

			window.removeEventListener(CUSTOM_EVENTS.SOCKET_CLIENT_MESSAGE, onClientMessage);
	
			clearInterval(intervalId);
		};

	}, []);

	const heartBeatIdx = useRef(0);
	useEffect(() => {
		const intervalId = setInterval(() => {
			heartBeatIdx.current += 1;
			setHeartBeatIdx2(heartBeatIdx.current);
		}, 2000);
	
		return () => clearInterval(intervalId);
	}, []);

	const [heartBeatIdx2,setHeartBeatIdx2] = useState<number>(0);
	const heartBeat = () => {
		// setHeartBeatIdx(prevHeartBeatIdx => {
			const newHeartBeatIdx = heartBeatIdx.current;
	
			let heartStr = newHeartBeatIdx % 2 === 0 ? 'on' : 'off';
			setConsoleStr('heart beat <' + newHeartBeatIdx + '/'+heartBeatIdx2+'> - ' + heartStr+' - clientStatus='+clientStatusRef.current);

			if(clientStatusRef.current === CLIENT_NODE_STATE.INITIALIZING || clientStatusRef.current === CLIENT_NODE_STATE.DISCONNECTED)
			{
				let callObj:ServerCallMessageObj = {callId:SocketController.get().callId, callType: SERVER_CALL_TYPE.CONNECT};
				
				setClientActionState(CLIENT_NODE_ACTION_STATE.NONE);
				setClientStatusContent(<div></div>);
				
				SocketController.get().sendMessage(serverObj, callObj, (response:ServerResponseMessageObj) => {
	
					console.log('...... RECEIVED ---- ('+serverObj.alias+') response : ',response);

					setConsoleStr('heart beat <' + newHeartBeatIdx + '/'+heartBeatIdx2+'> - ' + heartStr+' - clientStatus='+clientStatusRef.current);

					// setServerActionsReceived("received <"+response.callId+"> : "+response.responseType+" -- "+response.message+" ");
					
				});
			}

			// return newHeartBeatIdx; // return the updated index for the next state
		// });
	}

	useEffect(() => {		
		if((clientStatus === CLIENT_NODE_STATE.INITIALIZING && heartBeatIdx.current < 1) || clientStatus === CLIENT_NODE_STATE.DISCONNECTED )
		{
			heartBeat();
		}
	},[clientStatus,heartBeatIdx2]);

	const onClientMessage = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;

		// console.log(' ______________________________ HERE IT IS ___________ ');
		// console.log(' onClientMessage : ',ce.detail);

		if(ce.detail.clientState === CLIENT_NODE_ACTION_STATE.RESET)
		{
			setClientActionState(CLIENT_NODE_ACTION_STATE.NONE);
			setClientStatusContent(
				<div></div>);
			return;
		}

		setClientActionState(ce.detail.clientState);
		switch(ce.detail.clientState)
		{
			case CLIENT_NODE_ACTION_STATE.LISTENING:
				console.log('CLIENT_NODE_ACTION_STATE.LISTENING : ',ce.detail);
				setClientStatusContent(
				<div>
					<h1>Listening.....</h1>
					{ce.detail.data.deltaCallType === SERVER_CALL_TYPE.SEND_PACKET ? (
						<div>For one 1 packet from {ce.detail.delta}</div>
					)
					:
					(
						<div>For packet stream from {ce.detail.delta}</div>
					)}
				</div>);
			break;

			case CLIENT_NODE_ACTION_STATE.COUNTDOWN:
				setClientStatusContent(
					<div>
						<h1>COUNT-DOWN</h1>
						<div className="countDownNumber">{ce.detail.clientData.countdown}</div>
					</div>);
			break;

			case CLIENT_NODE_ACTION_STATE.RECEIVED:

				console.log('CLIENT_NODE_ACTION_STATE.RECEIVED : ',ce.detail);
				setClientStatusContent(
					<div>
						<h1>RECEIVED PING</h1>
						<div>{ce.detail.message}</div>
						<div>&nbsp;</div>
						{ce.detail.data.deltaCallType === SERVER_CALL_TYPE.SEND_PACKET ? (
							<div></div>
						)
						:
						(
							<div>
								<div>
									<div>{ce.detail.data.streamResponses.length} out of {ce.detail.data.numPackets}</div>
								</div>
								<div>
									<div>
										{ce.detail.data.streamResponses.map((obj:ServerResponseMessageObj, index:number) => (
											<div key={"streamResults_"+index}>
												<div>Received packet from {ce.detail.data.delta}</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>);
			break;

			case CLIENT_NODE_ACTION_STATE.RESULTS:

				let totalTime:number = 0;
				let totalCalls:number =0;
				ce.detail.clientData.countdownResults.forEach((wsResponse:ServerResponseMessageObj) => {
					totalCalls++;
					totalTime += wsResponse.callTime;
				});

				setClientStatusContent(
					<div>
						<h1>RESULTS</h1>
						<div className="countDownResults">
							<div>
								{ce.detail.clientData.countdownResults.map((obj:ServerResponseMessageObj, index:number) => (
									<div key={"countDownResults_"+index}>
										<div>{serverObj.alias} called {obj.target} and took {MiscUtils.FormatMilliseconds(obj.callTime)}</div>
									</div>
								))}
							</div>
							<div>&nbsp;</div>
							<div>
								<div>Total Calls : {totalCalls}</div>
								<div>Total Time : {MiscUtils.FormatMilliseconds(totalTime)}</div>
							</div>
						</div>
					</div>);
			break;
		}
		

		setConsoleStr('received <'+ce.detail.callId+'> : '+ce.detail.responseType+' -- '+ce.detail.message+' ');
	}

	const onServerOpen = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObjRef.current.alias) return;
		
		if(clientStatusRef.current === CLIENT_NODE_STATE.INITIALIZING || clientStatusRef.current === CLIENT_NODE_STATE.DISCONNECTED)
		{
			setClientStatus(CLIENT_NODE_STATE.CONNECTED);
			setClientStatusTitle(' CONNECTED :) ');
		}
	};

	const onServerClosed = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObjRef.current.alias) return;

		setClientStatus(CLIENT_NODE_STATE.DISCONNECTED);
		setClientStatusTitle('DISCONNECTED...');
	};

	const onServerError = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObjRef.current.alias) return;

		setClientStatus(CLIENT_NODE_STATE.ERROR);
		setClientStatusTitle('ERROR...'+ce.detail.message);
	};

	return ( 
		<div className="clientContainer">
			<div className="clientHeader">
				<div className="clientTitle"> {clientId} </div>
				<div className="clientDetails"> {serverObj.ip} </div>
			</div>
			
			<div className="clientStatus">
				<div className={`clientStatusContainer ${clientStatus}`}>
					<div className="clientStatusTitle">{clientStatusTitle}</div>
					<div className={`clientStatusContent ${clientActionState}`}>
						{clientStatusContent}
					</div>
				</div>
			</div>
			<div className="clientTools">
				<div>
					Console : {consoleStr}
				</div>
				<div>TOOLS

					<Button onClick={heartBeat}> HEART BEAT </Button>

				{/* <Button onClick={() => onClickButton(SERVER_CALL_TYPE.START_PACKET_STREAM)}>{SERVER_CALL_TYPE.START_PACKET_STREAM}</Button>
				<Button onClick={() => onClickButton(SERVER_CALL_TYPE.END_PACKET_STREAM)}>{SERVER_CALL_TYPE.END_PACKET_STREAM}</Button> */}
				</div>
			</div>
		</div>
	)
}

export default ClientComponent;