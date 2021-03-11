'use strict';

let blurstActive,
    highlightCheck = document.querySelector('#highlight_blrsts'),
    startBtn = document.querySelector('#blrst_start_btn'),
    optionsBtn = document.querySelector('#blrst_options_btn');

function startBlurst() {
  blurstActive = true;
  sendContentScriptCommand('toggleBlurst', true);
  chrome.browserAction.setIcon({path: 'images/active-icon-19.png'});
  chrome.browserAction.setTitle({title: 'Blurst is active!'});
  startBtn.classList.remove('blrst_inactive');
  startBtn.classList.add('blrst_active');
  startBtn.innerText = 'Turn off';
  chrome.storage.local.get(['highlighted'], (result) => {
      let highlighted = result.highlighted;
      sendContentScriptCommand('toggleHighlights', highlighted);
      if (highlighted) {
        highlightCheck.setAttribute('checked', 'checked');
      }
      else {
        highlightCheck.removeAttribute('checked');
      }
  });
}

function stopBlurst() {
  blurstActive = false;
  sendContentScriptCommand('toggleBlurst', false);
  chrome.browserAction.setIcon({path: 'images/icon-19.png'});
  chrome.browserAction.setTitle({title: 'Blurst is currently inactive'});
  startBtn.classList.remove('blrst_active');
  startBtn.classList.add('blrst_inactive');
  startBtn.innerText = 'Turn on';
}

function sendContentScriptCommand(commandName, paramValue) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {command: commandName, param: paramValue}, (response) => {
            console.log('receiving message', response);
            if (response) {
                console.log(commandName + ' instruction received');
            }
            else {
                console.warn(commandName + ' instruction not received');
            }
        });
    });
}

function addEventListeners() {
  highlightCheck.addEventListener('change', () => {
    chrome.storage.local.set({highlighted: highlightCheck.checked}, () => {
      sendContentScriptCommand('toggleHighlights', highlightCheck.checked);
    });
  });
  startBtn.addEventListener('click', () => {
      if (!blurstActive) {
        chrome.storage.local.set({active: true}, () => {
          startBlurst();
        });
      }
      else {
        chrome.storage.local.set({active: false}, () => {
          stopBlurst();
        });
      }
  });
  optionsBtn.addEventListener('click', () => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } 
      else {
        window.open(chrome.runtime.getURL('settings.html'));
      }
  });
}

(function setUp() {
    addEventListeners();
    chrome.runtime.sendMessage({message: 'popup count request'}, response => {
        if (response) {
            document.querySelector('#blrst_counter').innerHTML = response;
        }
    });
    chrome.storage.local.get(['active'], (result) => {
        blurstActive = result.active;
        if (result.active) {
            startBlurst();
        }
    });
})();
