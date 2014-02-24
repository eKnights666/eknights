


/**
 * Use by the isHebrew method.
 * @private
 **/
var hebrewPattern = new RegExp(/[\u0590-\u05FF]/);
/**
 * @param {String} word
 * @returns {Boolean} <tt>true</tt> if <tt>word</tt> contain at list one 
 * hebrew character, otherwise return <tt>false</tt>.
 * @public
 */
function isHebrew(word) {
    return hebrewPattern.test(word);
}


function isMostHebrew(text) {
    var arr = text.split(' ');
    var heb = 0;
    var en = 0;

    for (var i = 0; i < arr.length; i++) {
        if (isHebrew(arr[i]))
            heb++;
        else
            en++;
    }

    return heb > en;
}


