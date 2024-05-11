import StringTypesGutterComponent, { StringTypesGuttterComponentProps } from "components/stringTypes/stringTypesGutterComponent";

const GroupsGutterComponent: React.FC<StringTypesGuttterComponentProps> = ({ className="", network_endpoint }) => {

	return (
		<div className={`${className}`}>
			<StringTypesGutterComponent network_endpoint={network_endpoint} />
		</div>
	);
}

export default GroupsGutterComponent;