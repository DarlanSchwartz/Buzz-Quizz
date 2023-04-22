axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
const quizzPostURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
const createQuizzWindow = document.querySelector(".create-quizz-window");

const createQuizzFirstStep = document.querySelector(".create-quizz-first-step");
const createQuizzSecondStep = document.querySelector(".create-quizz-second-step");
const createQuizzThirdStep = document.querySelector(".create-quizz-third-step");
const createQuizzFinishedWindow = document.querySelector(".create-quizz-fourth-step");
const quizzFeedWindow = document.querySelector(".quizzFeedWindow");



//função que apresenta pagina inicial com lista de quizzes do site:
listAllQuizzes();

// CÓDIGO DARLAN
// Variaveis de criação de um quizz

// Informações básicas
let quizzCreateTitle ='';
let quizzCreateMainImageURL = '';
let quizzCreateQuestionsAmount = 0;
let quizzCreateLevelsAmount = 0;

// Perguntas

// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateQuestionsAmount
// O objeto vai ser criado na função final de enviar o quizz 
let quizzCreateQuestions = [];

// Níveis
// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateLevelsAmount
// O objeto vai ser criado na função final de enviar o quizz 

let quizzCreateLevels = [];

let createdQuizz = null;

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
    quizzFeedWindow.classList.add('hidden');

    // Renderizar janela de informações básicas

    createQuizzFirstStep.innerHTML = 
        `
        <h1>Comece pelo começo</h1>
        <div class="basic-info-box">
            <input class = "quizz-title-input quizz-create-input" type="text" placeholder="Título do seu quizz">
            <input class = "quizz-imageURL-input quizz-create-input" type="text" placeholder="URL da imagem do seu quizz">
            <input class = "quizz-questions-amount-input quizz-create-input" type="text" placeholder="Quantidade de perguntas do quizz">
            <input class = "quizz-levels-amount-input quizz-create-input" type="text" placeholder="Quantidade de níveis do quizz">
        </div>
        <button onclick="tryToProceedToCreateQuestions()" class="proceed-create-questions-btn">Prosseguir para criar perguntas</button>
        `
    ;

    /*const test = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/" + 55);
    test.then(logData);*/
}

/*function logData(dataToLog)
{
    console.log(dataToLog.data.id);
}*/

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
        quizzCreateLevelsAmount = Number(quizzLevelsAmountInput);
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
}

function proceedToCreateQuestions()
{
     // Mostrar janela de criação de perguntas do quizz
     createQuizzSecondStep.classList.remove('hidden');
     createQuizzWindow.classList.remove('hidden');
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


    let hasAllCorrectAnswers = true;
    let hasAllCorrectAnswersImage = true;
    let hasAllCorrectColors = true;
    let hasAllAtLeastOneWrongAnwers = true;
    let hasAllAtLeastOneWrongAnwersImage = true;
    let hasAllTitlesLenghtCorrect = true;

    let i =0;
    quizzCreateQuestions.forEach(question =>{ 

        //#region  Checar se o título é não valido
        if(question.title.length <20)
        {
            hasAllTitlesLenghtCorrect = false;
            console.log("A pergunta número " + (i+1) +" não é valida, possui " + question.title.length + " caracteres");
        }
        else
        {
            console.log("A pergunta número " + (i+1) +" é valida, possui " + question.title.length + " caracteres");
        }
        //#endregion

        //#region  Checar se a cor é não valida
        if(!isValidColor(question.color))
        {
            console.log("A cor da pergunta " + (i+1) +" é valida!");
            hasAllCorrectColors = false;
        }
        else
        {
            console.log("A cor da pergunta " + (i+1) + " não é valida");
        }
        //#endregion
        
        //#region  Checar se a resposta correta não é valida
        if(question.answers[0].text == "")
        {
            console.log("A resposta correta da pergunta número " + (i+1)+ " não é valida");
            hasAllCorrectAnswers = false;
        }
        else
        {
            console.log("A resposta correta da pergunta número " + (i+1) + "é valida");
        }
        //#endregion
        
        //#region  Checar a imagem de resposta correta não é valida
        if(!isValidImageURL(question.answers[0].image))
        {
            hasAllCorrectAnswersImage = false;
            console.log("A url de imagem da pergunta número " + (i+1)+ " não é valida");
        }
        else
        {
            console.log("A url de imagem da pergunta número " + (i+1)+ " é valida");
        }
        //#endregion

        //#region  Checar se a resposta incorreta não é valida
        if(question.answers[1].text == "" && question.answers[2].text == "" && question.answers[3].text == "")
        {
            hasAllAtLeastOneWrongAnwers = false;

            if(question.answers[1].text == "")
            {
                console.log("A resposta incorreta da pergunta:" + (i+1) + "resposta incorreta 1 não é valida");
            }
            else if(question.answers[2].text == "")
            {
                console.log("A resposta incorreta da pergunta:" + (i+1) + "resposta incorreta 2 não é valida");
            }
            else if(question.answers[3].text == "")
            {
                console.log("A resposta incorreta da pergunta:" + (i+1) + "resposta incorreta 3 não é valida");
            }
        }
        //#endregion

        //#region  Checar se a imagem de resposta incorreta não é valida
        if(!isValidImageURL(question.answers[1].image) && !isValidImageURL(question.answers[2].image) && !isValidImageURL(question.answers[3].image))
        {
            hasAllAtLeastOneWrongAnwersImage = false;
        }
        //#endregion

        i++;
    });

    console.log("Tem a resposta certa em cada pergunta: " + hasAllCorrectAnswers);
    console.log("Tem todas as imagens corretas de cada pergunta: " + hasAllCorrectAnswersImage);
    console.log("Tem pelo menos uma resposta errada em cada pergunta: " + hasAllAtLeastOneWrongAnwers);
    console.log("Tem pelo menos uma imagem de resposta errada em cada pergunta: " + hasAllAtLeastOneWrongAnwersImage);
    console.log("Tem pelo todas as cores válidas: " + hasAllCorrectColors);
    console.log("Tem todos os titulos válidas: " + hasAllTitlesLenghtCorrect);

    if(hasAllCorrectAnswers && hasAllAtLeastOneWrongAnwers && hasAllCorrectAnswersImage && hasAllAtLeastOneWrongAnwersImage && hasAllTitlesLenghtCorrect && hasAllCorrectColors)
    {
        proceedToCreateLevels();
    }
}

