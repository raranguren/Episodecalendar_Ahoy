// ==UserScript==
// @name         Episodecalendar Ahoy
// @namespace    n/a
// @description	 Adds torrent downloads to episodecalendar.com
	
// @version      4.8
// @date         2017-11-22
// @grant        none
// @noframes
// @run-at       document-idle

// @include      http*://episodecalendar.com/*calendar*
// @include      http*://extratorrent.cc*

// ==/UserScript==

//searchURL = 'http://extratorrent.cc/search/?search=*'
searchURL = "https://thepiratebay.org/search/*/0/7"
//searchURL = "https://rarbgmirror.xyz/torrents.php?search=*&category%5B%5D=18&category%5B%5D=41&category%5B%5D=49"
magnetIcon = "https://games4theworld.org/wp-content/uploads/2016/08/magnet_url.png"

// This part runs in episodecalendar.com
// =====================================

shows = document.getElementsByClassName("show");
episodes = document.getElementsByClassName("episode")
boxes = document.getElementsByClassName("checkbox-wrapper")
if (boxes.length) for (j in boxes) if (j>0) { i = j-1;
	//get the show name
	showName = shows[i].innerHTML;
	//get the episode ID and convert into format: s00e00
    showTip = episodes[i].innerHTML
		episodes[i].innerHTML = " "
	numbersFound = showTip.match(/\d+/g);
	episode = numbersFound[numbersFound.length - 1];
	season = numbersFound[numbersFound.length - 2];
    //clean titles
    episodes[i].childNodes[0].innerHTML = ""
	//add link to torrent search with format: episodename s00e00
	episodeHref = searchURL.replace("*",episodeName(showName,season,episode))
	episodes[i].appendChild(imageLink(episodeHref,magnetIcon));
}

// This part runs in extratorrent.cc when there is a list of seeders
// =================================================================

seeds = document.getElementsByClassName("sy")
minSeeds = 1000
if (seeds.length) for (i in seeds) if (+seeds[i].textContent > minSeeds) {
	//for each <td class="sy"> that has a number greater than the previously found
	magnetTitle = seeds[i].parentNode.getElementsByClassName("tli")[0].textContent
	magnetHref = seeds[i].parentNode.getElementsByTagName("a")[1].href
	minSeeds = +seeds[i].textContent
}
// if there was a good torrent found, display the name and launch torrent link
if (typeof(magnetHref) == "string") {
	window.location.replace(magnetHref)
	alert("DOWNLOADING MAGNET: \n\nTitle: "+magnetTitle+"\n\nSeeders: "+minSeeds)
	window.close()
}

// functions
// =========

function episodeName(show, season, episode, x = false) {
	return show.replace(/ +/g," ") + ' s' + ~~(season/10) + (season%10) + 'e' + ~~(episode/10) + (episode%10);
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
	return link
}
