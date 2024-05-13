import { useEffect } from 'react';
import './headerComponent.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { CUSTOM_EVENTS } from 'dataTypes/ClientDataTypes';

export function HeaderComponent()
{

	const onConnectAll = () => {
		console.log(' onConnectAll() ');
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ALL_CONNECT,{}));
	}

	const onDisconnectAll = () => {
		console.log(' onDisconnectAll() ');
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ALL_DISCONNECT,{}));
	}

	const onPingAll = () => {
		console.log(' onPingAll() ');
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ALL_PING,{}));
	}

	const onResetAll = () => {
		console.log(' onResetAll() ');
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.ALL_RESET,{}));
	}

	return (
		<div className='headerContainer'>
			<div className='headerLogoContainer'><Link to="/"><div className='headerLogo'></div></Link></div>
			{/* <div className='headerButton'><Link to="/transactions"><div className="headerButtonContent">Transactions</div></Link></div> */}
			<div className='headerSpacer'>&nbsp;_&nbsp;</div>
			<div className='headerButton'>
				<Button onClick={onConnectAll}>Connect All</Button>
			</div>
			<div>&nbsp;</div>
			<div>
				<Button onClick={onDisconnectAll}>Disconnect All</Button>
			</div>
			<div>&nbsp;</div>
			<div>
				<Button onClick={onPingAll}>Ping All</Button>
			</div>
			<div>&nbsp;</div>
			<div>
				<Button onClick={onResetAll}>RESET All</Button>
			</div>
			{/* <div className='headerButton'><Link to="/categories"><div className="headerButtonContent">Categeories</div></Link></div>
			<div className='headerButton'><Link to="/groups"><div className="headerButtonContent">Groups</div></Link></div>
			<div className='headerButton'><Link to="/tags"><div className="headerButtonContent">Tags</div></Link></div> */}
		</div>
	)
}