// ==UserScript==
// @name         Episodecalendar Ahoy
// @namespace    n/a
// @description	 Adds download links to episodecalendar.com
// @version      6.1
// @grant        none
// @noframes
// @run-at       document-idle
// @match        http*://episodecalendar.com/*

// ==/UserScript==

(function() {
    'use strict';

    // CONFIG
    const SEARCH_URL = "https://thepiratebay.org/search/*/0/7";
    const searchMagnetUrl = (show, season, episode, x = false) => SEARCH_URL
        .replace("*",show.replace("'","").replace(/ +/g," ") + ' s' + ~~(season/10) + (season%10) + 'e' + ~~(episode/10) + (episode%10));
    const STREAM_URL = "https://flixtor.video/tag/*";
    const searchStreamUrl = (show) => STREAM_URL
        .replace("*",show.replace("'","").replace("-"," ").replace(/\s?[^\s\w].*/g,"").replace(/\W/g,"-").toLowerCase());

    // ASSETS
    const MAGNET_ICON = "data:image/gif;base64," +
          "R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv" +
          "///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi" +
          "/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==";
    const TICKET_ICON = "data:image/png;base64," +
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAG1BMVEUXorgWorhHcEwWorgXorgXorgXorgXorgXorh6A0jNAAAACHRSTlPRHgBpOUOdecxab" +
          "/EAAABlSURBVBiVTZBbDgAhCAOLAvb+J96qK+qHZiYpD9HOGbYeHAbprxAzHgF2o10hjjRY+BZiJ9MUMxRvM3CZ0QlFZn6xT24YyuXlhlUpixXxUL+Mn3dbzXR4i1m0dpiXX" +
          "/5Ht1G/8AHdHwOBg/TDkwAAAABJRU5ErkJggg==";


    // Creates an image element wrapped with an hyperlink
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

    // Creates magnet link from a show name and episode label like 's01e02' or '1x02'
    function magnetLink(showName, episodeLabel) {
        var numbersFound = episodeLabel.match(/\d+/g);
        var episode = numbersFound[numbersFound.length - 1];
        var season = numbersFound[numbersFound.length - 2];
        return imageLink(searchMagnetUrl(showName,season,episode),MAGNET_ICON);
    }

    // Creates streaming link for a show name
    function streamLink(showName) {
        return imageLink(searchStreamUrl(showName), TICKET_ICON);
    }

    // Parse each element of an HTML collection and mark them as already parsed
    function parse(elements, runnable) {
        if (elements.length) {
            for (let item of elements) {
                if (!item.classList.contains("ahoy-parsed")) {
                    runnable(item);
                    item.classList.add("ahoy-parsed");
                }
            }
        }
    }

    // Figure out what show is being displayed in 'my shows' or 'unwatched' pages
    function getShowTitleContainerFromPage() {
        // Get selected elements, including the left menu
        var selected = document.getElementsByClassName("selected");
        if (selected.length > 1) {
            // We are in 'unwatched' page and a show is selected
            var name = selected[1].dataset.name;
            var span = document.createElement('span');
            span.textContent = name;
            return span;
        }
        // otherwise just use the page title
        var h1 = document.getElementsByTagName("h1");
        if (h1.length) {
            return h1[0];
        }
        return null;
    }

    // Search elements using a class name, or run the search to find those elements
    function getElementsByClassNameOrRun(container, search) {
        if (typeof search === 'string') {
            return container.getElementsByClassName(search);
        }
        return search(container);
    }

    // Add magnets to the elements of a certain class, indicating how to find each part
    function addMagnets(className, getCheckBoxes, getShowNames, getEpisodeLabels, getContainers) {
        const elements = document.getElementsByClassName(className);
        parse(elements, item => {
            let checkBoxes = getElementsByClassNameOrRun(item, getCheckBoxes);
            if (checkBoxes.length) {
                let showName = getElementsByClassNameOrRun(item, getShowNames)[0].innerText;
                let episodeLabel = getElementsByClassNameOrRun(item, getEpisodeLabels)[0].innerText;
                let container = getElementsByClassNameOrRun(item, getContainers)[0];
                container.appendChild(magnetLink(showName, episodeLabel));
                container.appendChild(streamLink(showName));
            }
        });
    }

    // MAIN
    // runs after jQuery finishes a page update
    $(document).ajaxComplete(() => {
        var titleContainer = getShowTitleContainerFromPage();
        addMagnets("epic-list-episode",
                   "checkbox-wrapper",
                   () => [titleContainer],
                   item => item.getElementsByClassName("name")[0].getElementsByTagName("strong"),
                   "seen");
        addMagnets("episode-item",
                   "checkbox-wrapper",
                   "show",
                   "episode",
                   item => [item]);
    });

})();
