(function() {
    const board = $("#board");
    var currentPlayer;
    var numOfColumns = 9;
    // parseInt($("#columns").val());
    var numOfRows = 9;
    // parseInt($("#rows").val());
    var winCondition = 4;
    // parseInt($("#winCondition").val());

    startNewGame();

    function startNewGame() {
        makeGrid();
        setupEventListeners();
        currentPlayer = "red";
    }

    function switchPlayer() {
        currentPlayer == "red" ? (currentPlayer = "yellow") : (currentPlayer = "red");
    }

    function makeGrid() {
        board.empty();
        // COLUMNS.
        for (var c = 0; c < numOfColumns; c++) {
            var col = $("<div>").addClass("column");
            // ROWS.
            for (var r = 0; r < numOfRows; r++) {
                var slot = $("<div>")
                    .addClass("slot row" + r)
                    .attr({ ascendDiag: c + r, descendDiag: c - r });
                col.append(slot);
            }
            board.append(col);
        }
    }

    function setupEventListeners() {
        // RESET BUTTON.
        $("#reset").on("click", function() {
            startNewGame();
            $("#winner").css({ visibility: "hidden" });
        });

        //PLACEMENT PREVIEW
        $(".column").on("mouseover", function(e) {
            var col = $(e.currentTarget);
            var slotsInCol = col.children();
            for (var i = slotsInCol.length - 1; i >= 0; i--) {
                if (!slotsInCol.eq(i).hasClass("red") && !slotsInCol.eq(i).hasClass("yellow")) {
                    if (currentPlayer == "red") {
                        slotsInCol.eq(i).addClass("option-red");
                    } else {
                        slotsInCol.eq(i).addClass("option-yellow");
                    }
                    break;
                }
            }
            $(".column").on("mouseleave", function() {
                slotsInCol.removeClass("option-red option-yellow");
            });
        });

        //PLACING PIECE.
        $(".column").on("click", function(e) {
            var col = $(e.currentTarget);
            var slotsInCol = col.children();
            slotsInCol.removeClass("option-red option-yellow");

            // FIND FIRST AVAILABLE SLOT.
            for (var i = slotsInCol.length - 1; i >= 0; i--) {
                if (!slotsInCol.eq(i).hasClass("red") && !slotsInCol.eq(i).hasClass("yellow")) {
                    slotsInCol.eq(i).addClass(currentPlayer);
                    break;
                }
            }
            // CHECK IF ROW IS FULL.
            var slotsInRow = $(".row" + i);
            if (i == -1) {
                return;
            }

            // COLUMN VICTORY.
            if (checkForLinearVictory(slotsInCol)) {
                $("#winner")
                    .css({ visibility: "visible", backgroundColor: currentPlayer, fontSize: "100px" })
                    .html("<p>" + currentPlayer + " wins with a column victory!</p>");
            } else if (checkForLinearVictory(slotsInRow)) {
                $("#winner")
                    .css({ visibility: "visible", backgroundColor: currentPlayer, fontSize: "100px" })
                    .html("<p>" + currentPlayer + " wins with a row victory!</p>");
            } else if (checkForDiagonalVictory()) {
                $("#winner")
                    .css({ visibility: "visible", backgroundColor: currentPlayer, fontSize: "100px" })
                    .html("<p>" + currentPlayer + " wins with a diagonal victory!</p>");
            } else {
                switchPlayer();
            }
        });
    }

    function checkForLinearVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                count++;
                if (count == winCondition) {
                    return true;
                }
            } else {
                // reset the count back to zero because it found the other player (or no player)
                count = 0;
            }
        }
    }

    function checkForDiagonalVictory() {
        var ascendDiagCount = 0;
        var descendDiagCount = 0;

        // LOOP OVER ALL POSSIBLE  DIAGONALS OF BOARD GIVEN DIMENSIONS USING ELEM ATTRIBUTE VALUES.
        for (let i = -numOfRows; i <= numOfColumns + numOfRows; i++) {
            var possibleAscendDiag = $(".slot" + "[ascendDiag=" + i + "]");
            var possibleDescendDiag = $(".slot" + "[descendDiag=" + i + "]");

            // CONFIRM DIAGONAL IN QUESTION IS SEQUENTIAL AND OF LENGTH = winCondtion FOR ASCEND AND DESCEND DIAGS
            for (let j = 0; j <= winCondition; j++) {
                if (possibleAscendDiag.eq(j).hasClass(currentPlayer)) {
                    ascendDiagCount++;
                    if (ascendDiagCount == winCondition) {
                        return true;
                    }
                } else {
                    ascendDiagCount = 0;
                }
            }
            for (let p = 0; p <= winCondition; p++) {
                if (possibleDescendDiag.eq(p).hasClass(currentPlayer)) {
                    descendDiagCount++;
                    console.log("descendDiagCount :", descendDiagCount);
                    if (descendDiagCount == winCondition) {
                        return true;
                    }
                } else {
                    descendDiagCount = 0;
                }
            }
        }
    }
})();

// $("#play").on("click", function() {
//     // $("#modal").hide();
//     startNewGame();
// });
