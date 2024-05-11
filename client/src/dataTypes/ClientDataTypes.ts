import { ReactElement } from "react";

export enum CUSTOM_EVENTS {
	SRTING_TYPES_DRAGGING_STARTED = 'SRTING_TYPES_DRAGGING_STARTED',
	STRING_TYPES_DRAGGING_ENDED = 'STRING_TYPES_DRAGGING_ENDED',
	STRING_TYPES_DOUBLE_CLICK = 'STRING_TYPES_DOUBLE_CLICK',
	TRANSACTIONS_EXPANDER_CHANGE = 'TRANSACTIONS_EXPANDER_CHANGE',
	CHART_GROUP_BY_CHANGE = 'CHART_GROUP_BY_CHANGE',
	CHART_TYPES_CHANGE = 'CHART_TYPES_CHANGE',
}

export enum TRANSACTIONS_VIEW_MODES {
	EXPANDED = 'expanded',
	PEAKING = 'peaking',
	CLOSED = 'closed'
}

export enum CHART_GROUP_BY_MODES {
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year'
}

export enum CHART_TYPES {
	LINE_OVER_TIME = 'lineovertime',
	PIE = 'pie',
	BAR = 'bar',
}

export interface DragAssocObj {
	id:number;
	name:string;
	endpoint:string;
}

export interface ContextMenuItem {
	name:string;
	event:string;
	eventObj:any;
	reactElement?:ReactElement;
}

export enum DRAG_TYPPES {
	ASSOC_OBJ = 'ASSOC_OBJ'
}

export enum CHIP_SIZES{
	small = 'small',
	medium = 'medium',
	large = 'large'
}

export enum CHIP_TYPES {
	groups = 'groups',
	tags = 'tags'
}

export function stringToChipType(str:string):CHIP_TYPES {
	switch(str)
	{
		case 'groups': return CHIP_TYPES.groups;
		case 'tags': return CHIP_TYPES.tags;
		default: return CHIP_TYPES.groups;
	}
}

export enum LIGHT_COLORS
{
	Alice_Blue = '#F0F8FF',
	Honeydew = '#F0FFF0',
	Lavender = '#E6E6FA',
	Light_Cyan = '#E0FFFF',
	Misty_Rose = '#FFE4E1',
	Peach_Puff = '#FFDAB9',
	Powder_Blue = '#B0E0E6',
	Thistle = '#D8BFD8',
	Light_Yellow = '#FFFFE0',
	Light_Pink = '#FFB6C1',
	Beige = '#F5F5DC',
	Cornsilk = '#FFF8DC',
	Light_Goldenrod_Yellow = '#FAFAD2',
	Lemon_Chiffon = '#FFFACD',
	Pale_Green = '#98FB98',
	Pale_Turquoise = '#AFEEEE',
	Pale_Goldenrod = '#EEE8AA',
	Light_Blue = '#ADD8E6',
	Wheat = '#F5DEB3',
	Azure = '#F0FFFF',
	Seashell = '#FFF5EE',
	Linen = '#FAF0E6',
	Mint_Cream = '#F5FFFA',
	Bisque = '#FFE4C4',
	Blanched_Almond = '#FFEBCD',
	Lavender_Blush = '#FFF0F5',
	Gainsboro = '#DCDCDC',
	Papaya_Whip = '#FFEFD5',
	Moccasin = '#FFE4B5',
	Peach_Cream = '#FFFDD0',
	Light_Grey = '#D3D3D3',
	Platinum = '#E5E4E2',
}

export class CHIP_COLORS {

	private static _cachedLightColors:LIGHT_COLORS[] = [];
	public static GetColors():LIGHT_COLORS[]
	{
		if(this._cachedLightColors === undefined || this._cachedLightColors.length <= 0)
		{
			this._cachedLightColors = [];

			Object.values(LIGHT_COLORS)
				.filter(value => typeof value === 'string')
				.forEach(value =>
				{
					this._cachedLightColors.push(value as LIGHT_COLORS);
				});
		}

		return this._cachedLightColors;
	}

	public static GetColor(type:CHIP_TYPES,idx:number):LIGHT_COLORS
	{
		if(type === CHIP_TYPES.tags) idx += 15;
		return this.GetColors()[(idx < this.GetColors().length-1)?idx:0];
	}
	
	public static GetRandomColor():LIGHT_COLORS
	{
		return this.GetColors()[Math.floor(Math.random() * this.GetColors().length)];
	}
};