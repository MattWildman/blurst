'use strict';

const sendMessageToTab = (tabId, message) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        } else {
            console.log('receiving message', response);
            /*if (response !== undefined && typeof response.blrstCount === 'number') {
                let countTxt = response.blrstCount > 999 ? '999+' : response.blrstCount.toString();
                chrome.browserAction.setBadgeText({text: countTxt});
            }*/
            if (response) {
                console.log(message.command + ' instruction received');
            }
            else {
                console.warn(message.command + ' instruction not received');
            }
        }
    });
};

const sendMessageToActiveTab = (message) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0].url.startsWith('http')) {
            sendMessageToTab(tabs[0].id, message);
        }
    });
};

chrome.webNavigation.onCommitted.addListener((details) => {
    console.log('navigation.onCommited', details);
    blrstCount = 0;
    sendMessageToTab(details.tabId, {command: 'getCount', param: null});
    chrome.storage.local.get(['active'], (result) => {
        sendMessageToTab(details.tabId, {command: 'toggleBlurst', param: result.active});
    });
    chrome.storage.local.get(['highlighted'], (result) => {
        sendMessageToTab(details.tabId, {command: 'toggleHighlights', param: result.highlighted});
    });
}, {url: [
    {schemes: ['https','http']}
]});

chrome.tabs.onCreated.addListener((tab) => {
    if (tab.pendingUrl.startsWith('http')) {
        blrstCount = 0;
        console.log('tabs.onCreated', tab);
        sendMessageToActiveTab({command: 'getCount', param: null});
        chrome.storage.local.get(['active'], (result) => {
            sendMessageToActiveTab({command: 'toggleBlurst', param: result.active});
        });
        chrome.storage.local.get(['highlighted'], (result) => {
            sendMessageToActiveTab({command: 'toggleHighlights', param: result.highlighted});
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.startsWith('http')) {
        blrstCount = 0;
        console.log('tabs.onUpdated', tab);
        sendMessageToActiveTab({command: 'getCount', param: null});
        chrome.storage.local.get(['active'], (result) => {
            sendMessageToActiveTab({command: 'toggleBlurst', param: result.active});
        });
        chrome.storage.local.get(['highlighted'], (result) => {
            sendMessageToActiveTab({command: 'toggleHighlights', param: result.highlighted});
        });
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('tabs.onActivated', activeInfo);
    blrstCount = 0;
    sendMessageToTab(activeInfo.tabId, {command: 'getCount', param: null});
    chrome.storage.local.get(['active'], (result) => {
        sendMessageToTab(activeInfo.tabId, {command: 'toggleBlurst', param: result.active});
    });
    chrome.storage.local.get(['highlighted'], (result) => {
        sendMessageToTab(activeInfo.tabId, {command: 'toggleHighlights', param: result.highlighted});
    });
});

let blrstCount = 0, countTxt = '0';
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.blrstCount !== undefined && typeof request.blrstCount === 'number') {
        blrstCount += request.blrstCount;
        countTxt = blrstCount > 999 ? '999+' : blrstCount.toString();
        chrome.browserAction.setBadgeText({text: countTxt});
    } else if (request.message && request.message === 'popup count request') {
        sendResponse(countTxt);
    }
});