import React, { FC, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { CHART_TYPES, CUSTOM_EVENTS } from 'dataTypes/ClientDataTypes';
import MiscUtils from '@shared/MiscUtils';
import { ChartToolsComponentProps } from 'components/transactions/transactionsComponent';

import './chartingTypeComponent.css';

export const ChartingTypeComponent: FC<ChartToolsComponentProps> = function ChartingTypeComponent({viewMode,chartTypeMode,chartGroupByMode}) {

	const handleChartType = (event: React.MouseEvent<HTMLElement>,newChartType: CHART_TYPES) => {
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.CHART_TYPES_CHANGE, { detail: {chartType: newChartType} }));
	};
	
	return (
		<ToggleButtonGroup
			value={chartTypeMode}
			exclusive
			onChange={handleChartType}
			aria-label="Chart Type"
		>
			<ToggleButton value={CHART_TYPES.LINE_OVER_TIME} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_TYPES.LINE_OVER_TIME)}>
				<InsightsIcon />
			</ToggleButton>
			<ToggleButton value={CHART_TYPES.PIE} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_TYPES.PIE)}>
				<PieChartIcon />
			</ToggleButton>
			<ToggleButton value={CHART_TYPES.BAR} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_TYPES.BAR)}>
				<BarChartIcon />
			</ToggleButton>
		</ToggleButtonGroup>
	)
}