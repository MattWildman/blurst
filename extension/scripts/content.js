const addStyle = (styles, id) => {             
    let css = document.createElement('style');
    css.id = id;
    css.type = 'text/css'; 
    if (css.styleSheet) {
        css.styleSheet.cssText = styles;
    } else {
        css.appendChild(document.createTextNode(styles)); 
    }
    document.getElementsByTagName("head")[0].appendChild(css); 
}

const BLURST_ID = 'blrst',
    HIGHLIGHT_ID = 'blrst_highlight';

let blurSelectors = ['.email', '.headshot'];
let blur = {
    v: 0,
    h: 0,
    radius: '5px',
    colour: 'rgba(0,0,0,0.5)',
    imgRadius: '1em'
};
let blurStyle = `{
    color: transparent !important;
    text-decoration: none !important;
    text-shadow: ${blur.v} ${blur.h} ${blur.radius} ${blur.colour} !important;
}`;
let selectedBlurSelectors = (sel) => sel.map(s => `${s}::selection`);
let imgBlurSelectors = (sel) => sel.map(s => `img${s}`);
let imgBlurStyle = `${imgBlurSelectors(blurSelectors)} {
    filter: blur(${blur.imgRadius}) !important;
}`;

let scribbleSelectors = ['.name','.another-name'];
let scribbleStyle = `{
    font-family: "Redacted Script" !important;
}`

let redactSelectors = ['.cost','.salary'];
let redactStyle = `{
    font-family: "Redacted" !important;
}`;

let allSelectors = [
    ...blurSelectors, 
    ...redactSelectors, 
    ...scribbleSelectors, 
    ...imgBlurSelectors(blurSelectors)
];

let highlightStyle = `${allSelectors} {
    outline: 1px solid red;
}`

let styles = `${blurSelectors.join(',')},${selectedBlurSelectors(blurSelectors).join(',')}${blurStyle}
    ${imgBlurStyle}
    ${scribbleSelectors.join(',')}${scribbleStyle}
    ${redactSelectors.join(',')}${redactStyle}
`;

window.addEventListener('DOMContentLoaded', (event) => {
    addStyle(styles, BLURST_ID);
    // addStyle(highlightStyle, HIGHLIGHT_ID);
}, {once: true});
