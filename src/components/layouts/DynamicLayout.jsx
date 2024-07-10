import { Fragment } from "react";

let int = 0;
const DynamicLayout = ({ layout, components }) => {
    const renderSection = (section, components) => {
        const Component = components[section.component];
        const children = section.children;

        if (!Component) {
            // 예외 처리: 해당 컴포넌트가 정의되지 않은 경우
            console.error(`Component '${section.component}' not found in components.`);
            return null;
        }

        return (
            <Component key={int++} {...section.props}>
                {children?.length > 0 && children.map((childrenSection) => renderSection(childrenSection, components))}
            </Component>
        );
    };
    return <Fragment>{layout.sections.map((section) => renderSection(section, components))}</Fragment>;
};

export default DynamicLayout;
