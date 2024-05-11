import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, TextField } from '@mui/material';
import { StringTypeObj } from "@shared/DataTypes";
import { useEffect, useState } from 'react';
import MiscUtils from '@shared/MiscUtils';
import StringTypesController from 'controllers/StringTypesController';
import { NETWORK_ENDPOINT } from '@shared/SharedNetworking';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

interface StringTypesPopupProps {
	open: boolean;
	onClose: () => void;
	network_endpoint: NETWORK_ENDPOINT;
	stringTypeObj: StringTypeObj | undefined;
	mode: 'create' | 'edit' | 'delete';
}

const StringTypesPopup: React.FC<StringTypesPopupProps> = ({ open, onClose, network_endpoint, stringTypeObj, mode }) => {

	const [stringTypeLabel, setStringTypeLabel] = useState(network_endpoint.name);
	const [popupTitle, setPopupTitle] = useState(MiscUtils.CapitalizeFirstLetter(mode)+' '+stringTypeLabel);
	const [popupAction, setPopupAction] = useState(MiscUtils.CapitalizeFirstLetter(mode));
	const [stringTypeInputName, setStringTypeInputName] = useState("");

	useEffect(() => {

		setStringTypeLabel(network_endpoint.name);
		setPopupTitle(MiscUtils.CapitalizeFirstLetter(mode) + ' ' + network_endpoint.name);
		setPopupAction(MiscUtils.CapitalizeFirstLetter(mode));
		if (stringTypeObj) {
			setStringTypeInputName(stringTypeObj.name);
		} else {
			setStringTypeInputName('');
		}

	}, [mode, network_endpoint, stringTypeObj]);

	const onCreateGroup = () => {

		if (mode === 'create') {

			StringTypesController.get().create(network_endpoint,{id: -1, name: stringTypeInputName}).then(data => {

				window.dispatchEvent(new CustomEvent(network_endpoint.name+"Changed"));

				onClose();

			}).catch(error => {
				console.error("Failed to create "+network_endpoint.name+":", error);
			});

		} else if (mode === 'edit' && stringTypeObj) {

			StringTypesController.get().update(network_endpoint,{ ...stringTypeObj, name: stringTypeInputName }).then(data => {

				window.dispatchEvent(new CustomEvent(network_endpoint.name+"Changed"));

				onClose();

			}).catch(error => {
				console.error("Failed to update "+network_endpoint.name+":", error);
			});

		} else if (mode === 'delete' && stringTypeObj) {

			StringTypesController.get().delete(network_endpoint,{ ...stringTypeObj, name: stringTypeInputName }).then(data => {

				window.dispatchEvent(new CustomEvent(network_endpoint.name+"Changed"));

				onClose();

			}).catch(error => {
				console.error("Failed to delete "+network_endpoint.name+":", error);
			});
		}
	}

	return (
	<BootstrapDialog
		onClose={onClose}
		aria-labelledby="customized-dialog-title"
		open={open}
	>
		<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
			{popupTitle}
		</DialogTitle>
		<IconButton
			aria-label="close"
			onClick={onClose}
			sx={{
				position: 'absolute',
				right: 8,
				top: 8,
				color: (theme) => theme.palette.grey[500],
			}}
		>
		<CloseIcon />
		</IconButton>
		<DialogContent dividers>
			<FormControl fullWidth>
				<TextField
					id="standard-basic"
					value={stringTypeInputName}
					onChange={(event) => setStringTypeInputName(event.target.value)}
					InputProps={{ readOnly: mode === 'delete' }}
				/>
			</FormControl>
		</DialogContent>
		<DialogActions>
			<Button autoFocus onClick={onCreateGroup}>
				{popupAction}
			</Button>
		</DialogActions>
	</BootstrapDialog>
	);
}

export default StringTypesPopup;