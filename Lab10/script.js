const words = [
  { word: "Алгоритм", hint: "Өгөгдлийн боловсруулалтыг шийдэхийн тулд ашигладаг тодорхой журам." },
  { word: "Бинар", hint: "2-ртын тооллын систем" },
  { word: "Сүлжээ", hint: "Олон компьютер, төхөөрөмжийг холбож ажиллуулах систем." },
  { word: "Компилятор", hint: "Програмыг бичсэн кодоос машинд ойлгомжтой хэл рүү хөрвүүлэгч програм." },
  { word: "Дебаг", hint: "Алдаа олж засварлах үйл явц." },
  { word: "Синтакс", hint: "Програмчлалын хэлний дүрэм, үгсийн харилцан холбоо." },
  { word: "Программчлал", hint: "Компьютерийг зааварлах хэл ашиглан код бичих үйл явц." },
  { word: "Функц", hint: "Програмчлалд тодорхой үүрэг гүйцэтгэдэг бие даасан хэсэг." },
  { word: "Программ", hint: "Компьютерийн үйл ажиллагааг удирдах кодын цогц." },
  { word: "Төхөөрөмж", hint: "Компьютерийн бүх физик эд ангиуд." },
  { word: "Шифрлэл", hint: "Мэдээллийг хамгаалах зорилгоор өөрчлөх үйл явц." },
  { word: "Пиксел", hint: "Дижитал дүрсийг бүрдүүлдэг жижиг цэг." },
  { word: "Сервер", hint: "Сүлжээнд холбогдсон бусад төхөөрөмжүүдэд үйлчилдэг компьютер." },
  { word: "Код", hint: "Програмыг бичихэд хэрэглэдэг зааварчилгаа." },
];

const maxWrong = 6;
let currentWord, guessedLetters, wrongGuesses;
let timer, timeLeft = 60;
let score = 0;

const wordDisplay = document.getElementById("wordDisplay");
const hintDiv = document.getElementById("hint");
const messageDiv = document.getElementById("resultMessage");
const letterButtons = document.getElementById("letterButtons");
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");
const scoreCount = document.getElementById("scoreCount");
const timerDisplay = document.getElementById("timer");


function drawGallows() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 240); ctx.lineTo(150, 240);
  ctx.moveTo(40, 240); ctx.lineTo(40, 20);
  ctx.lineTo(120, 20); ctx.lineTo(120, 40);
  ctx.stroke();
}

function drawHangman(part) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  switch (part) {
    case 1:
      ctx.beginPath(); ctx.arc(120, 60, 20, 0, Math.PI * 2); ctx.stroke(); break; // Толгой
    case 2:
      ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(120, 140); ctx.stroke(); break; // Бие
    case 3:
      ctx.beginPath(); ctx.moveTo(120, 100); ctx.lineTo(90, 120); ctx.stroke(); break;  // Зүүн гар
    case 4:
      ctx.beginPath(); ctx.moveTo(120, 100); ctx.lineTo(150, 120); ctx.stroke(); break; // Баруун гар
    case 5:
      ctx.beginPath(); ctx.moveTo(120, 140); ctx.lineTo(90, 180); ctx.stroke(); break;  // Зүүн хөл
    case 6:
      ctx.beginPath(); ctx.moveTo(120, 140); ctx.lineTo(150, 180); ctx.stroke(); break; // Баруун хөл
  }
}

function startGame() {
  // Шинэ үг сонгох
  const random = words[Math.floor(Math.random() * words.length)];
  currentWord = random.word.toUpperCase();
  guessedLetters = [];
  wrongGuesses = 0;

  // Товчлууруудыг идэвхжүүлэх ба үсгүүд үүсгэх
  letterButtons.innerHTML = "";
  for (let i = 1040; i <= 1071; i++) { // Кирилл үсгүүд (А-Я)
    const letter = String.fromCharCode(i);
    createLetterButton(letter);
  }
  ["Ө", "Ү"].forEach(extraLetter => createLetterButton(extraLetter));

  // Тоглоомын текст, зураг шинэчлэх
  hintDiv.textContent = `Санаа: ${random.hint}`;
  messageDiv.textContent = "";
  drawGallows();
  updateDisplay();

  // Таймерыг эхлүүлэх
  if (!timer) {
    timeLeft = 60;
    timerDisplay.textContent = `⏱ Цаг: ${timeLeft}`;
    score = 0;
    updateScore();
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `⏱ Цаг: ${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        endGame();
      }
    }, 1000);
  }
}

function createLetterButton(letter) {
  const btn = document.createElement("button");
  btn.textContent = letter;
  btn.onclick = () => handleGuess(letter, btn);
  letterButtons.appendChild(btn);
}


function updateDisplay() {
  wordDisplay.textContent = currentWord
    .split("")
    .map(l => guessedLetters.includes(l) ? l : "_")
    .join(" ");
}

function checkWin() {
  if (currentWord.split("").every(l => guessedLetters.includes(l))) {
    messageDiv.textContent = "🎉 Зөв!";
    disableAllButtons();
    score += currentWord.length;
    updateScore();
    setTimeout(() => {
      startGame();
    }, 1500);
  }
}

function disableAllButtons() {
  document.querySelectorAll("#letterButtons button").forEach(btn => btn.disabled = true);
}

function updateScore() {
  scoreCount.textContent = score;
}

function endGame() {
  messageDiv.textContent = `⏰ Цаг дууслаа!`;
  disableAllButtons();
  saveFinalScore(score);

  setTimeout(() => {
    window.location.href = "scoreboard.html";
  }, 1000);
}

// Ялагдсан үед ч мөн scoreboard руу шилжүүлэхээр бичсэн байх
function handleGuess(letter, button) {
  button.disabled = true;
  if (currentWord.includes(letter)) {
    guessedLetters.push(letter);
    updateDisplay();
    checkWin();
  } else {
    wrongGuesses++;
    drawHangman(wrongGuesses);
    if (wrongGuesses === maxWrong) {
      messageDiv.textContent = `❌ Та ялагдлаа! Үг: ${currentWord}`;
      disableAllButtons();
      saveFinalScore(score);
      setTimeout(() => {
        window.location.href = "scoreboard.html";
      }, 1000);
    }
  }
}


function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function saveFinalScore(score) {
  const nickname = getCookie("nickname") || "Тоглогч";
  if (typeof score !== "number" || isNaN(score)) {
    console.warn("Оноо буруу байна:", score);
    return;
  }

  const newScore = { name: nickname, score: score };
  let scores = JSON.parse(localStorage.getItem("hangmanTopScores") || "[]");

  if (!Array.isArray(scores)) {
    scores = [];
  }

  scores.push(newScore);
  scores = scores.filter(s => s && typeof s.score === "number" && typeof s.name === "string");
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  localStorage.setItem("hangmanTopScores", JSON.stringify(scores));
  console.log("Шинэ оноо хадгалагдлаа:", scores);
}


// Тоглоом эхлүүлэх
startGame();


