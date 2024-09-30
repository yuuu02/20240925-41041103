const cardsGrid = document.getElementById('cards-grid');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const flipAllFrontBtn = document.getElementById('flip-all-front');
const flipAllBackBtn = document.getElementById('flip-all-back');
const themeSelect = document.getElementById('theme-select');
const countdownElement = document.getElementById('countdown');
const scoreElement = document.getElementById('score-count');

let timer;
let countdown = 10;
let score = 0;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let cardImages = [];
let frontImage = '';

const themes = {
    theme1: {
        front: 'img/theme1/front.jpg',
        backs: [
            'img/theme1/image1.png', 'img/theme1/image2.png', 'img/theme1/image3.png', 'img/theme1/image4.png',
            'img/theme1/image5.png', 'img/theme1/image6.png', 'img/theme1/image7.png', 'img/theme1/image8.png'
        ]
    },
    theme2: {
        front: 'img/theme2/front.png',
        backs: [
            'img/theme2/image1.png', 'img/theme2/image2.png', 'img/theme2/image3.png', 'img/theme2/image4.png',
            'img/theme2/image5.png', 'img/theme2/image6.png', 'img/theme2/image7.png', 'img/theme2/image8.png'
        ]
    }
};

function createCardElements() {
    cardsGrid.innerHTML = '';  // 清空容器，重新生成卡片
    let selectedTheme = themes[themeSelect.value];
    frontImage = selectedTheme.front;
    cardImages = [...selectedTheme.backs, ...selectedTheme.backs]; // 生成配對
    cardImages = shuffle(cardImages);  // 洗牌

    cardImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('card', 'hidden'); // 初始狀態為隱藏
        card.innerHTML = `
            <div class="front" style="background-image: url('${frontImage}');"></div>
            <div class="back" style="background-image: url('${image}');"></div>
        `;
        card.addEventListener('click', flipCard);
        cardsGrid.appendChild(card);
    });

    // 初始狀態為背面
    document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    resetGame();
    startBtn.style.display = 'none'; // 隱藏開始遊戲按鈕
    restartBtn.style.display = 'inline-block'; // 顯示重新開始按鈕
    restartBtn.textContent = '重新開始'; // 將重新開始按鈕文本設置為「重新開始」
    countdown = 10;
    updateCountdown();
    cardsGrid.style.display = 'grid'; // 顯示卡片框架
    timer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown === 0) {
        clearInterval(timer);
        lockBoard = false;
        const cards = document.querySelectorAll('.card');
        let index = 0;

        const flipNextCard = () => {
            if (index < cards.length) {
                cards[index].classList.remove('flipped');
                index++;
                setTimeout(flipNextCard, 250); // 250ms 間隔翻下一張
            }
        };

        flipNextCard(); // 開始翻面
    } else if (countdown < 0) {
        clearInterval(timer);
        countdownElement.textContent = 0; // 防止倒數進入負數
    }
}

function resetGame() {
    score = 0;
    matchedPairs = 0;
    scoreElement.textContent = score;
    lockBoard = true;
    clearInterval(timer); // 停止計時器
    countdown = 10; // 重置倒計時
    countdownElement.textContent = countdown; // 更新顯示
    createCardElements();
    // 隱藏卡牌框架
    cardsGrid.style.display = 'none'; 
}
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    score += 1;
    scoreElement.textContent = score;
    matchedPairs++;

    if (matchedPairs === cardImages.length / 2) {
        endGame(); // 全部匹配完成，結束遊戲
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 500); // 這裡可以調整翻回速度
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function endGame() {
    Swal.fire({
        title: '恭喜！',
        text: '你已經成功配對所有卡片！',
        icon: 'success',
        confirmButtonText: '重新開始',
        focusConfirm: false,
        heightAuto: false
    }).then(() => {
        resetGame(); // 這裡呼叫 resetGame
        startBtn.style.display = 'inline-block'; // 顯示開始遊戲按鈕
        restartBtn.style.display = 'none'; // 隱藏重新開始按鈕
    });
}



// 監聽按鈕和事件
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    resetGame();
    startBtn.style.display = 'inline-block'; // 顯示開始遊戲按鈕
    restartBtn.style.display = 'none'; // 隱藏重新開始按鈕
});

// 統一翻到正面
flipAllFrontBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    let index = 0;

    const flipNextCard = () => {
        if (index < cards.length) {
            cards[index].classList.remove('flipped'); // 顯示正面
            index++;
            setTimeout(flipNextCard, 100); // 100ms 間隔翻下一張
        }
    };

    flipNextCard(); // 開始翻面
});

// 統一翻到背面
flipAllBackBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    let index = 0;

    const flipNextCard = () => {
        if (index < cards.length) {
            cards[index].classList.add('flipped'); // 顯示背面
            index++;
            setTimeout(flipNextCard, 100); // 100ms 間隔翻下一張
        }
    };

    flipNextCard(); // 開始翻面
});

themeSelect.addEventListener('change', createCardElements);

// 初始化卡片
createCardElements();
