import { Dino } from "./entity/dino.js";
import { ItemManager } from "./entity/items/item_manager.js";
import { Background } from "./background/background.js";
import { KeyboardManager } from "./keyboard/keyboard_manager.js";
import { ScoreManager } from "./score/score_manager.js";
import { ObstacleManager } from "./entity/obstacles/obstacle_manager.js";

export class GameManager {
  constructor() {
    this.isGameOver = false;
    this.background = new Background(document.getElementById("background"));
    this.scoreManager = new ScoreManager(this);
    this.keyboardHandler = new KeyboardManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.itemManager = new ItemManager(this);
    this.playerItems = {
      Bomb: 0,
      JumpBoost: 0,
    };
  }

  createDino() {
    const dinoElement = document.createElement("div");
    dinoElement.classList.add("dino");
    document.querySelector(".container").appendChild(dinoElement);
    const dinoTop = "70vh";
    this.dino = Dino.getInstance(dinoElement, dinoTop);
  }

  start() {
    // Display the start screen
    document.getElementById("startScreen").style.display = "block";

    const startButton = document.getElementById("startButton");

    // Ambil elemen-elemen yang diperlukan
    const guideButton = document.getElementById('guideButton');
    const guidePopup = document.getElementById('guidePopup');
    const closeGuideButton = document.getElementById('closeGuideButton');

    // Tampilkan pop-up saat tombol guide diklik
    guideButton.addEventListener('click', function() {
    guidePopup.style.display = 'block';
  });

    // Tutup pop-up saat tombol close diklik
    closeGuideButton.addEventListener('click', function() {
    guidePopup.style.display = 'none';
  });
    // Ambil elemen-elemen yang diperlukan
const mobileWarningPopup = document.getElementById('mobileWarningPopup');
const closeMobileWarningButton = document.getElementById('closeMobileWarningButton');

// Fungsi untuk mendeteksi perangkat mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Jika perangkat mobile terdeteksi, tampilkan pop-up peringatan
if (isMobileDevice()) {
    mobileWarningPopup.style.display = 'block';
}

// Tutup pop-up peringatan saat tombol close diklik
closeMobileWarningButton.addEventListener('click', function() {
    mobileWarningPopup.style.display = 'none';
});

    // Add an event listener to the start button
    startButton.addEventListener("click", () => {
      // Hide the start screen
      document.getElementById("startScreen").style.display = "none";

      // Start the game
      this.createDino();
      this.keyboardHandler.handleKey();
      this.background.moveBackground();
      this.scoreManager.start();
      this.obstacleManager.start();
      this.itemManager.start();
    });
  }

  endGame() {
    this.isGameOver = true;
    this.dino.stopMoving();
    this.background.stopMoving();
    this.scoreManager.stop();
    this.obstacleManager.stop();
    this.itemManager.stop();
    this.showGameOverWindow();
  }

  showGameOverWindow() {
    const gameOverWindow = document.getElementById("gameOverWindow");
    const finalScore = document.getElementById("finalScore");
    const restartButton = document.getElementById("restartButton");

    finalScore.innerText = this.scoreManager.getScore();
    gameOverWindow.style.display = "block";

    restartButton.onclick = () => {
      location.reload(); // Reload the page to restart the game
    };
  }
}
