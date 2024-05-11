import { List, ListItem } from "@mui/material";
import { StringTypeObj } from "@shared/DataTypes";
import { useEffect, useState } from "react";
import StringTypesController from "controllers/StringTypesController";
import { NETWORK_ENDPOINT } from "@shared/SharedNetworking";
import { StringTypeDraggableRow } from "./stringTypesDraggableRow";

import './stringTypesComponent.css';
import { CHIP_TYPES } from "dataTypes/ClientDataTypes";


export interface StringTypesGuttterComponentProps {
	className?: string;
	network_endpoint:NETWORK_ENDPOINT;
}

const StringTypesGutterComponent: React.FC<StringTypesGuttterComponentProps> = ({ network_endpoint }) => {

	const [stringTypes, setStringTypes] = useState<StringTypeObj[]>([]);

	useEffect(() => {
		StringTypesController.get().fetchAll(network_endpoint).then((data) => {
			setStringTypes(data);
		}).catch((error) => {
			console.error("Failed to load stringType:", error);
		});

		window.addEventListener(network_endpoint.name+"Changed", stringTypesUpdated);
		return () => {
			window.removeEventListener(network_endpoint.name+"Changed", stringTypesUpdated);
		};

	},[]);

	const stringTypesUpdated = (event: Event) => {
		StringTypesController.get().fetchAll(network_endpoint).then((data) => {
			setStringTypes(data);
		}).catch((error) => {
			console.error("Failed to load groups:", error);
		});
	};

	const sortedStringTypes = [...stringTypes].sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	return (

		<div style= {{ height: "100%" }}>
			<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
				{sortedStringTypes.map((value) => {
				const labelId = `checkbox-list-label-${value}`;
				return (
					<ListItem
						key={value.id}
						secondaryAction={<div>&nbsp;</div>}
						disablePadding
						>
						<StringTypeDraggableRow id={value.id} name={value.name} endpoint={network_endpoint.endpoint} />
					</ListItem>
				);
			})}
			</List>
		</div>
	)
}

export default StringTypesGutterComponent;