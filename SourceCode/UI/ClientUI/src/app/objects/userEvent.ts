
export class UserEvent {
    constructor(
        public userId: string,
        public songId: string,
        public actionType: string,
        public payload: string,
        public timestamp: any
    ) {
    }
}