'use strict';

angular.module('rheticus')
  .service('ArrayService', function() {
    /**
     * Parameters:
     * list - {Object}
     * attribute - {String}
     * idValue - {String}
     *
     * Returns:
     * {Integer} - Position in list
     */
    this.getIndexByAttributeValue = function(list,attribute,idValue) {
      var res = -1;
      try {
        if (list && (list!==null) && (list.length>0)) {
          var i=0;
          if (attribute!==""){
            for (i=0; i<list.length; i++){
              if (eval("list[i]."+attribute)===idValue){ // jshint ignore:line
                res = i;
                break;
              }
            }
          } else {
            for (i=0; i<list.length; i++){
              if (list[i]===idValue){
                res = i;
                break;
              }
            }
          }
        }
      } catch (e) {
        console.log("[ArrayService :: getIndexByAttributeValue] EXCEPTION : '"+e);
      } finally {
        return(res);
      }
    };
  });
