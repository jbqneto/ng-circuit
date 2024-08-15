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

    if (duration) {
        timeLeft = duration;
    }

    if (timeLeft === 0) {
        return;
    }

    if (interval === null) {
        interval = setInterval(() => {
            if (!paused && timeLeft > 0) {
                timeLeft--;
            } else {
                return;
            }

            if (!paused) {
                postMessage({ timeLeft });
            }
        }, 1000);
    }

});