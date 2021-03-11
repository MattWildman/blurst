if (window !== top) {
    console.log('BLURST LOG - FRAME', window, document);
    document.addEventListener('DOMContentLoaded', () => {
        try {
            console.log('BLURST LOG - FRAME HEAD', document.getElementsByTagName('head'));
            console.log('BLURST LOG - FRAME PARENT', parent);
            ready();
        } catch(ex) {
            console.log('BLURST LOG - exception', ex);
        }
    });
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
}
