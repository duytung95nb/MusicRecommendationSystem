import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserEvent } from "../objects/userEvent";
import { LISTEN } from "../actions/UserAction";
import { UserEventService } from "../helper/userEventService";

@Component({
    templateUrl: 'song-detail.component.html',
    styleUrls: ['./song-detail.component.css']
})

export class SongDetail implements OnInit, OnDestroy {
    private idSubscribe: any;
    private currentSong: Song;
    private currentIframeSource: SafeUrl;
    private similarSongs: Song[];
    private nextPlaySongs: Song[];
    private loggedInUser: any;
    constructor(private activatedRoute: ActivatedRoute,
        private songService: SongService,
        private userEventService: UserEventService,
        private sanitizer: DomSanitizer) {
    }
    ngOnInit() {
        if (localStorage.getItem('loggedInInfo')) {
            this.loggedInUser = JSON.parse(localStorage.getItem('loggedInInfo')).userInfo;
        }
        var self = this;
        this.idSubscribe = this.activatedRoute.params.subscribe(params => {
            var loggedInUserId = self.loggedInUser ? self.loggedInUser.id : null;
            self.songService.get(loggedInUserId, params['songId'])
                .subscribe(result => {
                    self.currentSong = result.currentSong;
                    self.currentIframeSource = self.sanitizer.bypassSecurityTrustResourceUrl("https://mp3.zing.vn/embed/song/" + result.currentSong.iframe + "?start=true");
                    self.similarSongs = result.similarSongs;
                    self.nextPlaySongs = result.nextPlaySongs;
                });
        });
    }

    ngOnDestroy() {
        var loggedInUserId = this.loggedInUser ? this.loggedInUser.id : null;
        //TODO: need to change duration when we have this feature
        var duration = "450";
        var userEvent = new UserEvent(
            loggedInUserId,
            this.currentSong.id,
            LISTEN,
            duration,
            null
        );
        this.userEventService.logUserEvent(userEvent)
            .subscribe(result => {
                console.log("Logged user event to database", result);
            });
        this.idSubscribe.unsubscribe();
    }
}