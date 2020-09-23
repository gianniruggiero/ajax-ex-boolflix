// MILESTONE 2

// 1. Trasformare il voto da 1 a 10 decimale in un numero intero da 1 a 5,
// poi stampare a schermo un numero di stelle piene che va da 1 a 5, lasciando le restanti vuote

// 2. Trasformare la stringa della lingua in bandiera della nazione corrispondente,
// gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API

// 3. Allargare la ricerca anche alle serie tv.
// Con la stessa azione di ricerca prendere sia i film che corrispondono alla query, sia le serie tv


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
      // cancella, eliminando i <li> della lista già stampata a video
      $("#list-movies li").remove();
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
    // cancella la lista della precedente ricerca, svuota inpunt box di ricerca
    resetSearch();
    // seleziona  il template da utilizzare
    var source = $("#movie-template").html();
    // compila il template selezionato con Handlebars
    var template = Handlebars.compile(source);
    // stampa il dettaglio di ogni film presente nell'oggetto {movies}
    for (var i = 0; i < movies.length; i++) {
      var voteTitle = Math.ceil(movies[i].vote_average / 2);
      var voteTitleStars = voteInStars(voteTitle)
      var originalLang = movies[i].original_language;
      var langFlag = langInFlag(movies[i].original_language);
      if (!langFlag == "") {
        originalLang = "";
      }
      // manipola il contenuto delle chiavi dell'oggetto con il risultato della chiamta API
      var context = {
        "title": movies[i].title,
        "original_title": movies[i].original_title,
        "original_language": originalLang,
        "vote_average": voteTitleStars,
        "lang_flag": langFlag,
      };
      // prepara il codice HTML da iniettare nel DOM
      var html = template (context);
      // inietta nel DOM il codice html manipolato
      $("#list-movies").append(html);
    }
  };

  // funzione che riceve in argomento un numero intero da 0 a 5 e
  // ritorna una stringa con corripondenti stelle in fontawesome
  function voteInStars(vote) {
    // assegna le icone con fontawesome
    // stella piena
    var star = "<i class='fas fa-star'></i>";
    // stella vuota
    var noStar = "<i class='far fa-star'></i>";

    // definisce la stringa da ritornare in base al numero del voto in argomento
    switch (vote) {
      case 0:
        return noStar + noStar + noStar + noStar + noStar;
        break;
      case 1:
        return star + noStar + noStar + noStar + noStar;
        break;
      case 2:
        return star + star + noStar + noStar + noStar;
        break;
      case 3:
        return star + star + star + noStar + noStar;
        break;
      case 4:
        return star + star + star + star + noStar;
        break;
      case 5:
        return star + star + star + star + star;
    }
  };

  // funzione che riceve in argomento la stringa della lingua e
  // ritorna una stringa con l'indirizzo dell'immagine della bandiera da visualizzare
  function langInFlag(lang) {
    switch (lang) {
      case "it":
        return "img/it.png";
        break;
      case "en":
        return "img/en.png";
        break;
      case "fr":
        return "img/fr.png";;
        break;
      case "de":
        return "img/de.png";
        break;
      case "pt":
        return "img/pt.png";
        break;
      case "es":
        return "img/es.png";
        break;
      case "nl":
        return "img/nl.png";
        break;
      case "ja":
        return "img/ja.png";
        break;
      default:
        return "";
    }
  };

  // funzione che cancella la lista a video e svuota l'input della ricerca
  function resetSearch() {
    // cancella, eliminando i <li> della lista già stampata a video
    $("#list-movies li").remove();
    // cancella il testo nell'input di ricerca
    $(".input_search").val(""); 
  }

});
