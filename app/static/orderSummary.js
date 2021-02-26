(function (global) {
    var host = window.location.pathname;
    var res = host.split("/",3);
    idOrder = res[2];
    qr_string = "order"+idOrder; //stringa da utilizzare per qr
    // console.log(idOrder);
}(window));

$.ajax({ //ottengo info sull'ordine

    url : "/getOrderInfo/"+idOrder+"",
    type : 'GET',
    dataType:'json',
    success : function(data) {
        info = JSON.parse(JSON.stringify(data.acquisti));
        displayInfo(info);
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
});

function displayInfo(info){
    var el;
    for(let i=0; i<info.length; i+=2){ //con step 2 poichè tra i vari id è presente - come separatore
        switch (info[i]) { //analizzo la stringa con gli id dei prodotti ordinati
            case '0':
                el = document.createElement("p");
                $(el).text("Pop corn vaschetta piccola");
                $(el).appendTo(".ticket2__body");
                break;
            case '1':
                el = document.createElement("p");
                $(el).text("Pop corn vaschetta media");
                $(el).appendTo(".ticket2__body");
                break;
            case '2':
                el = document.createElement("p");
                $(el).text("Pop corn vaschetta grande");
                $(el).appendTo(".ticket2__body");
                break;
            case '3':
                el = document.createElement("p");
                $(el).text("Coca 33cl");
                $(el).appendTo(".ticket2__body");
                break;
            case '4':
                el = document.createElement("p");
                $(el).text("Coca 66cl");
                $(el).appendTo(".ticket2__body");
                break;
        }
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


$.ajax(settings).done(function (response) {
	console.log(response);
	let srcQR = response.url;
	console.log(srcQR);
	let head = document.getElementsByClassName("ticket2__header");
	$(head).text("Ordine #"+idOrder+":");
	let qrImg = document.createElement("img");
	$(qrImg).attr("src",srcQR);
	$(qrImg).attr("id","qr");
	// $(qrImg).css("float","right");
	// $(qrImg).css("top","10px");
	$(qrImg).appendTo(".ticket2__body");
});

function backHome(){
    window.location.replace('/');
}