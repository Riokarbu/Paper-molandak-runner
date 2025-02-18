import config from "../config.js";
export class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.level = 1;
    this.interval = config.score.interval;
    this.levelInterval = config.score.levelInterval;
    this.scoreContainer = document.getElementById("score");
    this.levelContainer = document.getElementById("level");
    this.levelContainer.innerText = "Level: 1";
  }

  updateScore() {
    this.updateScoreIntervalId = setInterval(() => {
      this.score++;
      if (this.score % this.levelInterval === 0) {
        this.level++;
        this.levelContainer.innerText = "Level: " + this.level;
        this.game.obstacleManager.updateObstacleInterval();
      }
      this.scoreContainer.innerText = "Score: " + this.score;
    }, this.interval);
  }

  getScore() {
    return this.score;
  }

  start() {
    this.updateScore();
  }

  stop() {
    clearInterval(this.updateScoreIntervalId);
  }
}
