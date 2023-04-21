axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
const quizzPostURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
const createQuizzWindow = document.querySelector(".create-quizz-window");

const createQuizzFirstStep = document.querySelector(".create-quizz-first-step");
const createQuizzSecondStep = document.querySelector(".create-quizz-second-step");
const createQuizzThirdStep = document.querySelector(".create-quizz-third-step");
const createQuizzFinishedWindow = document.querySelector(".create-quizz-fourth-step");




// CÓDIGO DARLAN
// Variaveis de criação de um quizz

// Informações básicas
let quizzCreateTitle ='';
let quizzCreateMainImageURL = '';
let quizzCreateQuestionsAmount = 0;
let quizzCreateLevesAmount = 0;

// Perguntas

// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateQuestionsAmount
// O objeto vai ser criado na função final de enviar o quizz 
let quizzCreateQuestions = [];

// Níveis
// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateLevesAmount
// O objeto vai ser criado na função final de enviar o quizz 
/*
[
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
*/
let quizzCreateLevels = [];

// Função que inicia a criação de quizz escondendo as outras janelas e mostrando apenas a tela de criação de quiz inicial
function startCreatingQuizz()
{
    // Mostrar janela de quizz e janela inicial de criação quizz
    createQuizzWindow.classList.remove('hidden');
    createQuizzFirstStep.classList.remove('hidden');

    // Esconder outras janelas de criação de quizz
    createQuizzSecondStep.classList.add('hidden');
    createQuizzThirdStep.classList.add('hidden');
    createQuizzFinishedWindow.classList.add('hidden');
}

//startCreatingQuizz();

function isValidImageURL(urlToCheck)
{
    let imageExtensions = /\.(jpeg|jpg|gif|png)$/i;
    return imageExtensions.test(urlToCheck);
}


function isValidColor(colorToCheck) {
    const hexColorRegex = /^#?([0-9A-F]{3}){1,2}$/i;
    return hexColorRegex.test(colorToCheck);
}


// Tentativa de proceder para criar perguntas do quizz
function tryToProceedToCreateQuestions()
{
    const quizzTitleInput = document.querySelector(".quizz-title-input").value;
    const quizzImageUrlInput = document.querySelector(".quizz-imageURL-input").value;
    const quizzQuestionsAmountInput = document.querySelector(".quizz-questions-amount-input").value;
    const quizzLevelsAmountInput = document.querySelector(".quizz-levels-amount-input").value;

    // Checa se o titulo é valido, neste caso contem entre 20 e 65 caracteres
    // Se é valido essa variavel recebe true do contrário false
    const isValidTitle = quizzTitleInput.length >=20 && quizzTitleInput.length <= 65 ? true : false;
    
    // Checa a quantidade de perguntas inseridas pelo usuário
    // Se a quantidade é maior ou igual a 3 recebe true do contrário false
    const hasMinimumAmountOfQuestions = Number(quizzQuestionsAmountInput) >=3 ? true : false;
    // Checa a quantidade de níveis inseridos pelo usuário
    // Se a quantidade é maior ou igual a 2 recebe true do contrário false
    const hasMinimumAmountOfLevels = Number(quizzLevelsAmountInput) >=2 ? true : false;

    if(isValidTitle && isValidImageURL(quizzImageUrlInput) && hasMinimumAmountOfQuestions && hasMinimumAmountOfLevels)
    {
        quizzCreateTitle = quizzTitleInput;
        quizzCreateMainImageURL = quizzImageUrlInput;
        quizzCreateQuestionsAmount = Number(quizzQuestionsAmountInput);
        quizzCreateLevesAmount = Number(quizzLevelsAmountInput);
        proceedToCreateQuestions();
    }
    else
    {
        let alertText = isValidTitle ? "": "Cheque se seu título possui entre 20 e 65 caracteres\n";
        alertText += isValidImageURL(quizzImageUrlInput) ? "" : "Cheque se sua url da imagem é válida\n";
        alertText += hasMinimumAmountOfQuestions ? "" : "Cheque se a quantidade de perguntas é no mínimo 3\n";
        alertText += hasMinimumAmountOfLevels ? "" : "Cheque se a quantidade de níveis é no mínimo 2";
        alert(alertText);
    }
    
    // console.log(hasMinimumAmountOfLevels);
    // console.log(hasMinimumAmountOfQuestions);
    // console.log(isValidImageURL);
    // console.log(isValidTitle);
}

