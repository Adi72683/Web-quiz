const SELECTED = 20;
const TIME_LIMIT = 1200;

let quiz = [];
let answers = [];
let current = 0;
let timeLeft = TIME_LIMIT;
let timer;

function startQuiz(){

    let savedQuiz =
    sessionStorage.getItem("quiz");


    if(savedQuiz){

        quiz =JSON.parse(savedQuiz);
        answers =JSON.parse(sessionStorage.getItem("answers")) || [];
        current =parseInt(sessionStorage.getItem("current")) || 0;
        timeLeft =parseInt(sessionStorage.getItem("timeLeft")) || TIME_LIMIT;
        showQuiz();
        return;
    }


  
    fetch(
    `https://opentdb.com/api.php?amount=20&category=18&difficulty=medium`
    )

    .then(response => response.json())

    .then(data => {

        quiz = data.results.map(q => {

            let options = [
                ...q.incorrect_answers,
                q.correct_answer
            ];

            options = shuffle(options);

            return {

                question:
                decodeHTML(q.question),

                options:
                options.map(opt =>
                    decodeHTML(opt)
                ),

                a:
                options.indexOf(
                    decodeHTML(
                        q.correct_answer
                    )
                )
            };
        });


        answers =
        new Array(quiz.length).fill(null);

        current = 0;

        timeLeft = TIME_LIMIT;

        save();

        showQuiz();
    })

    .catch(error => {

        console.error(error);

        alert("Failed to fetch quiz");
    });
}




function decodeHTML(html){

    let txt =
    document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}




