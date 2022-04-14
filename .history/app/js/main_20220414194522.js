// $(function () {

//Переменные ---------------------------------------------

    // Дом дерево
    const monsterDiv = document.querySelector('.monster')
    const scoreDiv = document.querySelector('.score');
    const msgDiv = document.querySelector('.msg');
    const gameDiv = document.querySelector('.game');
    const playerDiv = document.querySelector('.player');
    const buildingsDiv = document.querySelector('.buildings');
    const roadDiv = document.querySelector('.road');
    const rainDiv = document.querySelector('.rain');
    const backgroundDiv = document.querySelector('.background')

    //Музыка и звуковые эффекты. Временный вариант
    const mainFX = document.querySelector(".bili");
    const explosionFX = document.querySelector(".explosion");
    const jumpFX = document.querySelector(".jump");


    // const musicList = {
    //     track1: 'audio/music/bili.mp3',
    //     track2: '',
    //     track3: '',
    // }
    // const sfxList = {
    //     jump: 'audio/effects/jump.mp3',
    //     explosion: 'audio/effects/explosion.mp3',
    //     rain: 'audio/effects/rain.mp3',
    //     lightning: 'audio/effects/lightning.mp3',
    //     laser_loading: 'audio/effects/laser_loading.mp3',
    //     laser_fire: 'audio/effects/laser_fire.mp3',
    //     laser_full: 'audio/effects/laser_full.mp3',
    // }
    //
    // function playSound(track) {
    //     let audio = new Audio (track);
    //     audio.play();
    // }

    // const music = new Audio(musicList.track1)


    // Геймплей
    const gravitation = 0.088;
    const buildings = [];
    const player = {
        x: 320,
        y: 0,
        v: 0
    }
    let gameStatus = 'start';
    let speed, score, nextBuildingX, gameProgress, lastHeight, lastTime;


