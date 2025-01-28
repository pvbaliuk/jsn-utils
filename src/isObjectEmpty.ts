/**
 * @param {object} obj
 * @returns {boolean}
 */
export function isObjectEmpty(obj: object): boolean{
    for(const key in obj){
        if(obj.hasOwnProperty(key))
            return false;
    }

    return true;
}
