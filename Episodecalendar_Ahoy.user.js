// ==UserScript==
// @name           			Episodecalendar Ahoy
// @namespace     			n/a
// @author					Ricardo Aranguren
// @tester					Ana García
// @description				Adds links to torrent and subs into episodecalendar.com
	
// @version        			3.1
// @date           			2016/09/05
// @grant                   none

// @include        			http://*episodecalendar.com/calendar*
// @include        			http://*episodecalendar.com/en/calendar*
// @include							https://*episodecalendar.com/calendar*
// @include							https://*episodecalendar.com/en/calendar*

// ==/UserScript==
var proxy = "http://thepiratebay.com.ua/"
var englishSubs = true // change to get links to english subs instead of Spanish
var icon = [ "http://i59.tinypic.com/2w3pd38.jpg", "http://www.subtitulos.es/images/icon-translate.png", "http://www.addic7ed.com/images/subtitle.gif"]
var showName; var showTip; var numbersFound; var season; var episode; var episodeHref; var i;
var shows = document.getElementsByClassName("show");
var episodes = document.getElementsByClassName("episode")
var boxes = document.getElementsByClassName("checkbox-wrapper")

if (boxes.length) for (var j in boxes) if (j>0) { i = j-1;
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
	episodeHref = 'http://extratorrent.cc/search/?search='+ episodeName(showName,season,episode, false)
	episodes[i].appendChild(imageLink(episodeHref,icon[0]));
	if (englishSubs) {
		//add link to addic7ed.com with format: episodename s00e00
		//episodeHref = 'http://www.addic7ed.com/search.php?search='+ episodeName(showName,season,episode, false);
		//episodes[i].appendChild(imageLink(episodeHref,icon[2]));
	} else {
		//add link to subtitulos.es with format: episodename 0x00
		episodeHref = 'http://www.subtitulos.es/search.php?cx=partner-pub-9712736367130269%3A9775425900&cof=FORID%3A10&q=';
		episodeHref += episodeName(showName,season,episode, true)
		episodes[i].appendChild(imageLink(episodeHref,icon[1]));
	}
	//shorten names
	//showName = showName.replace("The ","'");
	//if (showName.length > 9) shows[i].innerHTML = showName.substr(0,9)+'...';
    //align right
    //episodes[i].style.cssFloat="right"
    //boxes[j].style.cssFloat="left"
    //boxes[j].style.marginRight="6px"
    //boxes[j].style.top="3px"
}


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
