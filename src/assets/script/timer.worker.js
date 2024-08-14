self.addEventListener('message', (event) => {
    const { duration } = event.data;
    let timeLeft = duration;

    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft === 0) {
            clearInterval(interval);
            postMessage({ message: 'timeUp' });
        } else {
            postMessage({ timeLeft });
        }
    }, 1000);
});