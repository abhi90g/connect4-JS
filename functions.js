
class GameState {
    constructor(props){
        this.redTokenPlayer = 'Player 1';
        this.blackTokenPlayer = 'Player 2';
        this.player = 'red';
        this.currentPlayer = this.redTokenPlayer;
        this.totalRows = 6;
        this.totalCols = 7;
        this.playerName = function() {};
        this.gameover = false;
        this.props = props;
        this.initGameBoard();
        this.eventListners();
        
    }


    initGameBoard() {
        const $gameBoard = $(this.props);
        $gameBoard.empty();
        this.player = 'red';
        this.gameover = false;

        this.redTokenPlayer = prompt("enter player 1 name (red token)", this.redTokenPlayer);
        this.blackTokenPlayer = prompt("enter player 2 name (black token)", this.blackTokenPlayer);
        
        for (let row = 0; row < this.totalRows; row++) {
            const $row = $('<div/>').addClass('row');
            for (let col = 0; col < this.totalCols; col++) {
                const $col = $('<div/>').addClass('col col-empty').attr('data-col', col).attr('data-row', row);
                $row.append($col);   
            }
            $gameBoard.append($row);
            
        }
        // console.log($gameBoard.html());
    }

    eventListners() {
        const $gameBoard = $(this.props);
        const that = this;

        function lastEmptyCellInCol (col){
            const tableCell = $(`.col[data-col='${col}']`);
            for (let i = tableCell.length - 1; i >= 0; i--) {
                const $cell = $(tableCell[i]);
                if($cell.hasClass('col-empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $gameBoard.on('mouseenter', '.col.col-empty', function(){
            if(that.gameover){
                return;
            }

            const col = $(this).data('col');
            const $lastEmptyCell = lastEmptyCellInCol(col);
            $lastEmptyCell.addClass(`hover-${that.player}`);
        });

        $gameBoard.on('mouseleave', '.col', function(){
            $('.col').removeClass(`hover-${that.player}`);
        });

        $gameBoard.on('click', '.col.col-empty', function(){
            if(that.gameover){
                return;
            }
            const col = $(this).data('col');
            const row = $(this).data('row');
            const $lastEmptyCell = lastEmptyCellInCol(col);
            $lastEmptyCell.removeClass(`col-empty hover-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);

            const winner = that.winnerCheck($lastEmptyCell.data('row'), 
            $lastEmptyCell.data('col'))
              if (winner) {
                  that.gameover = true;
                  $('.col.col-empty').removeClass('col-empty')
                //   console.log(winner);
                  alert(`game over player ${that.player} won`);
                
                return;
              }
        

            that.player = (that.player == 'red') ? 'black' : 'red';
              that.playerName();

            that.currentPlayer = (that.currentPlayer == that.redTokenPlayer) ? that.blackTokenPlayer : that.redTokenPlayer;
            that.currentPlayer.update();
            console.log(that.currentPlayer);

            $(this).trigger('mouseenter');
        });

    }

    winnerCheck(row, col) {
        const that = this;

        function $tableCell(r, c) {
            return $(`.col[data-row='${r}'][data-col='${c}']`);
        }

        function directionCheck(direction) {
            let total = 0;
            let r = row + direction.r;
            let c = col + direction.c;
            let $nextCell = $tableCell(r, c);
            while (r >= 0 && r < that.totalRows && 
                    c >= 0 && c < that.totalCols && 
                    $nextCell.data('player') == that.player) {
                total++;
                r += direction.r;
                c += direction.c;
                $nextCell = $tableCell(r, c);
            }
            return total;
        }
        
        function winCheck (up, down) {
            const total = 1 + directionCheck(up) + directionCheck(down);
            if(total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }

        function verticalDirectionCheck() {
            return winCheck({r: -1, c: 0}, {r: 1, c: 0})
        }

        function horizontalDirectionCheck() {
            return winCheck({r: 0, c: -1}, {r: 0, c: 1})
        }

        function diagonalRightDirectionCheck() {
            return winCheck({r: 1, c: -1}, {r: 1, c: 1})
        }

        function diagonalLeftDirectionCheck() {
            return winCheck({r: 1, c: 1}, {r: -1, c: -1})
        }
        return verticalDirectionCheck() || horizontalDirectionCheck() || diagonalLeftDirectionCheck() || diagonalRightDirectionCheck();
    }

    startOver() {
        this.initGameBoard();
    }

}