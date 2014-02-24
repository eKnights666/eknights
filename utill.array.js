
var array_utill = function() {
    /**
     * @description Cluster object from an array by param and add a count property to each object.
     * @param {Array<<Object{id:Number}>>} resultSet  
     * @param {string} param to cluster  by.
     * @return {Array} 
     **/
    this.clusterNcount = function(resultSet, param) {
        "use strict";
        resultSet.sort(function(a, b) {
            var k1 = a[param], k2 = b[param];
            return (k1 > k2) ? 1 : ((k2 > k1) ? -1 : 0);
        });
        var counts = new Object();

        for (var i = 0; i < resultSet.length; i++) {
            if (counts[resultSet[i].name] === undefined)
                counts[resultSet[i].name] = 1;
            else
                counts[resultSet[i].name]++;
        }
        for (var i = 0; i < resultSet.length; i++) {
            while (i < (resultSet.length - 1) && resultSet[i + 1][param].toLowerCase() === resultSet[i][param].toLowerCase()) {
                resultSet.splice(i, 1);
            }
        }
        for (var i = 0; i < resultSet.length; i++) {
            resultSet[i].amount = counts[resultSet[i].name];
        }
        return resultSet;
    };
};


var ArrayUtill = new array_utill();