function proceedToCreateQuestions()
{
     // Mostrar janela de criação de perguntas do quizz
     createQuizzSecondStep.classList.remove('hidden');
 
     // Esconder outras janelas de criação de quizz
     createQuizzFirstStep.classList.add('hidden');  
     createQuizzThirdStep.classList.add('hidden');
     createQuizzFinishedWindow.classList.add('hidden');

     createQuizzSecondStep.innerHTML = `
     <h1>Crie suas perguntas</h1>
            <div class="question-box question-open">
                <div class="create-quizz-subtitle">Pergunta 1</div>
                <div class="question-fields">
                    <div class="question">
                        <input class="input-question-text quizz-create-input" type="text" placeholder="Texto da pergunta">
                        <input class ="input-question-color quizz-create-input"type="text" placeholder="Cor de fundo da pergunta">
                    </div>
                    <div class="create-quizz-subtitle">Resposta correta</div>
                    <div class="correct-answer">
                        <input class ="input-question-answer-text quizz-create-input"type="text" placeholder="Resposta correta">
                        <input class ="input-question-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem">
                    </div>
                    <div class="create-quizz-subtitle">Respostas Incorretas</div>
                    <div class="input-wrong-questions-box1">
                        <input class ="input-wrong-question1-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 1">
                        <input class ="input-wrong-question1-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 1">
                    </div>
                    <div class="input-wrong-questions-box2">
                        <input class ="input-wrong-question2-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 2">
                        <input class ="input-wrong-question2-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="input-wrong-questions-box3">
                        <input class ="input-wrong-question3-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 3">
                        <input class ="input-wrong-question3-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
                <ion-icon onclick="expandQuestion(this)" class="hidden" name="create-outline"></ion-icon>
            </div>
     `

     for (let i = 0; i < quizzCreateQuestionsAmount -1; i++) 
     {
        createQuizzSecondStep.innerHTML +=
        `
        <div class="question-box question-closed">
            <div class="create-quizz-subtitle">Pergunta ${i+2}</div>
            <div class="question-fields hidden">
                <div class="question">
                    <input class="input-question-text quizz-create-input" type="text" placeholder="Texto da pergunta">
                    <input class ="input-question-color quizz-create-input"type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <div class="create-quizz-subtitle">Resposta correta</div>
                <div class="correct-answer">
                    <input class ="input-question-answer-text quizz-create-input"type="text" placeholder="Resposta correta">
                    <input class ="input-question-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem">
                </div>
                <div class="create-quizz-subtitle">Respostas Incorretas</div>
                <div class="input-wrong-questions-box1">
                    <input class ="input-wrong-question1-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 1">
                    <input class ="input-wrong-question1-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 1">
                </div>
                <div class="input-wrong-questions-box2">
                    <input class ="input-wrong-question2-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 2">
                    <input class ="input-wrong-question2-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 2">
                </div>
                <div class="input-wrong-questions-box3">
                    <input class ="input-wrong-question3-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 3">
                    <input class ="input-wrong-question3-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 3">
                </div>
            </div>
            <ion-icon onclick="expandQuestion(this)" class="" name="create-outline"></ion-icon>
        </div>
        `
     }

     createQuizzSecondStep.innerHTML +=`<button onclick="tryToProceedToCreateLevels()" class="proceed-create-levels-btn">Prosseguir para criar níveis</button>`;
}

function expandQuestion(question)
{
    question = question.parentNode;
    question.classList.remove('question-closed');
    question.classList.add('question-open');
    question.querySelector('.question-fields').classList.remove('hidden');
    question.querySelector('ion-icon').classList.add('hidden');
}

function tryToProceedToCreateLevels()
{
    const allQuestionFields = document.querySelectorAll('.question-fields');

    quizzCreateQuestions = [];

    allQuestionFields.forEach( questionField =>{

        let questionTitle = questionField.querySelector('.question').querySelector('.input-question-text').value;
        let questionColor = questionField.querySelector('.question').querySelector('.input-question-color').value;

        let questionCorrectAnswerText = questionField.querySelector('.correct-answer').querySelector('.input-question-answer-text').value;
        let questionCorrectAnswerImageURL = questionField.querySelector('.correct-answer').querySelector('.input-question-answer-imageURL').value;
        
        let questionWrongAnswerText1 = questionField.querySelector('.input-wrong-questions-box1').querySelector('.input-wrong-question1-answer-text').value;
        let questionWrongAnswerText2 = questionField.querySelector('.input-wrong-questions-box2').querySelector('.input-wrong-question2-answer-text').value;
        let questionWrongAnswerText3 = questionField.querySelector('.input-wrong-questions-box3').querySelector('.input-wrong-question3-answer-text').value;

        let questionWrongAnswerImageURL1 = questionField.querySelector('.input-wrong-questions-box1').querySelector('.input-wrong-question1-answer-imageURL').value;
        let questionWrongAnswerImageURL2 = questionField.querySelector('.input-wrong-questions-box2').querySelector('.input-wrong-question2-answer-imageURL').value;
        let questionWrongAnswerImageURL3 = questionField.querySelector('.input-wrong-questions-box3').querySelector('.input-wrong-question3-answer-imageURL').value;

        quizzCreateQuestions.push(
        {
            title: questionTitle,
            color: questionColor,
            answers: [
                {
                    text: questionCorrectAnswerText,
                    image: questionCorrectAnswerImageURL,
                    isCorrectAnswer: true
                },
                {
                    text: questionWrongAnswerText1,
                    image: questionWrongAnswerImageURL1,
                    isCorrectAnswer: false
                },
                {
                    text: questionWrongAnswerText2,
                    image: questionWrongAnswerImageURL2,
                    isCorrectAnswer: false
                },
                {
                    text: questionWrongAnswerText3,
                    image: questionWrongAnswerImageURL3,
                    isCorrectAnswer: false
                }
            ]
        }
        );
    });


    console.log(quizzCreateQuestions);

    let hasAllCorrectAnswers = false;

    let i =0;
    quizzCreateQuestions.forEach(question =>{  


        if(isValidImageURL(question.answers[0].image) && isValidImageURL(question.answers[1].image) && isValidImageURL(question.answers[2].image) && isValidImageURL(question.answers[3].image))
        {
            console.log("Todas url de imagens válidas da pergunta" + i);
        }
        else
        {
            console.log("Algum url de imagem não é válido na pergunta: " + i);
        }

        if(isValidColor(question.color))
        {
            console.log("A cor da pergunta " + i +" é valida!");
        }
        else
        {
            console.log("A cor da pergunta " + i + " não é valida");
        }

        if(question.title.length >=20)
        {
            console.log("A pergunta número " + i +" é valida, possui " + question.title.length + " caracteres");
        }
        else
        {
            console.log("A pergunta número " + i +" não é valida, possui " + question.title.length + " caracteres");
        }

        if(question.answers[0].text != "" && question.answers[0].text != undefined && question.answers[0].text != null)
        {
            hasAllCorrectAnswers = true;
            console.log("A resposta correta da pergunta número " + i + "é valida");
        }
        else
        {
            console.log("A resposta correta da pergunta número " + i + " não é valida");
            hasAllCorrectAnswers = false;
        }

        i++;
    });


    if(hasAllCorrectAnswers)
    {
        
    }
}


