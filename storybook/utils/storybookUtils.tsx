/**
 * takes a function string and transforms it into a self invoking function string.
 *
 * @param {*} funcText
 * @returns
 */
function makeSelfInvokingFuncString(funcText) {
    return '(' + funcText + ')();'
}

/**
 * gets rid of any special html characters and returns the intended user string.
 *
 * @param {string} html
 * @returns
 */
function decodeHtml(html:string) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Takes a function as a string and executes.
 *
 * @export
 * @param {string} funcText - A function that is a passed in as a string.
 */
export function textToFunc(funcText:string) {
    let decodedText:string = decodeHtml(funcText);
    let selfInvokingFuncStr:string = makeSelfInvokingFuncString(decodedText);
    eval(selfInvokingFuncStr);
}
  