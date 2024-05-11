import StringTypesComponent, { StringTypesComponentProps } from "components/stringTypes/stringTypesComponent";

const TagsComponent: React.FC<StringTypesComponentProps> = ({ network_endpoint }) => {
	
	return (
		<StringTypesComponent network_endpoint={network_endpoint} />
	);
}

export default TagsComponent;