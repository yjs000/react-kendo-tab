const DynamicLayout = ({ layout, components }) => {
    return (
        <div className={`layout ${layout.styles}`}>
            {layout.sections.map((section, idx) => {
                const Component = components[section.component];
                if (!Component) {
                    // 예외 처리: 해당 컴포넌트가 정의되지 않은 경우
                    console.error(`Component '${section.component}' not found in components.`);
                    return null;
                }

                return (
                    <div key={idx} className={`section ${section.className}`}>
                        <Component {...section.props} />
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicLayout;
