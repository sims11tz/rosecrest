export enum CUSTOM_EVENTS {
	CUSTOM_EVENT = 'CUSTOM_EVENT',
	SOCKET_SERVER_OPEN = 'SOCKET_SERVER_OPEN',
	SOCKET_SERVER_ERROR = 'SOCKET_SERVER_ERROR',
	SOCKET_SERVER_CLOSED = 'SOCKET_SERVER_CLOSED',
	SOCKET_CLIENT_MESSAGE = 'SOCKET_CLIENT_MESSAGE',
	ALL_CONNECT = 'ALL_CONNECT',
	ALL_DISCONNECT = 'ALL_DISCONNECT',
	ALL_PING = 'ALL_PING',
	ALL_RESET = 'ALL_RESET',
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

export class LIGHT_COLORS_SET {

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

	public static GetColor(idx:number):LIGHT_COLORS
	{
		return this.GetColors()[(idx < this.GetColors().length-1)?idx:0];
	}
	
	public static GetRandomColor():LIGHT_COLORS
	{
		return this.GetColors()[Math.floor(Math.random() * this.GetColors().length)];
	}
};