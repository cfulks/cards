function stopwatch() {
    const clock = document.getElementById("display");
    let time = -1, intervalId;
    function incrementTime() {
      time++;
      clock.textContent = ("0" + Math.trunc(time / 60)).slice(-2) + ":" + ("0" + (time % 60)).slice(-2);
    }
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);
  }

window.addEventListener("load", stopwatch);