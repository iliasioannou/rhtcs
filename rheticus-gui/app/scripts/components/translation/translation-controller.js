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
    'geocoderToolbar':'Search ...',
    'myAreasToolbar':'My areas',
    'filtersToolbar': 'Filters',
    'titleFilters': 'Persistent Scatterers Map Advanced Filters',
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
    'precipitationsDailyPsTrend':'Daily',
    'precipitations30PsTrend':'Cumulative 30 days',
    'precipitations60PsTrend':'Cumulative 60 days',
    'precipitations90PsTrend':'Cumulative 90 days',
    'precipitations120PsTrend':'Cumulative 120 days',
    'coherencePsTrend':'Coherence (%)',
    'velocityPsTrend':'Velocity (mm/year)',
    'titleLandslide':'Landslide maps',
    'titleSentinel':'Sentinel 1 Datasets Identifier',
    'result1Sentinel':'Found ',
    'result2Sentinel':' datasets (with more than 5 products). Total products: ',
    'result3Sentinel':'alias:  ',
    'velocityLegend':'(mm/year)',
    'noResult':'No Persistent Scatterers found.',
    'loadingResult':'Loading result...',
    'FOO': 'This is a paragraph'
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
    'geocoderToolbar':'Cerca ...',
    'myAreasToolbar':'Le mie aree',
    'filtersToolbar': 'Filtri',
    'titleFilters': 'Filtri avanzati per i Persistent Scatterers',
    'helpFilters': "Sposta i limiti dello slider per selezionare l'intervallo desiderato",
    'velocityFilters': "Velocita'",
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
    'precipitationsDailyPsTrend':'Giornaliere',
    'precipitations30PsTrend':'Cumultivo 30 giorni',
    'precipitations60PsTrend':'Cumultivo 60 giorni',
    'precipitations90PsTrend':'Cumultivo 90 giorni',
    'precipitations120PsTrend':'Cumultivo 120 giorni',
    'coherencePsTrend':'Coerenza (%)',
    'velocityPsTrend':"Velocita' (mm/anno)",
    'titleLandslide':'Landslide maps',
    'titleSentinel':'Sentinel 1 Datasets Identifier',
    'result1Sentinel':'Trovati ',
    'result2Sentinel':" datasets (con piu' di 5 prodotti). Prodotti totali: ",
    'result3Sentinel':'alias:  ',
    'velocityLegend':'(mm/anno)',
    'noResult':'Nessun Persistent Scatterers trovato.',
    'loadingResult':'Caricamento ...',
    'FOO': 'This is a paragraph'
  });

  var determineCurrentLanguage= function () {

   var userLang = navigator.language || navigator.browserLanguage;
   if(userLang.indexOf("it")<0){
     userLang="en";

   }else{
     userLang="it";
   }
   console.log(userLang);
   return userLang;
 };


  $translateProvider.useSanitizeValueStrategy('sanitize');
  $translateProvider.preferredLanguage(determineCurrentLanguage());







  }]);