function shuffle(array){

    for(let i = array.length - 1;i > 0;i--){

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}


function showQuiz(){
    document.getElementById("landing").hidden = true;
    document.getElementById("quiz").hidden = false;

    initTracker();
    loadQ();
    startTimer();
}


function loadQ(){

    let currentQuestion = quiz[current];

    document.getElementById("question").innerText =
        (current + 1) + ". " + currentQuestion.question;

    let container =
    document.getElementById("options");

    container.innerHTML = "";

    currentQuestion.options.forEach((opt, i) => {

        let label =
        document.createElement("label");

        label.className = "option";

        let input =
        document.createElement("input");

        input.type = "radio";

        input.name = "opt";

        input.value = i;

        if(answers[current] === i){
            input.checked = true;
        }

        label.appendChild(input);

        label.appendChild(
            document.createTextNode(" " + opt)
        );

        container.appendChild(label);
    });

    updateTracker();
    updateProgress();    
    save();
}

window.addEventListener("DOMContentLoaded", () => {

    const savedQuiz =
    sessionStorage.getItem("quiz");

    const startBtn =
    document.getElementById("startBtn");

    if(savedQuiz !== null){

        startBtn.innerText = "Resume Quiz";

    } else {

        startBtn.innerText = "Start Quiz";
    }
});

document.addEventListener("change", e => {
    if(e.target.name === "opt"){
        answers[current] = +e.target.value;
        save();
        saveTextAnswers(); 

        updateProgress(); 
    }
});

document.addEventListener("keydown", function(e){

    if(e.key === "ArrowRight"){
        e.preventDefault();
        nextQuestion();
    }

    else if(e.key === "ArrowLeft"){
        e.preventDefault();
        prevQuestion();
    }

    else if(e.key === "Enter"){
        e.preventDefault();

        if(current === quiz.length - 1){
            submitQuiz();
        } else {
            nextQuestion();
        }
    }

    
    
if(e.key === "Tab"){

    let options = document.querySelectorAll('input[name="opt"]');

    let currentIndex = -1;

    
    options.forEach((opt, index) => {
        if(opt.checked){
            currentIndex = index;
        }
    });

    
    let nextIndex = (currentIndex + 1) % options.length;

    
    options[nextIndex].checked = true;

    
    answers[current] = nextIndex;

    
    save();
    updateProgress();
    updateTracker();

    
    e.preventDefault();
}

});
function nextQuestion(){

    if(current < quiz.length - 1){
        current++;
        save();
        loadQ();
    }
}

function prevQuestion(){

    if(current > 0){
        current--;
        save();
        loadQ();
    }
}

function updateProgress(){

    let answeredCount = answers.filter(answer => answer !== null).length;

    let progressPercentage = (answeredCount / quiz.length) * 100;

    document.getElementById("progressBar").style.width =
        progressPercentage + "%";
}


function initTracker() {
    const tracker = document.getElementById("tracker");
    tracker.innerHTML = "";

    quiz.forEach((_, i) => {
        let btn = document.createElement("button");
        btn.innerText = i + 1;
        btn.className = "track-btn";

        btn.onclick = () => {
        current = i;
        save();
        loadQ();
};

        tracker.appendChild(btn);
    });
}


function updateTracker() {
    const buttons = document.querySelectorAll(".track-btn");

    buttons.forEach((btn, i) => {
        btn.classList.remove("answered", "active");

        if (answers[i] !== null) {
            btn.classList.add("answered");
        }

        if (i === current) {
            btn.classList.add("active");
        }
    });
}


function saveTextAnswers(){

    let textAnswers = [];   

    for(let i = 0; i < answers.length; i++){

        let selectedAnswer = answers[i];   

        if(selectedAnswer === null){

            textAnswers[i] = null;   

        } else {

            textAnswers[i] =
                quiz[i].options[selectedAnswer];   
        }
    }

    sessionStorage.setItem(
        "textAnswers",
        JSON.stringify(textAnswers)
    );
    saveTextAnswers();
}

 function startTimer(){

    clearInterval(timer);

    timer = setInterval(function(){

        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        if(seconds < 10){
            seconds = "0" + seconds;
        }

        document.getElementById("timer").innerText =
            minutes + ":" + seconds;

        sessionStorage.setItem("timeLeft", timeLeft);

        if(timeLeft <= 0){

    clearInterval(timer);

    alert("Time's Up!");

    submitQuiz(true);
}

    }, 1000);
}

function save(){
    sessionStorage.setItem("quiz", JSON.stringify(quiz));
    sessionStorage.setItem("answers", JSON.stringify(answers));
    sessionStorage.setItem("current", current.toString());
    sessionStorage.setItem("timeLeft", timeLeft.toString());
    
}




function submitQuiz(timeUp = false){

    
    let unanswered = answers.filter(a => a === null).length;

    if(unanswered > 0 && !timeUp){
        alert(`Answer all questions!\nUnanswered: ${unanswered}`);
        return;
    }

    clearInterval(timer);

    let score = 0;
    let reviewHTML = "";

    quiz.forEach((q, i) => {

        let userAnswer =
            answers[i] != null
            ? q.options[answers[i]]
            : "Not Answered";

        let correctAnswer =
            q.a != null
            ? q.options[q.a]
            : "No Correct Answer";

    
        if(answers[i] === q.a){

            score++;

        }else{

            reviewHTML += `
            
            <div class="review-card">

                <p>
                    <b>Q${i+1}:</b>
                    ${q.question}
                </p>

                <p class="wrong">
                    Your Answer: ${userAnswer}
                </p>

                <p class="correct">
                    Correct: ${correctAnswer}
                </p>

            </div>
            
            `;
        }
    });

    let wrong = quiz.length - score;

    
    document.getElementById("quiz").hidden = true;

    document.getElementById("result").hidden = false;
    
    document.getElementById("score").innerText =
        `Score: ${score}/${quiz.length}`;

    
    document.getElementById("status").innerText =
        score >= 10 ? "PASS " : "FAIL ";

    
    document.getElementById("correctCount").innerText = score;
    document.getElementById("wrongCount").innerText = wrong;

  
    document.getElementById("review").innerHTML =
        reviewHTML || "<p class='correct'>All answers correct 🎉</p>";

   
    sessionStorage.clear();
}


function resetQuiz(){
    sessionStorage.clear();
    location.reload();
}

