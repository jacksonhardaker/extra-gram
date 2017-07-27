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
      iconUrl: 'icons/icon128.png',
      type: 'basic'
    });

    input.remove();
  }
});

/**
 * Opens a given list of instagram users in a new tab with links.
 */
chrome.runtime.onMessage.addListener(function (message) {
  if (message && message.type == 'opentab') {

    var html = ['<html><head><link href="', 
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAMXElEQVR4AdVaiVeTV97+/q1v+WrrohWkVltrq120LigLiFgRBbRLrXVpxWo7WnU6ba2tHVtbHUVlgSQkQBQS9gVkISRAWELYw/LM8/4m97x5GzDktGfm9J7znDe+3Nz8nt9+7/W/AHQRY8QMMf8nwSwxTnRpBCawyJiansWwf/o/htHxGUQYkxoBw6yZ2XncLnEh54IDez8ox7ZsK7ZHDRsEOQL5HOUa8rs7j9mQcbYSX/7Ugt6BSSww5khATCLD453AodxKPLfjIZ7Zfp/PB1ix6yGW73wqOCffiN0F4dhFhMyJvKY8seztB/h/yvJGpgWljv4wBkJAucshsv3ft/KwZk8Bnt+7FBRibYKGIkFMokLxIuA8DTJfvqvWiohnqcyN+0tQ/8SHkDGvEZgjcDO/C8+S7VIWkx8XKGFLEJMkQGyyCbFJGkpCYBKoOTKf31tLBMlz3chkaA1RcmBmzkhgbm4eR847sOxpBJTQiYUQLScVKwFF6HUKKQpmBfVOzeF8RZTkCWW5SBZZFZ+Pl9NNaO8ZMxIY9E0z2Kzid0/TekxQ40qrAhFKCWoRxGlIDUHw3TqBWeYLhISyirLI4iTWEKtJwvS4z0igp39CmK3cnb+48Mq3ReMlWKcLHiJwqeAFDftCEHwXJzCQ0S0iRDQSyhILE1lOJd8z94QT2HRACCwuvHKZRQW3auB7Bfk3CVixPs3GpwarQOYLhIRAWUMFu8RFOAHxkjzL0gioQDUIrwsuQohAsSmlWJOgvbPh5XfKseWIHa9l2rEhvQwxyVY8n1RKEmVChFBECCMR3aUUicLfQ6BQaV8XXhHgD4pmiTWJpdicUYFrd7uYpwfQ8MQPd/8kOj0TcDT58LCsH+9fbuY8m5B4cX8IkbRQIkJCd6dghmLyiJqArn3xe13zBD9bqFGLaHx5vBlbs+xoaB/F0EgAdy19uHbPhdzrT/D5jx248dCNspphSXtXf+nCyr2l/K4Na5NoFQ2JYjnCzM9cWwU2oZMQS0RFQBdeMo6JLiOLY+UeLppcim1HHyHphBOJJxxwtoygzTWOlzPs+O/tFqzYY8PGA3a8dPAxVuwtwzM7rTj73RMWyjkhtue4EymnqpH8MXFSg5OfHXgz287f5G/Eay4kJEJcqSgKAiK88vtiCdi1XHANF8/9rhWNHaPsS6bgGw2w4Qqgg66S85dGnPy6FVbnECvlqLzr7pvk3DE8qvfh4s1OVDaOiCX6h6fhGwvw+0Z4BibF/U591YTVe02UQSyvUqyyQmQCetYRX+RCFJ7IK+3FJNuNX0s8ePdiI1JP1SDni0bkV3jRQ59vd0+grXscta1+Pifg9k7BTuFNVUNwNvvhZ2fpIfGP/tqKfafrcPhCgyDzfD0yztXhvUsNuFfaK5a6Y3JjjZCQFKtcKTKBVYpAsFixejLvFuOz661al0pN19ONLFi2y4Ltx6pQ1+qXYC2pHEQNP9MiMm86MC8EfGMz6HRrfx/C9w89YoX2nnFkXmjCc/E2xkFZEDasTrDynQnvk0hgZh6ffNtMhRYrK5CMBHQkAgV62kwWMzJDWODqm8DNgh6siDfTGlaknq4Rs1c1jeCBzcvPxr69q3cSw8Z3Gjlarw/3ywZoyTmxRExKhcTLhgMVTLnlzEo2PLvLxHlutLvGKIdZZFAB/S8C+U8hEF8gTBWB1QzabTl2eOm3OZ/XMUAteCP7MTzUro3Z5VdzH+bnETrE//uHAlhsFFQM4mZhL/y0TvrZesSmCgkSqMCLJLFqrxnZF+owwN/cftROVzKm1UgEVN6XdLaKBFJPOijQtJYtqB0z7tv6RcPHqcEmBmno6OO8FsYBSYkrzc2pnwFmZ3Wmd8z9rBnDkr02vPOIggsBolzqyr5TTrHw/tNOKlEFc0QC5iCB4jACmgXiP6jCng8dGJ+cxeVbXahq9KPo0SDUmJ2bZ5rswr5PmpF+rgUpZ5px8Hwbjl5qxx2LFwO+GUxMzYnmx7jG+RudfDeNj//WirUp5XQjOxSBNAo+LAQcRgKJJLCbBErd4QReecfMTq8whIAZQuCUZoEp7HyvEt8/cEnRulXsES3fNvWJb2vjnnUAcelOrD9QjQ0Ha7Axo1YQk1aN1DMtEhNMo8xGszK/jum2vNbHOuLHC/s14cUKLGoagWpZVwjQhUIDeaUQ6FkCgRSdQN/gFIuNE7Vtfqa4XnQws3DQnQZQ2TQim+/dx+spuBOvZtXhtax6vJZdjy05jRpIqgZXbnvw22GqHKKvB7DjPScDuEKCmRYIIeAkAb0y04WWSCBZETAJAbd3kkFcLynzq9vdmAqIczM7TeFanpvwIHZ/FV49UgshkN1AwRuw9WgT0YhNh+uxNaeetcK4MX/cMKLFk9SDWHEjEkiyhhFYFzWBpFACTnQzjX7yTSu6eyfw7V0X1NDc6OqvLqyj8K9kVmOzIkDtCwmxQIMglq702Y8uA4GatlE86ZlA7vftWJ1YpiwQLYHIMUDBWVha0cXn13e6ETqau8ax6ZADL2U4sflwjbKCciPBpsw67PigEV/c7JYWQw1Hs18y0YUbHULgd8eAZKFwAuJCWZoLucdx5VannGCEjsu/uBCzr1IIKCsIiSBeSHcyAfRKdS6wD0ENs2NIs66026zIQkBlISFwRrJQJAKR06gK4qaOUbbIPeggkdDhZTpkEDNYHRASglrNGszzNUg53SRpUXO5/PJBqMr9c1EvU2kACSdqsC61bIE06gxPo1IH3E8vZNLICYFiVcgkjf49vwfVTHvs7SXvTzOYR5jXKRfybF7m88daPFDjDqyn1uO0J0kVV+pat9f5xBIN7WPMYl7pXpmBuNHRoBGwKAJ8OkSGpVdiYy9EQiTwcRW8wTqQTDJat3jsYpPWVkvTNTgSkALl8WoZqQdf3nIxsHsEF3+SzzJPDc6XHurLn7vEsnRJcZ8X0zUCZWwlLFQaK7FfJ7D0Xki6Uf3oZDW//GZ2Bc0svZA0WuW1Q7TCCI5yDzA+NWvISMYhwkobHTpoNWlD7lr6pUBuOVKJuLRy0T4JsGGUXojVfwpvZpUziBUB6Uaj2Q9ojGVDw/w9zv7Fg/95qwhvH6vUNE53coslxiaERNiga4nr/fbg+Nz1drYPbdInHb8qe2Xx/fUUfl2qFct2luCBtY/Zzc/f1wJXd58otpS6FZbvKsKJKw3SjJ35phn/93YJDn5aK+b/Ls/FDUkD+3zDeaW0y9R8WLrN+qIJp75uE8tcvNnB7aZF218IqHm6i7braxGi71+qY99TZDihiIKA1IMgSiQTXM/rkoXLa4Zw/oc2FNq94JAtI92J+942tspe2bAwHsTtmjvHOG+AQrfiQG69uI2Q6RyVd59ea6NF2vjdVsZCOxtEn8TLt//okPhbK7/PZ5QECHVwS2j5l9BIZJ+vRVnNoBQ0D2uDq39SOlW6EdsCHy7/3MmC14aT7DA/vNKCj6624NwP7dqOTbpQ5nb5DiF7Y28QA0SnZxwWxwAycp0ivHKdmOhPJYyHWvpZqNQFmrqEwWbF1sMV2JJZgVeJA5/W4G5pL3rpVt6haXn2DgSFG5mG1TmIdy818gjmEbYeeYTXefD1uny2Q9Y5zBjg2dDy3cWSdeQoR3edP/5kLlZOKix8TySXSu5m+uPOqozptgrpJHTwbK3sHzYfsmsNGudoJ3hB8DsEvytrcC0zn3/4yZwgdJOvKnTYuah+5mkVQnJgRfCzZBaewkU4VtRgVhVX+f3SCbj6IpxOq5NpZQlpt41ECHUqrQTUQRLyVKfTAv3+wHgaV7So8IpA2Ol03+AktmZaIt0PEEYicj+gzvpJRCFOIBoWGO4HBKYQodXhlTRrke4HqOSHKCj3GAnMzMwxt1fKpd5S7sSURQS6a6mj90XBvys/N1xsCBKWdkOzIa2YfdRI+B3Z5Z9aeTMZiQCREErCaBEV6ItBF7zY6OsRhReIghM+LGcnMBtGQHqPHcdsWLb9ftQXfQaLCKFFoBcmgVoj8gWf+L7cnpbo10tCwHBPXNvikwtmXvbJF3gfxQK2AOJ1cNEgCumjSpiihSB/5zyZryDrLP47klh4e0rLFeLG/Q6oEWYBNfqHJpF7rQHbsqzYmMajxZSiKFC8REReK45Yn1qELYcsOHyuCpUNg1hoaAQCWGD4xwPocI/B2TSM6uZ/P5zNQ2jqGIHPPw3tGniRMasRGMefd0yo/27jJ6aJuT8JAsQo0fVPb8YYOG8M39sAAAAASUVORK5CYII=",
    '" rel="icon" type="image/png" /><title>Non-Followback Users</title></head><body><ul>'];

    message.users.forEach(function (user) {
      html.push(['<li><a href="', 'https://www.instagram.com/', user, '" target="_blank">', user, '</a></li>'].join(''));
    });

    html.push('</ul></body></html>');
    var w = window.open('', '_blank');
    w.document.write(html.join(''));
  }
});
