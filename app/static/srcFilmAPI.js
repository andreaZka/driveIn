(function (global) {
	srcTitle = global.localStorage.getItem("srcFilm");
}(window));

let films;

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/"+srcTitle+"",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ec1856bc43msh4a9d68907ef251ep1fa698jsn19c7dc02250c",
		"x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
	films = response.titles;
	let baseName = "title_";
	for(let i=0; i<films.length; i++)
    {
    	let box = document.createElement("div");
    	$(box).attr("class","box");
    	$(box).attr("id",baseName+i);
    	$(box).appendTo(".container");
        let x = films[i];
        let img = document.createElement("img");
        $(img).attr("src", x.image);
        $(img).appendTo(box);
        let title = document.createElement("span");
		$(title).text(x.title);
        $(title).attr("id", baseName+i);
        $(title).appendTo(box);
    }
});

$(document).on('click', '.box', function(){//uso on per gestire i nuovi elementi creati con lo script
    let id_film = $(this).attr("id"); // che non funzionerebbe con document ready
    let n = id_film.substr(6,1);
    let id_API = films[n].id; //funzione per collegare titolo film a pagina
    window.location.href = "/filmView/"+id_API+"";
});