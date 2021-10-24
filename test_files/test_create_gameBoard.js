const assert = chai.assert;

describe('Game', function () {
    it('createGameBoard should create div#game-board for the game', function () {
        let result = Game.prototype.createGameBoard();
        assert.equal('game-board', result.id);
        assert.equal('DIV', result.tagName);
    });
    it('createStartButton should create button.btn with text start game', function () {
        let result = Game.prototype.createStartButton();
        assert.equal('start game', result.textContent);
        assert.equal('btn', result.classList);
        assert.equal('BUTTON', result.tagName);
    });
    it('createMessagesContainer should create div#messages', function () {
        let result = Game.prototype.createMessagesContainer();
        assert.equal('messages', result.id);
        assert.equal('DIV', result.tagName);
    });
    it('Making game start request returns empty if url is not provided', async function () {
        let result = await Game.prototype.getGame();
        assert.equal(JSON.stringify({}), JSON.stringify(result));
    });
});