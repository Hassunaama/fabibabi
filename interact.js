function playFunky() {
    let audio = new Audio('funkytown.ogg');
    audio.addEventListener("loadeddata", () => {
      audio.play()
      audio.loop = true;
      audio.speed = 100;
      // The duration variable now holds the duration (in seconds) of the audio clip
    });
  }