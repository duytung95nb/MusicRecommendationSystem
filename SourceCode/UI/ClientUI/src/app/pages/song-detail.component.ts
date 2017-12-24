import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserEvent } from "../objects/userEvent";
import { LISTEN, RATE, ADD_TO_FAVOURITE,DOWNLOAD, SHARE } from "../actions/UserAction";
import { UserEventService } from "../helper/userEventService";
import { UIParams, UIResponse, InitParams } from "ngx-facebook";
import { FacebookService } from "ngx-facebook/dist/esm/providers/facebook";

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
    private userRateForCurrentSong: number;
    constructor(private activatedRoute: ActivatedRoute,
        private songService: SongService,
        private userEventService: UserEventService,
        private sanitizer: DomSanitizer,
        private facebookService: FacebookService) {
        //TODO: change init param base on facebook app.
            let initParams: InitParams = {
                appId: '121873418213397',
                xfbml: true,
                version: 'v2.11'
            };
        
        facebookService.init(initParams);
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
                    self.userRateForCurrentSong = result.userRateForCurrentSong;
                    self.currentIframeSource = self.sanitizer.bypassSecurityTrustResourceUrl("https://mp3.zing.vn/embed/song/" + result.currentSong.iframe + "?start=true");
                    self.similarSongs = result.similarSongs;
                    self.nextPlaySongs = result.nextPlaySongs;
                });
        });
    }

    // get duration
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

    onRatingClick($event) {
        this.userRateForCurrentSong = $event;   // replace value of rating here
        var loggedInUserId = this.loggedInUser ? this.loggedInUser.id : null;
        var userEvent = new UserEvent(
            loggedInUserId,
            this.currentSong.id,
            RATE,
            this.userRateForCurrentSong.toString(),
            Date.now()
        );
        this.userEventService.logUserEvent(userEvent);
    }

    onAddToFavouriteClick() {
        var loggedInUserId = this.loggedInUser ? this.loggedInUser.id : null;
        var userEvent = new UserEvent(
            loggedInUserId,
            this.currentSong.id,
            ADD_TO_FAVOURITE,
            "true",
            Date.now()
        );
        this.userEventService.logUserEvent(userEvent);
    }

    onShareClick() {
        let params: UIParams = {
            href: "https://www.npmjs.com/package/ng2-facebook-sdk",
            method: 'share'
          };
         
          this.facebookService.ui(params)
            .then((res: UIResponse) => {
                // depend on response to log sharing event or not
                console.log(res);
            })
            .catch((e: any) => console.error(e));

        // var loggedInUserId = this.loggedInUser ? this.loggedInUser.id : null;
        // var userEvent = new UserEvent(
        //     loggedInUserId,
        //     this.currentSong.id,
        //     SHARE,
        //     "true",
        //     Date.now()
        // );
        // this.userEventService.logUserEvent(userEvent);
    }

    onDownloadClick() {
        var loggedInUserId = this.loggedInUser ? this.loggedInUser.id : null;
        var userEvent = new UserEvent(
            loggedInUserId,
            this.currentSong.id,
            DOWNLOAD,
            "true",
            Date.now()
        );
        this.userEventService.logUserEvent(userEvent);
    }
}