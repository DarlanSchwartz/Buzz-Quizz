axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';

const quizzFeedWindow = document.querySelector(".list-All-Quizzes-Window");
const userQuizzesContainer = document.querySelector(".user-quizzes-items");
const loadingWindow = document.querySelector(".loading-window");
//loading-window
//função que apresenta pagina inicial com lista de quizzes do site:
listAllQuizzes();

// CÓDIGO DARLAN
// Variaveis de criação de um quizz

// Informações básicas
let quizzCreateTitle ='';
let quizzCreateMainImageURL = '';
let quizzCreateQuestionsAmount = 0;
let quizzCreateLevelsAmount = 0;
let editingQuizz = null;
const quizzPostURL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";
const createQuizzWindow = document.querySelector(".create-quizz-window");
let quizzIdToDelete;

const createQuizzFirstStep = document.querySelector(".create-quizz-first-step");
const createQuizzSecondStep = document.querySelector(".create-quizz-second-step");
const createQuizzThirdStep = document.querySelector(".create-quizz-third-step");
const createQuizzFinishedWindow = document.querySelector(".create-quizz-fourth-step");
// Perguntas
// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateQuestionsAmount
// O objeto vai ser criado na função final de enviar o quizz 
let quizzCreateQuestions = [];
// Níveis
// Essa array vai ser populada com uma quantidade de objetos igual tamanho da var quizzCreateLevelsAmount
// O objeto vai ser criado na função final de enviar o quizz 
let quizzCreateLevels = [];
// Objeto que vai ser enviado ao servidor na criação
let createdQuizz = null;
// Objeto recebido pelo servidor que ira ser usado para abrir o quiz no final da criação
let createdQuizzServerResponse = null;


function startEditingQuizz(quizzElement)
{
    let quizzID = quizzElement.parentNode.parentNode.getAttribute('id');
    const quizzPromise = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/"+ quizzID);
    quizzPromise.then(startCreatingQuizzWithLoading);
    quizzPromise.catch(alert);
}


function startCreatingQuizzWithLoading(quizzToEditOut)
{
    loadingWindow.classList.remove('hidden');
    quizzFeedWindow.classList.add('hidden');
    setTimeout(() => {
        startCreatingQuizz(quizzToEditOut);
    }, 1000);
}

