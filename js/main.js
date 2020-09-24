$(document).ready(function() {

  var totalTitles = 0;

  // CLICK event sul pulsante Cerca
  $(".btn_search").click(function(){
    // controlla che l'inpunt di ricerca non sia vuota
    if (!$(".input_search").val() =="" ) {
      // resetta variabile del numero di titoli caricati, che viene stampato a video dopo la ricerca
      totalTitles = 0;
      // recupera stringa inserita dall'utente nell'input per la ricerca
      var titleToSearch = $(".input_search").val();
      // cancella la lista della precedente ricerca, svuota il campo input del search
      resetSearch()
      // (MOVIE) ricerca nel DB il titolo digitato in input, con la chiamta API specificata in url, stampa con il template passato in argomento
      renderTitles(
        titleToSearch,
        "https://api.themoviedb.org/3/search/movie"
      );
      // (TV) ricerca nel DB il titolo digitato in input, con la chiamta API specificata in url, stampa con il template passato in argomento
      renderTitles(
        titleToSearch,
        "https://api.themoviedb.org/3/search/tv"
      );
      // stampa sulla pagina il numero totale di film trovati
      $("#total_titles").text(totalTitles);

    }
  });

  // ENTER digitato da tastiera
  $(".input_search").keyup(function(e){
    // resetta variabile del numero di titoli caricati, che viene stampato a video dopo la ricerca
    totalTitles = 0;
    // controlla che sia stato digitato enter e l'inpunt di ricerca non sia vuota
    if (e.keyCode == 13 && !$(".input_search").val() =="" ) {
      // recupera stringa inserita dall'utente nell'input per la ricerca
      var titleToSearch = $(".input_search").val();
      // cancella la lista della precedente ricerca, svuota il campo input del search
      resetSearch()
      // (MOVIE) ricerca nel DB il titolo digitato in input, con la chiamta API specificata in url, stampa con il template passato in argomento
      renderTitles(
        titleToSearch,
        "https://api.themoviedb.org/3/search/movie"
      );
      // (TV) ricerca nel DB il titolo digitato in input, con la chiamta API specificata in url, stampa con il template passato in argomento
      renderTitles(
        titleToSearch,
        "https://api.themoviedb.org/3/search/tv"
      );
    }
  });

  // funzione che fa la ricerca dei titoli contenenti la stringa passata in arogmento
  // chiamando API endpoint passato in argomento e stampa a video i risultati della ricerca
  function renderTitles(searchTitle, urlApi) {
    // chiamata AJAX all'API
    $.ajax({
      "url": urlApi,
      "method": "GET",
      // passa alla chiamata Ajax le chiavi e la Query
      "data": {
        "api_key": "a550c2dd96e81e76d012966315a202be",
        "query": searchTitle,
        "language": "it-IT",
        "include_adult": false,
      },
      "success": function(data) {
        // chiama la funzione per stampare a video i risultati della ricerca ritornati dalla chiamata ajax
        printMovie(data.results);
        // aggiorna variabile del totale dei titoli trovati
        totalTitles = totalTitles + data.total_results;
        // stampa sulla pagina il numero totale di film trovati
        $("#total_titles").text(totalTitles);
        // stampa sulla pagina al stringa ricercata i input search
        $("#searched_title").text(searchTitle);
        // posiziona in alto la scroll-bar del listato
        $(".wrapper").scrollTop (0);
      },
      "error": function(err) {
        alert ("ATTENZIONE: errore chiamata ajax!");
      }
    });
  };

  // funzione che stampa a video il contentuo dell'oggetto movies passato in argomento
  function printMovie(titles) {
    // seleziona  il template da utilizzare
    var source = $("#title-template").html();
    // compila il template selezionato con Handlebars
    var template = Handlebars.compile(source);
    // stampa il dettaglio di ogni film presente nell'oggetto {movies}
    for (var i = 0; i < titles.length; i++) {

      // manipola il contenuto delle chiavi dell'oggetto con il risultato della chiamta API
      var context = {
        "title": titles[i].title,
        "name": titles[i].name,
        "original_title": titles[i].original_title,
        "original_name": titles[i].original_name,
        "vote_average": voteInStars(titles[i].vote_average),
        "url_flag": langInFlag(titles[i].original_language),
      };
      // prepara il codice HTML da iniettare nel DOM
      var html = template (context);
      // inietta nel DOM il codice html manipolato
      $("#list-movies").append(html);

      // ................
      // TEST con .onload
      // ................
      // var originalLang = "";
      // var langFlag = "img/" + titles[i].original_language + ".png";
      // var testImage = new Image();
      // testImage.src = langFlag;
      // testImage.onload = function() {
      //   console.log("immagine esiste");
      //   originalLang = "franco";
      //   console.log("originalLang: " + originalLang);
      // }
      // testImage.onerror = function() {
      //     // image did not load
      //     console.log("immagine non esiste");
      //     langFlag = "";
      // }
      // ................

      // ................
      // OPZIONE con switch per gestire chiavi diverse nel template
      // ................
      // definisce che chiavi utilizzare di title[] per riempire il template
      // switch (templateToPrint) {
      //   case "movie":
      //     var tempTitle = titles[i].title + " (film)";
      //     var tempOriginalTitle = titles[i].original_title;
      //     break;
      //   case "tv":
      //   var tempTitle = titles[i].name  + " (serie Tv)";
      //   var tempOriginalTitle = titles[i].original_name;
      //   break;
      // }
      // ................

    }
  };

  // funzione che riceve in argomento un numero intero da 0 a 5 e
  // ritorna una stringa con corripondenti stelle in fontawesome
  function voteInStars(vote) {
    // trasformiamo il numero in un numero intero da 1 a 5
    var num = Math.ceil(vote / 2);
    var string = "";
    // compone la stringa html
    for (var i = 0; i <= 4; i++) {
      if (i <= num) {
        string += "<i class='fas fa-star'></i>";
      } else {
        string += "<i class='far fa-star'></i>";
      }
    };
    return string;
  };

  // funzione che riceve in argomento la stringa della lingua e
  // ritorna una stringa con l'indirizzo dell'immagine della bandiera da visualizzare
  function langInFlag(lang) {
    // definisce l'array delle immagini di bandiera presenti nella cartella /img
    var flags = ["it","en","es","fr","de","nl", "pt", "ja"];
    // controlla se la lingua passata in argomento è presente nell'array delle bandiere
    if (flags.includes(lang)) {
      // ritorna URL per caricare immagine della relativa bandiera
      return "<img class='ico_flag' src='img/" + lang + ".png' alt=''>"
    } else {
      // ritorna la sigla della lingua da stampare a video al posto della bandiera
      return lang
    };
  };

  // funzione che cancella la lista a video e svuota l'input della ricerca
  function resetSearch() {
    // cancella, eliminando i <li> della lista già stampata a video
    $("#list-movies li").remove();
    // cancella il testo nell'input di ricerca
    $(".input_search").val("");
  }

});
