import { useEffect, useRef, type FC } from 'react'
import { CHIP_SIZES, CHIP_TYPES, CUSTOM_EVENTS, DRAG_TYPPES, DragAssocObj } from 'dataTypes/ClientDataTypes'
import { StringTypeChip } from './stringTypesChip'
import {useDraggable} from '@dnd-kit/core';

import './stringTypesDraggableRow.css';

export const StringTypeDraggableRow: FC<DragAssocObj> = function StringTypeDraggableRow(dragObj: DragAssocObj) {

	const chipType:CHIP_TYPES = (dragObj.endpoint==='groups') ? CHIP_TYPES.groups : CHIP_TYPES.tags;

	const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
		id: 'draggable-'+dragObj.endpoint+'-'+dragObj.id,
		attributes: {
		},
		data: {
			dragId : 'draggable-'+dragObj.endpoint+'-'+dragObj.id,
			dragObj : dragObj,
			assocId : dragObj.id
		  },
	});

	const style = transform ? {
		opacity: isDragging ? 0.5 : 1,
	} : undefined;

	const onDoubleClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		e.preventDefault();
		window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.STRING_TYPES_DOUBLE_CLICK, { detail: {dragId : 'draggable-'+dragObj.endpoint+'-'+dragObj.id, dragObj: dragObj} }));
		
	};

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} style={style} className='draggableRow' onDoubleClickCapture={onDoubleClick} >
			<StringTypeChip id={dragObj.id} name={dragObj.name} size={CHIP_SIZES.medium} type={chipType} />
			<div className='draggableRowText'>{dragObj.name}</div>
		</div>
	)
}