/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

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
