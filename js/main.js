$(document).ready(function() {

  // CLICK event sul pulsante Cerca
  $(".btn_search").click(function(){
    // controlla che l'inpunt di ricerca non sia vuota
    if (!$(".input_search").val() =="" ) {
      // recupera stringa inserita dall'utente nell'input per la ricerca
      renderMovie($(".input_search").val());
    }
  });

  // ENTER digitato da tastiera
  $(".input_search").keyup(function(e){
    // controlla che sia stato digitato enter e l'inpunt di ricerca non sia vuota
    if (e.keyCode == 13 && !$(".input_search").val() =="" ) {
      // recupera stringa inserita dall'utente nell'input per la ricerca
      renderMovie($(".input_search").val());
    }
  });

  // funzione che fa la ricerca dei titoli contenenti la stringa passata in arogmento
  // e stampa a video i risultati della ricerca
  function renderMovie(searchMovie) {
    // chiamata AJAX all'API
    $.ajax({
      "url":"https://api.themoviedb.org/3/search/movie",
      "method": "GET",
      // passa alla chiamata Ajax le chiavi e la Query
      "data": {
        "api_key": "a550c2dd96e81e76d012966315a202be",
        "query": searchMovie,
        "language": "it-IT",
        "include_adult": false,
      },
      "success": function(data) {
        // chiama la funzione per stampare a video i risultati della ricerca ritornati dalla chiamata ajax
        printMovie(data.results);
        // stampa sulla pagina il numero totale di film trovati
        $("#total_titles").text(data.total_results);
        // posiziona in alto la scroll-bar del listato
        $(".wrapper").scrollTop (0);
      },
      "error": function(err) {
        alert ("ATTENZIONE: errore chiamata ajax!");
      }
    });
  };

  // funzione che stampa a video il contentuo dell'oggetto movies passato in argomento
  function printMovie(movies) {
    // cancella, eliminando i <li> della lista già stampata a video
    $("#list-movies li").remove();
    // seleziona  il template da utilizzare
    var source = $("#movie-template").html();
    // compila il template selezionato con Handlebars
    var template = Handlebars.compile(source);
    // stampa il dettaglio di ogni film presente nell'oggetto {movies}
    for (var i = 0; i < movies.length; i++) {
      // manipola il contenuto delle chiavi dell'oggetto con il risultato della chiamta API
      var context = movies[i];
      // prepara il codice HTML da iniettare nel DOM
      var html = template (context);
      // inietta nel DOM il codice html manipolato
      $("#list-movies").append(html);
    }
  }

});
