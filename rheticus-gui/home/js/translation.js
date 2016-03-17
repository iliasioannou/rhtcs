var currentLanguage;
var languagesJson={
  "en-US": {
    "translation": {
      "navHome"     : "Home",
      "navServices" :"Services",
      "navContact"  :"Contact",
      "welcomeTextSecondary":"Monitoring the evolution of our Earth",
      "servicesText" :"Services",
      "servicesTextDisplacement":"Displacement",
      "servicesTextDisplacementDescription":"Detecting and reporting earth’s surface movements, aimed at monitoring landslides, subsidence, and the stability of infrastructures, as buildings, roads and <br>railways.",
      "servicesTextMarine":"Marine",
      "servicesTextMarineDescription":"Monitoring coastal seawaters quality, supporting local governments’ environmental reporting requirements in compliance with the EU Directive on 'Marine Strategy'.",
      "servicesTextBurned":"Burned area",
      "servicesTextBurnedDescription":"A geoinformation service designed to support activities for burned <br> area monitoring, through burned area perimeter, mapping and detection of illegal land use changes.",
      "servicesTextUrban":"Urban Dynamics",
      "servicesTextUrbanDescription":"Monitoring and reporting land use changes, soil loss and infrastructures development, to support decision makers in territorial planning and infrastructures building.",
      "contactText":"Contact",
      "contactAddress":"Via Massaua 12, I-70132 Bari, Italy"

    }
  },
  "it": {
    "translation": {
      "navHome"     : "Home",
      "navServices" :"Servizi",
      "navContact"  :"Contatti",
      "welcomeTextSecondary":"Lorem ipsum...(it)",
      "servicesText" :"Servizi",
      "servicesTextDisplacement":"Displacement",
      "servicesTextDisplacementDescription":"Il servizio di monitoraggio degli spostamenti superficiali. Tieni sotto controllo le aree in frana o in subsidenza. Controlla la stabilità delle tue infrastrutture.",
      "servicesTextMarine":"Marine",
      "servicesTextMarineDescription":"Lorem ipsum...(it)",
      "servicesTextBurned":"Burned area",
      "servicesTextBurnedDescription":"Lorem ipsum...(it)",
      "servicesTextUrban":"Urban...(it)",
      "servicesTextUrbanDescription":"Lorem ipsum...(it)",
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
