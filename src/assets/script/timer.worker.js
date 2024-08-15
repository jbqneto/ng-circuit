let timeLeft;
let paused = false;
let interval = null;

function clearLocalInterval() {
    clearInterval();

    setTimeout(() => {
        interval = null;
    }, 100);
}

self.addEventListener('message', (event) => {
    const { duration } = event.data;

    paused = event.data.pause ?? false;

    if (paused && interval) {
        return clearLocalInterval();
    }

    if (duration) {
        timeLeft = duration;
    }

    if (timeLeft === 0) {
        return clearLocalInterval();
    }

    if (interval === null) {
        interval = setInterval(() => {
            if (timeLeft === 0) {
                clearLocalInterval();
            } else if (!paused) {
                timeLeft--;
            }

            console.log("Interval running: " + timeLeft);

            if (!paused) {
                postMessage({ timeLeft });
            }
        }, 1000);
    }

});