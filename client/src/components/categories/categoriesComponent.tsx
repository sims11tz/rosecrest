import { Checkbox, ListItemButton, ListItemIcon, ListItemText, IconButton, List, ListItem } from "@mui/material";
import { useData } from "app/appDataProvider";
import { useEffect, useState } from "react";

function CategoriesComponent() {

	const { categories } = useData();
	const sortedCategories = [...categories].sort((a, b) => {
		return a.category.localeCompare(b.category);
	});

	useEffect(() => {

		if(categories.length > 0)
		{
			console.log("Categories : ",categories.length);

		}
		else
		{
			console.log("Categories : none ");
		}

	},[]);

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

	return (
		<div style= {{ height: "100%" }}>
			<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
				{sortedCategories.map((value) => {
				const labelId = `checkbox-list-label-${value}`;
				return (
					<ListItem
						key={value.id}
						secondaryAction={
							<IconButton edge="end" aria-label="comments">
								
							</IconButton>
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
							<ListItemText id={labelId} primary={`${value.category}`} />
						</ListItemButton>
					</ListItem>
				);
			})}
			</List>
		</div>
	)
}

export default CategoriesComponent;