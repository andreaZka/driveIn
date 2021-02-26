
$(document).on('click', '.product-container-coca', function(){ //ottengo id biglietto dal testo del paragrafo

    let divID = $(this).attr("id");
     let id = divID.substr(3,1); //id rappresenta la p che contiene la descrizione del prodotto
     console.log(id);
     let prodDescript = document.getElementById(id);
     if( $(prodDescript).hasClass("selectedProd") ){ //se è stato già selezionto
        $(prodDescript).removeClass("selectedProd"); //ricliccandoci lo deseleziono
        $(this).css("border-color","transparent");
        $(prodDescript).css("color","black");
     }
     else{
         $( prodDescript ).addClass( "selectedProd" );
         $(prodDescript).css("color","#4CAF50");
         $(this).css("border-color","#4CAF50");
     }
 });

 $(document).on('click', '.product-container-popcorn', function(){ //ottengo id biglietto dal testo del paragrafo




     let divID = $(this).attr("id");
     let id = divID.substr(3,1); //id rappresenta la p che contiene la descrizione del prodotto
     console.log(id);
     // $(this).attr("class", "selected-container");
    // let divID = "div"+id;
     let prodDescript = document.getElementById(id);
     if( $(prodDescript).hasClass("selectedProd") ){ //se è stato già selezionto
        $(prodDescript).removeClass("selectedProd"); //ricliccandoci lo deseleziono
        $(this).css("border-color","transparent");
        $(prodDescript).css("color","black");
     }
     else{
         // $(prodDescript).attr("class","selectedProd-popco");
         $( prodDescript ).addClass( "selectedProd" );
         $(prodDescript).css("color","#4CAF50");
         // console.log(divID);
         // $(this).css("border","solid 4px");
         $(this).css("border-color","#4CAF50");
     }
 });

function proceed(){
    var arr = new Array(); //utilizzo una string che contenga gli id dei prodotti selezionati
    var prodID;
    $(".selectedProd").each(function (){
        prodID = $(this).attr("id");
        arr.push(prodID);
    })
    if( typeof prodID === "undefined" ){
        alert("Nessun prodotto selezionato");
    }
    else{
        var filtered = arr.filter(function (el) { //filtro l'elemento undefined ad inizio array
            return el != null;
        });
        var products = filtered.join('-'); //id dei prodotti acquistati rappresentati in una stringa separati da -
        var host = window.location.pathname;
        var res = host.split("/",3);
        let idEvent = res[2];
        fetch("/services/"+idEvent+"/selectProduct/"+products+"/buyOrder")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then( json => {
			id_order = JSON.stringify(json.idOrder);
			console.log(json);
			window.location.href = "/orderSummary/"+id_order+""
		});

    }

}