// Функции---------------------------------------------

    //Слушатель клика мышки
    gameDiv.addEventListener('mousedown', () => {
        switch (gameStatus) {
            case "start":
            case "end":
                startGame();
                break;
            case "on":
                jump();
                break;
        }
    });

    // Сброс значений и старт
    function startGame() {
        buildings.splice(0,buildings.length);
        buildingsDiv.innerHTML = '';
        rainDiv.innerHTML = '';
        player.x = 380;
        player.y = 0;
        player.v = 0;
        speed = 1;
        score = 0;
        nextBuildingX = 760;
        gameProgress = 0;
        lastHeight = 0;
        lastTime = 0;
        gameStatus = 'on';
        render();
        
    
        // music.pause()
        // music.currentTime =  0.0;
        mainFX.pause()
        mainFX.currentTime =  0.0;
        
        msgDiv.innerHTML = `<h2>Chinese Wall</h2>(Click to jump)`;
        setTimeout(() => {
            msgDiv.classList = 'msg msg--off';
        }, 3000);

        monsterDiv.classList.remove('monster--active')
        setTimeout(()=>{
            monsterDiv.classList.add('monster--active')
        }, 0)
        
        backgroundDiv.classList.remove('background--red')
        setTimeout(()=>{
            backgroundDiv.classList.add('background--red')
        }, 42500)

        //Погода
        setTimeout(()=>{
            rain()
        }, 35000)
        
        setTimeout(()=>{
            rainDiv.style.setProperty('border-right-color', 'rgba(255, 0, 0, 0.7)');
        }, 42500)
        setTimeout(()=> {
            lightning()
        },39200)
        setTimeout(()=> {
            lightning()
        },42500)


    }

    // Прыжок
    function jump() {
        if (player.v !== 0) { 
            return false; 
        }
        player.v = 3.2;
        // playSound(sfxList.jump);
        jumpFX.play()
    }

    // Дождь
    function rain() {
        let rainDrop
        let quantityDrop = 20; //Кол-во капель
        for (let i = 0; i < quantityDrop; i++) {
            rainDrop = document.createElement('hr')
            rainDrop.classList.add('rain__drop')
            rainDrop.style.left = 1 + Math.random() * 760 + 'px';
            rainDrop.style.animationDuration = 0.2 + Math.random() * 0.5 + 's';
            rainDrop.style.animationDelay = Math.random() * 7 + 's'
            rainDiv.appendChild(rainDrop)
        }
    }
    
    //Молния
    function lightning() {
        const lightningDiv = document.createElement('div');
        lightningDiv.classList = "lightning";
        gameDiv.appendChild(lightningDiv);
        setTimeout(()=> {
            gameDiv.removeChild(lightningDiv);
        }, 1000)
    }
    
    // Платформы
    function createBuilding() {

        const building = {};
        building.x = nextBuildingX;
        //Ширина
        building.width = 60 + Math.round(Math.random() * 60);
        //ВЫсота. Разница высоты между соседями не больше 30px
        building.height = Math.min(Math.max((30 + Math.round(Math.random() * 150)), lastHeight - 30), lastHeight + 30);

        const buildingDiv = document.createElement('div');
        buildingDiv.classList = "building";
        buildingDiv.style.width = building.width + 'px';
        buildingDiv.style.height = building.height + 'px';

        //МОЖНО раскомментировать код ниже. Платформы станут случайными домами
        // const background = ['1.webp', '2.webp', '3.webp']
        // buildingDiv.style.backgroundImage = 'url( images/buildings/' + background[Math.floor(Math.random() * background.length)] + ')';
        // buildingDiv.style.backgroundSize = '100% 100%'
        //разные цвета домов
        // buildingDiv.style.setProperty('--hue', Math.round(Math.random() * 360) + 'deg');
        
        building.div = buildingDiv;

        buildingsDiv.appendChild(buildingDiv);
        buildings.push(building);

        nextBuildingX += building.width;
        lastHeight = building.height;
    }

    //Отрисовка
    function render() {

        // Дельта тайм / независимая частота кадров.
        const thisTime = performance.now();
        const dt = Math.min(32, Math.max(8, thisTime - lastTime)) / 16.666;
        lastTime = thisTime;
        
        // Отрисовка смерти и конец игры
        if ((gameStatus === 'dead'))  {
            if (player.y > 0) {
                player.y = Math.max(0, player.y + player.v * dt);
                player.v -= gravitation * dt;
                playerDiv.style.setProperty('--player-y', (350 - player.y) + "px");
                requestAnimationFrame(render);
            } else {
                gameStatus = 'end';
                msgDiv.innerHTML += `Click to restart`;
            }
            return false;
        }

        // music.play();
        mainFX.play()
        
        // Отрисовка зданий
        if (nextBuildingX < gameProgress + 760 + speed * dt) {
            createBuilding();
        }

        let base = 0;// начальная высота платформы и опора для персонажа
        const destroyBuildings = [];
        let nextBuilding = buildings[0];

        buildings.forEach((building, ix) => {

            if (building.x < player.x) {
                base = building.height;
                nextBuilding = buildings[ix + 1]
            }
            if (building.x < gameProgress + 120) {
                destroyBuildings.push(ix);
            }
            building.div.style.setProperty('--building-x', (building.x - gameProgress) + "px");
        });

        // Отрисовка персонажа
        // Прыжок, взлет
        if (player.v > 0) { 
            player.y += player.v * dt;
            player.v = Math.max(0, player.v - gravitation * dt);
            playerDiv.classList = 'player player--jump';
        // Прыжок, падение
        } else if (base < player.y) { // is falling
            player.y = Math.max(base, player.y + player.v * dt);
            player.v -= gravitation * dt;
            playerDiv.classList = 'player player--jump';
        //Бег    
        } else { 
            player.v = 0;
        }

        playerDiv.classList = `player ${player.v === 0 ? 'player--run' : 'player--jump'}`;

        let nextPlayerX = player.x + speed * dt;

        if (nextPlayerX - gameProgress < 620) {
            nextPlayerX += 1 / speed * dt;
        }

        if ((nextPlayerX > nextBuilding.x) && (nextBuilding.height > player.y)) {
            nextPlayerX = nextBuilding.x;
            playerDiv.classList = 'player player--idle';
        }

        player.x = nextPlayerX;

        playerDiv.style.setProperty('--player-x', (nextPlayerX - gameProgress) + "px");
        playerDiv.style.setProperty('--player-y', (350 - player.y) + "px");

        destroyBuildings.forEach(ix => {

            const thisDiv = buildings[ix].div
            thisDiv.classList.add('building--destroy');

            // playSound(sfxList.explosion)
            explosionFX.play()

            setTimeout(() => {
                thisDiv.parentNode.removeChild(thisDiv);
            }, 1000);

            if ((player.x <= buildings[ix].x + buildings[ix].width) && (player.y <= buildings[ix].height)) {
                gameStatus = 'dead';
                playerDiv.classList = 'player player--dead';

                msgDiv.innerHTML = `<h2>You're dead!</h2>`;
                msgDiv.classList = 'msg';

            } else {
                buildings.splice(ix, 1);
                score++;
            }
        });

        speed += 0.001 * dt;
        gameProgress += speed * dt;

        scoreDiv.innerHTML = `Score: ${score}`;

        if ((gameStatus === 'on') || (gameStatus === 'dead')) {
            requestAnimationFrame(render)
        }
    }


//Заметки для себя --------------------------------------------

    //FIX:
    //hitbox, buildings min height, sfx, optimization, mobile version, explosive

    //ADD:
    //fonts
    //start menu, black screen, npc RUN
    // sfx and music option
    // stage 2?

    //animation:
    // laser, meteor, helicopter, fly monsters, death

// })