const SELECTED = 20;
const TIME_LIMIT = 1200;


const questionBank = [
{q:"What does HTML stand for?",o:["Hyper Trainer Marking Language","HyperText Markup Language","HyperText Markdown Language","None"],a:1},
{q:"Which tag is used for links?",o:["a","link","href","url"],a:0},
{q:"Which CSS property controls text size?",o:["font-style","text-size","font-size","text-style"],a:2},
{q:"Which is JS data type?",o:["String","Number","Boolean","All"],a:3},
{q:"Which symbol for comments in JS?",o:["//","!-- --","#","**"],a:0},
{q:"CSS stands for?",o:["Color Style Sheet","Cascading Style Sheet","Creative Style","None"],a:1},
{q:"Which HTML tag for image?",o:["img","image","pic","src"],a:0},
{q:"JS used for?",o:["Styling","Structure","Logic","Database"],a:2},
{q:"Which property for background color?",o:["bgcolor","background-color","color","bg"],a:1},
{q:"Which keyword declares variable?",o:["var","let","const","All"],a:3},
{q:"Which event on click?",o:["onhover","onclick","onchange","onload"],a:1},
{q:"Flexbox is used for?",o:["Layout","Animation","Database","Security"],a:0},
{q:"Which HTML tag for table?",o:["table","tab","tr","td"],a:0},
{q:"Which CSS unit is relative?",o:["px","cm","rem","mm"],a:2},
{q:"JS runs on?",o:["Browser","Server","Both","None"],a:2},
{q:"DOM stands for?",o:["Document Object Model","Data Object","Doc Model","None"],a:0},
{q:"Which tag for heading?",o:["h1","head","heading","h"],a:0},
{q:"Which method selects element?",o:["getElementById","querySelector","Both","None"],a:2},
{q:"CSS Grid is used for?",o:["Layout","Animation","Fonts","None"],a:0},
{q:"Which is not JS framework?",o:["React","Angular","Vue","Django"],a:3},
{q:"Which HTML tag is used for paragraphs?",o:["p","para","text","pg"],a:0},
{q:"Which attribute is used for image source?",o:["src","href","link","path"],a:0},
{q:"Which CSS property controls margin?",o:["padding","spacing","margin","border"],a:2},
{q:"Which operator is used for equality (strict) in JS?",o:["=","==","===","!="],a:2},
{q:"Which function prints output in console?",o:["print()","log()","console.log()","write()"],a:2},
{q:"Which HTML tag is used for lists?",o:["ul","li","Both","list"],a:2},
{q:"Which keyword is used for function in JS?",o:["func","function","define","method"],a:1},
{q:"Which CSS property is used for text color?",o:["font-color","text-color","color","style"],a:2},
{q:"Which HTML element is used for forms?",o:["form","input","label","fieldset"],a:0},
{q:"Which JS method converts JSON to object?",o:["JSON.parse()","JSON.stringify()","parseJSON()","toObject()"],a:0}
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

   
    quiz = shuffle([...questionBank]).slice(
        0,
        Math.min(SELECTED, questionBank.length)
    );

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
        (current + 1) + ". " + currentQuestion.q;

    
    let container = document.getElementById("options");
    container.innerHTML = "";

    currentQuestion.o.forEach((opt, i) => {

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

    
    if(["1","2","3","4"].includes(e.key)){
        let index = parseInt(e.key) - 1;

        let options = document.querySelectorAll('input[name="opt"]');

        if(options[index]){
            options[index].checked = true;

            answers[current] = index;
            save();
            updateProgress();
            updateTracker();
        }
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
            textAnswers[i] = quiz[i].o[selectedAnswer];   
        }
    }

    sessionStorage.setItem("textAnswers", JSON.stringify(textAnswers));
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
            submitQuiz();
        }

    }, 1000);
}

function save(){
    sessionStorage.setItem("quiz", JSON.stringify(quiz));
    sessionStorage.setItem("answers", JSON.stringify(answers));
    sessionStorage.setItem("current", current.toString());
    sessionStorage.setItem("timeLeft", timeLeft.toString());
}




function submitQuiz(){

    // Count unanswered questions
    let unanswered = answers.filter(a => a === null).length;

    // Stop submit if questions are unanswered
    if(unanswered > 0){
        alert(`Answer all questions!\nUnanswered: ${unanswered}`);
        return;
    }

    // Stop timer
    clearInterval(timer);

    let score = 0;
    let reviewHTML = "";

    // Check each question
    quiz.forEach((q, i) => {

        // User selected answer
        let userAnswer =
            answers[i] != null
            ? q.o[answers[i]]
            : "Not Answered";

        // Correct answer
        let correctAnswer =
            q.a != null
            ? q.o[q.a]
            : "No Correct Answer";

        // Correct answer check
        if(answers[i] === q.a){

            score++;

        }else{

            // Add wrong answer review
            reviewHTML += `
            
            <div class="review-card">

                <p>
                    <b>Q${i+1}:</b>
                    ${q.q}
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

    // Wrong answers count
    let wrong = quiz.length - score;

    // Hide quiz section
    document.getElementById("quiz").style.display = "none";

    // Show result section
    document.getElementById("result").style.display = "block";

    // Show score
    document.getElementById("score").innerText =
        `Score: ${score}/${quiz.length}`;

    // Pass or fail
    document.getElementById("status").innerText =
        score >= 10 ? "PASS 🎉" : "FAIL ❌";

    // Statistics
    document.getElementById("correctCount").innerText = score;
    document.getElementById("wrongCount").innerText = wrong;

    // Show review
    document.getElementById("review").innerHTML =
        reviewHTML || "<p class='correct'>All answers correct 🎉</p>";

    // Clear saved session
    sessionStorage.clear();
}

function resetQuiz(){
    sessionStorage.clear();
    location.reload();
}

