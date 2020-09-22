$(document).ready(function() {

  // CLICK sul pulsante Cerca
  $(".btn_search").click(function(){
    // recupera stringa inserita dall'utente per la ricerca
    var searchMovie = $(".input_search").val();
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
        renderMovie(data.results);
      },
      "error": function(err) {
        alert ("ATTENZIONE: errore chiamata ajax!");
      }
    });
  });




  // funzione che stampa a video i risultati della ricerca che viene passata in argomento
  function renderMovie(movies) {
    // ripulisce la lista già stampata a video
    $("#list-movies li").remove();

    // seleziona per il template da utilizzare
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
