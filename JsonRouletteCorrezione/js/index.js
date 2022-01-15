"use strict"
/*dichiaro variabili globali, 
numero fishes iniziali, 
Vettore delle puntate 
 numeri di colore rosso*/ 
let nFishes = 36;
let VettorePuntate = [];
let NumeriRossi = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
let nGiocate = 0;
let win = 0;
let ControlloAlert = 0;

/* function di ready del documento DOM*/
$(document).ready(function(){
    /*variabili per la dimensione del tappeto*/
    let inizioX = 11;
    let inizioY = 9;
    let DimCasella = 59;
    let colonna = 0;
    let riga = 0;

    let ParagrafoFishes = $("#p").html(nFishes);
    let tappeto = $("#tappeto");

    /*faccio richiesta tramite xaamp*/

    let URL = "roulette.json";
    let jhttp = new XMLHttpRequest();
    jhttp.open("GET",URL,false);
    jhttp.send();
    //mi salvo il json formato stringa
    let strJson = jhttp.responseText;
    console.log(strJson)
    //e me lo parso in jsonOggetto
    let json = JSON.parse(strJson);
    
    //scorro tutto li json e assegno le varie property
    //for of per ogni item nel mio json
    for (const item of json) {
        if (item.win != 0) {
            let div = $("<div>");
            div.prop({
                "id": item.id,
                "numbers": item.numbers,
                "win":item.win,
                "bgColor":item.color
            })
            div.css({
                left:inizioX+DimCasella*colonna,//assegno posizione di caselle con le variabili 
                                                 //moltiplica nel top pwer riga e nel left per la colonna
                top:inizioY+DimCasella*riga
            })
            div.addClass("casella");
            tappeto.append(div);

            div.on("click",function(){
                if ($(this).children("div").length==0) {
                    /*controllo se ho fiche, altrimenti la vado a creare inserendolA NEL DIV CLICCATO (THIS!)*/ 
                    if (nFishes==0) {
                        alert("Attenzione! impossibile puntare : hai terminato le fiches!")
                    }else{
                        let fiche = $("<div>");
                        fiche.addClass("fiches");
                        $(this).append(fiche);
                        nFishes--;
                        VettorePuntate.push($(this).prop("id"));
                    }
                }else{
                    //tolgo il div della fiche in quanto era gia presente e dovevamo rimuoverla
                    $(this).children("div").remove();
                    nFishes++;
                    //andiamo ad eliminare la puntata precedentemente salvata in memoria attraverso l id salvato in vettore puntate
                    VettorePuntate.splice(VettorePuntate.indexOf($(this).prop("id")),1);
                }
                $("p").text(nFishes);
                console.log(VettorePuntate);
            })

        }
        colonna++;
        if (colonna%14 == 0) {//se è multiplo di 14 porto la colonna a 0 e incremento la riga cosi da scorrere il tappeto
            colonna = 0;
            riga++;
        }
    }
    //andiamo a gestire il button

    let buttonPunta = $("button");
    buttonPunta.on("click",function(){
        //gestiamo il cambio tra gif e jpg
        $("#mainFrame").children("img").eq(0).prop("src","img/roulettegif.gif");
        setTimeout(roulette,1000);
    })

    function roulette(){
        //andimao a gestire il lancio di un numero a caso nella roulette
        // insieme al cambio di immagine tra gif e jpg
        $("#mainFrame").children("img").eq(0).prop("src","img/roulette.jpg");
        let number = Math.floor(Math.random()*37);

        //gestiamo i numeri che vengono man mano estratti alla destra dell immagine della roulette
        let i = nGiocate;
        while(i>=1){
            $("#mainFrame span:nth-of-type("+(i+1)+")").html($("#mainFrame span:nth-of-type("+i+")").html());
            $("#mainFrame span:nth-of-type("+(i+1)+")").addClass("number");
            if(NumeriRossi.indexOf(parseInt($("#mainFrame span:nth-of-type("+i+")").html()))!=-1)
               $("#mainFrame span:nth-of-type("+(i+1)+")").css({"background-color":"red","color":"white"});
            else if(parseInt($("#mainFrame span:nth-of-type("+i+")").html())==0)
               $("#mainFrame span:nth-of-type("+(i+1)+")").css({"background-color":"green","color":"white"});
            else
               $("#mainFrame span:nth-of-type("+(i+1)+")").css({"background-color":"black","color":"white"});
            i--;
         }
         $("#mainFrame span:nth-of-type(1)").html(number).addClass("number");
       
         if(NumeriRossi.indexOf(number)!=-1)
            $("#mainFrame span:nth-of-type(1)").css({"background-color":"red","color":"white"});
         else if(number==0)
            $("#mainFrame span:nth-of-type(1)").css({"background-color":"green","color":"white"});
         else
            $("#mainFrame span:nth-of-type(1)").css({"background-color":"black","color":"white"});
         $("#mainFrame span:nth-of-type(1)").addClass("firstNum");
         nGiocate++;
         controllaVincita(number);

    }
    function controllaVincita(n){
        /*Ora andiamo a gestire il controllo della vincita 
        prendendo dal vettore puntate l id della puntata
        e controllando se nel vettore numbers ce il numero nel div*/ 
        win = 0;
        ControlloAlert = 0;

        for (const item of VettorePuntate) {

           let PuntatoreAlDivCorrente =  $("#"+item);

           if (PuntatoreAlDivCorrente.prop("numbers").indexOf(n)!=-1) {
               win+=parseInt(PuntatoreAlDivCorrente.prop("win"));
           }else{
               PuntatoreAlDivCorrente.children("div").eq(0).addClass("perdita");
           }
        }
        nFishes+= win;
        console.log(win);

        let perdita = $(".perdita");
        let vincita = $(".fiches");

        perdita.fadeOut(2000,function(){
            if (ControlloAlert==0) {
                alert("numero fiches vinte: " + win);
                VettorePuntate = [];

                if (win>0) {
                    vincita.remove();
                    let i=0;
                    let IncrementaFiches = setInterval(function(){
                        ParagrafoFishes.html(parseInt(ParagrafoFishes.html()+1))
                        i++;

                        if (i==win) {
                            clearInterval(IncrementaFiches);
                        }

                    },200)
                }
                alert++;
            }
            ControlloAlert++;
        })
    }
});