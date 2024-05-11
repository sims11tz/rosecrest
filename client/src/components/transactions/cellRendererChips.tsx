import { ICellRendererParams } from "ag-grid-community"
import { StringTypeObj } from "@shared/DataTypes";
import { StringTypeChip } from "components/stringTypes/stringTypesChip";
import { CHIP_TYPES, CHIP_SIZES } from "dataTypes/ClientDataTypes";

import './cellRendererChips.css'

export type CellRendererChipsParams = ICellRendererParams & {
	chipType: CHIP_TYPES;
}

export function CellRendererChips(params: CellRendererChipsParams) {

	if (!params.value || !Array.isArray(params.value))
	{
		return (<div id="chipsContainer"></div>)
	}

	return (
		<div id="chipsContainer" className="chipsContainer">
			{params.value
				.sort((a: StringTypeObj, b: StringTypeObj) => { return a.id - b.id; })
				.map((element: StringTypeObj) => (
					<StringTypeChip id={element.id} name={element.name} key={params.chipType+"_"+element.id} size={CHIP_SIZES.small} type={params.chipType} />
				))}
		</div>
	)
}