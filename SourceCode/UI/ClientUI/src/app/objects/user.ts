import { Song } from "./song";

export class User {
    id: String;
    name: String;
    constructor(id:string, name:string){
        this.id = id;
        this.name = name;
    }
}