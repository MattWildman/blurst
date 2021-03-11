chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.command) {
        case 'getCount':
            chrome.runtime.sendMessage({blrstCount: document.querySelectorAll(`${allSelectors}`).length});
            sendResponse('count sent');
            break;
        case 'toggleHighlights':
            if (request.param) {
                addStyle(highlightStyle, HIGHLIGHT_ID);
            } else {
                removeStyle(HIGHLIGHT_ID);
            }
            sendResponse(true);
            break;
        case 'toggleBlurst':
            if (request.param) {
                addStyle(styles, BLURST_ID);
            } else {
                removeStyle(BLURST_ID);
            }
            ready();
            sendResponse(true);
            break;
        default:
            sendResponse(true);
    }
});
