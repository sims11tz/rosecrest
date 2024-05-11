
import { CHIP_COLORS, CHIP_SIZES, CHIP_TYPES } from 'dataTypes/ClientDataTypes';
import { FC } from 'react';

import './stringTypesChip.css'

export interface ChipParamObject
{
	id: number;
	name: string;
	size: CHIP_SIZES;
	type: CHIP_TYPES;
}

export const StringTypeChip: FC<ChipParamObject> = function ({ id, name, size, type }) {

	return (
		<div key={id} chip-id={id} chip-type={type} chip-name={name} className={`chipContainer ${size} ${type}`} style={{backgroundColor: CHIP_COLORS.GetColor(type,id)}} >
			<div className='chipText'>{name.substring(0,2).toUpperCase()}</div>
		</div>
	)
}