function proceedToCreateLevels()
{
      // Mostrar janela de criação de niveis do quizz

      createQuizzThirdStep.classList.remove('hidden');
      createQuizzWindow.classList.remove('hidden');
      // Esconder outras janelas de criação de quizz
      createQuizzFirstStep.classList.add('hidden');  
      createQuizzSecondStep.classList.add('hidden');
      createQuizzFinishedWindow.classList.add('hidden');

      createQuizzThirdStep.innerHTML = 
      `
      <h1>Agora, decida os níveis</h1>
            <div class="levels-box level-open">
                <div class="create-quizz-subtitle">Nível 1</div>
                <ion-icon onclick="expandLevel(this)" class="hidden" name="create-outline"></ion-icon>
                <div class="input-level-box">
                    <input class ="input-level-title quizz-create-input" type="text" placeholder="Título do nível">
                    <input class ="input-level-percentage quizz-create-input"type="text" placeholder="% de acerto mínima">
                    <input class ="input-level-imageURL quizz-create-input"type="text" placeholder="URL da imagem do nível">
                    <textarea class ="input-level-description-area quizz-create-input"type="text" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
      `;

      for (let i = 0; i < quizzCreateLevelsAmount -1; i++) 
      {
        createQuizzThirdStep.innerHTML +=
        `
        <div class="levels-box level-closed">
                <div class="create-quizz-subtitle">Nível ${i+2}</div>
                <ion-icon onclick="expandLevel(this)" class="" name="create-outline"></ion-icon>
                <div class="input-level-box hidden">
                    <input class ="input-level-title quizz-create-input" type="text" placeholder="Título do nível">
                    <input class ="input-level-percentage quizz-create-input"type="text" placeholder="% de acerto mínima">
                    <input class ="input-level-imageURL quizz-create-input"type="text" placeholder="URL da imagem do nível">
                    <textarea class ="input-level-description-area quizz-create-input"type="text" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `;
      }


      createQuizzThirdStep.innerHTML +=`
      <button onclick= "tryToFinishQuizzCreation()"class="finish-quizz-creation-btn">Finalizar Quizz</button>
      `;
}

function expandLevel(level)
{
    level = level.parentNode;
    level.classList.remove('level-closed');
    level.classList.add('level-open');
    level.querySelector('.input-level-box').classList.remove('hidden');
    level.querySelector('ion-icon').classList.add('hidden');
}

