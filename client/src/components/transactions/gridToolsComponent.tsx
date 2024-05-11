import { FormControl, InputLabel, Select, SelectChangeEvent,MenuItem} from '@mui/material';
import { useEffect, useState } from 'react';
import { MemberObj, AccountObj } from '@shared/DataTypes';

import './gridToolsComponent.css';
import { useData } from 'app/appDataProvider';

export function GridToolsComponent()
{
	const { members, accounts } = useData();

	const [selectedMember, setSelectedMember] = useState<number | ''>(0);
	const handleMemberChange = (event: SelectChangeEvent<number>) => {
		setSelectedMember(parseInt(event.target.value.toString()));
	};

	const [selectedAccount, setSelectedAccount] = useState<number | ''>(0);
	const handleAccountChange = (event: SelectChangeEvent<number>) => {
		setSelectedAccount(parseInt(event.target.value.toString()));
	};

	useEffect(() => {

		if(members.length > 0) setSelectedMember(members[0].id);
		if(accounts.length > 0) setSelectedAccount(accounts[0].id);

	},[]);
	
	return (
		<div className='toolsContainer'>
			<div className='toolsTool'>
				<FormControl fullWidth>
					<InputLabel id="memberLabel">Member :</InputLabel>
					<Select
						labelId="memberLabel"
						id="memberSelect"
						label="Member"
						value={selectedMember}
						onChange={handleMemberChange}
					>
					{members.map((member: MemberObj) => (
						<MenuItem key={member.id} value={member.id}>
							{`${member.firstName} ${member.lastName}`}
						</MenuItem>
					))}
					</Select>
				</FormControl>
			</div>
			<div className='toolsTool'>
				<FormControl fullWidth>
					<InputLabel id="accountLabel">Account :</InputLabel>
					<Select
						labelId="accountLabel"
						id="accountSelect"
						label="Account"
						value={selectedAccount}
						onChange={handleAccountChange}
					>
						{accounts.map((account: AccountObj) => (
						<MenuItem key={account.id} value={account.id}>
							{`${account.account}`}
						</MenuItem>
					))}
					</Select>
				</FormControl>
			</div>
		</div>
	)
}