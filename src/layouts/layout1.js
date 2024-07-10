// layouts/Layout1.js

const layout1 = (titles, filters, buttons) => ({
    styles: "layout1",
    sections: [
        {
            component: "HeaderComponent",
            className: "header",
            props: {titles, buttons}
        },
        {
            component: "MainComponent",
            className: "main",
            children: [{
                component: "FilterComponent",
                className: "filter",
                props: {filters},
            },{
                component: "GridComponent",
                className: "grid",
            }]
        },
        {
            component: "PopupComponent",
            className: "popup",
        }
    ]
});

export default layout1;
