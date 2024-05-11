import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Checkbox, ListItemButton, ListItemIcon, ListItemText, List, ListItem, Button } from "@mui/material";
import { StringTypeObj } from "@shared/DataTypes";
import { useEffect, useState } from "react";

import './stringTypesComponent.css';
import StringTypesController from "controllers/StringTypesController";
import { NETWORK_ENDPOINT } from "@shared/SharedNetworking";
import StringTypesPopup from "./stringTypesPopup";
import MiscUtils from "@shared/MiscUtils";


export interface StringTypesComponentProps {
	network_endpoint:NETWORK_ENDPOINT;
}

const StringTypesComponent: React.FC<StringTypesComponentProps> = ({ network_endpoint }) => {

	const [stringTypes, setStringTypes] = useState<StringTypeObj[]>([]);
	const [currentStringType, setCurrentStringType] = useState<StringTypeObj>();
	const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create');
	const [dialogOpen, setDialogOpen] = useState(false);

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

	const [checked, setChecked] = useState([0]);

	const handleToggle = (value: number) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	return (

		<div style= {{ height: "100%" }}>
			 <StringTypesPopup open={dialogOpen} onClose={handleCloseDialog} network_endpoint={network_endpoint} stringTypeObj={currentStringType}  mode={mode} />
			<div className="header">
				<div>{MiscUtils.CapitalizeFirstLetter(network_endpoint.namePlural)}</div>
				<div><Button endIcon={<AddCircle/>} size="large" onClick={()=>{
					setMode('create');
					handleOpenDialog();
				}}>Create New</Button></div>
			</div>
			<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
				{sortedStringTypes.map((value) => {
				const labelId = `checkbox-list-label-${value}`;
				return (
					<ListItem
						key={value.id}
						secondaryAction={
							<div>
								<Button endIcon={<Edit/>} size="large" onClick={()=>{
									setMode('edit');
									setCurrentStringType(value);
									handleOpenDialog();
									}}
								></Button>
								<Button endIcon={<Delete/>} size="large" onClick={()=>{
									setMode('delete');
									setCurrentStringType(value);
									handleOpenDialog();
									}}
								></Button>
							</div>
						}
						disablePadding
						>
						<ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
							<ListItemIcon>
							<Checkbox
								edge="start"
								checked={checked.indexOf(value.id) !== -1}
								tabIndex={-1}
								disableRipple
								inputProps={{ 'aria-labelledby': labelId }}
							/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={`${value.name}`} />
						</ListItemButton>
					</ListItem>
				);
			})}
			</List>
		</div>
	)
}

export default StringTypesComponent;