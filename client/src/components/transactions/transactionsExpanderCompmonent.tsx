import { CSSProperties, FC, useState } from 'react';
import { Button } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CUSTOM_EVENTS, TRANSACTIONS_VIEW_MODES } from 'dataTypes/ClientDataTypes';

import './transactionsExpanderComponent.css';

export const TransactionsExpanderCompmonent: FC = function TransactionsExpanderCompmonent() {

	const [viewMode, setViewMode] = useState<TRANSACTIONS_VIEW_MODES>(TRANSACTIONS_VIEW_MODES.PEAKING);

	const handleViewModeChange = (newMode:TRANSACTIONS_VIEW_MODES) => {

		setViewMode(newMode);

		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.TRANSACTIONS_EXPANDER_CHANGE, { detail: {viewMode: newMode} }));
	}

	const singleButton:CSSProperties = {
		width: '56px',
		height: '56px'
	}

	const dualButton:CSSProperties = {
		width: '56px',
		height: '28px'
	}

	const dualButtons:CSSProperties = {
		display: 'flex',
		flexDirection: 'column',

		marginRight: '8px',

		width: '56px',
		height: '56px'
	}

	const renderState = () => {
		switch (viewMode) {
			case TRANSACTIONS_VIEW_MODES.CLOSED:
				return <Button style={singleButton} variant="outlined" onClick={() => handleViewModeChange(TRANSACTIONS_VIEW_MODES.PEAKING)}>< ExpandMoreIcon/></Button>;

			case TRANSACTIONS_VIEW_MODES.PEAKING:
				return <div style={dualButtons}>
						<Button style={dualButton} variant="outlined" onClick={() => handleViewModeChange(TRANSACTIONS_VIEW_MODES.CLOSED)}><ExpandLessIcon /></Button>
						<Button style={dualButton} variant="outlined" onClick={() => handleViewModeChange(TRANSACTIONS_VIEW_MODES.EXPANDED)}><ExpandMoreIcon /></Button>
					</div>;

			case TRANSACTIONS_VIEW_MODES.EXPANDED:
				return <Button style={singleButton} variant="outlined" onClick={() => handleViewModeChange(TRANSACTIONS_VIEW_MODES.PEAKING)}><ExpandLessIcon /></Button>;
		}
	};
	return (
		<div>
			{renderState()}
		</div>
	)
}