// CÓDIGO AUGUSTO
//item to test functions, to be replaced with response from server
let itemTest = [
	{
		id: 1,
		title: "Título do quizz",
		image: "https://http.cat/411.jpg",
		questions: [
			{
				title: "Título da pergunta 1",
				color: "#FFFF00",
				answers: [
					{
						text: "Texto da resposta 1",
						image: "https://http.cat/411.jpg",
						isCorrectAnswer: true
					},
					{
						text: "Texto da resposta 2",
						image: "https://http.cat/412.jpg",
						isCorrectAnswer: false
					}
				]
			},
			{
				title: "Título da pergunta 2",
				color: "blue",
				answers: [
					{
						text: "Texto da resposta 1",
						image: "https://http.cat/411.jpg",
						isCorrectAnswer: true
					},
					{
						text: "Texto da resposta 2",
						image: "https://http.cat/412.jpg",
						isCorrectAnswer: false
					}
				]
			},
			{
				title: "Título da pergunta 3",
				color: "red",
				answers: [
					{
						text: "Texto da resposta 1",
						image: "https://http.cat/411.jpg",
						isCorrectAnswer: true
					},
					{
						text: "Texto da resposta 2",
						image: "https://http.cat/412.jpg",
						isCorrectAnswer: false
					}
				]
			}
		],
		levels: [
			{
				title: "Título do nível 1",
				image: "https://http.cat/411.jpg",
				text: "Descrição do nível 1",
				minValue: 0
			},
			{
				title: "Título do nível 2",
				image: "https://http.cat/412.jpg",
				text: "Descrição do nível 2",
				minValue: 50
			}
		]
	}
]

//to shuffle
function comparador(){ 
    return Math.random() - 0.5; 
}

//function showResult

function showQuiz(quizz){ //pass object as an argument => object===quizz
    let item = quizz[0];

    //select the main container and show the title and image
    const container = document.querySelector('.container-show-quiz');

    container.innerHTML =   `<div class="quiz-title">
                                <p>${item.title}</p>
                            </div>
                            <div class="container-quiz-questions"></div>
                            `;

    const quizImage = document.querySelector('.quiz-title');
    quizImage.style.backgroundImage = `url(${item.image})`; 

    //get container for questions and show them
    const containerQuestions = document.querySelector('.container-quiz-questions');

    item.questions.forEach(question => {
        containerQuestions.innerHTML += `<div class="quiz-question-box">
                                            <div class="quiz-question">
                                                <p>${question.title}</p>
                                            </div>
                                            <div class="quiz-answer-box"></div>
                                        </div>`;

        const quizTitle = document.querySelectorAll('.quiz-question');
        quizTitle[quizTitle.length-1].style.backgroundColor = question.color; 

        const containerAnswers = document.querySelectorAll('.quiz-answer-box');

        //shuffle the answers and show them
        let answersArray = [];
        question.answers.forEach(answer => {
            answersArray.push(answer);
        })

        answersArray.sort(comparador);

        answersArray.forEach(answer => {
            containerAnswers[containerAnswers.length-1].innerHTML +=   `<div class="quiz-answer">
                                                <img src=${answer.image} alt="">
                                                <div class="quiz-answer-text">
                                                    <p>${answer.text}</p>
                                                </div>
                                            </div>`;
        })
    })

    containerQuestions.innerHTML += `<button class="reset-quiz">Reiniciar Quiz</button>
                            <button class="back-home">Voltar pra home</button>`;
}

//showQuiz(itemTest);