import { Tab, Tabs } from "@mui/material";
import { ENDPOINT_GROUPS, ENDPOINT_TAGS } from "@shared/SharedNetworking";
import GroupsGutterComponent from "components/groups/groupsGutterComponent";
import TagsGutterComponent from "components/tags/tagsGutterComponent";
import { useState } from "react";

interface LeftGutterProps {
	className?: string;
}

function gutterTabProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const LeftGutterComponent: React.FC<LeftGutterProps> = ({ className="" }) => {
	
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className={`${className}`}>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="Groups" {...gutterTabProps(0)} />
				<Tab label="Tags" {...gutterTabProps(1)} />
			</Tabs>
			<div
				role="tabpanel"
				hidden={value !== 0}
				id={`simple-tabpanel-${0}`}
				aria-labelledby={`simple-tab-${0}`}
				>
				<GroupsGutterComponent network_endpoint={ENDPOINT_GROUPS} />
			</div>
			<div
				role="tabpanel"
				hidden={value !== 1}
				id={`simple-tabpanel-${1}`}
				aria-labelledby={`simple-tab-${1}`}
				>
				<TagsGutterComponent network_endpoint={ENDPOINT_TAGS} />
			</div>
		</div>
	);
}

export default LeftGutterComponent;