// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

/**
 * Copies the given text to the clipboard
 */
chrome.runtime.onMessage.addListener(function (message) {
  if (message && message.type == 'copy') {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = message.text;
    input.focus();
    input.select();
    var successful = document.execCommand('Copy');

    chrome.notifications.create({
      title: 'Extra-gram',
      message: successful ? message.success : message.fail,
      iconUrl: 'icons/icon16.png',
      type: 'basic'
    });

    input.remove();
  }
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message && message.type == 'opentab') {

    var html = ['<html><head><title>Non-Followback Users</title></head><body><ul>'];

    message.users.forEach(function (user) {
      html.push(['<li><a href="', 'https://www.instagram.com/', user, '" target="_blank">', user, '</a></li>'].join(''));
    });

    html.push('</ul></body></html>');
    var w = window.open('', '_blank');
    w.document.write(html.join(''));
  }
});
