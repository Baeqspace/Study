window.onload = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    let body = document.querySelector('body');
    let startanim = document.querySelector('animate');
    let gameover = document.querySelector('#gameover');
    let gameovermenu = document.querySelector('#gameovermenu');
    let gameovertext = document.querySelector('#gameovertext');
    let finalscore = document.querySelector('#finalscore');
    let finalrounds = document.querySelector('#finalrounds');
    let restart = document.querySelector('#restart');
    let pacman = document.querySelector('#pacman');
    let pacmanFrame = document.querySelector('#anim');
    let coinsGroup = document.querySelector('#coins');
    let superCoinsGroup = document.querySelector('#superCoins');
    let obstaclesGroup = document.querySelector('#obstacles');
    let ghostAIPointsGroup = document.querySelector('#ghostAIPoints');
    let x = 50;
    let y = 50;
    let obstacles = obstaclesGroup.querySelectorAll('rect');
    let coins = coinsGroup.querySelectorAll('circle');
    let score = document.querySelector('.score');
    let maxscore = document.querySelector('.maxscore');
    let ghostAIPoints = ghostAIPointsGroup.querySelectorAll('circle');
    let pacmanBoost = 0;
    let round = document.querySelector('.round');
    let maxrounds = document.querySelector('.maxrounds');
    let clearStats = document.querySelector('.clearStats');
    let gameoversigns = ['ПОТРАЧЕНО', 'YOU DIED', 'YOU LOSE', 'press F to pay respects', 'Жил без страха и умер без страха', 'Умер от смерти'];
    let isGameOver = 0;
    let difficulty = 10;
    
    if (localStorage.getItem('lastgameoversign') == null) {
        localStorage.setItem('lastgameoversign', '')
    }
    let lastgameoversign = localStorage.getItem('lastgameoversign');
    function statsCheck() {
        if (localStorage.getItem('maxscore') == null && localStorage.getItem('maxrounds') == null) {
            localStorage.setItem('maxscore', 0)
            localStorage.setItem('maxrounds', 0)
        }
        if (score.textContent > Number(localStorage.getItem('maxscore'))) {
            localStorage.setItem('maxscore', score.textContent);
        }
        if (Number(round.textContent) > Number(localStorage.getItem('maxrounds'))) {
            localStorage.setItem('maxrounds', round.textContent)
        }
        maxscore.textContent = localStorage.getItem('maxscore');
        maxrounds.textContent = localStorage.getItem('maxrounds');
    }
    setInterval(statsCheck, 10)
    clearStats.onclick = function () {
        localStorage.clear();
    }
    restart.onclick = function () {
        window.close()
    }
    function pacmanFrames() {
        if (pacmanFrame.getAttribute('fill') === 'none') {
            pacmanFrame.setAttribute('fill', 'yellow');
        } else {
            pacmanFrame.setAttribute('fill', 'none');
        }
        for (let n = 1; n <= 4; n++) {
            let ghost = document.querySelector('#ghost' + String(n))
            let firstFrames = ghost.querySelectorAll('.firstFrame')
            let secondFrames = ghost.querySelectorAll('.secondFrame')
            for (let firstFrame of firstFrames) {
                if (firstFrame.getAttribute('fill') === 'none') {
                    firstFrame.setAttribute('fill', 'blue');
                    for (let secondFrame of secondFrames) {
                        secondFrame.setAttribute('fill', 'none')
                    }
                } else {
                    firstFrame.setAttribute('fill', 'none');
                    for (let secondFrame of secondFrames) {
                        secondFrame.setAttribute('fill', 'blue');
                    }
                }
            }
            
        }
    }
    setInterval(pacmanFrames, 300)
    function pacmanMove() {

    }
    function pacmanUp() {
        y-=1.5 + pacmanBoost;
        pacman.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(-90) scale(0.9)');
        pacmanFrame.setAttribute('cy', y);
        pacmanFrame.setAttribute('cx', x);
    }
    function pacmanLeft() {
        x-=1.5 + pacmanBoost;
        pacman.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(180) scale(0.9)');
        pacmanFrame.setAttribute('cy', y);
        pacmanFrame.setAttribute('cx', x);
    }
    function pacmanDown() {
        y+=1.5 + pacmanBoost;
        pacman.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(90) scale(0.9)');
        pacmanFrame.setAttribute('cy', y);
        pacmanFrame.setAttribute('cx', x);
    }
    function pacmanRight() {
        x+=1.5 + pacmanBoost;
        pacman.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(0) scale(0.9)');
        pacmanFrame.setAttribute('cy', y);
        pacmanFrame.setAttribute('cx', x);
    }
    let moveup, moveleft, movedown, moveright;
    document.onkeydown = function (event) {
        if (isGameOver == 1) {
            return
        }
        let moveCheck = [moveup, moveleft, movedown, moveright];
        for (let i of moveCheck) {
            clearInterval(i);
        }
        if (event.code === 'KeyW') {
            moveup = setInterval(pacmanUp, 10);
        } else if (event.code === 'KeyA') {
            moveleft = setInterval(pacmanLeft, 10);
        } else if (event.code === 'KeyS') {
            movedown = setInterval(pacmanDown, 10);
        } else if (event.code === 'KeyD') {
            moveright = setInterval(pacmanRight, 10);
        }
    }
    let olddiff = difficulty
    function collisionCheck() {
        for (let obstacle of obstacles) {
            let x1 = obstacle.getAttribute('x');
            let y1 = obstacle.getAttribute('y');
            let x4 = Number(obstacle.getAttribute('x')) + Number(obstacle.getAttribute('width'));
            let y4 = Number(obstacle.getAttribute('y')) + Number(obstacle.getAttribute('height'));
            let x2 = x4, y2 = y1, x3 = x1, y3 = y4;
            if (x > x1 && x < x2 && y + 45 > y1 && y < y3) {
                y-=1.5 + pacmanBoost
            }
            if (y > y2 && y < y4 && x - 45 < x2 && x > x1) {
                x+=1.5 + pacmanBoost
            }
            if (x > x3 && x < x4 && y - 45 < y4 && y > y3) {
                y+=1.5 + pacmanBoost
            }
            if (y > y1 && y < y3 && x + 45 > x1 && x < x4) {
                x-=1.5 + pacmanBoost
            }
        }
        let k = 0;
        
        for (let coin of coins) {
            let cx = Math.floor(coin.getAttribute('cx'));
            let cy = Math.floor(coin.getAttribute('cy'));
            if ((0 <= cy - y && cy - y <= 40 && 0 <= cx - x && cx - x <= 40 || 0 <= y - cy && y - cy <= 40 && 0 <= x - cx && x - cx <= 40) && coin.classList != 'eaten') {
                coin.classList = 'eaten';
                score.textContent = Number(score.textContent) + 100;
                
                if (coin.getAttribute('r') == '20') {
                    pacmanBoost = 1;
                    function unBoost() {
                        pacmanBoost = 0;
                    }
                    setTimeout(unBoost, 5000)
                }
            }
            if (coin.classList == 'eaten') {
                k++;
            }
            if (k == 146) {
                for (let coin of coins) {
                    coin.classList = '';
                }
                round.textContent = Number(round.textContent) + 1;
                difficulty -= 2;
            }
        }
        if (x - 40 < 0) {x+=1.5 + pacmanBoost}
        if (x + 40 > 1295) {x-=1.5 + pacmanBoost}
        if (y - 40 < 0) {y+=1.5 + pacmanBoost}
        if (y + 40 > 940) {y-=1.5 + pacmanBoost}

        for (let l = 1; l <= 4; l++) {
            let ghostX = ghostCoord['ghost' + String(l)]['x']
            let ghostY = ghostCoord['ghost' + String(l)]['y']
            if ((0 <= ghostY - y && ghostY - y <= 40 && 0 <= ghostX - x && ghostX - x <= 40 || 0 <= y - ghostY && y - ghostY <= 40 && 0 <= x - ghostX && x - ghostX <= 40) && pacmanBoost != 1) {
                if (gameover.classList != 'gameover' && gameovermenu.classList != 'gameovermenu' && gameovertext.classList != 'gameovertext') {
                    gameover.classList += 'gameover';
                    gameovermenu.classList += 'gameovermenu';
                    gameovertext.classList += 'gameovertext';
                    let gameoversign = gameoversigns[Math.floor(Math.random() * gameoversigns.length)]
                    if (gameoversign == lastgameoversign) {
                        
                        while (gameoversign == lastgameoversign) {
                            gameoversign = gameoversigns[Math.floor(Math.random() * gameoversigns.length)]
                        }
                    }
                    gameovertext.textContent = gameoversign
                    localStorage.setItem('lastgameoversign', gameoversign)
                    finalscore.textContent = score.textContent;
                    finalrounds.textContent = round.textContent;
                    restart.classList += 'restart';
                    isGameOver = 1;
                    pacman.remove();
                    pacmanFrame.remove();
                    let moveCheck = [moveup, moveleft, movedown, moveright];
                    for (let i of moveCheck) {
                        clearInterval(i);
                    }
                }
            } else if (pacmanBoost == 1) {
                if (0 <= ghostY - y && ghostY - y <= 40 && 0 <= ghostX - x && ghostX - x <= 40 || 0 <= y - ghostY && y - ghostY <= 40 && 0 <= x - ghostX && x - ghostX <= 40) {
                    ghostCoord['ghost' + String(l)]['direction'] = 'boostEaten'
                }
            }
        }
    }
    setInterval(collisionCheck, 10);

    ghostCoord = {
        "ghost1": {"x": "540", "y": "772", "direction": "start"},
        "ghost2": {"x": "610", "y": "772", "direction": "start"},
        "ghost3": {"x": "680", "y": "772", "direction": "start"},
        "ghost4": {"x": "750", "y": "772", "direction": "start"}
    }
    let ghostSpeed = 1;
    
    function ghostMove() {
        for (let j = 1; j <= 4; j++) {
            let ghost = document.querySelector('#ghost' + String(j))
            let ghostX = ghostCoord['ghost' + String(j)]['x']
            let ghostY = ghostCoord['ghost' + String(j)]['y']
            let direction = ghostCoord['ghost' + String(j)]['direction']
            if (direction == 'up') {
                ghostCoord['ghost' + String(j)]['y']  = Number(ghostCoord['ghost' + String(j)]['y']) - ghostSpeed;
            } else if (direction == 'down') {
                ghostCoord['ghost' + String(j)]['y'] = Number(ghostCoord['ghost' + String(j)]['y']) + ghostSpeed;
            } else if (direction == 'left') {
                ghostCoord['ghost' + String(j)]['x'] = Number(ghostCoord['ghost' + String(j)]['x']) - ghostSpeed;
            } else if (direction == 'right') {
                ghostCoord['ghost' + String(j)]['x'] = Number(ghostCoord['ghost' + String(j)]['x']) + ghostSpeed;
            } else if (direction == 'start') {
                if (Number(ghostCoord['ghost' + String(j)]['x']) > 446) {
                    ghostCoord['ghost' + String(j)]['x'] = Number(ghostCoord['ghost' + String(j)]['x']) - 1
                } else {
                    ghostCoord['ghost' + String(j)]['direction'] = ''
                }
            } else if (direction == 'boostEaten') {
                ghost.setAttribute('transform', 'translate(650 772)')
                ghostCoord['ghost' + String(j)]['x'] = '650'
                ghostCoord['ghost' + String(j)]['y'] = '772'
                ghostCoord['ghost' + String(j)]['direction'] = 'start'
                break
            }
            ghost.setAttribute('transform', 'translate(' + String(ghostCoord['ghost' + String(j)]['x'] - 33) + ' ' + String(ghostCoord['ghost' + String(j)]['y'] - 33) + ') scale(2.5)')
        }
    }

    function ghostAI() {
        for (let AIPoint of ghostAIPoints) {
            let AIPointX = AIPoint.getAttribute('cx');
            let AIPointY = AIPoint.getAttribute('cy');
            for (let i = 1; i <= 4; i++) {
                let ghostX = ghostCoord['ghost' + String(i)]['x']
                let ghostY = ghostCoord['ghost' + String(i)]['y']
                let direction = ghostCoord['ghost' + String(i)]['direction']
                if (ghostX == AIPointX && ghostY == AIPointY) {
                    ghostCoord['ghost' + String(i)]['direction'] = AIPoint.classList[Math.floor(Math.random() * AIPoint.classList.length)];
                }
            }
        }
    }
    setInterval(ghostAI, 1)
    let anima;
    function difficultyCheck() {
        if (difficulty < olddiff) {
            if (difficulty < 0) {difficulty++}
            clearInterval(anima)
            anima = setInterval(ghostMove, difficulty)
            olddiff = difficulty
        } else {
            clearInterval(anima)
            anima = setInterval(ghostMove, difficulty)
        }
    }
    setInterval(difficultyCheck, 1000, anima)
}