// Função que inicia a criação de quizz escondendo as outras janelas e mostrando apenas a tela de criação de quiz inicial
function startCreatingQuizz(quizzToEdit)
{
    // Mostrar janela de quizz e janela inicial de criação quizz
    createQuizzWindow.classList.remove('hidden');
    createQuizzFirstStep.classList.remove('hidden');

    // Esconder outras janelas de criação de quizz
    createQuizzSecondStep.classList.add('hidden');
    createQuizzThirdStep.classList.add('hidden');
    createQuizzFinishedWindow.classList.add('hidden');
    quizzFeedWindow.classList.add('hidden');
    loadingWindow.classList.add('hidden');
    
    // Renderizar janela de informações básicas

    createQuizzFirstStep.innerHTML = 
    `
    <h1 class="non-selectable" >Comece pelo começo</h1>
    <div class="basic-info-box">
        <input data-test="title-input" class = "quizz-title-input quizz-create-input" type="text" placeholder="Título do seu quizz">
        <input data-test="img-input" class = "quizz-imageURL-input quizz-create-input" type="text" placeholder="URL da imagem do seu quizz">
        <input data-test="questions-amount-input" class = "quizz-questions-amount-input quizz-create-input" type="number" placeholder="Quantidade de perguntas do quizz">
        <input data-test="levels-amount-input" class = "quizz-levels-amount-input quizz-create-input" type="number" placeholder="Quantidade de níveis do quizz">
    </div>
    <button data-test="go-create-questions" onclick="tryToProceedToCreateQuestions()" class="proceed-create-questions-btn">Prosseguir para criar perguntas</button>
    `;

    if(quizzToEdit != null)
    {
        document.querySelector(".basic-info-box").querySelector('.quizz-title-input').value = quizzToEdit.data.title;
        document.querySelector(".basic-info-box").querySelector('.quizz-imageURL-input').value = quizzToEdit.data.image;
        document.querySelector(".basic-info-box").querySelector('.quizz-questions-amount-input').value = quizzToEdit.data.questions.length;
        document.querySelector(".basic-info-box").querySelector('.quizz-levels-amount-input').value = quizzToEdit.data.levels.length;
        editingQuizz = quizzToEdit;
    }
}

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
     <h1 class="non-selectable">Crie suas perguntas</h1>
            <div data-test="question-ctn" class="question-box question-open">
                <div class="create-quizz-subtitle">Pergunta 1</div>
                <div class="question-fields">
                    <div class="question">
                        <input data-test="question-input" class="input-question-text quizz-create-input" type="text" placeholder="Texto da pergunta">
                        <input data-test="question-color-input" class ="input-question-color quizz-create-input"type="text" placeholder="Cor de fundo da pergunta">
                    </div>
                    <div class="create-quizz-subtitle">Resposta correta</div>
                    <div class="correct-answer">
                        <input  data-test="correct-answer-input" class ="input-question-answer-text quizz-create-input"type="text" placeholder="Resposta correta">
                        <input  data-test="correct-img-input" class ="input-question-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem">
                    </div>
                    <div class="create-quizz-subtitle">Respostas Incorretas</div>
                    <div class="input-wrong-questions-box1">
                        <input data-test="wrong-answer-input" class ="input-wrong-question1-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 1">
                        <input data-test="wrong-img-input" class ="input-wrong-question1-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 1">
                    </div>
                    <div class="input-wrong-questions-box2">
                        <input data-test="wrong-answer-input" class ="input-wrong-question2-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 2">
                        <input data-test="wrong-img-input" class ="input-wrong-question2-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="input-wrong-questions-box3">
                        <input data-test="wrong-answer-input" class ="input-wrong-question3-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 3">
                        <input data-test="wrong-img-input" class ="input-wrong-question3-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
                <ion-icon data-test="toggle" onclick="expandQuestion(this)" class="hidden" name="create-outline"></ion-icon>
            </div>
     `

     for (let i = 0; i < quizzCreateQuestionsAmount -1; i++) 
     {
        createQuizzSecondStep.innerHTML +=
        `
        <div data-test="question-ctn" class="question-box question-closed">
            <div class="create-quizz-subtitle">Pergunta ${i+2}</div>
            <div class="question-fields hidden">
                <div class="question">
                    <input data-test="question-input" class="input-question-text quizz-create-input" type="text" placeholder="Texto da pergunta">
                    <input data-test="question-color-input" class ="input-question-color quizz-create-input"type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <div class="create-quizz-subtitle">Resposta correta</div>
                <div class="correct-answer">
                    <input  data-test="correct-answer-input" class ="input-question-answer-text quizz-create-input"type="text" placeholder="Resposta correta">
                    <input data-test="correct-img-input" class ="input-question-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem">
                </div>
                <div class="create-quizz-subtitle">Respostas Incorretas</div>
                <div class="input-wrong-questions-box1">
                    <input data-test="wrong-answer-input" class ="input-wrong-question1-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 1">
                    <input data-test="wrong-img-input" class ="input-wrong-question1-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 1">
                </div>
                <div class="input-wrong-questions-box2">
                    <input data-test="wrong-answer-input" class ="input-wrong-question2-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 2">
                    <input data-test="wrong-img-input" class ="input-wrong-question2-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 2">
                </div>
                <div class="input-wrong-questions-box3">
                    <input data-test="wrong-answer-input" class ="input-wrong-question3-answer-text quizz-create-input"type="text" placeholder="Resposta incorreta 3">
                    <input data-test="wrong-img-input" class ="input-wrong-question3-answer-imageURL quizz-create-input"type="text" placeholder="URL da imagem 3">
                </div>
            </div>
            <ion-icon data-test="toggle" onclick="expandQuestion(this)" class="" name="create-outline"></ion-icon>
        </div>
        `
     }

     createQuizzSecondStep.innerHTML +=`<button data-test="go-create-levels" onclick="tryToProceedToCreateLevels()" class="proceed-create-levels-btn">Prosseguir para criar níveis</button>`;

     if(editingQuizz != null)
     {
        // pegar os valores do quizz que esta sendo editado e colocar nas caixas
        const allQuestions = document.querySelectorAll(".question-box");

        for (let index = 0; index < editingQuizz.data.questions.length; index++) {
            const questionFound = allQuestions[index];
            questionFound.querySelector(".question-fields").querySelector(".question").querySelector(".input-question-text").value = editingQuizz.data.questions[index].title == undefined ? "" :  editingQuizz.data.questions[index].title;
            questionFound.querySelector(".question-fields").querySelector(".question").querySelector(".input-question-color").value = editingQuizz.data.questions[index].color == undefined ? "" :  editingQuizz.data.questions[index].color;
            questionFound.querySelector(".question-fields").querySelector(".correct-answer").querySelector(".input-question-answer-text").value = editingQuizz.data.questions[index].answers[0].text  == undefined ? "" : editingQuizz.data.questions[index].answers[0].text;
            questionFound.querySelector(".question-fields").querySelector(".correct-answer").querySelector(".input-question-answer-imageURL").value = editingQuizz.data.questions[index].answers[0].image  == undefined ? "" : editingQuizz.data.questions[index].answers[0].image;
            if(editingQuizz.data.questions[index] !=undefined)
            {
                if(editingQuizz.data.questions[index].answers[1] !=undefined)
                {
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box1").querySelector(".input-wrong-question1-answer-text").value = editingQuizz.data.questions[index].answers[1].text  == undefined ? "" : editingQuizz.data.questions[index].answers[1].text;
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box1").querySelector(".input-wrong-question1-answer-imageURL").value = editingQuizz.data.questions[index].answers[1].image  == undefined ? "" : editingQuizz.data.questions[index].answers[1].image;
                }
                if(editingQuizz.data.questions[index].answers[2] !=undefined)
                {
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box2").querySelector(".input-wrong-question2-answer-text").value = editingQuizz.data.questions[index].answers[2].text  == undefined ? "" :  editingQuizz.data.questions[index].answers[2].text;
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box2").querySelector(".input-wrong-question2-answer-imageURL").value = editingQuizz.data.questions[index].answers[2].image  == undefined ? "" : editingQuizz.data.questions[index].answers[2].image;
                }
                if(editingQuizz.data.questions[index].answers[3] !=undefined)
                {
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box3").querySelector(".input-wrong-question3-answer-text").value = editingQuizz.data.questions[index].answers[3].text  == undefined ? "" : editingQuizz.data.questions[index].answers[3].text;
                    questionFound.querySelector(".question-fields").querySelector(".input-wrong-questions-box3").querySelector(".input-wrong-question3-answer-imageURL").value = editingQuizz.data.questions[index].answers[3].image  == undefined ? "" : editingQuizz.data.questions[index].answers[3].image;
                }
            }
        }
     }

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

        let answerObjects = [];

        answerObjects.push({text: questionCorrectAnswerText,
            image: questionCorrectAnswerImageURL,
            isCorrectAnswer: true});
       

        if(questionWrongAnswerText1 !=""&& questionWrongAnswerImageURL1 !="")
        {
            answerObjects.push({text: questionWrongAnswerText1,
                image: questionWrongAnswerImageURL1,
                isCorrectAnswer: false});
        }
        if(questionWrongAnswerText2 !=""&& questionWrongAnswerImageURL2 !="")
        {
            answerObjects.push({text: questionWrongAnswerText2,
                image: questionWrongAnswerImageURL2,
                isCorrectAnswer: false});
        }
        if(questionWrongAnswerText3 !=""&& questionWrongAnswerImageURL3 !="")
        {
            answerObjects.push({text: questionWrongAnswerText3,
                image: questionWrongAnswerImageURL3,
                isCorrectAnswer: false});
        }


        quizzCreateQuestions.push(
        {
            title: questionTitle,
            color: questionColor,
            answers: answerObjects
        }
        );
    });

    let hasAllCorrectAnswers = true;
    let hasAllCorrectAnswersImage = true;
    let hasAllCorrectColors = true;
    let hasAllAtLeastOneWrongAnwers = true;
    let hasAllAtLeastOneWrongAnwersImage = true;
    let hasAllTitlesLenghtCorrect = true;
    let hasAllWrongAnswers = true;
    let hasAllWrongAnswersImage = true;

    let alertText = "";

    let i =0;
    quizzCreateQuestions.forEach(question =>{ 

        //#region  Checar se o título é não valido
        if(question.title.length <20)
        {
            hasAllTitlesLenghtCorrect = false;
            //console.log("A pergunta número " + (i+1) +" não é valida, possui " + question.title.length + " caracteres");
            alertText+= "A pergunta número " + (i+1) +" não é valida, possui " + question.title.length + " caracteres\n" ;
        }
        else
        {
            //console.log("A pergunta número " + (i+1) +" é valida, possui " + question.title.length + " caracteres");
        }
        //#endregion

        //#region  Checar se a cor é não valida
        if(!isValidColor(question.color))
        {
            //console.log("A cor da pergunta " + (i+1) +" não é valida!");
            alertText+= "A cor da pergunta " + (i+1) + " não é valida\n";
            hasAllCorrectColors = false;
        }
        else
        {
            //console.log("A cor da pergunta " + (i+1) + " é valida");
        }
        //#endregion
        
        //#region  Checar se a resposta correta não é valida
        if(question.answers[0].text == "")
        {
            //console.log("A resposta correta da pergunta número " + (i+1)+ " não é valida");
            alertText+= "A resposta correta da pergunta número " + (i+1)+ " não é valida\n";
            hasAllCorrectAnswers = false;
        }
        else
        {
            //console.log("A resposta correta da pergunta número " + (i+1) + "é valida");
        }
        //#endregion
        
        //#region  Checar a imagem de resposta correta não é valida
        if(!isValidImageURL(question.answers[0].image))
        {
            hasAllCorrectAnswersImage = false;
            //console.log("A url de imagem da pergunta número " + (i+1)+ " não é valida");
            alertText+= "A url de imagem da resposta correta da pergunta número " + (i+1)+ " não é valida\n";
        }
        else
        {
            //console.log("A url de imagem da pergunta número " + (i+1)+ " é valida");
        }
        //#endregion

        /*if(question.answers[1].text == "" && question.answers[2].text == "" && question.answers[3].text == "")
        {
            hasAllWrongAnswers = false;
            alertText+= "Todas as respostas erradas da pergunta número " + (i+1)+ " não são válidas\n";
        }

        
        if(!isValidImageURL(question.answers[1].image) && !isValidImageURL(question.answers[2].image) && !isValidImageURL(question.answers[3].image))
        {
            hasAllWrongAnswersImage = false;
            alertText+= "Todas as imagens de respostas erradas da pergunta número " + (i+1)+ " não são válidas\n";
        }*/


        //#region  Checar se a resposta incorreta não é valida
        if(question.answers[1] == null && question.answers[2] == null && question.answers[3] == null)
        {
            hasAllAtLeastOneWrongAnwers = false;

            alertText+="Você precisa de pelo menos uma resposta errada em cada pergunta!";
        }
        //#endregion

        if(question.answers[1] !=null && !isValidImageURL(question.answers[1].image))
        {
            alertText+= "A url da imagem da pergunta " + (i+1) + "resposta incorreta 1 é invalida";
        }

        if(question.answers[2] !=null && !isValidImageURL(question.answers[2].image))
        {
            alertText+= "A url da imagem da pergunta " + (i+1) + "resposta incorreta 2 é invalida";
        }

        
        if(question.answers[3] !=null && !isValidImageURL(question.answers[3].image))
        {
            alertText+= "A url da imagem da pergunta " + (i+1) + "resposta incorreta 3 é invalida ";
        }

        //#region  Checar se a imagem de resposta incorreta não é valida
        /*if(!isValidImageURL(question.answers[1].image) && !isValidImageURL(question.answers[2].image) && !isValidImageURL(question.answers[3].image))
        {
            hasAllAtLeastOneWrongAnwersImage = false;
        }*/

        if(hasAllAtLeastOneWrongAnwers)
        {
            if((question.answers[1] == null || (question.answers[1] != null && !isValidImageURL(question.answers[1].image))) && (question.answers[2] == null || (question.answers[2] != null && !isValidImageURL(question.answers[2].image))) && (question.answers[3] == null || (question.answers[3] != null && !isValidImageURL(question.answers[3].image))))
            {
                hasAllAtLeastOneWrongAnwersImage = false;
            }
        }

        //#endregion

        i++;
    });

    if(alertText !="")
    {
        alert(alertText);
    }

    // Servidor não ta deixando enviar quizzes com só respostas em cada pergunta

    if(hasAllCorrectAnswers && hasAllAtLeastOneWrongAnwers && hasAllCorrectAnswersImage && hasAllAtLeastOneWrongAnwersImage && hasAllTitlesLenghtCorrect && hasAllCorrectColors)
    {
        proceedToCreateLevels();
    }

    /*if(hasAllCorrectAnswers && hasAllAtLeastOneWrongAnwers && hasAllCorrectAnswersImage && hasAllAtLeastOneWrongAnwersImage && hasAllTitlesLenghtCorrect && hasAllCorrectColors)
    {
        proceedToCreateLevels();
    }*/
}

function proceedToCreateLevels()
{
      // Mostrar janela de criação de niveis do quizz

      createQuizzThirdStep.classList.remove('hidden');
      createQuizzWindow.classList.remove('hidden');
      quizzFeedWindow.classList.add('hidden');

      // Esconder outras janelas de criação de quizz
      createQuizzFirstStep.classList.add('hidden');  
      createQuizzSecondStep.classList.add('hidden');
      createQuizzFinishedWindow.classList.add('hidden');

      createQuizzThirdStep.innerHTML = 
      `
      <h1>Agora, decida os níveis</h1>
            <div data-test="level-ctn" class="levels-box level-open">
                <div class="create-quizz-subtitle">Nível 1</div>
                <ion-icon data-test="toggle" onclick="expandLevel(this)" class="hidden" name="create-outline"></ion-icon>
                <div class="input-level-box">
                    <input data-test="level-input" class ="input-level-title quizz-create-input" type="text" placeholder="Título do nível">
                    <input data-test="level-percent-input" class ="input-level-percentage quizz-create-input"type="number" placeholder="% de acerto mínima">
                    <input data-test="level-img-input" class ="input-level-imageURL quizz-create-input"type="text" placeholder="URL da imagem do nível">
                    <textarea data-test="level-description-input" class ="input-level-description-area quizz-create-input"type="text" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
      `;

      for (let i = 0; i < quizzCreateLevelsAmount -1; i++) 
      {
        createQuizzThirdStep.innerHTML +=
        `
        <div data-test="level-ctn" class="levels-box level-closed">
                <div class="create-quizz-subtitle">Nível ${i+2}</div>
                <ion-icon data-test="toggle" onclick="expandLevel(this)" class="" name="create-outline"></ion-icon>
                <div class="input-level-box hidden">
                    <input data-test="level-input" class ="input-level-title quizz-create-input" type="text" placeholder="Título do nível">
                    <input data-test="level-percent-input" class ="input-level-percentage quizz-create-input"type="number" placeholder="% de acerto mínima">
                    <input data-test="level-img-input" class ="input-level-imageURL quizz-create-input"type="text" placeholder="URL da imagem do nível">
                    <textarea data-test="level-description-input" class ="input-level-description-area quizz-create-input"type="text" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `;
      }


      createQuizzThirdStep.innerHTML +=`
      <button data-test="finish" onclick= "tryToFinishQuizzCreation()"class="finish-quizz-creation-btn">Finalizar Quizz</button>
      `;

      if(editingQuizz != null)
     {
        // pegar os valores do quizz que esta sendo editado e colocar nas caixas
        const allLevels = document.querySelectorAll(".levels-box");

        for (let index = 0; index < editingQuizz.data.levels.length; index++) {
            const levelFound = allLevels[index];
            levelFound.querySelector(".input-level-box").querySelector(".input-level-title").value = editingQuizz.data.levels[index].title == undefined ? "" :  editingQuizz.data.levels[index].title;
            levelFound.querySelector(".input-level-box").querySelector(".input-level-percentage").value = editingQuizz.data.levels[index].minValue  == undefined ? "" :  editingQuizz.data.levels[index].minValue;
            levelFound.querySelector(".input-level-box").querySelector(".input-level-imageURL").value = editingQuizz.data.levels[index].image  == undefined ? "" : editingQuizz.data.levels[index].image;
            levelFound.querySelector(".input-level-box").querySelector(".input-level-description-area").value = editingQuizz.data.levels[index].text  == undefined ? "" : editingQuizz.data.levels[index].text;
        }
     }
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
    let hasAtLeastOneFullErrorQuiz = false;
    let alertText = "";
    quizzCreateLevels.forEach(level =>{

        if(level.title.length <10)
        {
           // console.log("O título do nível " + i + " não é válido, ele possui " + level.title.length + " caracteres!");
            alertText+= "O título do nível " + i + " não é válido, ele possui " + level.title.length + " caracteres!\n";
            hasAllLevelsTitleValid = false;
        }
        else
        {
            //console.log("O título do nível " + i + "é válido");
        }

        if(level.minValue < 0 || level.minValue > 100)
        {
            //console.log("A porcentagem de acerto mínima do nível " + i + " não é válida, digite um número de 0 a 100!");
            alertText+= "A porcentagem de acerto mínima do nível " + i + " não é válida, digite um número de 0 a 100!\n";
            hasAllLevelsPercentageValid = false;
        }
        else
        {
            //console.log("A porcentagem de acerto mínima do nível " + i + " é válida");
        }

        if(!isValidImageURL(level.image))
        {
            //console.log("A url de imagem do nível " + i + " é inválida");
            alertText+="A url de imagem do nível " + i + " é inválida\n";
            hasAllLevelsImageURLValid = false;
        }
        else
        {
            //console.log("A url de imagem do nível " + i + " é válida");
        }

        if(level.text.length < 30)
        {
           // console.log("A descrição do nível " + i + " não é válida, ela possui " + level.text.length + " caracteres!");
            alertText+= "A descrição do nível " + i + " não é válida, ela possui " + level.text.length + " caracteres!\n";
            hasAllLevelsDescriptionValid = false;
        }
        else
        {
            //console.log("A descrição do nível " + i + "é válida");
        }

        if(level.minValue == 0)
        {
            hasAtLeastOneFullErrorQuiz = true;
        }

        i++;
    });

    if(!hasAtLeastOneFullErrorQuiz)
    {
        alertText+= "Pelo menos um nível do quizz deve ter a porcentagem de acerto com o valor 0";
    }

    if(alertText!="")
    {
        alert(alertText);
    }

    // Verificar se todos níveis estão OK
    if(hasAtLeastOneFullErrorQuiz &&  hasAllLevelsTitleValid && hasAllLevelsPercentageValid && hasAllLevelsImageURLValid && hasAllLevelsDescriptionValid)
    {
        createdQuizz = 
        {
            title: quizzCreateTitle,
            image: quizzCreateMainImageURL,
            questions: quizzCreateQuestions,
            levels: quizzCreateLevels
        }

        //console.log(createdQuizz);

        const creationTry = axios.post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes", createdQuizz);
        //console.log(creationTry);
        loadingWindow.classList.remove('hidden');
        createQuizzWindow.classList.add('hidden');
        creationTry.then(finishQuizzCreation);
        creationTry.catch(errorCreatingQuizz);
    }
}

function errorCreatingQuizz(error)
{
    alert(error);
    window.location.reload();
}


function hideQuizzCreationWindow(reloadMainAfterCreation)
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

    if(reloadMainAfterCreation == true)
    {
        window.location.reload();
    }
}

function acessQuizzAfterCreation()
{
    editingQuizz =null;
    loadingWindow.classList.remove('hidden');
    hideQuizzCreationWindow(false);
    setTimeout(() => {
        showQuiz(createdQuizzServerResponse);
    }, 1000);
}

function finishQuizzCreation(quizzServerResponse)
{
    // Mostrar janela de criação de niveis do quizz
    loadingWindow.classList.add('hidden');
    createQuizzWindow.classList.remove('hidden');
    createQuizzFinishedWindow.classList.remove('hidden');
    // Esconder outras janelas de criação de quizz
    createQuizzFirstStep.classList.add('hidden');  
    createQuizzSecondStep.classList.add('hidden');
    createQuizzThirdStep.classList.add('hidden');
    
    createQuizzFinishedWindow.innerHTML =
    `
        <h1>Seu quizz está pronto!</h1>
        <div class="final-quizz-image-box" data-test="success-banner">
            <div onclick="acessQuizzAfterCreation()" class="image-overlay-box">
                <img class="finalize-creation-quizz-image" src="${quizzCreateMainImageURL}" alt="">
                <div class="image-overlay-gradient"></div>
            </div>
            <div class="finalize-creation-quizz-title">${quizzCreateTitle}</div>
        </div>
        <button data-test="go-quiz" onclick="acessQuizzAfterCreation()" class="finalize-creation-quizz-acess-btn">Acessar Quizz</button>
        <button data-test="go-home" onclick="hideQuizzCreationWindow(true)" class="finalize-creation-quizz-return-btn">Voltar pra home</button>
    `;

    if(editingQuizz !=null)
    {
        deleteQuizz(editingQuizz.data.id, true);
        editingQuizz =null;
    }

    let objectTosave = { 
        id: quizzServerResponse.data.id,
        key: quizzServerResponse.data.key
    };

    if(localStorage.getItem('ids') !=undefined)
    {
        const localStorageIds = JSON.parse(localStorage.getItem('ids'));
        localStorageIds.push(objectTosave)
        localStorage.setItem("ids",JSON.stringify(localStorageIds));
    }
    else
    {
        let ids = [];
        ids.push(objectTosave);
        localStorage.setItem("ids",JSON.stringify(ids));
    }

    createdQuizzServerResponse = quizzServerResponse; 
}

function deleteQuizz(idToDelete, afterEditing)
{
    if(!afterEditing)
    {
        idToDelete = idToDelete.parentNode.parentNode.getAttribute('id');
    }
    
    if(localStorage.getItem('ids') !=undefined)
    {
        const localStorageIds = JSON.parse(localStorage.getItem('ids'));
        const newIds = [];

        let quizzToDeleteKey;

        localStorageIds.forEach( savedQuizz =>{
            if(savedQuizz.id == idToDelete)
            {
                quizzToDeleteKey = savedQuizz.key;
            }
            else
            {
                newIds.push(savedQuizz);
            }
        });

        if(newIds.length == 0)
        {
            localStorage.removeItem('ids');
        }
        else
        {
            localStorage.setItem('ids',JSON.stringify(newIds));
        }
        
        const deleteObjectHeader =
        { 
            headers: {"Secret-Key":quizzToDeleteKey.toString()}
        };

        const deletePromise =  axios.delete("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/" + idToDelete, deleteObjectHeader);
       if(!afterEditing || (!afterEditing && quizzToDeleteKey !=null))
       {
            deletePromise.then(()=>{window.location.reload();
                quizzIdToDelete = null;});
       }

       deletePromise.catch(()=>{alert("Algo deu errado ao deletar o quizz");});
    }
}

// CÓDIGO AUGUSTO
//promise to test code

let currentQuizz;

//to shuffle
function comparador(){ 
    return Math.random() - 0.5; 
}

function scrollPage(whereTo){
    whereTo.scrollIntoView({behavior: "smooth"});
}

function resetQuiz(){
    //first get item test -> connect to server?
    showQuiz(currentQuizz); //start again

    //scroll to top of the page, not quiz title
    scrollTo(0,0);
}

function returnHome(){
    //clean show-quiz
    const container = document.querySelector('.container-show-quiz');
    container.innerHTML = '';

    //remove hidden from tela1
    
    loadingWindow.classList.remove('hidden');
    listAllQuizzes();
    setTimeout(() => {
        let home = document.querySelector('.list-All-Quizzes-Window');
        loadingWindow.classList.add('hidden');
        home.classList.remove('hidden');
    }, 1000);

    scrollPage(document.querySelector('.container'));
}

function finishQuiz(quizz){
    let item = quizz.data;

    const containerFinishing = document.querySelector('.quiz-finishing-box');
    //get total questionś
    //get how many right answers -> box that has answer-selected-correct and answer-selected
    let questionNumber = document.querySelectorAll('.quiz-question-box').length;
    let rightAnswers = document.querySelectorAll('.answer-selected-correct.answer-selected').length;

    let percentage = rightAnswers / questionNumber;
    let score = Math.round(percentage*100);
    
    //get the level
    let levels = item.levels;
    let currentLevel;

    levels.forEach(level => {
        if(score >= level.minValue){
            currentLevel = level;
        }
    })

    //finishing quiz
    containerFinishing.classList.remove('hidden');
    containerFinishing.innerHTML += `
                <div class="quiz-finishing-header" data-test="level-title">
                    <p>${score}% de acerto: ${currentLevel.title}</p>
                </div>
                <div class="quiz-finishing-content">
                    <img src=${currentLevel.image} alt="" data-test="level-img">
                    <div class="quiz-finishing-content-text" data-test="level-text">
                        <p>${currentLevel.text}</p>
                    </div>
                </div>`    
}

function selectAnswer(thisAnswer){
    //when selected, remove onclick from all the answers and apply the classes
    //answer clicked img stays the same, all the others fade
    //right answer one color, all the other ones another -> check class true or false
    const answersNode = thisAnswer.parentNode;
    let answers = answersNode.children;

    for (const answer of answers) {
        answer.removeAttribute('onclick');
        answer.classList.remove('pointer');

        if(answer.classList.contains(true)){
            answer.classList.add('answer-selected-correct');
        } else {
            answer.classList.add('answer-selected-incorrect');
        }

        if(answer !== thisAnswer){
            answer.classList.add('answer-not-selected');
        } else {
            answer.classList.add('answer-selected');
        }
    }

    //get the next question and scroll to it
    const questionNode = answersNode.parentNode;
    let thisId = questionNode.id;
    let nextId = Number(thisId)+1;

    let questions = document.querySelectorAll('.quiz-question-box');
    const questionsArr = Array.from(questions);
    let nextQuestion = questionsArr.filter(question => question.id==nextId)[0];

    let questionsSelected = document.querySelectorAll('.answer-selected');
    
    if(nextQuestion !== undefined){
        setTimeout(scrollPage, 2000, nextQuestion);
    } 
    
    if(questions.length === questionsSelected.length){ //next question undefined === finished
        finishQuiz(currentQuizz);
        let finishing = document.querySelector('.quiz-finishing-box');
        setTimeout(scrollPage, 2000, finishing);
    }
}

function showQuiz(quizz){ //pass object as an argument => object===quizz
    currentQuizz = quizz;
    hideQuizzCreationWindow(false);
    hideFedd();
    loadingWindow.classList.add('hidden');
    let item = quizz.data;

    //select the main container and show the title and image
    const container = document.querySelector('.container-show-quiz');

    container.innerHTML =   `<div class="quiz-title" data-test="banner">
                                <p>${item.title}</p>
                                <img src="${item.image}">
                            </div>
                            <div class="container-quiz-questions"></div>
                            `;

    //get container for questions and show them
    const containerQuestions = document.querySelector('.container-quiz-questions');

    //count to get the id for the question
    let count = 0;

    item.questions.forEach(question => {
        containerQuestions.innerHTML += `<div class="quiz-question-box" id=${count} data-test="question">
                                            <div class="quiz-question" data-test="question-title">
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
            containerAnswers[containerAnswers.length-1].innerHTML +=   `<div class="quiz-answer pointer ${answer.isCorrectAnswer}" onclick="selectAnswer(this)" data-test="answer">
                                                <img src=${answer.image} alt="">
                                                <div class="quiz-answer-text" data-test="answer-text">
                                                    <p>${answer.text}</p>
                                                </div>
                                            </div>`;
        })
    
        count++;
    })

    //add buttons at the end
    containerQuestions.innerHTML += `<div class="quiz-finishing-box hidden"></div>
                            <button class="reset-quiz" onclick="resetQuiz()" data-test="restart">Reiniciar Quiz</button>
                            <button class="back-home" onclick="returnHome()" data-test="go-home">Voltar pra home</button>`;
    // Scrolla página para o inicio do quizz, previne bug de abrir a página do quizz aparecendo só o final dele
                            document.querySelector('.quiz-title').scrollIntoView();
}


