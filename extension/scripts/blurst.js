const BLURST_ID = 'blrst',
    HIGHLIGHT_ID = 'blrst_highlight';

let ready = () => {
    if (document.getElementsByTagName('body').length) {
        document.getElementsByTagName('body')[0].classList.add('blrst_ready');
    }
};

let blurSelectors = ['.email .email', '.headshot', 'h1'];
let blur = {
    v: 0,
    h: 0,
    radius: '0.5em',
    colour: 'rgba(0,0,0,0.5)',
    imgRadius: '0.5em'
};
let blurStyle = `{
    color: transparent !important;
    text-decoration: none !important;
    text-shadow: ${blur.v} ${blur.h} ${blur.radius} ${blur.colour} !important;
}`;
let selectedBlurSelectors = sel => sel.map(s => `${s}::selection`);
let imgBlurSelectors = sel => sel.map(s => `img${s}`);
let imgBlurStyle = `${imgBlurSelectors(blurSelectors)} {
    filter: blur(${blur.imgRadius}) !important;
}`;

let scribbleSelectors = ['.name','.another-name','.activity-item-user.activity-item-author'];
let scribbleStyle = `{
    font-family: "Redacted Script" !important;
}`;

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
let allSelectorsBefore = sel => sel.map(s => `${s}::before`);

let highlightStyle = `
body{
    counter-reset: highlights;
}
${allSelectors}{
    counter-increment: highlights;
    background-color: yellow !important;
}
${imgBlurSelectors(blurSelectors)} {
    outline: 3px solid yellow !important;
}
${allSelectorsBefore(allSelectors)}{
    content: counter(highlights);
    position: absolute;
    left: 7px;
    display: inline-block;
    text-align: center;
    width: 12px;
    height: 14px;
    padding: 2px;
    padding-bottom: 0;
    border-radius: 2px;
    background: yellow;
    color: black;
    border: 2px solid black;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 11px;
}`;


let styles = `${blurSelectors},${selectedBlurSelectors(blurSelectors)}${blurStyle}
    ${imgBlurStyle}
    ${scribbleSelectors}${scribbleStyle}
    ${redactSelectors}${redactStyle}
`;

const addStyle = (styles, id) => {
    let el = document.getElementById(id);
    if (!el) {
        let css = document.createElement('style');
        css.id = id;
        css.type = 'text/css';
        css.appendChild(document.createTextNode(styles));
        document.getElementsByTagName('head')[0].appendChild(css);
    }
};

const removeStyle = id => {
    let el = document.getElementById(id);
    if (el) {
        el.remove();
    }
};