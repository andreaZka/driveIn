(function (global) {
    //ottengo l'id evento dall'url attuale
    var host = window.location.pathname;
    var res = host.split("/",4);
    idFilm = res[1];
    idEvent = res[3];
    console.log(idEvent);
}(window));

$.ajax({ //ottengo posti liberi e occupati per l'evento

    url : "/get_seat/"+idEvent+"",
    type : 'GET',
    dataType:'json',
    success : function(data) {
        occupati = JSON.parse(JSON.stringify(data));
        insertSeat(occupati);
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
});


function insertSeat(occupati){
    console.log(occupati);

    if(occupati.full_free==true){
        console.log("yoooo");
         var n_file = Math.floor(occupati.MAXposti/5); //numero di file da 5
        var restFila = (occupati.MAXposti) % 5; // eventuale fila non da 5
        for(var i=0; i<n_file; i++){
            var fila = document.createElement("div");
            $(fila).attr("id", "fila"+i);
            for(var j=1; j<=occupati.MAXposti; j++){
                let car = document.createElement("img");
                $(car).attr("src", "/static/styles/img/green_car.png");
                $(car).attr("class", "posto_libero");
                $(car).attr("id", i*5+j);
                $(car).appendTo(fila);
            }
        }
        $(fila).appendTo("#posti");
    }
    else{
        var n_file = Math.floor(occupati[0].MAXposti/5); //numero di file da 5
        var restFila = (occupati[0].MAXposti) % 5; // eventuale fila non da 5
        var postiOccupati = [];
        for(let x=0; x<occupati.length; x++){
            postiOccupati.push(occupati[x].posto); //salvo i posti occupati in un array
        }
        // console.log(postiOccupati);
        for(var i=0; i<n_file; i++){
            var fila = document.createElement("div");
            $(fila).attr("class","fila");
            $(fila).attr("id", "fila"+i);
            for(var j=1; j<=5; j++){
                let car = document.createElement("img");
                if( postiOccupati.includes( i*5+j) ){ //moltiplico la i*5 perchè le file sono composte da 5
                    $(car).attr("src","/static/styles/img/red_car.png");
                    $(car).attr("class", "posto_occupato");
                }
                else{
                    $(car).attr("src", "/static/styles/img/green_car.png");
                    $(car).attr("class", "posto_libero");
                }
                $(car).attr("id", i*5+j);
                $(car).appendTo(fila);
            }
            $(fila).appendTo("#posti");
        }
    }
}


$(document).on('click', '.posto_occupato', function(){ //funzione per
    alert("Posto già occupato: impossibile prenotare");
});


$(document).on('click', '.posto_libero', function(){ //funzione per

    var alreadySelected = document.getElementsByClassName('posto_selezionato')[0]; //contiene posto già selezzionato
    if( typeof alreadySelected !== "undefined"){ //se è già stato selezionato un posto
        $(alreadySelected).attr("class","posto_libero"); //lo deseleziono e lo rendo di nuovo libero
        $(alreadySelected).attr("src","/static/styles/img/green_car.png")
    }
    $(this).attr("class", "posto_selezionato");
    $(this).attr("src", "/static/styles/img/yellow_car.png")
});


function buy(){

    let posto = $(".posto_selezionato").attr("id");
    console.log(posto);
    if( typeof posto === "undefined" ){
        alert("Nessun posto selezionato");
    }
    else{
        window.location.href = "/buyTicket/"+idEvent+"/"+posto+"";
    }
}


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
	$(img).appendTo("#leftDIV");

});