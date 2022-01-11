"use strict"
$(document).ready(function(){
    let tappeto = $("#tappeto");

    let table = $("<table>");
    table.appendTo(tappeto);

    for (let i = 0; i < 4; i++) {

        let tr = $("<tr>");
        tr.appendTo(table);

       for (let j = 0; j < 15; j++) {

           let td = $("<td>");
           td.appendTo(tr)
           
           let div = $("<div>");
           div.addClass("casella");
           div.appendTo(td);
       }
    }
})