import { Song } from "./song";

export class User {
    constructor(
        private Id: string,
        private Username: string,
        private Password: string,
        private AvatarUrl: string,
        private Firstname: string,
        private Lastname: string,
        private Gender: boolean,
        private Birthdate: Date,
        private City: string
    ) {
    }
}