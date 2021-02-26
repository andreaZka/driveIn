(function (global) {
    //ottengo l'id evento dall'url attuale
    var host = window.location.pathname;
    var res = host.split("/",3);
    idEvent = res[2];
    posto = res[3];
    qr_string = idEvent+posto;
}(window));


const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://codzz-qr-cods.p.rapidapi.com/getQrcode?type=text&value="+qr_string+"",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ec1856bc43msh4a9d68907ef251ep1fa698jsn19c7dc02250c",
		"x-rapidapi-host": "codzz-qr-cods.p.rapidapi.com"
	}
};


$.ajax(settings).done(function (response) { //ottengo qr
	console.log(response);
	let srcQR = response.url;
	console.log(srcQR);
	let qrImg = document.createElement("img");
	$(qrImg).attr("src",srcQR);
	$(qrImg).appendTo(".ticket2__body");
});

function backHome(){
    window.location.replace('/');
}

$( window ).on( "load", function() {
	$(".dataOra").each(function (){

        let date_string = ($(this).text()).split(".")[0]; //taglio i millisecondi dalla data
		let newDate = date_string.substr("0",date_string.length-3); //taglio i secondi
		$(this).text(newDate);
    })
});