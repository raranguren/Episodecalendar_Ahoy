// ==UserScript==
// @name         Episodecalendar Ahoy
// @namespace    n/a
// @description	 Adds torrent downloads to episodecalendar.com
// @version      4.12
// @date         2021-07-08
// @grant        none
// @noframes
// @run-at       document-idle
// @include      http*://episodecalendar.com/*calendar*

// ==/UserScript==

(function() {
    'use strict';

    const SEARCH_URL = "https://thepiratebay.org/search/*/0/7";
    const MAGNET_ICON = "data:image/gif;base64," +
          "R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv" +
          "///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi" +
          "/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==";

    const shows = document.getElementsByClassName("show");
    const episodes = document.getElementsByClassName("episode");
    const boxes = document.getElementsByClassName("checkbox-wrapper");
    if (boxes.length) {
        for (let j in boxes) {
            if (j > 0) {
                var i = j-1;
                //get the show name
                var showName = shows[i].innerHTML;
                //get the episode ID and convert into format: s00e00
                var showTip = episodes[i].innerHTML
                episodes[i].innerHTML = " ";
                var numbersFound = showTip.match(/\d+/g);
                var episode = numbersFound[numbersFound.length - 1];
                var season = numbersFound[numbersFound.length - 2];
                //clean titles
                episodes[i].childNodes[0].innerHTML = "";
                //add link to torrent search with format: episodename s00e00
                var episodeHref = SEARCH_URL.replace("*",episodeName(showName,season,episode));
                episodes[i].appendChild(imageLink(episodeHref,MAGNET_ICON));
            }
        }
    }

    function episodeName(show, season, episode, x = false) {
        return show.replace("'","").replace(/ +/g," ") + ' s' + ~~(season/10) + (season%10) + 'e' + ~~(episode/10) + (episode%10);
    }

    function imageLink(href,src) {
        var link = document.createElement('a');
        link.target = "_blank";
        link.href = href;
        link.style.position = 'relative';
        link.style.top = '1px';
        link.style.paddingLeft = '2px';
        var img = document.createElement('img');
        img.src = src;
        img.height = 10;
        link.appendChild(img);
        return link;
    }

})();
