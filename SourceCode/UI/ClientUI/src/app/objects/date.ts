export class TestDate{
    private time:String;
    private milliseconds_since_epoch: String;
    private date: String;
    
    static fromJSON(json: any): TestDate {
        let object = Object.create(TestDate.prototype);
        Object.assign(object, json);
        return object;
    }
}