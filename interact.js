document.querySelector("#funky").addEventListener("click", (e) => {
    const audio = document.getElementById("fuckjs")
    audio.addEventListener("loadeddata", () => {
      audio.loop = true;
      audio.playbackRate = 1;
      audio.play()
    });
})