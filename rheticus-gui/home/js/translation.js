$(document).ready(function() {

  var userLang = navigator.language || navigator.browserLanguage;

  if(userLang.indexOf("en") < 0 && userLang.indexOf("it")<0){
    userLang="en-US";
    console.log("set default language");
  }
  console.log(userLang);
  //translation i18next
  i18next.init({
    lng: userLang,
    resources: {
      "en-US": {
        "translation": {
          "navHome"     : "Home",
          "navServices" :"Services",
          "navContact"  :"Contact",
          "welcomeTextSecondary":"Cloud-based geoinformation service platform for monitoring the evolution of the earth's surface.",
          "servicesText" :"Services",
          "servicesTextDisplacement":"Displacement",
          "servicesTextDisplacementDescription":"A geoinformation service designed specifically to detect and report earth’s surface movements, aimed at monitoring areas subject to landslides and subsidence, and the stability of infrastructures, as buildings, roads and railways.",
          "servicesTextMarine":"Marine",
          "servicesTextMarineDescription":"A geoinformation service designed for the monitoring of coastal seawaters quality, in order to meet the environmental reporting requirements of local governments in compliance with the EU Directive on 'Marine Strategy'.",
          "servicesTextBurned":"Burned area",
          "servicesTextBurnedDescription":"A geoinformation service designed to support burned area monitoring, through burned area mapping and detection of illegal land use changes.",
          "contactText":"Contact",
          "contactAddress":"Via Massaua 12, I-70132 Bari, Italy"

        }
      },
      "it": {
        "translation": {
          "navHome"     : "Home",
          "navServices" :"Servizi",
          "navContact"  :"Contatti",
          "welcomeTextSecondary":"Lorem ipsum",
          "servicesText" :"Servizi",
          "servicesTextDisplacement":"Displacement",
          "servicesTextDisplacementDescription":"Il servizio di monitoraggio degli spostamenti superficiali. Tieni sotto controllo le aree in frana o in subsidenza. Controlla la stabilità delle tue infrastrutture.",
          "servicesTextMarine":"Marine",
          "servicesTextMarineDescription":"Lorem ipsum",
          "servicesTextBurned":"Burned area",
          "servicesTextBurnedDescription":"Lorem ipsum",
          "contactText":"Contatti",
          "contactAddress":"Via Massaua 12, I-70132 Bari, Italia"
        }
      }
    }
  }, (err, t) => {
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
    document.getElementById("contactText").innerHTML = i18next.t('contactText');
    document.getElementById("contactAddress").innerHTML = i18next.t('contactAddress');
    var markerAddress    = i18next.t('contactAddress');
  });

});
