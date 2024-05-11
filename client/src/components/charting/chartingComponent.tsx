import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { AgChartOptions, AgMapShapeSeriesOptions, AgPieSeriesOptions } from 'ag-charts-enterprise';
import { AgChartsReact } from "ag-charts-react";
import { CHART_GROUP_BY_MODES, CHART_TYPES, CUSTOM_EVENTS, TRANSACTIONS_VIEW_MODES } from 'dataTypes/ClientDataTypes';
import { useData } from 'app/appDataProvider';
import MiscUtils from '@shared/MiscUtils';
import { STRING_TYPES, TransactionObj, StringTypeObj } from '@shared/DataTypes';
import { ChartToolsComponentProps } from 'components/transactions/transactionsComponent';

import './chartingComponent.css';

interface TransactionChartData {
	date: string;
	dateObj?: Date;
	amount: number;
}

interface AggregatedChartData {
	[key: string]: TransactionChartData;
}


interface TransactionPieData {
	type: STRING_TYPES;
	name: string;
	amount: number;
	quantity: number;
}

interface AggregatedPieData { 
	[key: string]: TransactionPieData;
}


export const ChartingComponent: FC<ChartToolsComponentProps> = function ChartingComponent({viewMode,chartTypeMode,chartGroupByMode}) {

	const [chartKey, setChartKey] = useState(0);
	const chartRef = useRef(null);
	useEffect(() => {
		setChartKey(prevKey => prevKey + 1);
	},[viewMode]);
	const onChartReady = (params:any) => {}

	const {activeRows} = useData();
	useEffect(() => {

		if(chartTypeMode === CHART_TYPES.LINE_OVER_TIME)
		{
			let aggregatedData:TransactionChartData[] = [];
			switch(chartGroupByMode)
			{
				case CHART_GROUP_BY_MODES.DAY: 
						aggregatedData = aggregateDataByDay(activeRows); 
						break;

				case CHART_GROUP_BY_MODES.WEEK:
						aggregatedData = aggregateDataByWeek(activeRows);
						break;

				case
					CHART_GROUP_BY_MODES.MONTH: 
						aggregatedData = aggregateDataByMonth(activeRows);
						break;

				default : 
					aggregatedData = activeRows;
					break;
			} 

			setChartOptions({
				autoSize : true,
				data: aggregatedData,
				series: [
					{
						type: "line",
						xKey: "dateObj",
						yKey: "amount",
						yName: "Amount",
						tooltip: {
							renderer: (params) => {
								return {
									content: `${params.datum.date.substring(0,10)}<br>$${params.datum.amount.toFixed(2)}`
								};
							}
						}
					},
				],
				axes: [
					{
						type: 'number',
						position: 'left',
						title: {
							text: 'Amount ($)'
						},
						label: {
							// formatter: (params) => `$${params.value.toFixed(2)}`
							formatter: (params) => `${params.value}`
						}
					},
					{
						type: 'time',
						position: 'bottom',
						title: {
							text: 'Date'
						},
						label :{
							formatter: (params) => `${params.value.substring(0,10)}`
							// format: '%Y-%m-%d'
						}
					}
				]
			});
		}
		else if(chartTypeMode === CHART_TYPES.PIE)
		{
			let aggregatedData:TransactionPieData[] = aggregateDataByGroups(activeRows);

			// calloutLabelKey sectorLabelKey legendItemKey

			let agMapShapeSeriesOptions:AgPieSeriesOptions = {
				type: 'pie',
				angleKey: 'amount',
				legendItemKey: 'name',
				sectorLabelKey: 'quantity',
				calloutLabelKey: 'name'
			};
			
			setChartOptions({
				autoSize : true,
				data: aggregatedData,
				series: [
					agMapShapeSeriesOptions
				]
			});
		}

	} ,[activeRows,chartGroupByMode,chartTypeMode]);

	const aggregateDataByGroups = (data:TransactionObj[]): TransactionPieData[] => {

		let groupedData:AggregatedPieData = {};

		data.forEach(transactionObj => {

			if(transactionObj.groups.length > 0)
			{
				transactionObj.groups.forEach(groupObj => {

					if(groupedData.hasOwnProperty(groupObj.inferedType+"_"+groupObj.id) === false)
					{
						groupedData[groupObj.inferedType+"_"+groupObj.id] = {
							type: groupObj.inferedType,
							name: groupObj.name,
							amount: 0,
							quantity: 0
						} as TransactionPieData;
					}

					groupedData[groupObj.inferedType+"_"+groupObj.id].amount += transactionObj.amount;
					groupedData[groupObj.inferedType+"_"+groupObj.id].quantity ++;
				});
			}
		});

		return Object.values(groupedData);
	};

	const aggregateDataByDay = (data: TransactionObj[]): TransactionChartData[] => {
		const aggregated = data.reduce<AggregatedChartData>((acc, curr) => {
			const date = new Date(curr.date);
			const dayMonthYearKey = `${date.getMonth() + 1}-${date.getDay() + 1}-${date.getFullYear()}`;
	
			if (!acc[dayMonthYearKey]) {
				acc[dayMonthYearKey] = {
					date: dayMonthYearKey,
					dateObj: date,
					amount: 0
				};
			}
	
			acc[dayMonthYearKey].amount += curr.amount;
			return acc;
		}, {});
	
		return Object.values(aggregated);
	};

	const aggregateDataByWeek = (data: TransactionObj[]): TransactionChartData[] => {
		const aggregated = data.reduce<AggregatedChartData>((acc, curr) => {
			const date = new Date(curr.date);
			const weekYearKey = `Week ${MiscUtils.GetISOWeek(date)}-${MiscUtils.GetISOYear(date)}`;
	
			if (!acc[weekYearKey]) {
				acc[weekYearKey] = {
					date: weekYearKey,
					dateObj: date,
					amount: 0
				};
			}
	
			acc[weekYearKey].amount += curr.amount;
			return acc;
		}, {});
	
		return Object.values(aggregated);
	};

	const aggregateDataByMonth = (data: TransactionObj[]): TransactionChartData[] => {
		const aggregated = data.reduce<AggregatedChartData>((acc, curr) => {
			const date = new Date(curr.date);
			const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
	
			if (!acc[monthYearKey]) {
				acc[monthYearKey] = {
					date: monthYearKey,
					dateObj: date,
					amount: 0
				};
			}
	
			acc[monthYearKey].amount += curr.amount;
			return acc;
		}, {});
	
		return Object.values(aggregated);
	};

	const [chartOptions, setChartOptions] = useState<AgChartOptions>({
		data: [],
		series: [],
		axes: [],
		autoSize : true
	});
	
	const chartContainer:CSSProperties = {
		width: "100%",
		height: "100%",
	};

	return (
		<div style={chartContainer} className={viewMode}>
			<AgChartsReact id="agChart" ref={chartRef} key={chartKey}
				options={chartOptions}
				onChartReady={onChartReady}
			/>
		</div>
	);
}

export default ChartingComponent;