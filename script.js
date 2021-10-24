class Game {
    // CREATE NECESSARY COMPONENTS ELEMENTS
    constructor(container) {
        this.container_id = container;
        this.container_elem = document.querySelector(`${this.container_id}`);
        this.gameboard = this.createGameBoard();
        this.start_button = this.createStartButton();
        this.message_container = this.createMessagesContainer();
        this.gold_container = this.createGoldAndMerchantContainer();
        this.store_container = this.createStoreContainer();
        this.life_container = this.createLifeBar();
        this.score_container = this.createScoreBar(0);
        this.notification_container = this.createNotificationContainer();
        this.rep_container = this.createReputationContainer();
        this.container_elem.innerHTML = "";
        this.intro_text = "<h2>Welcome, Dragon keeper!</h2><br> Want to get your dragon strong? <br> Want to earn gold?<br> Here is a system that will help you get a fast start in the world of dragon keeping. Go questing, get gold and buy items from merchant to upgrade your dragon";
        this.intro_text_container = this.createIntroTextContainer();
        this.api_url = "https://dragonsofmugloar.com/api/v2";
        // SETUP GAME
        this.init();
    }

    // SETUP UI
    init() {
        this.gameboard.innerHTML = "";
        this.gameboard.appendChild(this.intro_text_container);
        this.gameboard.appendChild(this.start_button);
        this.gameboard.appendChild(this.message_container);
        this.gameboard.appendChild(this.gold_container);
        this.gameboard.appendChild(this.life_container);
        this.gameboard.appendChild(this.score_container);
        this.gameboard.appendChild(this.notification_container);
        this.gameboard.appendChild(this.rep_container);
        this.container_elem.appendChild(this.gameboard);
        this.message_container.style.display = "none";
        this.gold_container.style.display = "none";
        this.score_container.style.display = "none";
        this.notification_container.style.display = "none";

        if (localStorage.getItem("game")) {
            this.game = JSON.parse(localStorage.getItem("game"));
            this.startGame().then();
        }
    }

    // CREATE board element
    createGameBoard() {
        const new_board = document.createElement("div");
        new_board.innerHTML = "";
        new_board.id = "game-board";
        return new_board;
    }

    // CREATE messages element
    createMessagesContainer() {
        const message_container = document.createElement("div");
        message_container.id = "messages";
        return message_container;
    }

    // CREATE start button
    createStartButton() {
        const start_button = document.createElement("button");
        start_button.addEventListener("click", async function () {
            await this.startClick();
        }.bind(this));
        start_button.textContent = "start game";
        start_button.classList.add("btn");
        return start_button;
    }

    // CREATE element for intro text
    createIntroTextContainer() {
        const introTextContainer = document.createElement("p");
        introTextContainer.id = "intro_text";
        introTextContainer.innerHTML = this.intro_text;
        return introTextContainer;
    }

    // Click Event START BUTTON
    async startClick() {
        this.game = await this.getGame();
        // STORE GAME STATE TO localStorage to persist after refresh
        localStorage.setItem("game", JSON.stringify(this.game));
        await this.startGame();
    }

    // START Game view
    async startGame() {
        this.start_button.style.display = "none";
        this.intro_text_container.style.display = "none";
        this.message_container.style.display = "block";
        this.gold_container.style.display = "block";
        this.life_container.style.display = "block";
        this.rep_container.style.display = "block";
        this.score_container.style.display = "block";
        this.notification_container.style.display = "block";
        this.renderMessages(await this.getMessages());
        let lives = this.createLifeElements(this.game.lives);
        this.life_container.appendChild(lives);
        await this.updateGold(this.game.gold);
        await this.updateScoreBar(this.game.score);
    }

    // CREATE elements for messages
    renderMessages(messages) {
        this.message_container.innerHTML = "";
        if (messages && !messages.hasOwnProperty("status")) {
            for (let message of messages) {
                let new_message = this.createMessage(message);
                this.message_container.appendChild(new_message);
            }
        }
    }

    // CREATE End Screen Element
    __createEndScreenResetButton() {
        const reset_button = document.createElement("button");
        reset_button.classList.add("reset_button");
        reset_button.textContent = "Back to starting screen?"
        reset_button.addEventListener("click", function () {
            this.resetGame();
            this.init();
        }.bind(this));
        return reset_button
    }

    // CREATE Message element for Messages List
    createMessage(message_obj) {
        const message_div = document.createElement("div");
        message_div.classList.add("message");
        message_div.appendChild(this.__createMessageBlock(message_obj.message));
        const message_info = document.createElement("div");
        message_info.classList.add("message__info")
        message_info.appendChild(this.__createExpiryElement(message_obj.expiresIn));
        message_info.appendChild(this.__createRewardElement(message_obj.reward));
        message_info.appendChild(this.__createMessageDifficultyElement(message_obj.probability));
        message_div.appendChild(message_info);
        const message_controls = this.__createMessageControlsElement(message_obj.adId);
        message_div.appendChild(message_controls);
        return message_div;
    }

    // CREATE Message controls with Accept Button
    __createMessageControlsElement(adId) {
        let message_controls = document.createElement("div");
        message_controls.classList.add("message__controls");
        message_controls.style.display = "flex";
        message_controls.style.justifyContent = "flex-end";
        let accept_button = this.__createAcceptButton(adId);
        message_controls.appendChild(accept_button);
        return message_controls;
    }

    // CREATE Ad Message Text Element
    __createMessageBlock(text) {
        let message_text = document.createElement("p");
        message_text.classList.add("message__text");
        message_text.innerHTML = text;
        message_text.setAttribute("data-text", text);
        message_text.addEventListener("click", function () {
            this.innerHTML = Game.decodeText(this.innerHTML);
        });
        message_text.addEventListener("mouseleave", function (event) {
            this.innerHTML = this.getAttribute("data-text");
        });
        return message_text;
    }

    // CREATE Message Chance/Difficulty Element
    __createMessageDifficultyElement(probability) {
        let message_challenge = document.createElement("span");
        message_challenge.classList.add("message__threat");
        message_challenge.innerHTML = `Threat: ${probability}`;
        message_challenge.setAttribute("data-text", `Threat: ${probability}`);
        message_challenge.addEventListener("click", function (event) {
            const initialText = this.innerHTML;
            const split_text = initialText.split(": ");
            this.innerHTML = `${split_text[0]}: ${Game.decodeText(split_text[1])}`;
        });
        message_challenge.addEventListener("mouseleave", function (event) {
            this.innerHTML = this.getAttribute("data-text");
        });
        return message_challenge;
    }

    // CREATE Message Turn Count display
    __createExpiryElement(expiresIn) {
        let message_expire = document.createElement("span");
        message_expire.classList.add("message__expire");
        message_expire.innerHTML = `Expires in: ${expiresIn} turns`;
        return message_expire;
    }

    // CREATE Message Gold reward Element
    __createRewardElement(reward_text) {
        let message_reward = document.createElement("span");
        message_reward.classList.add("message__gold");
        message_reward.innerHTML = `<span class="Gold">Gold</span>: ${reward_text}`;
        return message_reward;
    }

    // CREATE Accept button for message
    __createAcceptButton(messageId) {
        let accept_button = document.createElement("button");
        accept_button.classList.add("btn__accept");
        accept_button.textContent = "I will accept"
        accept_button.addEventListener("click", async function () {
            await this.messageAccept(messageId);
        }.bind(this));
        accept_button.addEventListener("mouseenter", function () {
            this.style.color = "red";
        });
        accept_button.addEventListener("mouseleave", function () {
            this.style.color = "#B4080B";
        });
        return accept_button;
    }

    // Click Event MESSAGE ACCEPT
    async messageAccept(messageId) {
        const url = `${this.api_url}/${this.game.gameId}/solve/${messageId}`;
        const quest_result = await this.__request(url, "POST");
        await this.updateMessages();
        if (quest_result && !quest_result?.error) {
            const {gold, highScore, lives, message, score, success, turn} = quest_result;
            this.createNotification(message);
            if (lives >= 0) {
                await this.updateGameState(lives, gold, score, highScore, turn, null);
            }
        }
    }


    // RESET GAME STATE AND UPDATE VISUAL
    resetGame() {
        localStorage.removeItem("game");
        this.game = {};
        this.start_button.style.display = "block";
        this.intro_text_container.style.display = "block";
        this.message_container.style.display = "none";
        this.gold_container.style.display = "none";
        this.life_container.style.display = "none";
        this.score_container.style.display = "none";
        this.rep_container.style.display = "none";
    }

    // CREATE container for gold tracking and merchant access
    createGoldAndMerchantContainer(gold = 0) {
        const gold_and_merchant = document.createElement("div");
        gold_and_merchant.id = "gold_manager";
        gold_and_merchant.appendChild(this.__createGoldCounter(gold));
        gold_and_merchant.appendChild(this.__createMerchantButton());
        return gold_and_merchant;
    }

    // CREATE merchant button element for opening store
    __createMerchantButton() {
        const market_button = document.createElement("button");
        market_button.id = "gold_manager__button";
        market_button.textContent = "Visit merchant >";
        market_button.style.background = "none";
        market_button.style.border = "none";
        market_button.addEventListener("click", async function () {
            await this.openStore();
        }.bind(this));
        market_button.addEventListener("mouseenter", function () {
            this.style.color = "red";
        });

        market_button.addEventListener("mouseleave", function () {
            this.style.color = "Black";
        });
        return market_button;
    }

    // CREATE game gold UI element
    __createGoldCounter(gold) {
        const gold_amount = document.createElement("div");
        gold_amount.id = "gold_manager__gold";
        gold_amount.style.zIndex = "999";
        gold_amount.innerHTML = `<span>${gold}</span> <span class="gold__icon">Gold</span>`;
        return gold_amount;
    }

    // CREATE game life bar container element
    createLifeBar() {
        const lifeContainer = document.createElement("div");
        lifeContainer.id = "life_container";
        return lifeContainer;
    }

    // CREATE life bar elements based on provided count
    createLifeElements(count = 0) {
        const life_block = document.createElement("div");
        for (let i = 0; i < count; i++) {
            let life_span = document.createElement("span");
            life_span.classList.add("life");
            life_span.innerHTML = "&hearts;";
            life_span.style.color = "red";
            life_block.appendChild(life_span);
        }
        return life_block;
    }

    // CREATE score counter to display score for user
    createScoreBar(score) {
        const score_container = document.createElement("div");
        score_container.id = "score_bar";
        score_container.innerHTML = `SCORE: ${score}`;
        return score_container;
    }

    // UPDATE GAME STATE, in memory and in storage
    async updateGameState(lives, gold, score, highScore, turn, level) {
        const storage_state = localStorage.getItem("game");
        this.rep_container.innerHTML = '';
        this.rep_container.appendChild(await this.requestReputation());
        if (storage_state) {
            const current_state = JSON.parse(storage_state);
            if (lives || (lives >= 0)) {
                current_state["lives"] = lives;
                this.updateLives(lives);
            }
            if (gold) {
                current_state["gold"] = gold;
                this.updateGold(gold);
            }
            if (score) {
                current_state["score"] = score;
                this.updateScoreBar(score)
            }
            if (highScore) {
                current_state["highscore"] = highScore;
            }
            if (turn) {
                current_state["turn"] = turn;
            }
            if (level) {
                current_state["level"] = level;
            }
            this.game = current_state;
            localStorage.setItem("game", JSON.stringify(current_state));
        }
    }

    // UPDATE lives count
    updateLives(count) {
        this.life_container.innerHTML = "";
        this.life_container.appendChild(this.createLifeElements(count));
    }

    // UPDATE gold count
    updateGold(gold) {
        const gold_manager = this.gold_container.querySelector("#gold_manager__gold");
        gold_manager.firstElementChild.textContent = gold
    }

    // UPDATE game score count
    updateScoreBar(score) {
        this.score_container.innerHTML = `SCORE: ${score}`;
    }


    // UPDATE Message view
    async updateMessages() {
        let messages = await this.getMessages(`${this.api_url}/${this.game.gameId}/messages`, "POST");
        this.renderMessages(messages);
    }

    //  Click Event OPEN STORE
    async openStore() {
        this.gameboard.appendChild(this.store_container);
        await this.storeUpdate();
    }

    // UPDATE Store view
    async storeUpdate() {
        const store_items = await this.getStoreItems();
        const store_view = this.createStoreView(store_items);
        const store_view_container = this.store_container.querySelector("#store_view_container");
        store_view_container.innerHTML = "";
        store_view_container.appendChild(store_view);
    }

    // Click Event CLOSE STORE
    async closeStore() {
        this.gold_container.style.color = "black";
        this.gold_container.style.zIndex = "initial";
        this.store_container.remove();
        await this.updateMessages();
    }

    // CREATE Store View Container Element
    createStoreContainer() {
        const store_container = document.createElement("div");
        store_container.id = "store_container";
        const close_button = document.createElement("button");
        close_button.classList.add("close");
        close_button.textContent = "X";
        close_button.addEventListener("click", async function () {
            await this.closeStore();
        }.bind(this));

        close_button.addEventListener("mouseenter", function () {
            this.style.color = "red";
        });

        close_button.addEventListener("mouseleave", function () {
            this.style.color = "white";
        });

        const store_view_container = document.createElement("div");
        store_view_container.id = "store_view_container";
        store_container.appendChild(close_button);
        store_container.appendChild(store_view_container);
        return store_container;
    }

    // CREATE STORE VIEW
    createStoreView(storeItems) {
        const storeList = document.createElement("div");
        storeList.id = "store_list"

        for (let storeItem of storeItems) {
            storeList.appendChild(this.__createStoreItemElement(storeItem));
        }
        this.gold_container.style.color = "white";
        this.gold_container.style.zIndex = "999";
        return storeList;
    }

    // CREATE store item
    __createStoreItemElement(storeItem) {
        let item = document.createElement("div");
        item.classList.add("store_item");

        let text = document.createElement("p");
        text.textContent = storeItem.name;

        let price = document.createElement("p");
        price.innerHTML = `${storeItem.cost} <span class="gold__icon">Gold</span>`;

        item.appendChild(text);
        item.appendChild(price);
        if (storeItem.cost <= this.game.gold) {
            item.appendChild(this.__createPurchaseButton(storeItem.id));
        } else {
            let warning_text = document.createElement("p");
            warning_text.classList.add("warning_text");
            warning_text.textContent = "! Not enough gold !"
            item.appendChild(warning_text);
        }
        return item;
    }

    // CREATE Purchase button For Store item
    __createPurchaseButton(itemId) {
        let purchase_button = document.createElement("button");
        purchase_button.classList.add("store_item__buy")
        purchase_button.textContent = "Buy item";
        purchase_button.addEventListener("click", async function () {
            await this.purchaseItem(itemId);
            await this.storeUpdate();
        }.bind(this));

        purchase_button.addEventListener("mouseenter", function () {
            this.style.background = "red";
        });

        purchase_button.addEventListener("mouseleave", function () {
            this.style.background = "rgb(180, 8, 11)";
        });
        return purchase_button;
    }

    // CREATE container for messages notifications
    createNotificationContainer() {
        let message_container = document.createElement("div");
        message_container.id = "notification_container";
        message_container.addEventListener("notify", function (event) {
            const {message} = event.detail;
            if (message) {
                this.innerHTML = message;
            }
            setTimeout(function () {
                this.innerHTML = "";
            }.bind(this), 2500);
        });
        return message_container;
    }

    // EVENT for notification displaying
    createNotification(message) {
        const messageEvent = new CustomEvent("notify", {
            bubbles: false,
            detail: {message}
        });
        this.notification_container.dispatchEvent(messageEvent)
    }

    // CREATE container for reputation element
    createReputationContainer() {
        let rep_container = document.createElement("div");
        rep_container.id = "reputation_container";
        return rep_container;
    }


    // REQUEST game data from API
    async getGame() {
        return this.__request(`${this.api_url}/game/start`, "POST");
    }

    // REQUEST game ads messages from API
    async getMessages() {
        return await this.__request(`${this.api_url}/${this.game.gameId}/messages`, "GET");
    }

    // REQUEST Store Items
    async getStoreItems() {
        const url = `https://dragonsofmugloar.com/api/v2/${this.game.gameId}/shop`;
        return await this.__request(url, "GET");
    }

    // REQUEST Reputation stats from API
    async requestReputation() {
        const rep_result = await this.__request(`https://dragonsofmugloar.com/api/v2/${this.game.gameId}/investigate/reputation`, "POST");
        const rep_list = document.createElement("div");
        if (rep_result && !rep_result?.status) {
            for (let i in rep_result) {
                let rep_list_el = document.createElement("p");
                rep_list_el.innerHTML = `${i}: ${Math.round(rep_result[i])}`;
                rep_list.appendChild(rep_list_el);
            }
        }
        return rep_list;
    }

    // REQUEST purchase from API
    async purchaseItem(itemId) {
        const purchase_result = await this.__request(`https://dragonsofmugloar.com/api/v2/${this.game.gameId}/shop/buy/${itemId}`, "POST");

        if (purchase_result) {
            const {gold, level, lives, shoppingSuccess, turn} = purchase_result;
            if (!shoppingSuccess) {
                console.log("Cannot buy this item!");
            }
            await this.updateGameState(lives, gold, null, null, turn, level);
        }

    }

    // HELPER for handling all requests
    async __request(url, method) {
        let response = await fetch(`${url}`, {method: method}).then(response => {
            return response.json();

        }).catch(() => {
            console.log('error');
        });
        if (response) {
            if (response?.status === 'Game Over') {
                this.gameboard.innerHTML = `<p>Game over! You managed to reach score ${this.game.score}</p> &nbsp;`;
                this.gameboard.appendChild(this.__createEndScreenResetButton());
                return response
            }
            return response;
        }
        return [];
    }

    // DECODE BASE64 Text
    static decodeText(text) {
        const regexCheck = new RegExp("^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$");
        if (regexCheck.test(text)) {
            text = window.atob(text);
        }
        return text;
    }
}