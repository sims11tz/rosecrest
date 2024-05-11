import { useEffect, useState } from "react";
import MiscUtils from "@shared/MiscUtils";
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { CHART_GROUP_BY_MODES, CHART_TYPES, CHIP_SIZES, CUSTOM_EVENTS, DragAssocObj, stringToChipType, TRANSACTIONS_VIEW_MODES } from "dataTypes/ClientDataTypes";
import { GridToolsComponent } from "./gridToolsComponent";
import { StringTypeChip } from "components/stringTypes/stringTypesChip";
import LeftGutterComponent from "./leftGutterComponent";
import Divider from '@mui/material/Divider';
import OverviewComponent from "./overviewComponent";
import ChartingComponent from "components/charting/chartingComponent";
import GridComponent from "./gridComponent";
import { TransactionsExpanderCompmonent } from "./transactionsExpanderCompmonent";
import { ChartingToolsGroupByCompmonent } from "components/charting/chartingToolsGroupByComponent";
import { ChartingTypeComponent } from "components/charting/chartingTypeComponent";

import './transactionsComponent.css';

export interface ChartToolsComponentProps {
	viewMode: TRANSACTIONS_VIEW_MODES,
	chartTypeMode: CHART_TYPES,
	chartGroupByMode: CHART_GROUP_BY_MODES
}

function TransactionsComponent() {

	const [viewMode, setViewMode] = useState<TRANSACTIONS_VIEW_MODES>(TRANSACTIONS_VIEW_MODES.PEAKING);
	useEffect(() => {

		window.addEventListener(CUSTOM_EVENTS.TRANSACTIONS_EXPANDER_CHANGE,handleTransactionsExpanderChange);
		window.addEventListener(CUSTOM_EVENTS.CHART_GROUP_BY_CHANGE, handleGroupByModeChange);
		window.addEventListener(CUSTOM_EVENTS.CHART_TYPES_CHANGE, handleChartTypeChange);

		return () => {
			window.removeEventListener(CUSTOM_EVENTS.TRANSACTIONS_EXPANDER_CHANGE,handleTransactionsExpanderChange);
			window.removeEventListener(CUSTOM_EVENTS.CHART_GROUP_BY_CHANGE, handleGroupByModeChange);
			window.removeEventListener(CUSTOM_EVENTS.CHART_TYPES_CHANGE, handleChartTypeChange);
		}
	}, []);

	const [chartGroupByMode, setChartGroupByMode] = useState<CHART_GROUP_BY_MODES>(CHART_GROUP_BY_MODES.WEEK);
	const handleGroupByModeChange = (event: Event) => {
		setChartGroupByMode((event as CustomEvent).detail.chartGroupByMode);
	}
	
	const [chartTypeMode, setChartTypeMode] = useState<CHART_TYPES>(CHART_TYPES.LINE_OVER_TIME);
	const handleChartTypeChange = (event: Event) => {
		setChartTypeMode((event as CustomEvent).detail.chartType);
	}

	const handleTransactionsExpanderChange = (event:Event) => {
		let ce:CustomEvent = event as CustomEvent;
		setViewMode(ce.detail.viewMode);
	}

	const [dragObj, setDragObj] = useState({} as DragAssocObj);
	function handleDragStart(dragEvent:DragStartEvent) {

		let dragObj:DragAssocObj = MiscUtils.GetNestedPropertySafe(dragEvent,['active','data','current','dragObj']);
		setDragObj(dragObj);

		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SRTING_TYPES_DRAGGING_STARTED, { detail: {dragId : dragEvent.active.id, dragObj: dragObj} }));
	}
	
	function handleDragEnd(dragEvent:DragEndEvent)
	{
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.STRING_TYPES_DRAGGING_ENDED, { 
			detail : {
				dragId : MiscUtils.GetNestedPropertySafe(dragEvent, ['active','data','current','dragId']),
				dragObj : MiscUtils.GetNestedPropertySafe(dragEvent, ['active','data','current','dragObj']),
				assocId : MiscUtils.GetNestedPropertySafe(dragEvent, ['active','data','current','assocId'])
			}
		}));
	}

	return (
		<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}  >
			<DragOverlay className="dragOverlay" dropAnimation={null} modifiers={[snapCenterToCursor]}>
				<div className="dragOverlayContent">
					<div className="menuItemButton">
						<StringTypeChip id={dragObj.id} name={dragObj.name} key={dragObj.id} size={CHIP_SIZES.small} type={stringToChipType(dragObj.endpoint)} />
						<span className="menuItemText">{dragObj.name}</span>
					</div>
				</div>
			</DragOverlay>
			<div id="transactionsComponent" className={viewMode}>
				<div id="topSection">
					<div className="chartOverTools">
						<ChartingTypeComponent viewMode={viewMode} chartTypeMode={chartTypeMode} chartGroupByMode={chartGroupByMode}/>
						<Divider orientation="vertical" sx={{ borderRightWidth: 3 , borderLeftWidth: 3 }} />
						<ChartingToolsGroupByCompmonent viewMode={viewMode} chartTypeMode={chartTypeMode} chartGroupByMode={chartGroupByMode}/>
						<OverviewComponent />
					</div>
					<ChartingComponent viewMode={viewMode} chartTypeMode={chartTypeMode} chartGroupByMode={chartGroupByMode} />
				</div>
				<div id="bottomSection">
					<div id="gridToolsContainer">
						<TransactionsExpanderCompmonent />
						<GridToolsComponent />
					</div>
					<div className="gridContainer">
						<LeftGutterComponent className="leftGutterComponent" />
						<GridComponent/>
					</div>
				</div>
			</div>
		</DndContext>
	)
}

export default TransactionsComponent;