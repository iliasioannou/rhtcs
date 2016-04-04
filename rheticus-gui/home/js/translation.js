var currentLanguage;
var languagesJson={
  "en-US": {
    "translation": {
      "navHome"     : "Home",
      "navServices" :"Services",
      "navContact"  :"Contacts",
      "welcomeTextSecondary":"Monitoring the evolution of our Earth",
      "servicesText" :"Services",
      "servicesTextDisplacement":"Displacement",
      "servicesTextDisplacementDescription":"Detecting and reporting earth’s surface movements, aimed at monitoring landslides, subsidence, and the stability of infrastructures, as buildings, roads and railways.",
      "servicesTextMarine":"Marine",
      "servicesTextMarineDescription":"Monitoring coastal seawaters quality, supporting local governments, environmental reporting <br>requirements, aquaculture and desalination plants.",
      "servicesTextBurned":"Wildfires",
      "servicesTextBurnedDescription":"A geoinformation service designed to support burnt areas detection and monitoring, through burned area perimeter, mapping and detection of illegal land use changes over time.",
      "servicesTextUrban":"Urban Dynamics",
      "servicesTextUrbanDescription":"Monitoring and reporting land use changes, soil loss and infrastructures development, to support decision makers in territorial planning and infrastructures building.",
      "contactText":"Contacts",
      "contactAddress":"Via Massaua 12, I-70132 Bari, Italy"

    }
  },
  "it": {
    "translation": {
      "navHome"     : "Home",
      "navServices" :"Servizi",
      "navContact"  :"Contatti",
      "welcomeTextSecondary":"Monitoring the evolution of our Earth",
      "servicesText" :"Servizi",
      "servicesTextDisplacement":"Displacement",
      "servicesTextDisplacementDescription":"Monitoraggio dei movimenti superficiali connessi a frane, subsidenza e stabilità di edifici ed infrastrutture, come strade, ferrovie, condotte e opere ingegneristiche.",
      "servicesTextMarine":"Marine",
      "servicesTextMarineDescription":"Monitoraggio della qualità delle acque marino-costiere a supporto delle attività di reporting ambientale dei governi locali, dell'acquacoltura e degli impianti di dissalazione.",
      "servicesTextBurned":"Wildfires",
      "servicesTextBurnedDescription":"Monitoraggio delle aree percorse dagli incendi, attraverso la mappatura delle aree e la rilevazione dei cambiamenti di uso del suolo illegali nel </br>tempo.",
      "servicesTextUrban":"Urban Dynamics",
      "servicesTextUrbanDescription":"Monitoraggio dei cambiamenti del territorio, perdita di suolo e costruzione di infrastrutture, per attività di pianificazione territoriale ed ingegneria.",
      "contactText":"Contatti",
      "contactAddress":"Via Massaua 12, I-70132 Bari, Italia"
    }
  }
};

// On document loaded set browser language.
$(document).ready(function() {

  var userLang = navigator.language || navigator.browserLanguage;

  if(userLang.indexOf("it")<0){
    userLang="en-US";
    document.getElementById("imageLanguage").src="./media/img/it.png"
    document.getElementById("imageLanguage").title="Click to change language"
  }else{
    document.getElementById("imageLanguage").src="./media/img/gb.png"
    document.getElementById("imageLanguage").title="Clicca per cambiare lingua"
  }
  currentLanguage=userLang;
  //translation i18next
  updateLanguage();

});

//switch language between en-US and it
var changeLanguage = function() {
  if(currentLanguage=="en-US"){
    document.getElementById("imageLanguage").src="./media/img/gb.png";
    document.getElementById("imageLanguage").title="Clicca per cambiare lingua"
    currentLanguage="it";
  }else{
    document.getElementById("imageLanguage").src="./media/img/it.png";
    document.getElementById("imageLanguage").title="Click to change language"
    currentLanguage="en-US";
  }
  updateLanguage();
}


// Update the language with the current language.
var updateLanguage = function(){
  i18next.init({
    lng: currentLanguage,
    resources: languagesJson
  }, function(err, t) {
    // initialized and ready to go!
    document.getElementById("navHome").innerHTML = i18next.t('navHome');
    document.getElementById("navServices").innerHTML = i18next.t('navServices');
    document.getElementById("navContact").innerHTML = i18next.t('navContact');
    document.getElementById("welcomeTextSecondary").innerHTML = i18next.t('welcomeTextSecondary');
    document.getElementById("servicesText").innerHTML = i18next.t('servicesText');
    document.getElementById("servicesTextDisplacement").innerHTML = i18next.t('servicesTextDisplacement');
    document.getElementById("servicesTextDisplacementDescription").innerHTML = i18next.t('servicesTextDisplacementDescription');
    document.getElementById("servicesTextMarine").innerHTML = i18next.t('servicesTextMarine');
    document.getElementById("servicesTextMarineDescription").innerHTML = i18next.t('servicesTextMarineDescription');
    document.getElementById("servicesTextBurned").innerHTML = i18next.t('servicesTextBurned');
    document.getElementById("servicesTextBurnedDescription").innerHTML = i18next.t('servicesTextBurnedDescription');
    document.getElementById("servicesTextUrban").innerHTML = i18next.t('servicesTextUrban');
    document.getElementById("servicesTextUrbanDescription").innerHTML = i18next.t('servicesTextUrbanDescription');
    document.getElementById("contactText").innerHTML = i18next.t('contactText');
    document.getElementById("contactAddress").innerHTML = i18next.t('contactAddress');
  });
}
