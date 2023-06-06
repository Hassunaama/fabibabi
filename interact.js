function playFunky() {
    let audio = new Audio('funkyfabi.wav');
    audio.addEventListener("loadeddata", () => {
      audio.play()
      audio.loop = true;
      audioplaybackRate = 100;
      // The duration variable now holds the duration (in seconds) of the audio clip
    });
  }