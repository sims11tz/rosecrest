import { ReactElement, useEffect, useState } from 'react';
import { Delete } from "@mui/icons-material";
import './contextMenuComponent.css';
import { AssocObj } from '@shared/DataTypes';
import { CHIP_SIZES, CHIP_TYPES, ContextMenuItem, stringToChipType } from 'dataTypes/ClientDataTypes';
import { ContextMenuItemComponent } from './contextMenuItemComponent';
import { StringTypeChip } from 'components/stringTypes/stringTypesChip';

interface ContextMenuProps {
	x: number;
	y: number;
	isVisible: boolean;
}

export const ContextMenu:React.FC<ContextMenuProps> = ({x,y,isVisible}) => { 

	const styleObj: React.CSSProperties = {
		position: 'absolute',
		top: `${y}px`,
		left: `${x}px`,
		background: 'white',
		border: '1px solid black',
		zIndex: 1000,
		display: isVisible ? 'block' : 'none'
	};

	useEffect(() => {

		if(isVisible)
		{
			let transId:string="";
			let chipId:string="";
			let chipType:string="";
			let chipName:string="";

			let menuItems:ContextMenuItem[] = [];

			const elements = document.elementsFromPoint(x, y);
			const targetChip = elements.filter(el => el.classList.contains('chipContainer'));
			if(targetChip != null && targetChip.length > 0)
			{
				const targetTransaction = elements.filter(el => el.classList.contains('ag-row'));
				if(targetTransaction != null && targetTransaction.length > 0)
				{
					let transAttribute:string|null = targetTransaction[0].getAttribute('row-id');
					if (transAttribute != null)
					{
						transId = transAttribute.toString();
					}

					let chipAttribute:string|null = targetChip[0].getAttribute('chip-id');
					if (chipAttribute != null)
					{
						chipId = chipAttribute.toString();
					}

					let chipTypeAttribute:string|null = targetChip[0].getAttribute('chip-type');
					if (chipTypeAttribute != null)
					{
						chipType = chipTypeAttribute.toString();
					}

					let chipNameAttribute:string|null = targetChip[0].getAttribute('chip-name');
					if (chipNameAttribute != null)
					{
						chipName = chipNameAttribute.toString();
					}

					let assocObj:AssocObj = {id:parseInt(chipId), name:chipName, assocType:chipType, assocId:parseInt(chipId), transactionId:parseInt(transId)};

					let node:ReactElement = (
						<div className="menuItemButton">
							<Delete className="menuItemIcon" />
							<StringTypeChip id={assocObj.id} name={assocObj.name} key={assocObj.id} size={CHIP_SIZES.small} type={stringToChipType(chipType)} />
							<span className="menuItemText">{chipName}</span>
						</div> );

					menuItems.push({name:'Delete '+chipName, event:'request_deleteAssoc', eventObj:assocObj, reactElement:node});
				}
			}
			setMenuItems(menuItems);
		}
	}, [isVisible,x,y]);


	const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([]);

	const onMenuItemClick = (item:ContextMenuItem) => {
		window.dispatchEvent(new CustomEvent(item.event, { detail: item.eventObj }));

	};

	return (
		<div style={styleObj} className="contextMenuContainer">
			<ul>
				{menuItems.map((menuItem: ContextMenuItem) => (
					<ContextMenuItemComponent key={menuItem.name} menuItemObj={menuItem} onMenuItemClick={onMenuItemClick} />
				))}
			</ul>
		</div>
	);
};