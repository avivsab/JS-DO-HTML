const app = document.getElementById('root');

const h1 = document.createElement('h1');
h1.setAttribute('class', 'gallary-headline');
h1.innerText = 'choose gallery';
app.appendChild(h1);

const buttonsDiv = document.createElement('div');
buttonsDiv.classList.add('btns-container');
app.appendChild(buttonsDiv);

const sportBtn = document.createElement('button');
sportBtn.setAttribute('id', 'sport-btn');
sportBtn.innerText = 'sport';
buttonsDiv.append(sportBtn);

const foodBtn = document.createElement('button');
foodBtn.setAttribute('id', 'food-btn');
foodBtn.innerText = 'food';
buttonsDiv.append(foodBtn);

const musicBtn = document.createElement('button');
musicBtn.setAttribute('id', 'music-btn');
musicBtn.innerText = 'music';
buttonsDiv.append(musicBtn);

const imgContainer = document.createElement('div');
imgContainer.classList.add('image-container');

app.appendChild(imgContainer);


sportBtn.onclick = (e) => getImages(e);
foodBtn.onclick = (e) => getImages(e);
musicBtn.onclick = (e) => getImages(e);

const timers = [];

function loadImages(genre, currInterval) {
    let URL = '';
    if (genre) URL = `https://pixabay.com/api/?key=14910698-da2d9192ee156a4fb851cc1c6&q=${genre}`;

    else URL = 'https://pixabay.com/api/?key=14910698-da2d9192ee156a4fb851cc1c6';

    if (currInterval) timers.push(currInterval)
    for (let i = 0; i < timers.length; i++) {
        clearTimeout(timers[i]);
    }

    if (document.body.classList.contains('manual-buttons')) {
        const smallMsg = document.createElement('small');
        smallMsg.innerHTML = 'Refreshing Collection';
        smallMsg.style.color = 'red';
        smallMsg.style.opacity = 0.5
        app.append(smallMsg);
        document.body.classList.remove('manual-buttons');
        setTimeout(() => {
            smallMsg.style.display = 'none';
        }, 2000);
    }
    fetch(URL).then(res => res.json().then(data => {
            imgContainer.innerHTML = '';
            const img = document.createElement('img');
            img.classList.add('main-image');
            imgContainer.append(img);

            const figcaption = document.createElement('figcaption');
            if (document.getElementsByTagName(figcaption)[0]) figcaption = '';
            figcaption.innerText = genre ? `${genre} collection` : 'random collection';
            imgContainer.append(figcaption);


            const imagesArr = data.hits;
            let imgSrc = imagesArr[0].largeImageURL;
            let i = 0;
            const int = setInterval(() => {
                i++;

                if (i === imagesArr.length - 1) {
                    clearInterval(int);
                    if (genre) loadImages(genre, int);
                }

                imgSrc = imagesArr[i].largeImageURL
                img.src = imgSrc;
                img.alt = 'main-picture';
                img.title = 'stop on image';
                img.addEventListener('click', () => {
                    clearInterval(int);
                })
            }, 1500);
            timers.push(int)
        }))
        .catch(e => console.error(e))
}

function getImages(e) {
    for (let i = 0; i < timers.length; i++) {
        clearTimeout(timers[i]);
    }

    const currentGenre = e.target.innerText;
    const URL = 'https://pixabay.com/api/?key=14910698-da2d9192ee156a4fb851cc1c6';
    const imgRequest = `&q=${currentGenre}`;
    fetch(URL + imgRequest)
        .then(res => res.json())
        .then(data => {
            imgContainer.innerHTML = '';
            const img = document.createElement('img');
            img.classList.add('main-image');
            imgContainer.append(img);

            const imagesArr = data.hits;
            let imgSrc = imagesArr[0].largeImageURL;
            img.src = imgSrc;
            img.alt = 'main-picture';

            const figcaption = document.createElement('figcaption');
            figcaption.innerText = `${currentGenre} collection`;
            imgContainer.append(figcaption);

            const imgArrLength = imagesArr.length;
            let imageIndex = 0;
            const interval = setInterval(() => {
                imageIndex += 1
                if (imageIndex === imgArrLength - 1) {
                    clearInterval(interval)
                    loadImages(currentGenre, interval);
                }
                imgSrc = imagesArr[imageIndex].largeImageURL;
                img.src = imgSrc;
                img.addEventListener('click', () => {
                    clearInterval(interval);
                })
            }, 1500);
            timers.push(interval);
            markActiveBtn(currentGenre);

            const rightBtn = document.createElement('button');
            rightBtn.innerText = '>';
            rightBtn.classList.add('right-btn')
            rightBtn.title = 'Manual Forword';
            imgContainer.appendChild(rightBtn);

            const leftBtn = document.createElement('button');
            leftBtn.innerText = '<';
            leftBtn.classList.add('left-btn');
            leftBtn.title = 'Manual Back';
            imgContainer.appendChild(leftBtn);

            document.body.classList.add('manual-buttons')

            leftBtn.onclick = () => manualLeftMove(interval, imagesArr)
            rightBtn.onclick = () => manualRightMove(interval, imagesArr)

            function manualLeftMove(int, arr) {
                clearInterval(int);
                imageIndex--;
                if (imageIndex <= 0) imageIndex = arr.length - 1;
                imgSrc = arr[imageIndex].largeImageURL;
                img.src = imgSrc;
                img.title = 'stop on image';
            }

            function manualRightMove(int, arr) {
                clearInterval(int);
                imageIndex++;
                if (imageIndex >= arr.length - 1) imageIndex = 0;
                imgSrc = arr[imageIndex].largeImageURL;
                img.src = imgSrc;
            }
        })
        .catch(e => console.warn(e));
}

function markActiveBtn(genre) {
    const genrebuttons = document.querySelectorAll("button");
    for (const current of genrebuttons) {
        current.classList.remove('active-genre');
    }
    switch (genre) {
        case 'sport':
            genrebuttons[0].classList.add('active-genre')
            break;
        case 'food':
            genrebuttons[1].classList.add('active-genre')
            break;
        case 'music':
            genrebuttons[2].classList.add('active-genre')
            break;
        default:
            undefined
            break;
    }
}
loadImages()