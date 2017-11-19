export class Song {
    constructor(
        public id: string,
        public album: string,
        public song: String,
        public artist: String,
        public composer: String,
        public genre: string[],
        public iframe: string,
        public thumbnail: string,
        public listened: number
    ) {

    }
}