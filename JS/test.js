document.addEventListener('DOMContentLoaded', function () {
  const questions = [
    {
      question: "Вы увидели эмоциональный пост в соцсети о неком событии, вызывающий сильное возмущение. Какой первый шаг в проверке информации, чтобы не попасть под влияние фейка?",
      options: [
        "Немедленно поделиться постом, чтобы предупредить других о “несправедливости”.", 
        "Постараться найти первоисточник новости или подтверждение из авторитетных, независимых СМИ, а также обратить внимание на дату публикации и возможные противоречия.", 
        "Проверить, сколько лайков собрал пост – чем больше, тем правдивее."
      ],
      correctAnswer: "Б"
    },

        {
      question: "Какую роль играет “контекст” при оценке информации, особенно фотографий и видео?",
      options: [
        "Контекст не важен, главное – само изображение.",
        "Неверный контекст (например, старое фото, выдаваемое за текущее событие) может полностью исказить смысл и создать фейк.",
        "Контекст всегда правдив, если он написан под фото."
      ],
      correctAnswer: "Б"
    },
    {
      question: "При анализе заголовка новости, на что следует обратить внимание, чтобы заподозрить фейк?",
      options: [
        "На его краткость и информативность.",
        "На наличие кликбейтных фраз, чрезмерной эмоциональности, обещаний “сенсаций” или полного отсутствия конкретики.",
        "На то, что заголовок полностью совпадает с содержанием."
      ],
      correctAnswer: "Б"
    },
    {
      question: "Что такое “авторитетный источник” в контексте медиаграмотности?",
      options: [
        "Любой блогер с большим количеством подписчиков.",
        "Ресурс, который известен своей профессиональной репутацией, придерживается редакционных стандартов, проверяет факты и указывает источники информации.",
        "Любой сайт, который публикует много статей."
      ],
      correctAnswer: "Б"
    },
    {
      question: "“Эхо-камеры” и “информационные пузыри” в интернете – это:",
      options: [
        "Технические сбои в работе социальных сетей.",
        "Ситуации, когда пользователи видят в основном ту информацию, которая подтверждает их собственные взгляды, что затрудняет критическое восприятие альтернативных точек зрения.",
        "Специальные разделы на сайтах с мнениями экспертов."
      ],
      correctAnswer: "Б"
    },
    {
      question: "Если вы обнаружили на сайте с новостями большое количество грамматических и пунктуационных ошибок, что это может сигнализировать?",
      options: [
        "О том, что сайт написан очень “простым” языком.",
        "О низком уровне профессионализма редакции и, как следствие, о возможной недостоверности публикуемой информации.",
        "О том, что это очень “честный” и “неформальный” источник."
      ],
      correctAnswer: "Б"
    },
    {
      question: "Что означает “проверка обратным поиском по изображению” (reverse image search)?",
      options: [
        "Поиск похожих изображений в интернете.",
        "Поиск источника и контекста, в котором было впервые опубликовано изображение, чтобы выявить его возможное искажение или подмену.",
        "Создание нового изображения на основе найденного."
      ],
      correctAnswer: "Б"
    },
    {
      question: "Какой из следующих приемов, используемых в дезинформации, направлен на манипуляцию эмоциями, а не на предоставление фактов?",
      options: [
        "Приведение статистических данных из официальных отчетов.",
        "Использование шокирующих или тревожных заголовков и сюжетов, вызывающих страх или гнев.",
        "Цитаты признанных экспертов с указанием их области компетенции."
      ],
      correctAnswer: "Б"
    }

   
  ];

  let currentQuestionIndex = 0;
  const totalQuestions = questions.length;
  let userAnswers = []; // Array to store user answers

  // Function to load the question dynamically
  function loadQuestion(index) {
    const question = questions[index];
    const questionText = document.createElement('div');
    questionText.classList.add('question');
    questionText.innerHTML = `
      <div class="question-number">Вопрос ${index + 1}</div>
      <div class="question-text">${question.question}</div>
      <div class="options">
        <div class="option">
          <span class="letter">А</span>
          <span class="text">${question.options[0]}</span>
        </div>
        <div class="option">
          <span class="letter">Б</span>
          <span class="text">${question.options[1]}</span>
        </div>
        <div class="option">
          <span class="letter">В</span>
          <span class="text">${question.options[2]}</span>
        </div>
      </div>
    `;
    document.getElementById('testQuestions').innerHTML = questionText.innerHTML;

    // Add click event to each option
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.addEventListener('click', function () {
        options.forEach(opt => opt.classList.remove('selected'));  // Remove previous selection
        this.classList.add('selected');  // Highlight the selected option

        // Store the selected answer
        userAnswers[index] = this.querySelector('.letter').textContent;
        
        // Enable next button
        document.getElementById('nextButton').disabled = false; // Enable next button
      });
    });
  }

  // Show next question or result
  function nextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
      document.getElementById('nextButton').disabled = true; // Disable next button until answer is selected
    } else {
      showResult();
    }
  }

  // Show previous question
  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion(currentQuestionIndex);
    }
  }

  // Show the result at the end
  function showResult() {
  const score = calculateScore();                // how many correct
  const total = totalQuestions;                  // 8 for you
  const percent = Math.round((score / total) * 100);

  // show result box
  const resultBox = document.getElementById('testResult');
  const scoreText = document.getElementById('scoreText');
  const resultDetails = document.getElementById('resultDetails');
  const certBlock = document.getElementById('certificateContainer');

  resultBox.style.display = 'block';
  document.getElementById('testQuestions').style.display = 'none';
  document.querySelector('.nav-buttons').style.display = 'none';

  // write main result text
  scoreText.textContent = `Вы набрали ${score} из ${total} (${percent}%)`;
  resultDetails.textContent = percent >= 80
    ? "Отлично! Тест пройден ✅"
    : "Тест не пройден. Попробуйте ещё раз.";

  // handle certificate
  if (percent >= 80) {
    certBlock.style.display = 'block';
    certBlock.innerHTML = `
      <h4 style="
        font-size:18px;
        font-weight:600;
        color:#1e1e1e;
        margin:16px 0 10px;
        text-align:center;
      ">Ваш сертификат</h4>
      <img src="/PICS_LOGOs/certificate.png"
           alt="Сертификат"
           style="
             max-width:100%;
             height:auto;
             border:1px solid #ddd;
             border-radius:12px;
             box-shadow:0 8px 20px rgba(0,0,0,0.08);
             display:block;
             margin:0 auto 10px;
           ">
      <p style="
        font-size:14px;
        color:#555;
        text-align:center;
        margin:0;
      ">Вы можете скачать и сохранить этот сертификат.</p>
    `;
  } else {
    certBlock.style.display = 'none';
    certBlock.innerHTML = '';
  }
}

  // Calculate score
  function calculateScore() {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score++;
      }
    });
    return score;
  }

  // Button event listeners
  document.getElementById('nextButton').addEventListener('click', nextQuestion);
  document.getElementById('prevButton').addEventListener('click', prevQuestion);

  // Load the first question
  loadQuestion(currentQuestionIndex);
});




