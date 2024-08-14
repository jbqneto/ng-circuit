let timeLeft;
let paused = false;
let interval;

self.addEventListener('message', (event) => {
    const { duration } = event.data;

    paused = event.data.pause ?? false;

    if (duration) {
        timeLeft = duration;
    }

    interval = setInterval(() => {
        if (timeLeft === 0) {
            clearInterval(interval);
        } else if (!paused) {
            timeLeft--;
        }

        postMessage({ timeLeft });
    }, 1000);
});