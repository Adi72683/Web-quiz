const SELECTED = 20;
const TIME_LIMIT = 1200;


const questionBank = [
{question:"What does HTML stand for?",options:["Hyper Trainer Marking Language","HyperText Markup Language","HyperText Markdown Language","None"],a:1},
{question:"Which tag is used for links?",options:["a","link","href","url"],a:0},
{question:"Which CSS property controls text size?",options:["font-style","text-size","font-size","text-style"],a:2},
{question:"Which is JS data type?",options:["String","Number","Boolean","All"],a:3},
{question:"Which symbol for comments in JS?",options:["//","!-- --","#","**"],a:0},
{question:"CSS stands for?",options:["Color Style Sheet","Cascading Style Sheet","Creative Style","None"],a:1},
{question:"Which HTML tag for image?",options:["img","image","pic","src"],a:0},
{question:"JS used for?",options:["Styling","Structure","Logic","Database"],a:2},
{question:"Which property for background color?",options:["bgcolor","background-color","color","bg"],a:1},
{question:"Which keyword declares variable?",options:["var","let","const","All"],a:3},
{question:"Which event on click?",options:["onhover","onclick","onchange","onload"],a:1},
{question:"Flexbox is used for?",options:["Layout","Animation","Database","Security"],a:0},
{question:"Which HTML tag for table?",options:["table","tab","tr","td"],a:0},
{question:"Which CSS unit is relative?",options:["px","cm","rem","mm"],a:2},
{question:"JS runs on?",options:["Browser","Server","Both","None"],a:2},
{question:"DOM stands for?",options:["Document Object Model","Data Object","Doc Model","None"],a:0},
{question:"Which tag for heading?",options:["h1","head","heading","h"],a:0},
{question:"Which method selects element?",options:["getElementById","querySelector","Both","None"],a:2},
{question:"CSS Grid is used for?",options:["Layout","Animation","Fonts","None"],a:0},
{question:"Which is not JS framework?",options:["React","Angular","Vue","Django"],a:3},
{question:"Which HTML tag is used for paragraphs?",options:["p","para","text","pg"],a:0},
{question:"Which attribute is used for image source?",options:["src","href","link","path"],a:0},
{question:"Which CSS property controls margin?",options:["padding","spacing","margin","border"],a:2},
{question:"Which operator is used for equality (strict) in JS?",options:["=","==","===","!="],a:2},
{question:"Which function prints output in console?",options:["print()","log()","console.log()","write()"],a:2},
{question:"Which HTML tag is used for lists?",options:["ul","li","Both","list"],a:2},
{question:"Which keyword is used for function in JS?",options:["func","function","define","method"],a:1},
{question:"Which CSS property is used for text color?",options:["font-color","text-color","color","style"],a:2},
{question:"Which HTML element is used for forms?",options:["form","input","label","fieldset"],a:0},
{question:"Which JS method converts JSON to object?",options:["JSON.parse()","JSON.stringify()","parseJSON()","toObject()"],a:0}
];




let quiz = [], answers = [], current = 0, timeLeft = TIME_LIMIT, timer;



function startQuiz(){

    
    let savedQuiz = sessionStorage.getItem("quiz");

    
    if(savedQuiz){

        quiz = JSON.parse(savedQuiz);
        answers = JSON.parse(sessionStorage.getItem("answers"));
        current = parseInt(sessionStorage.getItem("current"));
        timeLeft = parseInt(sessionStorage.getItem("timeLeft"));

        showQuiz();
        return;
    }

   
    quiz = shuffle([...questionBank]).slice(0,Math.min(SELECTED, questionBank.length));

    answers = new Array(quiz.length).fill(null);

    current = 0;
    timeLeft = TIME_LIMIT;

    save();
    showQuiz();
   
}

function shuffle(a){
    return a.sort(() => Math.random() - 0.5);
}


function showQuiz(){
    document.getElementById("landing").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    initTracker();
    loadQ();
    startTimer();
}


function loadQ(){

    let currentQuestion = quiz[current];

   
    document.getElementById("question").innerText =
        (current + 1) + ". " + currentQuestion.question;

    
    let container = document.getElementById("options");
    container.innerHTML = "";

    currentQuestion.options.forEach((opt, i) => {

        let label = document.createElement("label");
        label.className = "option";

        let input = document.createElement("input");
        input.type = "radio";
        input.name = "opt";
        input.value = i;

        
        if (answers[current] === i){
            input.checked = true;
        }

        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + opt));

        container.appendChild(label);
    });

    document.getElementById("submitBtn").style.display = "inline-block";

    document.getElementById("prevBtn").style.display =
        current === 0 ? "none" : "inline-block";

    document.getElementById("nextBtn").style.display =
        current === quiz.length - 1 ? "none" : "inline-block";

   
    updateTracker();
    updateProgress();
}

document.addEventListener("change", e => {
    if(e.target.name === "opt"){
        answers[current] = +e.target.value;
        save();
        saveTextAnswers(); 

        updateProgress(); 
    }
});

document.addEventListener("keydown", function(e){

    
    if(e.key === "ArrowRight" || e.key === "Enter"){
        e.preventDefault();
        nextQuestion();
    }

    
    if(e.key === "ArrowLeft"){
        e.preventDefault();
        prevQuestion();
    }
    if(e.key === "Enter"){
        e.preventDefault();

        
        if(current === quiz.length - 1){
            submitQuiz();
        } 
        
        else {
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
        loadQ();
    }
}

function prevQuestion(){
    if(current > 0){
        current--;
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

    
    document.getElementById("quiz").style.display = "none";

    document.getElementById("result").style.display = "block";

    
    document.getElementById("score").innerText =
        `Score: ${score}/${quiz.length}`;

    
    document.getElementById("status").innerText =
        score >= 10 ? "PASS 🎉" : "FAIL ❌";

    
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

