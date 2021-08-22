// ==UserScript==
// @name         Episodecalendar Ahoy
// @namespace    n/a
// @description	 Adds torrent downloads to episodecalendar.com
// @version      5.3
// @date         2021-08-22
// @grant        none
// @noframes
// @run-at       document-idle
// @include      http*://episodecalendar.com/*

// ==/UserScript==

(function() {
    'use strict';

    const SEARCH_URL = "https://pirateproxy.space/search/*/0/7";
    function searchUrl(show, season, episode, x = false) {
        return SEARCH_URL.replace("*",show.replace("'","").replace(/ +/g," ") + ' s' + ~~(season/10) + (season%10) + 'e' + ~~(episode/10) + (episode%10));
    }
    const MAGNET_ICON = "data:image/gif;base64," +
          "R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv" +
          "///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi" +
          "/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==";
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

    $(document).ajaxComplete(() => {
        const shows = document.getElementsByClassName("show");
        const episodes = document.getElementsByClassName("episode");
        const checkBoxes = document.getElementsByClassName("checkbox-wrapper");
        if (checkBoxes.length) {
            for (let i = 0; i < checkBoxes.length; i++) {
                if (shows[i] && episodes[i] && !checkBoxes[i].classList.contains("ahoy")) {
                    var showName = shows[i].innerHTML;
                    var episodeLabel = episodes[i].innerHTML;
                    var numbersFound = episodeLabel.match(/\d+/g);
                    var episode = numbersFound[numbersFound.length - 1];
                    var season = numbersFound[numbersFound.length - 2];
                    episodes[i].appendChild(imageLink(searchUrl(showName,season,episode),MAGNET_ICON));
                    checkBoxes[i].classList.add("ahoy");
                }
            }
        }
    });

})();
