import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, RowNode } from 'ag-grid-community';
import { AssocObj, TransactionObj } from '@shared/DataTypes';
import { CHIP_TYPES, CUSTOM_EVENTS, DragAssocObj } from 'dataTypes/ClientDataTypes';
import { CellRendererChips } from './cellRendererChips';
import { NETWORK_ENDPOINT_BY_NAME } from '@shared/SharedNetworking';
import TransactionsController from 'controllers/TransactionsController';
import StringTypesController from 'controllers/StringTypesController';
import MiscUtils from '@shared/MiscUtils';
import {useDroppable} from '@dnd-kit/core';
import { useData } from 'app/appDataProvider';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './gridComponent.css';

const GridComponent:React.FC = () => { 

	const {setActiveRows} = useData();

	const gridApiRef = useRef<any>(null);

	const dragObjRef = useRef<DragAssocObj | undefined>();
	const [dragObj, setDragObj] = useState<DragAssocObj>();
	useEffect(() => {
		dragObjRef.current = dragObj;
	}	,[dragObj]);

	const onGridReady = (params:any) => {
		gridApiRef.current = params.api;
		// gridApiRef.current.setDomLayout('autoHeight');
	}

	const getRowNodeId = (data:any) => {
		return data.data.id;
	}

	type TimerId = ReturnType<typeof setTimeout>;
	let _timeout:TimerId;

	const [transactions, setTransactions] = useState<TransactionObj[]>([]);
	useEffect(() => {

		TransactionsController.get().loadTransactions().then((data) => {
			
			setTransactions(data);
			gridInitialize(_timeout,gridApiRef.current);

		}).catch((error) => {
			console.error("Failed to load transactions:", error);
		});

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('request_deleteAssoc', deleteAssoc);

		window.addEventListener(CUSTOM_EVENTS.SRTING_TYPES_DRAGGING_STARTED, handleStringTypes_DragStarted);
		window.addEventListener(CUSTOM_EVENTS.STRING_TYPES_DRAGGING_ENDED, handleStringTypes_DragEnded);
		window.addEventListener(CUSTOM_EVENTS.STRING_TYPES_DOUBLE_CLICK, handleStringTypes_DoubleClick);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('dragover', handleMouseMove);

			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('request_deleteAssoc', deleteAssoc);

			window.removeEventListener(CUSTOM_EVENTS.SRTING_TYPES_DRAGGING_STARTED, handleStringTypes_DragStarted);
			window.removeEventListener(CUSTOM_EVENTS.STRING_TYPES_DRAGGING_ENDED, handleStringTypes_DragEnded);
			window.removeEventListener(CUSTOM_EVENTS.STRING_TYPES_DOUBLE_CLICK, handleStringTypes_DoubleClick);
		};

	},[]);

	const deleteAssoc = (event:Event) => {
		const customEvent = event as CustomEvent<AssocObj>;
		let assocObj: AssocObj = customEvent.detail;

		StringTypesController.get().deleteAssoc(NETWORK_ENDPOINT_BY_NAME(assocObj.assocType),assocObj).then((data) => {

			let updatedTransaction:TransactionObj = TransactionsController.get().ModifyTransactionObject(assocObj.transactionId,{stringObjsToRemove:[{id:assocObj.id, name:assocObj.name ,inferedType: assocObj.assocType}]})

			gridApiRef.current.applyTransaction({
				update: [updatedTransaction]
			});

		}).catch((error) => {
			console.error("Failed to load transactions:", error);
		});
	};
	
	
	const [shiftDown, setShiftDown] = useState<boolean>(false);
	const shiftDownRef = useRef<boolean>(shiftDown);
	useEffect(() => {
		shiftDownRef.current = shiftDown;
	}, [shiftDown]);
	const handleKeyUp = (event: KeyboardEvent) => {

		if (event.code === 'ShiftLeft')
		{
			if(shiftDownRef.current)
			{
				setShiftDown(false);
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {

		if (event.code === 'ShiftLeft')
		{
			if(!shiftDownRef.current)
			{
				setShiftDown(true);
			}
		}
		else if (event.code === 'Space')
		{
			if(isDragging && dragObjRef.current != null && dragObjRef.current.id != null)
			{
				event.preventDefault();

				let dragObj:DragAssocObj = dragObjRef.current;
				let transactionId = -1;

				const elements = document.elementsFromPoint(mousePositionRef.x, mousePositionRef.y);
				const targetChildren = elements.filter(el => el.classList.contains('ag-row'));
				if(targetChildren != null && targetChildren.length > 0)
				{
					transactionId = targetChildren[0].getAttribute('row-id') ? parseInt(targetChildren[0].getAttribute('row-id')!, 10) || -1 : -1;
				}

				if(transactionId > 0)
				{
					StringTypesController.get().createAssoc(NETWORK_ENDPOINT_BY_NAME(dragObj.endpoint),{assocId:dragObj.id, transactionId:transactionId} as AssocObj).then((data) => {

						let updatedTransaction:TransactionObj = TransactionsController.get().ModifyTransactionObject(transactionId,{stringObjsToAdd:[dragObj]})
						gridApiRef.current.applyTransaction({
							update: [updatedTransaction]
						});

					}).catch((error) => {
						console.error("Failed to load transactions:", error);
					});
				}
			}
		}
	};	

	const mousePositionRef = { x: 0, y: 0 };
	const handleMouseMove = (event:MouseEvent) => {
		mousePositionRef.x = event.clientX;
		mousePositionRef.y = event.clientY;
	};

	let isDragging:boolean = false;
	const handleStringTypes_DragStarted = (event: Event) => {

		setDragObj(MiscUtils.GetNestedPropertySafe(event,['detail','dragObj']));

		isDragging = true;

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('dragover', handleMouseMove);

	};

	const handleStringTypes_DragEnded = (event: Event) =>
	{
		let ce:CustomEvent = event as CustomEvent;

		isDragging = false;

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('dragover', handleMouseMove);

		if(lastHoveredRow != null) lastHoveredRow.classList.remove("hovered-row");

		let idx:number=-1;

		const elements = document.elementsFromPoint(mousePositionRef.x, mousePositionRef.y);
		const targetChildren = elements.filter(el => el.classList.contains('ag-row'));
		if(targetChildren != null && targetChildren.length > 0)
		{
			idx = targetChildren[0].getAttribute('row-id') ? parseInt(targetChildren[0].getAttribute('row-id')!, 10) || -1 : -1;

			const selectedData:TransactionObj[] = gridApiRef.current.getSelectedRows();
			if(selectedData.length <= 0 && shiftDownRef.current)
			{
				gridApiRef.current.forEachNodeAfterFilterAndSort((node:RowNode) => {
					selectedData.push(node.data);
				});
			}

			if(selectedData.length > 0)
			{
				handleCreateAssocMultipleSelect(ce.detail.dragObj, selectedData);
			}
			else
			{
				if(lastHoveredRowIdx == idx)
				{
					if(dragObjRef.current != null && dragObjRef.current.id == ce.detail.dragObj.id)
					{
						let transactionId = targetChildren[0].getAttribute('row-id') ? parseInt(targetChildren[0].getAttribute('row-id')!, 10) || -1 : -1;
		
						StringTypesController.get().createAssoc(NETWORK_ENDPOINT_BY_NAME(ce.detail.dragObj.endpoint),{assocId:ce.detail.dragObj.id, transactionId:transactionId} as AssocObj).then((data) => {
		
							let updatedTransaction:TransactionObj = TransactionsController.get().ModifyTransactionObject(transactionId,{stringObjsToAdd:[{id:ce.detail.dragObj.id, name:ce.detail.dragObj.name ,inferedType: ce.detail.dragObj.endpoint}]})
							gridApiRef.current.applyTransaction({
								update: [updatedTransaction]
							});

						}).catch((error) => {
							console.error("Failed to load transactions:", error);
						});
					}
				}
			}
		}
	};

	const handleStringTypes_DoubleClick = (event: Event) => {
		let ce:CustomEvent = event as CustomEvent;

		const selectedData:TransactionObj[] = gridApiRef.current.getSelectedRows();
		if(selectedData.length > 0)
		{
			handleCreateAssocMultipleSelect(ce.detail.dragObj, selectedData);
		}
	};

	const handleCreateAssocMultipleSelect = (dragObj:DragAssocObj, selectedData:TransactionObj[]) => {
		let assocObjs:AssocObj[] = selectedData.map(item => ({
				transactionId: item.id,
				assocId: dragObj.id
			} as AssocObj)
		);
	
		StringTypesController.get().createAssocs(NETWORK_ENDPOINT_BY_NAME(dragObj.endpoint),assocObjs).then((data) => {

			let updatedTransactions:TransactionObj[] = [];
			assocObjs.forEach((assocObj:AssocObj) => {
				updatedTransactions.push(TransactionsController.get().ModifyTransactionObject(assocObj.transactionId,{stringObjsToAdd:[{id:dragObj.id, name:dragObj.name ,inferedType: dragObj.endpoint}]}));
			});
				
			gridApiRef.current.applyTransaction({
				update: updatedTransactions
			});

		}).catch((error) => {
			console.error("Failed to load transactions:", error);
		});
	}

	const transactionsRef = useRef<TransactionObj[]>([]);
	useEffect(() => {
		transactionsRef.current = transactions;

	}, [transactions]);

	const {setNodeRef} = useDroppable({ id: 'droppable', });

//TODO:: wow... this is so heavy. so much processing and looping over nodes and then querying html and all sorts of shit
	const gridInitialize = (_timeout:TimerId,gridApi:GridApi) => {

		gridApi.addEventListener('modelUpdated', () => {
			if(_timeout != null && _timeout != undefined) clearTimeout(_timeout);
			_timeout = setTimeout(() => {
				parseGridNodes(gridApi);

				let activeRows:TransactionObj[] = [];
				gridApi.forEachNodeAfterFilterAndSort(node => {
					activeRows.push(node.data);
				});
				
				setActiveRows(activeRows);

			}, 125);
		});

		gridApi.addEventListener('viewportChanged', () => {
			parseGridNodes(gridApi);
		});
	}

	const parseGridNodes = (gridApi:GridApi) => {
		gridApi.forEachNode((node) => {
			const rowElement = document.querySelector<HTMLElement>(`div[row-index="${node.rowIndex}"][row-id="${node.id}"]`);
			if (rowElement !== null)
			{
				rowElement.removeEventListener('mouseenter', onRowMouseEnter);
				rowElement.removeEventListener('mouseleave', onRowMouseLeave);
	
				rowElement.addEventListener('mouseenter', onRowMouseEnter);
				rowElement.addEventListener('mouseleave', onRowMouseLeave);
			}
		});
	}

	let lastHoveredRow:HTMLElement;
	let lastHoveredRowIdx:number;
	const onRowMouseEnter = (event: MouseEvent) => {
		if(isDragging && event.target != null)
		{
			let rowAttrIdx:string|null = (event.target as HTMLElement).getAttribute('row-id');
			if (rowAttrIdx != null)
			{
				if(lastHoveredRow != null) lastHoveredRow.classList.remove("hovered-row");
				(event.target as HTMLElement).classList.add("hovered-row");
				lastHoveredRow = (event.target as HTMLElement);

				lastHoveredRowIdx = parseInt(rowAttrIdx);
			}
		}
	}
	
	const onRowMouseLeave = (event: MouseEvent) => {
		if(isDragging && event.target != null)
		{
			(event.target as HTMLElement).classList.remove("hovered-row");
		}
	}

	const [colDefs] = useState<ColDef[]>([
		{ field: "", minWidth: 50, width: 50, checkboxSelection:true, headerCheckboxSelection: true},
		{ field: "date", width: 105, sortable: true, filter: true,valueFormatter: ({ value }) => MiscUtils.FormatDate(value) },
		{ field: "shortDescription", sortable: true, filter: true },
		{ field: "amount", width: 100, sortable: true, filter: true },
		{ field: "categoryString", width:300, sortable: true, filter: true },
		{ field: "groups", flex:1, cellRenderer: CellRendererChips, cellRendererParams: { chipType: CHIP_TYPES.groups } },
		{ field: "tags", flex:1, cellRenderer: CellRendererChips, cellRendererParams: { chipType: CHIP_TYPES.tags } },
	]);

	const onFilterTextBoxChanged = useCallback(() => {
		gridApiRef.current.setGridOption(
			"quickFilterText",
			(document.getElementById("filter-text-box") as HTMLInputElement).value,
		);
	}, []);

	let newStyle:CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	};

	let gridInnerTools:CSSProperties = {
		height: '50px',
		width: '100%',

		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	};

	return (
		<div ref={setNodeRef} className={`aggrid_container ag-theme-quartz`}>
			<div style={newStyle}>
				<div style={gridInnerTools}>
					<span style={{marginLeft:'8px',marginRight:'8px'}}>Search :</span>
					<input
						type="text"
						id="filter-text-box"
						placeholder="Search..."
						onInput={onFilterTextBoxChanged}
					/>
				</div>
				<AgGridReact
					rowData={transactions}
					animateRows={true}
					columnDefs={colDefs}
					onGridReady={onGridReady}
					getRowId={getRowNodeId}
					rowSelection="multiple"
					
				/>
			</div>
		</div>
	);
}

export default GridComponent;