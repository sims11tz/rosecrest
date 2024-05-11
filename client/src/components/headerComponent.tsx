import { useEffect } from 'react';
import './headerComponent.css';
import { Link } from 'react-router-dom';

export function HeaderComponent()
{
	return (
		<div className='headerContainer'>
			<div className='headerLogoContainer'><Link to="/"><div className='headerLogo'></div></Link></div>
			<div className='headerButton'><Link to="/transactions"><div className="headerButtonContent">Transactions</div></Link></div>
			<div className='headerSpacer'>&nbsp;_&nbsp;</div>
			<div className='headerButton'><Link to="/categories"><div className="headerButtonContent">Categeories</div></Link></div>
			<div className='headerButton'><Link to="/groups"><div className="headerButtonContent">Groups</div></Link></div>
			<div className='headerButton'><Link to="/tags"><div className="headerButtonContent">Tags</div></Link></div>
		</div>
	)
}