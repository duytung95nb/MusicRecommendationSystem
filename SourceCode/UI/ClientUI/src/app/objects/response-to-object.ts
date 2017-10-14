import { Song } from "../objects/song";

export class ResponseToObject {
    
    static fromJSON(json: any): Song {
        let object = Object.create(Song.prototype);
        Object.assign(object, json);
        return object;
    }
    static fromJSONArray(json: any): Song[] {
        let array = Object.create(Song.prototype);
        Object.assign(array, json);
        return array;
    }
}