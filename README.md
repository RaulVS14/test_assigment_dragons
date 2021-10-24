## PLANNING

Due date: Monday 25. October 2021
Time estimate: 12h
1. Allows the user to start a game
    * Build UI - start button, background in container [x]
    * AJAX query on click to make query to API [X]
    * Get response [X]
    * Replace container
    * GameState
        * Set[x]
        * Get[x]

2. Fetches and displays the list of ads
    * Make request to get ads [x]
    * Display them using js [x]
    * Update after quest [X]

3. Allows user to pick which ones to solve
    * User can click on ad to solve [x]
        * API query for solving [x]
        * Get response [x]
        * Update game state [x]
4. Allows user to purchase items from the shop
    * User can open shop on click [X]
    * Make query for API to get Items for purchase [X]
    * User can click to buy [X]
    * Make query to buy [X]
        * If success update user data [X]
        * If not success show declined message - Decided to use store update and not letting users click on items not
          available for buying
5. Displays player's score, gold and lives [X]
    * Element for score [X]
    * Element for gold [X]
    * Element for lives [x]


Bonus: Tool to help player make decisions on ads

Ideas:

* Expiry time + probability - display probability [X]
* Decoder [X]

## RESOURCES

**BG Image**: https://www.freeimages.com/photo/abstract-light-3-1176752

* Photo by <a href="https://freeimages.com/photographer/mcleod-45904">Leszek Nowak</a>
  from <a href="https://freeimages.com">FreeImages</a>

**PAPER Texture**: https://stackoverflow.com/questions/14585101/old-paper-background-texture-with-just-css

**FONT**: https://fonts.google.com/specimen/Italianno?category=Handwriting

**GOLD COIN**: https://commons.wikimedia.org/wiki/File:Gold_coin_icon.png


## TIME
1. Test assignment - Initial setup and first game start query - 00:44:14
2. Test assignment - Setup UI and create design to think elements through - 00:55:26
3. Test assignment - Setup UI and create design to think elements through - 00:52:37
4. Test assignment - Implement messages to display and interact. Improve design - 01:39:00
5. Test assignment - Implement shop view and look a bit into in browser testing with Mocha - 02:04:32
6. Test assignment - UI elements - 02:16:00
7. Test assignment - Bug fixes and Improvements - 01:22:08
8. Test assignment - Code refactoring - 00:58:23
TOTAL: 10:52:20