// CÓDIGO BRENDO
// Listar todos os quizzes

let allQuizzes = [];

function hideFedd()
{
    document.querySelector('.list-All-Quizzes-Window').classList.add("hidden");
}

function renderAllQuizzes(){

    let userQuizzesIds = [];

    //Pegar os quizzes salvos no computador
    if(localStorage.getItem('ids') !=undefined)
    {
        const getIds = localStorage.getItem('ids');
         //transformar os quizzes em uma array
        const convertIds = JSON.parse(getIds);
        userQuizzesIds = convertIds;
        userQuizzesContainer.innerHTML = "";
        document.querySelector('.create-quizz-area').classList.add('hidden');
        document.querySelector('.user-quizzes').classList.remove('hidden');
        //mostrar na tela os quizzes salvos baseado no id dos quizzes salvos
        for (let i = 0; i < convertIds.length; i++)
        {
            const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/' + convertIds[i].id);
            
            promisse.then(renderUserQuizz);
            promisse.catch(console.log);
        }
    }
    else
    {
        document.querySelector('.create-quizz-area').classList.remove('hidden');
        document.querySelector('.user-quizzes').classList.add('hidden');
    }

    let idsQuizzesString = "";
    userQuizzesIds.forEach(quiz =>{idsQuizzesString+= (quiz.id + "");});
    
    const elementUL = document.querySelector('.container-quizzes');
    elementUL.innerHTML = `<div class="title-list-quizzes">Todos os Quizzes</div>`;


    for (let i = 0; i < allQuizzes.length; i++) 
    {
        let quizzToRender = allQuizzes[i];
        
        if(userQuizzesIds.length != 0)
        {
            
                let isUserQuizz = idsQuizzesString.includes(quizzToRender.id);
                if(isUserQuizz === false)
                {
                    elementUL.innerHTML += `
                    <li id="${quizzToRender.id}" onclick="openQuizzFromFeed(this)" class="quizz-area">
                        <div data-test="others-quiz" class="image-inside-box">
                            <img class="finalize-creation-quizz-image" src="${quizzToRender.image}" alt="">
                            <div class="image-inside-gradient"></div>
                            <p>${quizzToRender.title}</p>
                        </div>
                    </li>
                    `;
                }
        }
        else
        {
            elementUL.innerHTML += `
            <li id="${quizzToRender.id}" onclick="openQuizzFromFeed(this)" class="quizz-area">
                <div data-test="others-quiz" class="image-inside-box">
                    <img class="finalize-creation-quizz-image" src="${quizzToRender.image}" alt="">
                    <div class="image-inside-gradient"></div>
                    <p>${quizzToRender.title}</p>
                </div>
            </li>
            `;
        }

        
    }
}


