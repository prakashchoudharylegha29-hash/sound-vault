

const soundsContainer = document.querySelector(".sounds-container");
const searchInput = document.querySelector("#search-input");

const searchButton = document.querySelector("#search-button");
const recentContainer = document.querySelector(".recent-container");
const clearButton = document.querySelector("#clear-button");

searchInput.addEventListener("input", () => {

    if (searchInput.value.trim() !== "") {

        clearButton.style.display = "block";

    } else {

        clearButton.style.display = "none";
    }

});

let allSounds = [];

let favorites = JSON.parse(
    localStorage.getItem("favorites")
) || [];

function addToRecent(sound) {

    const oldItems =
        recentContainer.querySelectorAll(
            ".recent-item"
        );

    oldItems.forEach((item) => {

        if (
            item.dataset.file === sound.file
        ) {

            item.remove();
        }

    });

    const recentItem =
        document.createElement("div");

    recentItem.className =
        "recent-item";

    recentItem.dataset.file =
        sound.file;

    recentItem.textContent =
        "🎵 " + sound.title;

    recentItem.addEventListener(
        "click",
        () => {

            const originalCard =
                document.querySelector(
                    `audio source[src="./assets/sounds/${sound.file}"]`
                ).parentElement.parentElement;

            const playButton =
                originalCard.querySelector(
                    ".play-button"
                );

            playButton.click();
        }
    );

    recentContainer.prepend(
        recentItem
    );

    if (
        recentContainer.children.length > 5
    ) {

        recentContainer.lastElementChild.remove();
    }
}

let currentAudio = null;

let currentButton = null;

fetch("./data/sounds.json")
    .then((response) => response.json())
    .then((sounds) => {

        allSounds = sounds;

        sounds.forEach((sound) => {

            const card = document.createElement("div");

            card.className = "sound-card";

            card.innerHTML = `
            
                <div class="sound-info">

                    <h2>${sound.title}</h2>

                    <p class="sound-duration">
                        Loading...
                    </p>

                </div>

                <div class="card-buttons">

                    <button class="play-button">
                        ▶
                    </button>

                    <a
                        href="./assets/sounds/${sound.file}"
                        download
                    >
                        <button class="download-button">
                            ⬇
                        </button>
                    </a>

                        <button class="favorite-button">
                            🤍
                        </button>

                        <button class="share-button">
                            📤
                        </button>
                    
                </div>

                <audio class="sound-audio">

                    <source
                        src="./assets/sounds/${sound.file}"
                        type="audio/mpeg"
                    >

                </audio>

            `;



            soundsContainer.appendChild(card);

            const playButton = card.querySelector(".play-button");

            const audio = card.querySelector(".sound-audio");
            const wave = card.querySelector(".sound-wave");
            const favoriteButton = card.querySelector(".favorite-button");
            const shareButton = card.querySelector(".share-button");

                shareButton.addEventListener(
                    "click",
                     async () => {

                        const shareData = {

                            title: sound.title,

                            text:
                                "Listen to this sound on SoundVault 🎵",

                            url: window.location.href
                        };

                        try {

                            await navigator.share(
                                shareData
                            );

                        } catch (error) {

                            console.log(
                                "Share cancelled"
                            );

                        }
 
                    }
                );

                if (
                    favorites.includes(sound.file)
                ) {

                    favoriteButton.classList.add("active");

                    favoriteButton.textContent = "❤️";
                }

                favoriteButton.addEventListener("click", () => {

                    favoriteButton.classList.toggle("active");

                    if (
                        favoriteButton.classList.contains("active")
                    ) {

                       favoriteButton.textContent = "❤️";

                       favorites.push(sound.file);

                    } else {

                        favoriteButton.textContent = "🤍";

                        favorites = favorites.filter(
                            item => item !== sound.file
                        );
                    }

                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(favorites)
                    );

                });



        audio.addEventListener("loadedmetadata", () => {

            const durationElement =
                card.querySelector(".sound-duration");

            const totalSeconds = Math.floor(audio.duration);

            const minutes =
                Math.floor(totalSeconds / 60);

            const seconds =
                totalSeconds % 60;

            durationElement.textContent =
                `⏱️ ${minutes}:${seconds
                    .toString()
                    .padStart(2, "0")}`;

        });

            playButton.addEventListener("click", () => {

                if (currentAudio && currentAudio !== audio) {

                    currentAudio.pause();

                    currentAudio.currentTime = 0;

                    currentButton.textContent = "▶";
                }

                if (audio.paused) {

                    audio.play();

                    addToRecent(sound);

                    playButton.textContent = "⏸";

                    currentAudio = audio;

                    currentButton = playButton;

                } else {

                    audio.pause();

                    audio.currentTime = 0;

                    playButton.textContent = "▶";

                    currentAudio = null;

                    currentButton = null;
                }

            });


            audio.addEventListener("ended", () => {

                playButton.textContent = "▶";
                    
                currentAudio = null;

                currentButton = null;

            });

           

        });

    });



searchButton.addEventListener("click", () => {

    const searchText = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".sound-card");

    cards.forEach((card) => {

        const title = card
            .querySelector("h2")
            .textContent
            .toLowerCase();

        if (title.includes(searchText)) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});

clearButton.addEventListener("click", () => {

    searchInput.value = "";

    clearButton.style.display = "none";

    const cards = document.querySelectorAll(".sound-card");

    cards.forEach((card) => {

        card.style.display = "flex";

    });

});