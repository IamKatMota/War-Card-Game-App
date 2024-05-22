let deckId = '';
let player1Score = 0;
let player2Score = 0;

// Fetch a new deck on page load and store the deck ID
fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        deckId = data.deck_id;
        document.querySelector('#cardsLeft').innerText = data.remaining;
    })
    .catch(err => {
        console.log(`error ${err}`);
    });

// Add event listener to the button to draw two cards
document.querySelector('button').addEventListener('click', drawTwo);

function drawTwo() {
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.remaining === 0) {
                announceWinner();
                return;
            }

            document.querySelector('#player1').src = data.cards[0].image;
            document.querySelector('#player2').src = data.cards[1].image;
            document.querySelector('#cardsLeft').innerText = data.remaining;

            let player1Val = convertToNum(data.cards[0].value);
            let player2Val = convertToNum(data.cards[1].value);

            if (player1Val > player2Val) {
                document.querySelector('h3').innerText = 'Player 1 Wins';
                player1Score++;
            } else if (player1Val < player2Val) {
                document.querySelector('h3').innerText = 'Player 2 Wins';
                player2Score++;
            } else {
                document.querySelector('h3').innerText = 'It\'s a Tie! Both players draw again';
                setTimeout(drawTwo, 3000); // Delay the next draw by 3 seconds
               
            }

            document.querySelector('#player1Score').innerText = player1Score;
            document.querySelector('#player2Score').innerText = player2Score;
        })
        .catch(err => {
            console.log(`error ${err}`);
        });
}

function announceWinner() {
    let result = '';
    if (player1Score > player2Score) {
        result = 'Player 1 is the overall winner!';
    } else if (player1Score < player2Score) {
        result = 'Player 2 is the overall winner!';
    } else {
        result = 'It\'s a tie overall!';
    }
    document.querySelector('h3').innerText = result;
}

function convertToNum(val) {
    if (val === 'ACE') {
        return 14;
    } else if (val === 'KING') {
        return 13;
    } else if (val === 'QUEEN') {
        return 12;
    } else if (val === 'JACK') {
        return 11;
    } else {
        return Number(val);
    }
}
