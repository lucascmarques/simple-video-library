import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Video } from '../../models/video';
import { VideoLibrary } from '../../models/video-library';
import { VideoService } from '../../services/video.service';
import { ElectronService } from '../../providers/electron.service';

declare var jQuery: any;

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html'
})
export class VideosComponent implements OnInit {

    videos: Video[] = [];
    videosSelected: Video[] = [];
    library: VideoLibrary;

    keyCtrlPressed: boolean = false;

    constructor(private videoService: VideoService,
        private electronService: ElectronService) {
        videoService.videos$.subscribe(videos => this.videos = videos);
    }

    ngOnInit() {
    }

    ngAfterContentInit() {

    }

    onDblClickVideo(video) {
        this.clearSelectedVideos();
        this.selectVideo(video);
        this.electronService.ipcRenderer.send('videos:open', video);
        video.new = false;
        this.videoService.update(video);
    }

    selectVideo(video) {
        video.selected = true;
        this.videosSelected.push(video);
        this.videoService.setVideoEdition(video);
    }

    unSelectVideo(video) {
        video.selected = false;
        this.videoService.setVideoEdition(null);
    }

    onClickVideo(event, video: Video) {
        let selected = video.selected;
        if (!this.keyCtrlPressed) {
            this.clearSelectedVideos();
        }
        if (selected) {
            this.unSelectVideo(video);
        } else {
            this.selectVideo(video);
        }
    }

    clearSelectedVideos() {
        this.videosSelected.forEach(video => video.selected = false);
        this.videosSelected = [];
    }

    onRateVideo(video: Video) {
        this.videoService.update(video);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyupEvent(event: KeyboardEvent) {
        if(event.key === 'Control') {
            this.keyCtrlPressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeydownEvent(event: KeyboardEvent) {
        if(event.key === 'Delete') {
            console.log('delete pressed...');
        } else if (event.key === 'Control') {
            this.keyCtrlPressed = false;
        }
    }

}