function openQuizzFromFeed(quizzToOpen)
{
    const promise = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/"+ quizzToOpen.getAttribute('id'));
    loadingWindow.classList.remove('hidden');
    quizzFeedWindow.classList.add('hidden');
    promise.then(showQuiz);
    promise.catch(alert);
}

function successSearchingQuizzes(response){
    allQuizzes = response.data;
    loadingWindow.classList.add('hidden');
    document.querySelector('.container-quizzes').classList.remove('hidden');
    renderAllQuizzes();
}

function listAllQuizzes(){
    // Mostrar janela com lista de todos os quizzes fornecidos pelo site
    loadingWindow.classList.remove('hidden');
    const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes')
    promisse.then(successSearchingQuizzes);
    promisse.catch(console.log);
}

function renderUserQuizz(response){
    userQuizzesContainer.innerHTML +=
    `
        <div id="${response.data.id}" onclick="openQuizzFromFeed(this)" class="user-quizz">
            <div data-test="my-quiz" class="user-quizz-img-box">
                <img class="user-quizz-img" src="${response.data.image}" alt="">
                <div class="user-image-inside-gradient"></div>
                <img class="modify-buttons" src="./images/Rectangle 43.png" alt="">
                <ion-icon data-test="edit"onclick="event.stopPropagation(); startEditingQuizz(this)" class="edit-quizz-btn" name="create-outline"></ion-icon>
                <ion-icon data-test="delete" onclick="event.stopPropagation(); setQuizzDeleteId(this)" class="delete-quizz-btn" name="trash-outline"></ion-icon>
            </div>
            <p>${response.data.title}</p>
        </div>
    `;
}

function CloseDeleteWindow()
{
    document.querySelector(".delete-confirmation-window").classList.add("hidden");
    quizzIdToDelete = null;
}

function setQuizzDeleteId(quizz)
{
    document.querySelector(".delete-confirmation-window").classList.remove("hidden");
    quizzIdToDelete = quizz.parentNode.parentNode.getAttribute('id');
}

function deleteQuizzFromId()
{
    document.querySelector(".delete-confirmation-window").classList.add("hidden");
    deleteQuizz(quizzIdToDelete, true);
}