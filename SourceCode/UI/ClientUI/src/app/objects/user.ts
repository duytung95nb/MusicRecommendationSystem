import { Song } from "./song";

export class User {
    constructor(
        public Id: string,
        public Username: string,
        public Password: string,
        public AvatarUrl: string,
        public Firstname: string,
        public Lastname: string,
        public Gender: boolean,
        public Birthdate: Date,
        public City: string
    ) {
    }
}