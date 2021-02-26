(function (global) {
	// idFilm = global.localStorage.getItem("idAPI");
	var host = window.location.pathname;
    var res = host.split("/",3);
    idFilm = res[2];
    console.log(idFilm);
}(window));


var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/"+idFilm+"",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ec1856bc43msh4a9d68907ef251ep1fa698jsn19c7dc02250c",
		"x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
	// var div = document.getElementById("box");
	let img = document.createElement("img");
	$(img).attr("src",response.poster);
	$(img).attr("id","poster");
	$(img).appendTo(".container");
	let titolo = document.createElement("h1");
  	$(titolo).text(response.title);
  	$(titolo).attr("id","titolo");
	$(titolo).appendTo("#event_descript");
	// $(titolo).append(img);
	let anno = document.createElement("h3");
	$(anno).text(response.year);
	$(anno).attr("id","anno");
	$(anno).appendTo("#event_descript");
	// $(anno).append(titolo);
	let durata = document.createElement("h3");
	$(durata).text(response.length);
	$(durata).appendTo("#event_descript");
	// $(durata).append(anno);
	$(durata).attr("id","durata");
	let trama = document.createElement("p");
	$(trama).text(response.plot);
	$(trama).attr("id","trama");
	$(trama).appendTo("#event_descript");
	// $(trama).append(durata);
});


$(document).on('click', '.buyButton', function(){ //funzione per
	console.log("LOLLOLLOL");
	let id_evento = $(this).attr("id"); //l'id evento è messo come id del bottone
	console.log(id_evento);
	window.location.href = "/"+idFilm+"/selectSeat/"+id_evento+""

});


function selectEvent(){
    var host = window.location.pathname;
    var res = host.split("/",3); //divido l'indirizzo in sottostringhe
    fetch("/"+res[1]+"/"+res[2]+"/getIdEvent")
        .then(response => {
            if (response.ok) {
                console.log("yess");
                return response.json();
            }
        })
        .then( json => console.log(json));
}


$.ajax({ //ottengo info sull'ordine

    url : "/getEvents/"+idFilm+"",
    type : 'GET',
    dataType:'json',
    success : function(response) {
		loadEvents(response);
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
});

function loadEvents(response){

	console.log("yooo");
	if(response.length==0){
		let riga = document.createElement("tr");
		// $(riga).text("Non ci sono eventi in programma");
		$(riga).appendTo(".proiezioni");

		var cella = document.createElement("td");
		$(cella).attr("colSpan",3);
		$(cella).text("Non ci sono eventi in programma");
		$(cella).appendTo(riga);
		return;
	}
	var tabella = document.getElementsByClassName("proiezioni")
	for(var i=0; i<response.length; i++){

		if(response[i].sold_out==false)
		{

			let riga = document.createElement("tr");
			$(riga).appendTo(tabella);
			let cinema_val = document.createElement("td");
			$(cinema_val).text(response[i].cinema);
			$(cinema_val).appendTo(riga);
			let orario_val = document.createElement("td");
			let dateTime = response[i].orario.split('T');
			let data = dateTime[0];
			let ora = dateTime[1].substr(0,5);
			let datetime_formattato= data+"  "+ora;
			$(orario_val).text(datetime_formattato);
			$(orario_val).appendTo(riga);
			let cella_button = document.createElement("td");

			let buyButton = document.createElement("button");
			$(buyButton).attr("id",response[i].id_evento); //in questo modo ottengo id_evento prendendo l'id del bottone che viene cliccato
			$(buyButton).attr("class","buyButton");
			$(cella_button).attr("id","abc");
			$(buyButton).text("Acquista biglietto");
			$(buyButton).appendTo(cella_button);
			$(cella_button).appendTo(riga);
		}
		else{
			let riga = document.createElement("tr");
			$(riga).appendTo(tabella);
			let title = document.createElement("td");
			$(title).text(response[i].cinema);
			$(title).appendTo(riga);
			let orario = document.createElement("td");
			$(orario).text(response[i].orario);
			$(orario).appendTo(riga);
			let soldOut = document.createElement("td");
			$(soldOut).text("SOLD OUT!");
			$(soldOut).appendTo(riga);
		}

	}
}

