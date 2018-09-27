$(document).ready(function() {

    const game = new GameState('#connect4game')
   
    game.playerName = function() {
        $('.playerName').text(game.player);
      }

    
    $('.startover').click(function() {
        console.log('startover');
        game.startOver();
    })


});
