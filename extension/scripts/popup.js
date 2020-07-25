'use strict';

var redaxActive,
    highlightCheck = document.querySelector('#highlight_blrsts'),
    showCheck = document.querySelector('#toggle_blrsts'),
    startBtn = document.querySelector('#blrst_start_btn'),
    optionsBtn = document.querySelector('#blrst_options_btn');

function startRedax() {
  log.trace()
  redaxActive = true;
  sendContentScriptCommand('toggleRedax', true);
  sendContentScriptCommand('getCount', null);
  chrome.browserAction.setIcon({path: 'images/active-icon-19.png'});
  chrome.browserAction.setTitle({title: 'Redax is active!'});
  startBtn.classList.remove('blrst_inactive');
  startBtn.classList.add('blrst_active');
  startBtn.innerText = 'Turn off Redax';
  highlightCheck.removeAttribute('disabled');
  showCheck.removeAttribute('disabled');
  chrome.storage.local.get(['highlighted'], function(result) {
      var highlighted = result.highlighted;
      sendContentScriptCommand('toggleHighlights', highlighted);
      if (highlighted) {
        highlightCheck.setAttribute('checked', true);
      }
      else {
        highlightCheck.removeAttribute('checked');
      }
  });
  chrome.storage.local.get(['showOriginals'], function(result) {
      var show = result.showOriginals;
      sendContentScriptCommand('toggleRedaxions', show);
      if (show) {
        showCheck.setAttribute('checked', true);
      }
      else {
        showCheck.removeAttribute('checked');
      }
  });
}

function stopRedax() {
  log.trace()
  redaxActive = false;
  sendContentScriptCommand('toggleRedax', false);
  chrome.browserAction.setIcon({path: 'images/icon-19.png'});
  chrome.browserAction.setTitle({title: 'Redax is currently inactive'});
  chrome.browserAction.setBadgeText({text: ''});
  startBtn.classList.remove('blrst_active');
  startBtn.classList.add('blrst_inactive');
  startBtn.innerText = 'Turn on Redax';
  highlightCheck.setAttribute('disabled', 'disabled');
  showCheck.setAttribute('disabled', 'disabled');
}

function sendContentScriptCommand(commandName, paramValue) {
  log.trace(commandName, paramValue)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {command: commandName, param: paramValue}, function(response) {
      if (response !== undefined && response.message == 'count') {
        console.log('receiving message');
        chrome.browserAction.setBadgeText({text: response.value.toString()});
        document.querySelector('#blrst_counter').innerHTML = response.value;
      }
      else if (response) {
        console.log(commandName + ' instruction received');
      }
      else {
        console.warn(commandName + ' instruction not received');
      }     
    });
  });
}

function addEventListeners() {
  log.trace()
  highlightCheck.addEventListener('change', function() {
    chrome.storage.local.set({highlighted: highlightCheck.checked}, function() {
      sendContentScriptCommand('toggleHighlights', highlightCheck.checked);
    });
  });
  showCheck.addEventListener('change', function() {
    chrome.storage.local.set({showOriginals: showCheck.checked}, function() {
      sendContentScriptCommand('toggleRedaxions', showCheck.checked);
    });
  });
  startBtn.addEventListener('click', function() {
      if (!redaxActive) {
        chrome.storage.local.set({active: true}, function() {
          startRedax();
        });
      }
      else {
        chrome.storage.local.set({active: false}, function() {
          stopRedax();
        });
      }
  });
  optionsBtn.addEventListener('click', function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } 
      else {
        window.open(chrome.runtime.getURL('options.html'));
      }
  });
}

(function setUp() {
  log.trace()
  addEventListeners();
  chrome.storage.local.get(['active'], function(result) {
    redaxActive = result.active;
    if (result.active) {
      startRedax();
    }
  });
  chrome.storage.local.get(['highlighted'], function(result) {
      var highlighted = result.highlighted;
      if (highlighted) {
        highlightCheck.setAttribute('checked', true);
      }
      else {
        highlightCheck.removeAttribute('checked');
      }
  });
  chrome.storage.local.get(['showOriginals'], function(result) {
      var show = result.showOriginals;
      if (show) {
        showCheck.setAttribute('checked', true);
      }
      else {
        showCheck.removeAttribute('checked');
      }
  });
})();
