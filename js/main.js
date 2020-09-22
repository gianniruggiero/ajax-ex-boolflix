$(document).ready(function() {

  // CLICK event sul pulsante Cerca
  $(".btn_search").click(function(){
    // controlla che l'inpunt di ricerca non sia vuota
    if (!$(".input_search").val() =="" ) {
      // recupera stringa inserita dall'utente per la ricerca
      renderMovie($(".input_search").val());
    }
  });

  // ENTER digitato da tastiera
  $(".input_search").keyup(function(e){
    // controlla che sia stato digitato invio e l'inpunt di ricerca non sia vuota
    if (e.keyCode == 13 && !$(".input_search").val() =="" ) {
      // recupera stringa inserita dall'utente per la ricerca
      renderMovie($(".input_search").val());
    }
  });

  // funzione che fa la ricerca dei titoli contenenti la stringa passata in arogmento
  // e stampa a video i risultati della ricerca
  function renderMovie(searchMovie) {
    // chiamata Ajax
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
        console.log(data.total_results);
        $("#total_titles").text(data.total_results);
        $(".wrapper").scrollTop (0);
      },
      "error": function(err) {
        alert ("ATTENZIONE: errore chiamata ajax!");
      }
    });
  };

  // stampa a video il contentuo dell'oggetto movies passato in argomento
  function printMovie(movies) {
    // elimina la lista già stampata a video
    $("#list-movies li").remove();
    // seleziona  il template da utilizzare
    var source = $("#movie-template").html();
    // compila il template selezionato con Handlebars
    var template = Handlebars.compile(source);
    // stampa il dettaglio di ogni film (oggetto)
    for (var i = 0; i < movies.length; i++) {
      var title = movies[i].title;
      var titleOriginal = movies [i].original_title;
      var lang = movies [i].original_language;
      var vote = movies [i].vote_average;
      // manipola il contenuto delle chiavi dell'oggetto
      var context = {
        "title": title,
        "title_original": titleOriginal,
        "lang": lang,
        "vote": vote
      }
      // prepara il codice HTML da iniettare
      var html = template (context);
      // inserisce il codice html manipolato nel DOM
      $("#list-movies").append(html);
    }
  }

});
