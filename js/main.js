$(document).ready(function() {

  // dichiara variabile globale del totale dei titoli trovati
  var totalTitles = 0;

  // imposta stile di sfondo del wrap_top a seconda della posizione della scroll-bar
  document.body.onscroll = function(){
    if (document.body.scrollTop > 55 || document.documentElement.scrollTop > 55) {
      $(".wrap_top").css("background", "linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.8)");
     } else {
       $(".wrap_top").css("background", "linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0)");
     };
  };

  // CLICK event sul pulsante Cerca
  $(".btn_search").click(function(){
    // controlla che l'inpunt di ricerca non sia vuota
    if (!$(".input_search").val() =="" ) {
      titlesSearchPrint();
    }
  });

  // ENTER digitato da tastiera
  $(".input_search").keyup(function(e){
    // controlla che sia stato digitato enter e l'inpunt di ricerca non sia vuota
    if (e.keyCode == 13 && !$(".input_search").val() =="" ) {
      titlesSearchPrint();
    }
  });

  // funzione che fa la ricerca dei titoli contenenti la stringa passata in arogmento
  // chiamando API endpoint passato in argomento e stampa a video i risultati della ricerca
  function renderTitles(searchTitle, typeTemplate) {
    // chiamata AJAX all'API
    $.ajax({
      "url": "https://api.themoviedb.org/3/search/" + typeTemplate,
      "method": "GET",
      // passa alla chiamata Ajax le chiavi e la Query
      "data": {
        "api_key": "a550c2dd96e81e76d012966315a202be",
        "query": searchTitle,
        "language": "it-IT",
        "include_adult": false,
      },
      "success": function(data) {

        // stampa sulla pagina la stringa ricercata in input search
        $(".hai_cercato").addClass("active");
        $("#searched_title").text(searchTitle);

        if (data.total_results == 0) {
          if (screen.width > 768) {
            $(".titoli_trovati").addClass("active");
            // stampa sulla pagina il numero totale di film trovati
            $("#total_titles").text("nessun titolo trovato");
          } else {
            $(".esito_ricerca").addClass(" active");
          }
        } else {
            // chiama la funzione per stampare a video i risultati della ricerca ritornati dalla chiamata ajax
            printMovie(data.results, typeTemplate);
            // aggiorna variabile del totale dei titoli trovati
            totalTitles = totalTitles + data.total_results;
            // posiziona in alto la scroll-bar del listato
            $(".wrapper").scrollTop (0);
            // stampa sulla pagina il numero totale di film trovati
            $(".titoli_trovati").addClass("active");
            // stampa sulla pagina il numero totale di film trovati
            $("#total_titles").text(totalTitles);
        };

      },
      "error": function(err) {
        alert ("ATTENZIONE: errore chiamata ajax!");
      }
    });
  };

  // funzione che stampa a video il contentuo dell'oggetto movies passato in argomento
  function printMovie(titles, templateToPrint) {
    // seleziona  il template da utilizzare
    var source = $("#title-template").html();
    // compila il template selezionato con Handlebars
    var template = Handlebars.compile(source);
    // stampa il dettaglio di ogni film presente nell'oggetto {movies}
    for (var i = 0; i < titles.length; i++) {
      // definisce le variabili temporanee utilizzate dal ciclo For
      var tempTitle, tempOriginalTitle, tempSelector, tempTitleType, tempPath, tempNoPoster, tempOverview;

      // a seconda del tipo di ricernca, definisce che chiavi utilizzare per riempire i placeholder del template
      switch (templateToPrint) {
        case "movie":
          tempTitle = titles[i].title;
          tempTitleType = "Film";
          tempOriginalTitle = titles[i].original_title;
          tempSelector = $("#list-movies");
          $("#tit_film").text("Film");
          break;
        case "tv":
          tempTitle = titles[i].name;
          tempTitleType = "Serie TV";
          tempOriginalTitle = titles[i].original_name;
          tempSelector = $("#list-tv");
          $("#tit_tv").text("Serie TV");
          break;
      };

      if (titles[i].poster_path){
        tempPath = "https://image.tmdb.org/t/p/w342/" + titles[i].poster_path;
        tempNoPoster = "";
      } else {
        tempPath = "img/no_poster.png";
        tempNoPoster = " active";
      }

      if (titles[i].overview == ""){
        tempOverview = "";
      } else {
        tempOverview = "<strong>Overview: </strong>" + (titles[i].overview);

      }

      // manipola il contenuto delle chiavi dell'oggetto con il risultato della chiamta API
      var context = {
        "title": tempTitle,
        "title_type": tempTitleType,
        "original_title": tempOriginalTitle,
        "vote_average": voteInStars(titles[i].vote_average),
        "url_flag": langInFlag(titles[i].original_language),
        "url_poster": tempPath,
        "overview": tempOverview,
        "class_noposter": tempNoPoster,
      };
      // prepara il codice HTML da iniettare nel DOM
      var html = template (context);
      // inietta nel DOM il codice html manipolato
      tempSelector.append(html);
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
    // cancella la lista FILM già stampata a video
    $("#list-movies").html("");
    // cancella la lista SERIE TV già stampata a video
    $("#list-tv").html("");
    // cancella il testo nell'input di ricerca
    $(".input_search").val("");
    // cancella la label Film prima del corrispondente listato
    $("#tit_film").text("");
    // cancella la label Serie TV prima del corrispondente listato
    $("#tit_tv").text("");
    // nasconde H3 per avviso Nessun titolo trovato
    $(".esito_ricerca").removeClass(" active");
  }

  function titlesSearchPrint() {
    // resetta variabile del numero di titoli caricati, che viene stampato a video dopo la ricerca
    totalTitles = 0;
    // recupera stringa inserita dall'utente nell'input per la ricerca
    var titleToSearch = $(".input_search").val();
    // cancella la lista della precedente ricerca, svuota il campo input del search
    resetSearch()
    // ricerca titolo digitato in input, con endpoint della chiamata API specificata in argomento
    renderTitles(titleToSearch, "movie");
    // ricerca titolo digitato in input, con endpoint della chiamata API specificata in argomento
    renderTitles(titleToSearch, "tv");
  }

});
