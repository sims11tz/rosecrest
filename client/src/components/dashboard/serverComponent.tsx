import React, { useEffect, useRef, useState, type FC } from 'react'
import { SendPacketObj, SERVER_CALL_TYPE, SERVER_NODE_STATE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerObj, ServerResponseMessageObj } from '@shared/DataTypes';
import Button from '@mui/material/Button';
import SocketController from 'controllers/SocketController';
import { CUSTOM_EVENTS } from 'dataTypes/ClientDataTypes';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import AppController from 'controllers/AppController';

import './serverComponent.css';

interface ServerComponentProps {
	serverObj: ServerObj;
}

export const ServerComponent: FC<ServerComponentProps> = ({ serverObj }) => {

	const onDoubleClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		e.preventDefault();
		console.log(' double click br uh');
		
	};

	const [allString, setAllString] = useState<string>('');

	useEffect(() => { 

		let allStringBuild:string='';
		AppController.get().Servers.map((serverObjIn: ServerObj) => {
			if (serverObjIn.alias === serverObj!.alias){ return null; }
			allStringBuild += serverObjIn.alias+',';
		});
		setAllString(allStringBuild.slice(0, -1));

		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_OPEN, onServerOpen);
		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_CLOSED, onServerClosed);
		window.addEventListener(CUSTOM_EVENTS.SOCKET_SERVER_ERROR, onServerError);

		window.addEventListener(CUSTOM_EVENTS.ALL_CONNECT, onAllConnect);
		window.addEventListener(CUSTOM_EVENTS.ALL_DISCONNECT, onAllDisconnect);
		window.addEventListener(CUSTOM_EVENTS.ALL_PING, onAllPing);
		window.addEventListener(CUSTOM_EVENTS.ALL_RESET, onAllReset);
		
	
		return () => {
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_OPEN, onServerOpen);
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_CLOSED, onServerClosed);
			window.removeEventListener(CUSTOM_EVENTS.SOCKET_SERVER_ERROR, onServerError);

			window.removeEventListener(CUSTOM_EVENTS.ALL_CONNECT, onAllConnect);
			window.removeEventListener(CUSTOM_EVENTS.ALL_DISCONNECT, onAllDisconnect);
			window.removeEventListener(CUSTOM_EVENTS.ALL_PING, onAllPing);
			window.removeEventListener(CUSTOM_EVENTS.ALL_RESET, onAllReset);
		};

	}, []);

	const [clickCount, setClickCount] = useState<number>(0);
	const onClickButton = (callType:SERVER_CALL_TYPE) => {

		setClickCount(clickCount+1);

		let callObj:ServerCallMessageObj = {callId:SocketController.get().callId, callType: callType};
		if(callType === SERVER_CALL_TYPE.CONNECT || callType === SERVER_CALL_TYPE.DISCONNECT || callType === SERVER_CALL_TYPE.RESET)
		{
			setServerActionsSent("");
			setServerActionsReceived("");
		}
		else if(callType === SERVER_CALL_TYPE.SEND_PACKET || callType === SERVER_CALL_TYPE.START_PACKET_STREAM || callType === SERVER_CALL_TYPE.END_PACKET_STREAM)
		{
			if(selectedTarget === '') 
			{
				setServerActionsSent(" You must select a target server first.");
				return;
			}
			callObj.data = {
				target:selectedTarget,
				numPackets: (callType === SERVER_CALL_TYPE.START_PACKET_STREAM)?10:1
			} as SendPacketObj;

			setServerActionsSent("sent <"+callObj.callId+"> : "+callType+"  ");
			setServerActionsReceived("WAITING....");
		}

		SocketController.get().sendMessage(serverObj, callObj, receiveMessage);
	};

	const receiveMessage = (response:ServerResponseMessageObj) => {
		
		if(response.responseType === SERVER_RESPONSE_TYPE.MESSAGE)
		{
			setServerActionsReceived("received <"+response.callId+"> : "+response.responseType+" -- "+response.message+" ");
		}
	}

	const onAllConnect = (event:Event) => {
		onClickButton(SERVER_CALL_TYPE.CONNECT);
	};

	const onAllDisconnect = (event:Event) => {
		onClickButton(SERVER_CALL_TYPE.DISCONNECT);
	};
	
	const onAllPing = (event:Event) => {
		onClickButton(SERVER_CALL_TYPE.PING);
	};

	const onAllReset = (event:Event) => {
		onClickButton(SERVER_CALL_TYPE.RESET);
	};

	const onServerOpen = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObj.alias) return;
		
		setServerState(SERVER_NODE_STATE.CONNECTED);
	};

	const onServerClosed = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObj.alias) return;

		setServerState(SERVER_NODE_STATE.DISCONNECTED);
	};

	const onServerError = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		if(ce.detail.alias !== serverObj.alias) return;

		setServerState(SERVER_NODE_STATE.ERROR);
	};

	const [serverState,setServerState] = useState<SERVER_NODE_STATE>(SERVER_NODE_STATE.UNKNOWN);
	/*useEffect(() => {
	}, [serverState]);*/

	const [serverActionsSent,setServerActionsSent] = useState<string>("");
	const [serverActionsReceived,setServerActionsReceived] = useState<string>("");

	const [selectedTarget, setSelectedTarget] = useState<string>('');
	const handleTargetChange = (event: SelectChangeEvent<string>) => {
		console.log(' handleTargetChange : ',event.target.value);
		setSelectedTarget(event.target.value.toString());
	};
	
	const ServerTools = React.memo(() => {
		
		return (
			<div id="routerContainer">
				{ serverState !== SERVER_NODE_STATE.CONNECTED ? (
					<div className="serverNodeToolsList">
						<Button onClick={() => onClickButton(SERVER_CALL_TYPE.CONNECT)}>{SERVER_CALL_TYPE.CONNECT}</Button>
					</div>
				) : (
					<div className="serverNodeToolsList">
						<div className="serverToolPair">
							<Button onClick={() => onClickButton(SERVER_CALL_TYPE.PING)}>{SERVER_CALL_TYPE.PING}</Button>
							<Button onClick={() => onClickButton(SERVER_CALL_TYPE.DISCONNECT)}>{SERVER_CALL_TYPE.DISCONNECT}</Button>	
						</div>
						<div>&nbsp;</div>
						<div className="serverToolPair">
								<FormControl fullWidth>
									<InputLabel id="targetLabel">Target :</InputLabel>
									<Select
										labelId="targetLabel"
										id="targetSelect"
										label="Target"
										value={selectedTarget}
										onChange={handleTargetChange}
									>
									<MenuItem key="all_servers" value={allString}>All Servers</MenuItem>
									{AppController.get().Servers.map((serverObjIn: ServerObj) => {
										if (serverObjIn.alias === serverObj!.alias){ return null; }
										return (
											<MenuItem key={serverObjIn.alias} value={serverObjIn.alias}>
												{`${serverObjIn.alias} ${serverObjIn.ip}:${serverObjIn.port_external}`}
											</MenuItem>
										);
									})}
									</Select>
								</FormControl>
						</div>
						<div className="serverToolPair">
							<Button onClick={() => onClickButton(SERVER_CALL_TYPE.SEND_PACKET)}>{SERVER_CALL_TYPE.SEND_PACKET}</Button>
							<Button onClick={() => onClickButton(SERVER_CALL_TYPE.START_PACKET_STREAM)}>{SERVER_CALL_TYPE.START_PACKET_STREAM}</Button>
							<Button onClick={() => onClickButton(SERVER_CALL_TYPE.END_PACKET_STREAM)}>{SERVER_CALL_TYPE.END_PACKET_STREAM}</Button>
						</div>
					</div>
				)}
			</div>
		);
	});

	return (
		<div className='serverNode'>
			<div className='serverNodeContent'>
				<div className='serverNodeTitle'>{serverObj.alias} {serverObj.ip}:{serverObj.port_external}</div>
				<div className={`serverNodeStatus ${serverState}`}>Status : {serverState}</div>
				<div className="serverNodeTools">
					<ServerTools/>
				</div>
				<div className="serverActions">
					<div className="serverActionsSent">{serverActionsSent}</div>
					<div className="serverActionsReceived">{serverActionsReceived}</div>
				</div>
			</div>
		</div>
	)
}