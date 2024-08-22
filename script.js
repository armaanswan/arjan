document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('assets/lyrics/1-Ilzaam.json');
    const data = await response.json();

    const audioPlayer = document.querySelector('.audio-player');
    const lyricsContainer = document.querySelector('.lyrics-container');

    data.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add("section");
        sectionDiv.setAttribute('data-title', section.type);

        section.lyrics.forEach(line => {
            const p = document.createElement('p');
            p.classList.add("line");
            p.textContent = line.text;
            p.setAttribute('data-time', line.time);
            if (line.background == 1) {
                p.classList.add('background');
            }
            sectionDiv.appendChild(p);
        });

        lyricsContainer.appendChild(sectionDiv);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;

        const lines = document.querySelectorAll('#lyricsContainer p');
        let highlightedLine;
        lines.forEach((line, index) => {
            if (currentTime >= line.dataset.time && (!lines[index + 1] || currentTime < lines[index + 1].dataset.time)) {
                line.classList.add('highlight');
                highlightedLine = line;
            } else {
                line.classList.remove('highlight');
            }
        });

        if (highlightedLine) {
            const containerHeight = lyricsContainer.clientHeight;
            const highlightedOffset = highlightedLine.offsetTop;
            const scrollPosition = highlightedOffset - (containerHeight / 3.5);
            lyricsContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    });

    clearButton.addEventListener('click', () => {
        savedTimes.textContent = '';
    });
});

document.querySelector('.lyrics-container').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('line')) {
        const audioPlayer = document.querySelector('.audio-player');
        const time = parseFloat(event.target.getAttribute('data-time'));
        audioPlayer.currentTime = time;
        audioPlayer.play();
    }
});

document.addEventListener('keydown', (event) => {
    const audioPlayer = document.querySelector('.audio-player')
    if (event.code === 'Space') {
        event.preventDefault();
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }
});