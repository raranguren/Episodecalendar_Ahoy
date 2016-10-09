// ==UserScript==
// @name         Episodecalendar Ahoy
// @namespace    n/a
// @description	 Adds torrent downloads to episodecalendar.com
	
// @version      4.0
// @date         2016/09/10
// @grant        none

// @include      http*://episodecalendar.com/*calendar*
// @include      http*://extratorrent.cc*

// ==/UserScript==

searchURL = 'http://extratorrent.cc/search/?search=*'
magnetIcon = "http://images4et.com/images/magnet.png"

// This part runs in episodecalendar.com
//////////////////////////////////////////

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
	episodeHref = searchURL.replace("*",episodeName(showName,season,episode, false))
	episodes[i].appendChild(imageLink(episodeHref,magnetIcon));
}

// This part runs in extratorrent.cc when there is a list of seeders
////////////////////////////////////////////////////////////////////

seeds = document.getElementsByClassName("sy")
minSeeds = 1000
if (seeds.length) for (i in seeds) if (seeds[i].innerHTML > minSeeds) {
	//for each <td class="sy"> that has a number greater than the previously found
	minHref = seeds[i].parentNode.getElementsByClassName("tli")[0].getElementsByTagName("a")[0].href
}
//redirect if there was a good torrent found
if (typeof(minHref) == "string") window.location.replace(minHref)

// This part finds magnet links and runs them
/////////////////////////////////////////////

links = document.getElementsByTagName("a")
for (i in links) if (links[i].href.substring(0,7) == "magnet:") 
		window.location.replace(links[i].href)

// functions
////////////

function episodeName(show, season, episode, x = false) {
	if (x) {
		return show.replace(/[\d()]/g,"").replace(/ +/g," ") + ' ' + season*1 + "x" + ~~(episode/10) + (episode%10);
	} else {
		return show.replace(/[\d()]/g,"").replace(/ +/g," ") + ' s' + ~~(season/10) + (season%10) + 'e' + ~~(episode/10) + (episode%10);
	}
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
