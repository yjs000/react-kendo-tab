// layouts/Layout1.js

const layout1 = (filters, buttons, data, columns) => ({
    styles: "layout1",
    sections: [
        {
            component: "FilterComponent",
            className: "filter",
            props: { filters }
        },
        {
            component: "ButtonComponent",
            className: "button",
            props: {buttons}
        },
        {
            component: "GridComponent",
            className: "grid",
            props: { data, columns }
        }
    ]
});

export default layout1;