function tryToFinishQuizzCreation()
{
    const allLevels = document.querySelectorAll('.input-level-box');

    quizzCreateLevels = [];

    allLevels.forEach( level =>{

        let levelTitle = level.querySelector('.input-level-title').value;
        let levelPercentage = Number(level.querySelector('.input-level-percentage').value);
        let levelImageURL = level.querySelector('.input-level-imageURL').value;
        let levelDescription = level.querySelector('.input-level-description-area').value;
       
        quizzCreateLevels.push(
            {
                title: levelTitle,
                image: levelImageURL,
                text: levelDescription,
                minValue: levelPercentage
            }
        );
    });

    let i  = 1;
    let hasAllLevelsTitleValid = true;
    let hasAllLevelsPercentageValid = true;
    let hasAllLevelsImageURLValid = true;
    let hasAllLevelsDescriptionValid = true;
    quizzCreateLevels.forEach(level =>{

        if(level.title.length <10)
        {
            console.log("O título do nível " + i + " não é válido, ele possui " + level.title.length + " caracteres!");
            hasAllLevelsTitleValid = false;
        }
        else
        {
            console.log("O título do nível " + i + "é válido");
        }

        if(level.minValue < 0 || level.minValue > 100)
        {
            console.log("A porcentagem de acerto mínima do nível " + i + " não é válida, digite um número de 0 a 100!");
            hasAllLevelsPercentageValid = false;
        }
        else
        {
            console.log("A porcentagem de acerto mínima do nível " + i + " é válida");
        }

        if(!isValidImageURL(level.image))
        {
            console.log("A url de imagem do nível " + i + " é inválida");
            hasAllLevelsImageURLValid = false;
        }
        else
        {
            console.log("A url de imagem do nível " + i + " é válida");
        }

        if(level.text.length < 30)
        {
            console.log("A descrição do nível " + i + " não é válida, ela possui " + level.text.length + " caracteres!");
            hasAllLevelsDescriptionValid = false;
        }
        else
        {
            console.log("A descrição do nível " + i + "é válida");
        }

        i++;

        
    });

    // Verificar se todos níveis estão OK
    if(hasAllLevelsTitleValid && hasAllLevelsPercentageValid && hasAllLevelsImageURLValid && hasAllLevelsDescriptionValid)
    {
        createdQuizz = 
        {
            title: quizzCreateTitle,
            image: quizzCreateMainImageURL,
            questions: quizzCreateQuestions,
            levels: quizzCreateLevels
        }
        console.log(createdQuizz);
        const creationTry = axios.post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes", createdQuizz);
        console.log(creationTry);
        creationTry.then(finishQuizzCreation);
        creationTry.catch(alert);
    }
}

function hideQuizzCreationWindow(returnToMain)
{
    // Esconder outras janelas de criação de quizz
    createQuizzWindow.classList.add('hidden');
    createQuizzFirstStep.classList.add('hidden');  
    createQuizzSecondStep.classList.add('hidden');
    createQuizzThirdStep.classList.add('hidden');
    createQuizzFinishedWindow.classList.add('hidden');

    createQuizzSecondStep.innerHTML = '';
    createQuizzThirdStep.innerHTML = '';
    createQuizzFinishedWindow.innerHTML = '';
    quizzCreateTitle ='';
    quizzCreateMainImageURL = '';
    quizzCreateQuestionsAmount = 0;
    quizzCreateLevelsAmount = 0;
    createdQuizz = null;

    if(returnToMain == true)
    {
        quizzFeedWindow.classList.remove('hidden');
    }
}

function finishedQuizzCreationAcessQuizz()
{
    if(createdQuizz !=null)
    {
        showQuiz(createdQuizz);
    }
}

function finishQuizzCreation(quizzServerResponse)
{
    // Mostrar janela de criação de niveis do quizz
    createQuizzWindow.classList.remove('hidden');
    createQuizzFinishedWindow.classList.remove('hidden');
    // Esconder outras janelas de criação de quizz
    createQuizzFirstStep.classList.add('hidden');  
    createQuizzSecondStep.classList.add('hidden');
    createQuizzThirdStep.classList.add('hidden');
    
    createQuizzFinishedWindow.innerHTML =
    `
        <h1>Seu quizz está pronto!</h1>
        <div class="final-quizz-image-box">
            <div class="image-overlay-box">
                <img class="finalize-creation-quizz-image" src="${quizzCreateMainImageURL}" alt="">
                <div class="image-overlay-gradient"></div>
            </div>
            <div class="finalize-creation-quizz-title">${quizzCreateTitle}</div>
        </div>
        <button onclick ="finishedQuizzCreationAcessQuizz()" class="finalize-creation-quizz-acess-btn">Acessar Quizz</button>
        <button onclick="hideQuizzCreationWindow(true)" class="finalize-creation-quizz-return-btn">Voltar pra home</button>
    `;

    let idObject = { id: quizzServerResponse.data.id};

    if(localStorage.getItem('ids') !=undefined)
    {
        const localStorageIds = JSON.parse(localStorage.getItem('ids'));
        localStorageIds.push(idObject)
        localStorage.setItem("ids",JSON.stringify(localStorageIds));
    }
    else
    {
        let ids = [];
        ids.push(idObject);
        localStorage.setItem("ids",JSON.stringify(ids));
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


// CÓDIGO BRENDO
// Listar todos os quizzes

let allQuizzes = [];

function renderAllQuizzes(){

    const elementUL = document.querySelector('.container-quizzes');
    elementUL.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        let quizzToRender = allQuizzes[i];
        
        elementUL.innerHTML += `
        <li id="${quizzToRender.id}" onclick="showQuiz" class="quizz-area">
            <div class="image-inside-box">
                <img class="finalize-creation-quizz-image" src="${quizzToRender.image}" alt="">
                    <div class="image-inside-gradient"></div>
                    <p>${quizzToRender.title}</p>
            </div>
        </li>
        `;
    };
}


function successSearchingQuizzes(response){
    console.log(response.data);
    allQuizzes = response.data;

    renderAllQuizzes();
}
function errorSearchingQuizzes(error){
    console.log(error);
}

function listAllQuizzes(){

    // Mostrar janela com lista de todos os quizzes fornecidos pelo site
    const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes')
    promisse.then(successSearchingQuizzes);
    promisse.catch(errorSearchingQuizzes);
}