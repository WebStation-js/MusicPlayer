import songs from "/api/theme/assets/mp3/songs/songs.js";

function fadeIn(audioElement, maxVol, startDelay, fadeInTime, steps) {
    let i = 0;
    let interval = fadeInTime / steps;
    setTimeout(function () {
        let intervalId = setInterval(function () {
            let volume = (maxVol / steps) * i;
            audioElement.volume = volume;
            if (++i >= steps)
                clearInterval(intervalId);
        }, interval);
    }, startDelay);
}

function fadeOut(audioElement, maxVol, startDelay, fadeOutTime, steps) {
    let i = 0;
    let interval = fadeOutTime / steps;
    setTimeout(function () {
        let intervalId = setInterval(function () {
            let volume = maxVol - (maxVol / steps) * i;
            audioElement.volume = volume;
            if (++i >= steps) {
                audioElement.volume = 0;
                clearInterval(intervalId);
            }
        }, interval);
    }, startDelay);
}

class MusicPlayer {
    constructor() {
        this.sfxVolume = 1;
        this.musicVolume = 0.5;
        this.masterVolume = 1;
    };

    playSFX(name) {
        var url = `/api/theme/assets/mp3/${ name }`;

        var audio = new Audio(url);
        audio.volume = this.sfxVolume * this.masterVolume;
        audio.play();
    };

    playRandom() {
        var random = songs[Math.floor(Math.random()*songs.length)];
        /*var name = random.name;
        var url = `/src/music_player/songs/${ random.url }`;*/
        var name = random.split(".")[0];
        var url = `/api/theme/assets/mp3/songs/${ random }`;
        var volume = this.musicVolume * this.masterVolume;

        WebStation.menu.createToast( "Now playing: " + name );

        var audio = new Audio(url);
        fadeIn(audio, volume, 500, 2000, 3000);
        audio.volume = 0;
        audio.loop = true;
        audio.play();

        var scope = this;
        setTimeout(() => {
            var fadePoint = audio.duration - 2; 

            var fadeAudio = setInterval(function () {

                if (audio.currentTime >= fadePoint) {
                    fadeOut(audio, volume, 0, 2000, 3000);

                    setTimeout(() => clearInterval(fadeAudio), 2000);
                } else if ( audio.volume !== scope.musicVolume * scope.masterVolume ) {
                    audio.volume = scope.musicVolume * scope.masterVolume;
                };

            }, 200);
        }, 1000);
    };
};

export default MusicPlayer;
