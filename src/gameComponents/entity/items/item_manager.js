import { CollisionDetector } from "../../utils/collision_detector.js";
import { Bomb } from "./bomb.js";
import { JumpBoost } from "./jumpboost.js";
import { RandomIntervalTimer } from "../../utils/random_interval_timer.js";
import config from "../../config.js";

export class ItemManager {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.collisionDetector = new CollisionDetector(this.game);
    this.itemTimer = new RandomIntervalTimer(
      () => {
        this.createItem();
      },
      config.itemGenerateMinInterval,
      config.itemGenerateMaxInterval
    );
    this.renderInterval = config.game.renderInterval;
    this.collisionIntervalId = null;
    this.removeItemIntervalId = null;
  }

  getRandomItemType() {
    const itemTypes = [
      { type: Bomb, top: config.item.bombHeight },
      { type: JumpBoost, top: config.item.jumpBoostHeight },
    ];

    const randomIndex = Math.floor(Math.random() * itemTypes.length);
    return itemTypes[randomIndex];
  }

  createItem() {
    const itemInfo = this.getRandomItemType();

    // Check if the randomly selected item type already exists on the field
    const specialItemExists = this.items.some(
      (item) => item instanceof itemInfo.type
    );

    // If the selected item type already exists, do not create a new one
    if (specialItemExists) {
      return;
    }

    const itemDiv = document.createElement("div");
    itemDiv.classList.add(itemInfo.type.name.toLowerCase());
    document.querySelector(".container").appendChild(itemDiv);

    const item = new itemInfo.type(itemDiv, itemInfo.top);
    this.items.push(item);
  }

  checkItemsCollision() {
    this.collisionIntervalId = setInterval(() => {
      const dinoDimensions = this.game.dino.getDimensions();

      for (let item of this.items) {
        const itemDimensions = item.getDimensions();

        if (
          this.collisionDetector.isColliding(dinoDimensions, itemDimensions)
        ) {
          this.game.playerItems[item.constructor.name] += 1; // Update player's items
          document.getElementById(item.constructor.name).innerText =
            item.constructor.name +
            ": " +
            this.game.playerItems[item.constructor.name]; // Update frontend
          this.removeItem(item);
        }
      }
    }, this.renderInterval);
  }

  removeItemsOutsideScreen() {
    this.removeItemIntervalId = setInterval(() => {
      this.items.forEach((item) => {
        const itemPositionX = item.getDimensions().left;
        const itemWidth = item.getDimensions().width;
        if (itemPositionX + itemWidth <= 0) {
          this.removeItem(item);
        }
      });
    }, this.renderInterval);
  }

  activateItem(itemName) {
    if (this.game.playerItems[itemName] <= 0) return;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add(itemName.toLowerCase());
    document.querySelector(".container").appendChild(itemDiv);

    const top =
      itemName === "Bomb" ? config.bombHeight : config.jumpBoostHeight;

    // new a Bomb or JumpBoost instance and activate it
    const item = new (itemName === "Bomb" ? Bomb : JumpBoost)(itemDiv, top);
    item.activate(this.game);

    //console log the item name
    this.game.playerItems[itemName] -= 1;
    document.getElementById(itemName).innerText =
      itemName + ": " + this.game.playerItems[itemName]; // Update frontend
    this.removeItem(item);
  }

  removeItem(item) {
    item.stopMoving();
    if (item.element.parentNode) {
      item.element.parentNode.removeChild(item.element);
    }
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  removeItems() {
    while (this.items.length > 0) {
      this.removeItem(this.items[0]);
    }
  }

  start() {
    this.itemTimer.start();
    this.checkItemsCollision();
    this.removeItemsOutsideScreen();
  }

  stop() {
    this.itemTimer.stop();
    this.removeItems();
    clearInterval(this.collisionIntervalId);
    clearInterval(this.removeItemIntervalId);
  }
}
