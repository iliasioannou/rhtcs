Le API REST fanno uso delle seguenti librerie:
    - restify.js (http://restify.com/) per gli entry point REST
    - bookshelf.js (http://bookshelfjs.org/) come ORM per l'accesso a Postgresql

---------------------------------------------------
Specifiche API

Versioning delle API
    La versione delle API è inclusa nell'url della risorsa da richiamare.
    Fare riferimento a http://apigee.com/about/blog/technology/restful-api-design-tips-versioning
    
    http://<server>:<port>/rheticus/api/vx/.....


Url delle risorse:

detailed info for ps of a dataset
    .../api/v1/datasets/{id}/pss/{id}

    returned:
    
       {
          "psid" : "L09201P11983",
          "datasetid" : "SENTINEL-1IWIW1168168DESCENDINGVV-VHSSLC1244.0",
          "sensorid" : "S01",
          "coherence": 0.94,
          "velocity": 2.94
       }


all measure for ps of a dataset
    .../api/v1/datasets/{id}/pss/{id}/measures

    returned:

        [
           {
              "psid" : "L09201P11983",
              "datasetid" : "SENTINEL-1IWIW1168168DESCENDINGVV-VHSSLC1244.0",
              "type" : "DL",
              "data": 2011-05-21,
              "measure": 0
           },
           {
              "psid" : "L09201P11983",
              "datasetid" : "SENTINEL-1IWIW1168168DESCENDINGVV-VHSSLC1244.0",
              "type" : "DL",
              "data": 2011-07-24,
              "measure": 1.5
           },
           {
              "psid" : "L09201P11983",
              "datasetid" : "SENTINEL-1IWIW1168168DESCENDINGVV-VHSSLC1244.0",
              "type" : "DL",
              "data": 2011-09-26,
              "measure": 1.1
           },
        ....
        ]



measure of specific type for ps of a dataset
    .../api/v1/datasets/{id}/pss/{id}/measures?type={type}

    where:
        {type} = DL, VAL, VASDL

    returned:
        like previous
