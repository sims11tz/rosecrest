
import { FC } from 'react'
import { ContextMenuItem } from 'dataTypes/ClientDataTypes'

import './contextMenuItemComponent.css'

export interface MenuItemParamObject
{
	menuItemObj: ContextMenuItem;
	onMenuItemClick: Function;
}

export const ContextMenuItemComponent: FC<MenuItemParamObject> = function StringTypeDraggableRow({menuItemObj, onMenuItemClick}) {

	return (
		<li key={menuItemObj.name} onClick={() => onMenuItemClick(menuItemObj)}>{menuItemObj.reactElement}</li>
	)
}