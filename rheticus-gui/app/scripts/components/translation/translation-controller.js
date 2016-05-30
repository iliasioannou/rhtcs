  'use strict';
  var app = angular.module('rheticus');

  app.config(['$translateProvider',function ($translateProvider) {
  $translateProvider.translations('en', {
    'language':'Language',
    'titleToolbar': 'Displacement',
    'welcomeLogin':'Welcome',
    'userLogin':'User',
    'passwordLogin':'Password',
    'buttonOnLogin':'Login',
    'buttonOffLogin':'Logout',
    'errorLogin':'Not authorized !!!',
    'statusLogin':'You are logged as:',
    'accountToolbar':'Account',
    'geocoderToolbar':'Search',
    'geocoderPlaceholder':'Search ...',
    'myAreasToolbar':'My areas',
    'filtersToolbar': 'Filters',
    'titleFilters': 'Persistent Scatterers Map Advanced Filters',
    'warningFilters': 'At this zoom level no filters are available',
    'helpFilters': 'Move slider bounds to select desired range',
    'velocityFilters': 'Velocity',
    'coherenceFilters': 'Coherence',
    'dataProvidersFilters': 'Data Providers',
    'settingsToolbar': 'Settings',
    'basemapSettings': 'Basemap',
    '3dViewerSettings': '3D Viewer',
    '3dViewerHelpSettings': 'Go to 3D viewer ',
    'extraFeaturesSettings': 'Extra features',
    'regressionLinePsTrend':'Regression line',
    'noiseFilterPsTrend':'Noise filter',
    'precipitationsPsTrend':'Precipitations:',
    'precipitationsNonePsTrend':'None',
    'precipitationsDailyPsTrend':'Daily',
    'precipitations30PsTrend':'Cumulative 30 days',
    'precipitations60PsTrend':'Cumulative 60 days',
    'precipitations90PsTrend':'Cumulative 90 days',
    'precipitations120PsTrend':'Cumulative 120 days',
    'coherencePsTrend':'Coherence (%)',
    'quotePsTrend':'Quote (m)',
    'velocityPsTrend':'Velocity (mm/year)',
    'titleLandslide':'Landslide maps',
    'titleSentinel':'Sentinel 1 Datasets Identifier',
    'result1Sentinel':'Found ',
    'result2Sentinel':' datasets (with more than 5 products). Total products: ',
    'result3Sentinel':'alias:  ',
    'velocityLegend':'(mm/year)',
    'noResult':'No Persistent Scatterers found.',
    'loadingResult':'Loading result...',
    'errorZoom':"Please zoom again to view Persistent Scatterers",
    'FOO': 'This is a paragraph'
  });

  $translateProvider.translations('gr', {
      'language':'Γλώσσα',
      'titleToolbar': 'Displacement',
      'welcomeLogin':'Καλώς ήρθατε',
      'userLogin':'Χρήστης',
      'passwordLogin':'Κωδικός',
      'buttonOnLogin':'Συνδεση',
      'buttonOffLogin':'Αποσύνδεση',
      'errorLogin':'Εσφαλμένα διαπιστευτήρια !',
      'statusLogin':'Είστε καταχωρημένος/η ως:',
      'geocoderToolbar':'Αναζήτηση',
      'geocoderPlaceholder':'Αναζήτηση ...',
      'accountToolbar':'Λογαριασμός',
      'myAreasToolbar':'περιοχές μου',
      'filtersToolbar': 'Φίλτρα',
      'titleFilters': 'Προχωρημένα φίλτρα για per i Persistent Scatterers',
      'warningFilters': 'Δεν υπάρχει διαθέσιμο φίλτρο σε αυτό το επίπεδο μεγέθυνσης ',
      'helpFilters': "Μετακινήστε το ρυθμιστικό για να επιλέξετε τα επιθυμητά όρια του εύρους",
      'velocityFilters': "Ταχύτητα",
      'coherenceFilters': 'Συνοχή',
      'dataProvidersFilters': 'Πάροχοι δεδομένων',
      'settingsToolbar': 'Ρυθμίσεις',
      'basemapSettings': 'Φόντο χάρτη',
      '3dViewerSettings': 'Προβολή 3D',
      '3dViewerHelpSettings': 'Πήγαινε σε προβολή 3D ',
      'extraFeaturesSettings': "Συμπληρωματικές λειτουργίες ",
      'regressionLinePsTrend':'Γραμμή παλινδρόμησης',
      'noiseFilterPsTrend':'Μείωση θορύβου',
      'precipitationsNonePsTrend':'************************************',
      'precipitationsPsTrend':'Βροχόπτωση:',
      'precipitationsDailyPsTrend':'Ημερήσια',
      'precipitations30PsTrend':'Αθροιστική βροχόπτωση 30 ημερών',
      'precipitations60PsTrend':'Αθροιστική βροχόπτωση 60 ημερών',
      'precipitations90PsTrend':'Αθροιστική βροχόπτωση 90 ημερών',
      'precipitations120PsTrend':'Αθροιστική βροχόπτωση 120 ημερών',
      'coherencePsTrend':'Συνοχή (%)',
      'quotePsTrend':'μερίδιο (m)',
      'velocityPsTrend':"Ταχύτητα (χλστ./έτος)",
      'titleLandslide':'Χάρτες κατολίσθησης',
      'titleSentinel':'Αναγνωριστικά σύνολα δεδομένων Sentinel 1 ',
      'result1Sentinel':'Βρέθηκαν ',
      'result2Sentinel':" Σύνολα δεδομένων(με περισσότερα από 5 προϊόντα). Συνολικά προϊόντα: ",
      'result3Sentinel':'Ψευδώνυμο:  ',
      'velocityLegend':'(χλστ./έτος)',
      'noResult':'Δεν βρέθηκαν Έμμονοι Διασκορπιστές.',
      'loadingResult':'Φόρτωση ...',
      'errorZoom':"Μεγενθύνετε για να δείτε τους Έμμονους Διασκορπιστές",
      'FOO': 'Αυτή είναι μια παράγραφος ..'
    });

  $translateProvider.translations('it', {
    'language':'Lingua',
    'titleToolbar': 'Displacement',
    'welcomeLogin':'Benvenuto',
    'userLogin':'Utente',
    'passwordLogin':'Password',
    'buttonOnLogin':'Accedi',
    'buttonOffLogin':'Esci',
    'errorLogin':'Credenziali errate !',
    'statusLogin':'Sei registrato come:',
    'geocoderToolbar':'Cerca',
    'geocoderPlaceholder':'Cerca ...',
    'accountToolbar':'Account',
    'myAreasToolbar':'Le mie aree',
    'filtersToolbar': 'Filtri',
    'titleFilters': 'Filtri avanzati per i Persistent Scatterers',
    'warningFilters': 'A questo livello di zoom non è disponibile alcun filtro',
    'helpFilters': "Sposta i limiti dello slider per selezionare l'intervallo desiderato",
    'velocityFilters': "Velocità",
    'coherenceFilters': 'Coerenza',
    'dataProvidersFilters': 'Fornitori di dati',
    'settingsToolbar': 'Impostazioni',
    'basemapSettings': 'Mappa di sfondo',
    '3dViewerSettings': '3D Viewer',
    '3dViewerHelpSettings': 'Go to 3D viewer ',
    'extraFeaturesSettings': "Funzionalita' aggiuntive",
    'regressionLinePsTrend':'Linea di regressione',
    'noiseFilterPsTrend':'Riduci rumore',
    'precipitationsPsTrend':'Precipitazioni:',
    'precipitationsNonePsTrend':'Non visualizzare',
    'precipitationsDailyPsTrend':'Giornaliere',
    'precipitations30PsTrend':'Cumultivo 30 giorni',
    'precipitations60PsTrend':'Cumultivo 60 giorni',
    'precipitations90PsTrend':'Cumultivo 90 giorni',
    'precipitations120PsTrend':'Cumultivo 120 giorni',
    'coherencePsTrend':'Coerenza (%)',
    'quotePsTrend':'Quota (m)',
    'velocityPsTrend':"Velocità (mm/anno)",
    'titleLandslide':'Landslide maps',
    'titleSentinel':'Sentinel 1 Datasets Identifier',
    'result1Sentinel':'Trovati ',
    'result2Sentinel':" datasets (con più di 5 prodotti). Prodotti totali: ",
    'result3Sentinel':'alias:  ',
    'velocityLegend':'(mm/anno)',
    'noResult':'Nessun Persistent Scatterers trovato.',
    'loadingResult':'Caricamento ...',
    'errorZoom':"Aumenta lo zoom per vedere i Persistent Scatterers",
    'FOO': 'This is a paragraph'
  });

  var determineCurrentLanguage= function () {

   var userLang = navigator.language || navigator.browserLanguage;
   if (userLang.indexOf("it")>-1){
     userLang="it";
   }else if (userLang.indexOf("gr")>-1){
     userLang="gr";
   }else{
     userLang="en";
   }
   return userLang;
 };


  $translateProvider.useSanitizeValueStrategy(null);
  $translateProvider.preferredLanguage(determineCurrentLanguage());







  }]);
