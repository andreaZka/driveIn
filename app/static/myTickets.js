qr_string = 0;


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

$(document).on('click', '.help-btn', function(){ //ottengo id biglietto dal testo del paragrafo
	var selected_ticketDIV = $(this).parent();
	var id_string = $(selected_ticketDIV).find("p.ticketID").text();
	console.log(id_string);
	let id = id_string.split("#",2)[1];
	qr_string = "ticket"+id;
	console.log(qr_string);
	popup();
});



function popup() //i rappresenta il i-esimo ordine
{
    $.ajax(settings).done(function (response) {
	    let srcQR = response.url;
	    let qrImg = document.createElement("img");
	    $(qrImg).attr("src",srcQR);
        var html = "<div class='sfondo'></div>"
		  +"	<div class='corpo'>"
		  +" 		<div class='contenuto'></div>"
		  +"		<p class='chiudi'>CHIUDI</p>"
		  +"	</div>";
        $("body").prepend(html);

        $(".sfondo, .chiudi").click(function() {popup_close();});
        $(qrImg).appendTo(".contenuto");
    });
}

function popup_close()
{
	$(".sfondo, .corpo").remove();
}


$( window ).on( "load", function() {
	$(".dataOra").each(function (){

        let date_string = ($(this).text()).split(".")[0]; //taglio i millisecondi dalla data
		let newDate = date_string.substr("0",date_string.length-3); //taglio i secondi
		$(this).text(newDate);
    })
    });