import React, { FC, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CHART_GROUP_BY_MODES, CHART_TYPES, CUSTOM_EVENTS } from 'dataTypes/ClientDataTypes';
import MiscUtils from '@shared/MiscUtils';
import { ChartToolsComponentProps } from 'components/transactions/transactionsComponent';

import './chartingToolsGroupByCompmonent.css';

export const ChartingToolsGroupByCompmonent: FC<ChartToolsComponentProps> = function ChartingToolsGroupByCompmonent({viewMode,chartTypeMode,chartGroupByMode}) {

	const handleGroupByChange = (event: React.MouseEvent<HTMLElement>,newGroupByMode: CHART_GROUP_BY_MODES) => {
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.CHART_GROUP_BY_CHANGE, { detail: {chartGroupByMode: newGroupByMode} }));
	};
	
	const renderLineTools = () => {

		if(chartTypeMode == CHART_TYPES.LINE_OVER_TIME)
		{
			return (
				<ToggleButtonGroup
					exclusive
					value={chartGroupByMode}
					onChange={handleGroupByChange}
					aria-label="Date Grouping Mode"
				>
					<ToggleButton value={CHART_GROUP_BY_MODES.DAY} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_GROUP_BY_MODES.DAY)}>
						<CalendarViewDayIcon />
					</ToggleButton>
					<ToggleButton value={CHART_GROUP_BY_MODES.WEEK} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_GROUP_BY_MODES.WEEK)}>
						<CalendarViewWeekIcon />
					</ToggleButton>
					<ToggleButton value={CHART_GROUP_BY_MODES.MONTH} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_GROUP_BY_MODES.MONTH)}>
						<CalendarViewMonthIcon />
					</ToggleButton>
					<ToggleButton value={CHART_GROUP_BY_MODES.YEAR} aria-label={MiscUtils.CapitalizeFirstLetter(CHART_GROUP_BY_MODES.YEAR)}>
						<CalendarTodayIcon />
					</ToggleButton>
				</ToggleButtonGroup>
			);
		}
		else
		{
			return;
		}
	};

	return (
		<div>
			{renderLineTools()}
		</div>
	)
}