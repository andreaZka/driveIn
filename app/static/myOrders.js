qr_string = 0;

$.ajax({ //ottengo info sull'ordine

    url : "/getMyOrders",
    type : 'GET',
    dataType:'json',
    success : function(data) {
        info = JSON.parse(JSON.stringify(data));
        showOrders(info);
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
});


function showOrders(info){
    if(info.length===0){
        console.log("ajkadfjk");
        let allertImg = document.createElement("img");
        $(allertImg).attr("src","/static/styles/img/attenzione.png");
        $(allertImg).attr("id","allertImg");
        $(allertImg).appendTo(".orders-container");
        let avviso = document.createElement("p");
        $(avviso).text("NON HAI ORDINI PRENOTATI");
        $(avviso).attr("id","avviso");
        $(avviso).appendTo(".orders-container");

    }
    console.log(info);
    for(let i=0; i<info.length; i++)
    {
        console.log(info);
        let orderBox = document.createElement("div");
        $(orderBox).attr("class","orderBox");
        $(orderBox).appendTo(".orders-container");
        let boxHead = document.createElement("header");
        $(boxHead).attr("class","boxHeader");
        $(boxHead).appendTo(orderBox);
        let idOrdine = document.createElement("h1");
        $(idOrdine).text("ID ordine: #"+info[i].id_ordine);
        $(idOrdine).attr("id","id"+i);
        $(idOrdine).appendTo(boxHead);
        var section = document.createElement("section");
        $(section).attr("class","descSection");
        $(section).appendTo(orderBox);
        var eventDesc = document.createElement("p");
        // $(eventDesc).text("Ordine per proiezione: "+info[i].evento+" "+info[i].evento_ora);
        $(eventDesc).text(info[i].evento);
        $(eventDesc).appendTo(section);
        let dataCell = document.createElement("p");
        let dateTime = info[i].evento_ora.split('T');
		let data = dateTime[0];
		let ora = dateTime[1].substr(0,5);
		let datetime_formattato= data+"  "+ora;
        $(dataCell).text(datetime_formattato);
        console.log(datetime_formattato);
        $(dataCell).appendTo(section);
        var cinema = document.createElement("p");
        $(cinema).text(info[i].cinema);
        $(cinema).appendTo(section);
        var prodotti = info[i].acquisti;
        var el;
        for(let j=0; j<prodotti.length; j+=2)
        { //con step 2 poichè tra i vari id è presente - come separatore
            console.log("yaaa");
            switch (prodotti[j]) //analizzo la stringa con gli id dei prodotti ordinati
            {
                case '0':
                    el = document.createElement("p");
                    $(el).text("Pop corn vaschetta piccola");
                    $(el).attr("class","product");
                    $(el).appendTo(section);
                    break;
                case '1':
                    el = document.createElement("p");
                    $(el).text("Pop corn vaschetta media");
                    $(el).attr("class","product");
                    $(el).appendTo(section);
                    break;
                case '2':
                    el = document.createElement("p");
                    $(el).text("Pop corn vaschetta grande");
                    $(el).attr("class","product");
                    $(el).appendTo(section);
                    break;
                case '3':
                    el = document.createElement("p");
                    $(el).text("Coca 33cl");
                    $(el).attr("class","product");
                    $(el).appendTo(section);
                    break;
                case '4':
                    el = document.createElement("p");
                    $(el).text("Coca 66cl");
                    $(el).attr("class","product");
                    $(el).appendTo(section);
                    break;
            }
        }
        button = document.createElement("button");
        $(button).attr("onclick","popup("+i+")"); //passa alla funzione alla chiamata l'idOrdine
        $(button).attr("class","help-btn");
        $(button).attr("id","button"+i);
        $(button).text("Clicca per QR dell'ordine");
        $(button).appendTo(section);
    }
}


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

function popup(i) //i rappresenta il i-esimo ordine
{
    let id_string = $("#id"+i+"").text(); //ottengo la stringa che contiene l'id nell'html
    var id = id_string.split("#",2)[1]; //estraggo id
    qr_string = "order"+id; //modifico la stringa per ottenere il qr in base ad id order
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
	    // $(".contenuto").text(testo);
    });
}

function popup_close()
{
	$(".sfondo, .corpo").remove();
}

