let pieces = [];

let boardSquares = [];

let selectedSquare = null;

let Player = function (color) {
    this.checked = false;
    this.color = color;
    this.castled = false;
    this.king = null;
    this.kingMoved = false;
    this.promote = null;
    this.moved = null;
}

let turn = 1;

let white = new Player("white");

let black = new Player("black");

let currentPlayer = white;
// Single-player config
let singlePlayerMode = true;
let userSide = null; // 'white' or 'black'
let engineThinking = false;
let gameOver = false;

let SquareObject = function (x, y, color, selected, element, piece) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.selected = selected;
    this.element = element;
    this.piece = piece;
}

SquareObject.prototype.setPiece = function (piece) {
    this.piece = piece;
    this.update();
};

SquareObject.prototype.unsetPiece = function () {
    this.piece = null;
    this.update();
};

SquareObject.prototype.update = function () {
    this.element.className = "square " + this.color + " " + (this.selected ? "selected" : "") + " " + (this.piece === null ? "empty" : this.piece.color + "-" + this.piece.type);
};

SquareObject.prototype.select = function () {
    this.selected = true;
    this.update();
};

SquareObject.prototype.deselect = function () {
    this.selected = false;
    this.update();
};

SquareObject.prototype.hasPiece = function () {
    return this.piece !== null;
}

let Piece = function (x, y, color, type) {
    this.color = color;
    this.type = type;
    this.x = x;
    this.y = y;
    this.captured = false;
    this.lastmoved = 0;
    this.advancedtwo = 0;
};

Piece.prototype.capture = function () {
    this.captured = true;
}

let Castle = function (x, y, color) {
    this.color = color;
    this.type = "castle";
    this.x = x;
    this.y = y;
    this.hasMoved = false;
};

Castle.prototype = new Piece();

Castle.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    //Piece.prototype.isValidMove.apply(this, arguments);
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let directionX = movementX ? (movementX / Math.abs(movementX)) : 0;
    let directionY = movementY ? (movementY / Math.abs(movementY)) : 0;
    let result = { valid: false, capture: null };
    if (movementX == 0 || movementY == 0) {
        let blocked = false;
        for (let testX = this.x + directionX, testY = this.y + directionY; testX != toSquare.x || testY != toSquare.y; testX += directionX, testY += directionY) {
            testSquare = getSquare(testX, testY);
            blocked = blocked || testSquare.hasPiece();
        }
        if (!blocked) {
            if (!toSquare.hasPiece()) {
                result = { valid: true, capture: null };
            } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            }
        }
    }
    if (n == 2/*&&currentPlayer.checked==false*/) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    //Piece.prototype.isValidMove2.call(this, toSquare, n-1);
    //console.log("movementX: " + movementX +" | movementY: " + movementY + " | direction: {"+directionX+", "+directionY+"}");
    return result;
}


let Knight = function (x, y, color) {
    this.color = color;
    this.type = "knight";
    this.x = x;
    this.y = y;
};

Knight.prototype = new Piece();

Knight.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    //Piece.prototype.isValidMove.apply(this, arguments);
    let movementY = toSquare.y - this.y;
    let movementX = toSquare.x - this.x;
    let result = { valid: false, capture: null };
    if ((Math.abs(movementX) == 2 && Math.abs(movementY) == 1) || (Math.abs(movementX) == 1 && Math.abs(movementY) == 2)) {
        if (!toSquare.hasPiece()) {
            result = { valid: true, capture: null };
        } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
            result = { valid: true, capture: toSquare };
        }
    }
    if (n == 2/*&&currentPlayer.checked==false*/) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    //Piece.prototype.isValidMove2.call(this, toSquare, n-1);
    //console.log("movementX: " + movementX +" | movementY: " + movementY);
    return result;
}


let Bishop = function (x, y, color) {
    this.color = color;
    this.type = "bishop";
    this.x = x;
    this.y = y;
};

Bishop.prototype = new Piece();

Bishop.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    //Piece.prototype.isValidMove.apply(this, arguments);
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let directionX = movementX ? (movementX / Math.abs(movementX)) : 0;
    let directionY = movementY ? (movementY / Math.abs(movementY)) : 0;
    let result = { valid: false, capture: null };
    if (Math.abs(movementX) == Math.abs(movementY)) {
        let blocked = false;
        for (let testX = this.x + directionX, testY = this.y + directionY; testX != toSquare.x || testY != toSquare.y; testX += directionX, testY += directionY) {
            testSquare = getSquare(testX, testY);
            blocked = blocked || testSquare.hasPiece();
        }
        if (!blocked) {
            if (!toSquare.hasPiece()) {
                result = { valid: true, capture: null };
            } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            }
        }
    }
    if (n == 2/*&&currentPlayer.checked==false*/) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    //Piece.prototype.isValidMove2.call(this, toSquare, n-1);
    //console.log("movementX: " + movementX +" | movementY: " + movementY + " | direction: {"+directionX+", "+directionY+"}");
    return result;
}

let Queen = function (x, y, color) {
    this.color = color;
    this.type = "queen";
    this.x = x;
    this.y = y;
};

Queen.prototype = new Piece();

Queen.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    //Piece.prototype.isValidMove.apply(this, arguments);
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let directionX = movementX ? (movementX / Math.abs(movementX)) : 0;
    let directionY = movementY ? (movementY / Math.abs(movementY)) : 0;
    let result = { valid: false, capture: null };
    if (Math.abs(movementX) == Math.abs(movementY) || movementX == 0 || movementY == 0) {
        let blocked = false;
        for (let testX = this.x + directionX, testY = this.y + directionY; testX != toSquare.x || testY != toSquare.y; testX += directionX, testY += directionY) {
            testSquare = getSquare(testX, testY);
            blocked = blocked || testSquare.hasPiece();
        }
        if (!blocked) {
            if (!toSquare.hasPiece()) {
                result = { valid: true, capture: null };
            } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            }
        }
    }
    if (n == 2/*&&currentPlayer.checked==false*/) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    //Piece.prototype.isValidMove2.call(this, toSquare, n-1);
    //console.log("movementX: " + movementX +" | movementY: " + movementY + " | direction: {"+directionX+", "+directionY+"}");
    return result;
}

let King = function (x, y, color) {
    this.color = color;
    this.type = "king";
    this.x = x;
    this.y = y;
    this.checkedBy = null;
};

King.prototype = new Piece();

King.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    //Piece.prototype.isValidMove.apply(this, arguments);
    let movementY = toSquare.y - this.y;
    let movementX = toSquare.x - this.x;
    let result = { valid: false, capture: null };
    if ((movementX >= -1 && movementX <= 1 && movementY >= -1 && movementY <= 1)) {
        if (!toSquare.hasPiece()) {
            result = { valid: true, capture: null };
        } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
            result = { valid: true, capture: toSquare };
        }
        oldPiece = toSquare.piece;
        toSquare.unsetPiece();
        for (let i = 0; i < pieces.length; i++) {
            let square = getSquare(pieces[i].x, pieces[i].y);
            if (square.piece != null && pieces[i].captured == false) {
                if (pieces[i].color != currentPlayer.color) {
                    if (pieces[i] instanceof Pawn) {
                        //console.log("called");
                        let direction = pieces[i].color == "white" ? -1 : 1;
                        let movementY = (toSquare.y - pieces[i].y);
                        let movementX = (toSquare.x - pieces[i].x);
                        if (movementY == direction) {
                            if (Math.abs(movementX) == 1 && Math.abs(movementY) == 1) {
                                if (this.color != pieces[i].color) {
                                    result.valid = false;
                                    //console.log("called2");
                                    //console.log(pieces[i])
                                    toSquare.setPiece(oldPiece);
                                    break;
                                }
                            }
                        }
                    }
                    else if (pieces[i] instanceof King) {
                        if (this.color == "white") {
                            if (Math.abs(black.king.x - toSquare.x) <= 1 && Math.abs(black.king.y - toSquare.y) <= 1) {
                                result.valid = false;
                                toSquare.setPiece(oldPiece);
                                return result;
                            }
                        } else {
                            if (Math.abs(white.king.x - toSquare.x) <= 1 && Math.abs(white.king.y - toSquare.y) <= 1) {
                                result.valid = false;
                                toSquare.setPiece(oldPiece);
                                return result;
                            }
                        }
                    }
                    else {
                        if (pieces[i].isValidMove(getSquare(toSquare.x, toSquare.y)).valid) {
                            //console.log(square.piece);
                            result.valid = false;
                            //console.log("not valid move");
                            console.log(result.capture);
                            toSquare.setPiece(oldPiece);
                            return result;
                        }
                    }
                }
            }
            else console.log("null");
        }
        toSquare.setPiece(oldPiece);
    }
    else if (Math.abs(movementX) == 2 && movementY == 0) { // Castling
        if (currentPlayer.kingMoved == false && currentPlayer.checked == false) {
            let Y = currentPlayer == white ? 8 : 1;
            if (currentPlayer.king.x == 5 && currentPlayer.king.y == Y) {
                let savedKingX = currentPlayer.king.x;
                let savedKingY = currentPlayer.king.y;
                if (movementX == 2) { // Kingside castling
                    let rookSquare = getSquare(8, Y);
                    if (rookSquare.piece instanceof Castle && !rookSquare.piece.hasMoved) {
                        if (getSquare(6, Y).piece == null && getSquare(7, Y).piece == null) {
                            // Check king doesn't pass through attacked square (f-file)
                            currentPlayer.king.x = 6;
                            currentPlayer.king.y = Y;
                            let passThroughSafe = !kingExposed(currentPlayer.king);
                            // Check destination square (g-file)
                            currentPlayer.king.x = 7;
                            currentPlayer.king.y = Y;
                            let destSafe = !kingExposed(currentPlayer.king);
                            // Restore king position
                            currentPlayer.king.x = savedKingX;
                            currentPlayer.king.y = savedKingY;
                            if (passThroughSafe && destSafe) {
                                result.valid = true;
                                // Move the rook
                                let rook = rookSquare.piece;
                                rookSquare.unsetPiece();
                                getSquare(6, Y).setPiece(rook);
                                rook.x = 6;
                                rook.y = Y;
                                rook.hasMoved = true;
                            }
                        }
                    }
                }
                else if (movementX == -2) { // Queenside castling
                    let rookSquare = getSquare(1, Y);
                    if (rookSquare.piece instanceof Castle && !rookSquare.piece.hasMoved) {
                        if (getSquare(2, Y).piece == null && getSquare(3, Y).piece == null && getSquare(4, Y).piece == null) {
                            // Check king doesn't pass through attacked square (d-file)
                            currentPlayer.king.x = 4;
                            currentPlayer.king.y = Y;
                            let passThroughSafe = !kingExposed(currentPlayer.king);
                            // Check destination square (c-file)
                            currentPlayer.king.x = 3;
                            currentPlayer.king.y = Y;
                            let destSafe = !kingExposed(currentPlayer.king);
                            // Restore king position
                            currentPlayer.king.x = savedKingX;
                            currentPlayer.king.y = savedKingY;
                            if (passThroughSafe && destSafe) {
                                result.valid = true;
                                // Move the rook
                                let rook = rookSquare.piece;
                                rookSquare.unsetPiece();
                                getSquare(4, Y).setPiece(rook);
                                rook.x = 4;
                                rook.y = Y;
                                rook.hasMoved = true;
                            }
                        }
                    }
                }
            }
        }
    }
    if (n == 2 && currentPlayer.checked == false) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    console.log(pieces[i]);
                    console.log("prevents king from moving ");
                    //console.log(getSquare(currentPlayer.king.x, currentPlayer.king.y))
                    break;
                }
            }
        }
    }
    //Piece.prototype.isValidMove2.call(this, toSquare, n-1);
    //console.log("movementX: " + movementX +" | movementY: " + movementY);
    if (result.valid && currentPlayer.kingMoved == false) {
        currentPlayer.kingMoved = true;
    }
    return result;
}

let Pawn = function (x, y, color) {
    this.color = color;
    this.type = "pawn";
    this.x = x;
    this.y = y;
};

Pawn.prototype = new Piece();

Pawn.prototype.isValidMove = function (toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let direction = this.color == "white" ? -1 : 1;
    let result = { valid: false, capture: null };
    //console.log("movementX: " + movementX +" | movementY: " + movementY + " | direction: "+direction);
    if (movementY == direction * 2 && movementX == 0 && this.y == (this.color == "white" ? 7 : 2) && !getSquare(this.x, this.y + direction).hasPiece() && !toSquare.hasPiece()) {
        result = { valid: true, capture: null };
        this.advancedtwo = turn;
    } else if (movementY == direction) {
        if (Math.abs(movementX) == 1) {
            if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            } else {
                passantSquare = getSquare(this.x + movementX, this.y);
                if (passantSquare.hasPiece() && passantSquare.piece.color != this.color && passantSquare.piece.type == "pawn" && passantSquare.piece.advancedtwo == turn - 1) {
                    result = { valid: true, capture: passantSquare };
                }
            }
        } else if (movementX == 0 && !toSquare.hasPiece()) {
            result = { valid: true, capture: null }
        }
    }
    if (currentPlayer == white) {
        if (toSquare.y == 1 && this.y == 2) {
            if (result.capture != null && Math.abs(movementX) == 1 || result.capture == null && Math.abs(movementX) == 0 && !toSquare.hasPiece()) {
                console.log("called1");
                result.valid = true;
                result.promote = true;
            }
        }
        //else console.log("tosqure " + toSquare.y);
    }
    else if (currentPlayer == black) {
        if (toSquare.y == 8 && this.y == 7) {
            if (result.capture != null && Math.abs(movementX) == 1 || result.capture == null && Math.abs(movementX) == 0 && !toSquare.hasPiece()) {
                console.log("called");
                result.valid = true;
                result.promote = true;
            }
        }
        //else console.log("tosqure2 " + toSquare.y);
    }
    if (n == 2/*&&currentPlayer.checked==false*/) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    return result;
}

let setup = function () {
    let boardContainer = document.getElementById("board");
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            let squareElement = document.createElement("div");
            let color = (j + i) % 2 ? "dark" : "light";
            squareElement.addEventListener("click", squareClicked);
            squareElement.setAttribute("data-x", j);
            squareElement.setAttribute("data-y", i);
            let square = new SquareObject(j, i, color, false, squareElement, null);
            square.update();
            boardSquares.push(square);
            boardContainer.appendChild(squareElement);
        }
    }
    white.king = new King(5, 8, "white");
    black.king = new King(5, 1, "black");
    pieces.push(white.king);
    pieces.push(black.king);

    pieces.push(new Castle(1, 1, "black"));
    pieces.push(new Knight(2, 1, "black"));
    pieces.push(new Bishop(3, 1, "black"));
    pieces.push(new Queen(4, 1, "black"));
    pieces.push(new Bishop(6, 1, "black"));
    pieces.push(new Knight(7, 1, "black"));
    pieces.push(new Castle(8, 1, "black"));
    pieces.push(new Pawn(1, 2, "black"));
    pieces.push(new Pawn(2, 2, "black"));
    pieces.push(new Pawn(3, 2, "black"));
    pieces.push(new Pawn(4, 2, "black"));
    pieces.push(new Pawn(5, 2, "black"));
    pieces.push(new Pawn(6, 2, "black"));
    pieces.push(new Pawn(7, 2, "black"));
    pieces.push(new Pawn(8, 2, "black"));
    pieces.push(new Pawn(1, 7, "white"));
    pieces.push(new Pawn(2, 7, "white"));
    pieces.push(new Pawn(3, 7, "white"));
    pieces.push(new Pawn(4, 7, "white"));
    pieces.push(new Pawn(5, 7, "white"));
    pieces.push(new Pawn(6, 7, "white"));
    pieces.push(new Pawn(7, 7, "white"));
    pieces.push(new Pawn(8, 7, "white"));
    pieces.push(new Castle(1, 8, "white"));
    pieces.push(new Knight(2, 8, "white"));
    pieces.push(new Bishop(3, 8, "white"));
    pieces.push(new Queen(4, 8, "white"));
    pieces.push(new Bishop(6, 8, "white"));
    pieces.push(new Knight(7, 8, "white"));
    pieces.push(new Castle(8, 8, "white"));
    for (let i = 0; i < pieces.length; i++) {
        getSquare(pieces[i].x, pieces[i].y).setPiece(pieces[i]);
    }

    // Show side selection overlay if single player
    if (singlePlayerMode) {
        document.getElementById('sideSelect').className = 'overlay show';
    }
};

// Called from side selection overlay
let selectSide = function (side) {
    if (side === 'random') {
        side = Math.random() < 0.5 ? 'white' : 'black';
    }
    userSide = side;
    // hide overlay
    document.getElementById('sideSelect').className = 'overlay';
    // If engine moves first, request engine move
    if (currentPlayer.color !== userSide) {
        requestEngineMove();
    }
}

// Build a FEN string from current board position (basic piece placement + side)
let getFenFromPosition = function (sideToMove) {
    let fenRanks = [];
    for (let rank = 1; rank <= 8; rank++) {
        // rows in boardSquares are 1..8 top->bottom in their y coordinate; we need rank 8->1
    }
    // Build using boardSquares mapping: boardSquares[y*8+x-9] (x,y are 1-based)
    for (let r = 8; r >= 1; r--) {
        let rowStr = '';
        let emptyCount = 0;
        for (let c = 1; c <= 8; c++) {
            let sq = getSquare(c, r);
            if (!sq.hasPiece()) {
                emptyCount++;
            } else {
                if (emptyCount > 0) { rowStr += emptyCount; emptyCount = 0; }
                let p = sq.piece;
                let letter = '';
                switch (p.type) {
                    case 'pawn': letter = 'p'; break;
                    case 'knight': letter = 'n'; break;
                    case 'bishop': letter = 'b'; break;
                    case 'castle': letter = 'r'; break;
                    case 'queen': letter = 'q'; break;
                    case 'king': letter = 'k'; break;
                    default: letter = 'p';
                }
                if (p.color === 'white') letter = letter.toUpperCase();
                rowStr += letter;
            }
        }
        if (emptyCount > 0) rowStr += emptyCount;
        fenRanks.push(rowStr);
    }
    let placement = fenRanks.join('/');
    let sideChar = (currentPlayer.color === 'white') ? 'w' : 'b';
    if (sideToMove === 'white') sideChar = 'w';
    else if (sideToMove === 'black') sideChar = 'b';
    // Minimal FEN: placement + side. Omit castling/en-passant/details
    return placement + ' ' + sideChar + ' - - 0 1';
}

// Request best move from backend engine
let requestEngineMove = async function () {
    if (engineThinking || gameOver) return;
    engineThinking = true;
    // simple UI feedback
    showEngine('Engine is thinking...');

    // determine engine side: prefer `userSide` (single-player), otherwise opposite of currentPlayer
    let engineSide;
    if (singlePlayerMode && userSide !== null) {
        engineSide = (userSide === 'white') ? 'black' : 'white';
    } else {
        engineSide = (currentPlayer.color === 'white') ? 'black' : 'white';
    }
    // Build FEN for the side that will move (engine)
    let fen = getFenFromPosition(engineSide);
    try {
        let resp = await fetch('https://checkmate-machine.onrender.com/engine/best_move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen: fen, side: engineSide, depth: 3 })
        });
        if (!resp.ok) throw new Error('Engine request failed');
        let data = await resp.json();
        // expected format: { from: 'e2', to: 'e4' }
        if (data.from && data.to) {
            applyEngineMove(data.from, data.to);
        } else {
            showError('Engine returned invalid move');
        }
    } catch (err) {
        showError('Engine error: ' + err.message);
    } finally {
        engineThinking = false;
        closeEngine();
    }
}

// Convert algebraic like 'e2' to square and execute move
let applyEngineMove = function (fromAlg, toAlg) {
    let fromFile = fromAlg.charCodeAt(0) - 96; // a=1
    let fromRank = 8 - parseInt(fromAlg[1]) + 1; // convert so getSquare expects (x,y)
    // Correction: our getSquare takes (x,y) where y is 1..8 top->bottom; algebraic rank 1 is bottom (y=8)
    let fromY = parseInt(fromAlg[1]);
    let toY = parseInt(toAlg[1]);
    // Algebraic: file letter then rank number. getSquare(x,y) expects x,file (1..8) and y,rank (1..8), with 1 at top.
    // In our setup, rank 1 is top? The existing code maps boardSquares[y*8+x-9], and setup created squares with y from 1..8 top->bottom.
    // Algebraic rank 8 should map to y=1. So convert: y = 9 - algebraicRank
    let fx = fromAlg.charCodeAt(0) - 96;
    let fy = 9 - parseInt(fromAlg[1]);
    let tx = toAlg.charCodeAt(0) - 96;
    let ty = 9 - parseInt(toAlg[1]);

    let fromSq = getSquare(fx, fy);
    let toSq = getSquare(tx, ty);
    if (fromSq && toSq) {
        // perform move as engine (currentPlayer should already be engine color)
        move(fromSq, toSq);
    } else {
        showError('Engine move coordinates out of range');
    }
}

let showError = function (message) {
    document.getElementById("errorText").innerHTML = message;
    document.getElementById("errorMessage").className = "overlay show";
}

let closeError = function () {
    document.getElementById("errorMessage").className = "overlay";
}

let showEngine = function () {
    document.getElementById("engineMessage").className = "overlay show";
    document.getElementById("engineText").innerHTML = "Engine is thinking...";
}

let closeEngine = function () {
    document.getElementById("engineMessage").className = "overlay";
}

let showEnd = function (message) {
    document.getElementById("endText").innerHTML = message;
    document.getElementById("endMessage").className = "overlay show";
}

let newGame = function () {
    location.reload();
}

let getSquare = function (x, y) {
    return boardSquares[y * 8 + x - 9];
};

let squareClicked = function (e) {
    if (gameOver) return;
    let x = Number(this.getAttribute("data-x"));
    let y = Number(this.getAttribute("data-y"));
    let square = getSquare(x, y);
    if (selectedSquare === null) {
        // enforce single-player permission
        if (singlePlayerMode && currentPlayer.color !== userSide) {
            showError('It is not your turn');
            return;
        }
        if (square.piece === null) {
            showError("There is no piece here!");
        } else if (square.piece.color != currentPlayer.color) {
            showError("This is not your piece!");
        } else {
            selectedSquare = getSquare(x, y);
            selectedSquare.select();
        }
    } else {
        if (selectedSquare.x == x && selectedSquare.y == y) {
            selectedSquare.deselect();
            selectedSquare = null;
        } else {
            if (square.piece != null && square.piece.color == currentPlayer.color) {
                selectedSquare.deselect();
                selectedSquare = getSquare(x, y);
                selectedSquare.select();
            }
            else {
                move(selectedSquare, square);
            }
        }
    }
}

let move = function (start, end) {

    let piece = start.piece;
    currentPlayer.moved = start.piece;
    let moveResult = piece.isValidMove(end);
    console.log("wut");
    console.log(piece);
    // Clear previous check highlights
    document.querySelectorAll('.check-highlight').forEach(el => el.classList.remove('check-highlight'));
    if (currentPlayer == white) {
        black.checked = false;
        black.king.checkedBy = null;
    }
    else {
        white.checked = false;
        white.king.checkedBy = null;
    }
    if (moveResult.valid) {
        console.log("debug");
        capturedPiece = null;
        if (moveResult.capture !== null) {
            moveResult.capture.piece.capture();
            capturedPiece = moveResult.capture.piece;
            moveResult.capture.unsetPiece();
        }
        piece.x = end.x;
        piece.y = end.y;
        end.setPiece(piece);
        start.unsetPiece();
        if (kingExposed(currentPlayer.king)) {
            //if(!(piece instanceof King)){
            console.log("exposed");
            showError("That is an invalid move!");
            end.unsetPiece();
            piece.x = start.x;
            piece.y = start.y;
            start.setPiece(piece);
            if (moveResult.capture !== null) {
                capturedPiece.captured = false;
                moveResult.capture.setPiece(capturedPiece);
            }
            return;
            //}
            //else console.log("not");
        }
        else console.log(currentPlayer.king.color + " not exposed");
        end.piece.lastmoved = turn;
        // Track rook/king movement for castling eligibility
        if (end.piece instanceof Castle) end.piece.hasMoved = true;
        start.unsetPiece();
        start.deselect();
        selectedSquare = null;
        if (moveResult.promote == true) {
            currentPlayer.promote = end.piece;
            showPromotion(currentPlayer);
            return;
            //console.log(end);
            /*end.unsetPiece();
            let newPiece = new Queen(end.x, end.y, currentPlayer.color);
            pieces.push(newPiece);
            end.setPiece(newPiece);
            showError("promoted!");*/
        }
        if (currentPlayer == white) {
            if (end.piece.isValidMove(getSquare(black.king.x, black.king.y), 2).valid) {
                black.checked = true;
                black.king.checkedBy = end.piece;
                getSquare(black.king.x, black.king.y).element.classList.add('check-highlight');
            }
            if (kingExposed(black.king)) {
                black.checked = true;
                getSquare(black.king.x, black.king.y).element.classList.add('check-highlight');
                if (isCheckmate(black.king)) {
                    gameOver = true;
                    if (singlePlayerMode && userSide === 'white') {
                        showEnd('Checkmate! <b>You Win!</b> 🎉');
                    } else if (singlePlayerMode && userSide === 'black') {
                        showEnd('Checkmate! <b>You Lose!</b>');
                    } else {
                        showEnd('Checkmate! <b>White wins!</b>');
                    }
                    return;
                }
            }

        }
        else {
            if (end.piece.isValidMove(getSquare(white.king.x, white.king.y), 2).valid) {
                white.checked = true;
                white.king.checkedBy = end.piece;
                getSquare(white.king.x, white.king.y).element.classList.add('check-highlight');
            }
            if (kingExposed(white.king)) {
                white.checked = true;
                getSquare(white.king.x, white.king.y).element.classList.add('check-highlight');
                if (isCheckmate(white.king)) {
                    gameOver = true;
                    if (singlePlayerMode && userSide === 'black') {
                        showEnd('Checkmate! <b>You Win!</b> 🎉');
                    } else if (singlePlayerMode && userSide === 'white') {
                        showEnd('Checkmate! <b>You Lose!</b>');
                    } else {
                        showEnd('Checkmate! <b>Black wins!</b>');
                    }
                    return;
                }
            }

        }
        //edited here
        let moveList = document.getElementById("moveList");

        if (moveList) {

            let notation = "";

            // 🔹 Detect castling FIRST
            if (piece.type === "king" && Math.abs(end.x - start.x) === 2) {

                if (end.x > start.x) {
                    notation = "O-O";        // king side
                } else {
                    notation = "O-O-O";      // queen side
                }

            } else {

                let pieceLetter = "";

                switch (piece.type) {
                    case "knight": pieceLetter = "N"; break;
                    case "bishop": pieceLetter = "B"; break;
                    case "castle": pieceLetter = "R"; break;
                    case "queen": pieceLetter = "Q"; break;
                    case "king": pieceLetter = "K"; break;
                }

                let file = String.fromCharCode(96 + end.x);
                let rank = end.y;

                let captureSymbol = moveResult.capture ? "x" : "";

                // pawn capture format (exd5)
                if (piece.type === "pawn" && moveResult.capture) {
                    let fromFile = String.fromCharCode(96 + start.x);
                    pieceLetter = fromFile;
                }

                notation = pieceLetter + captureSymbol + file + rank;
            }

            if (black.checked || white.checked) notation += "+";

            if (currentPlayer === white) {

                let li = document.createElement("li");

                let whiteSpan = document.createElement("span");
                whiteSpan.className = "white-move";
                whiteSpan.textContent = notation;

                let blackSpan = document.createElement("span");
                blackSpan.className = "black-move";

                li.appendChild(whiteSpan);
                li.appendChild(blackSpan);

                moveList.appendChild(li);

            } else {

                let lastMove = moveList.lastElementChild;
                if (lastMove) {
                    let blackSpan = lastMove.querySelector(".black-move");
                    if (blackSpan) {
                        blackSpan.textContent = notation;
                    }
                }
            }

            moveList.scrollTop = moveList.scrollHeight;
        }
        // Remove previous last-move highlights
        document.querySelectorAll(".last-move").forEach(sq => {
            sq.classList.remove("last-move");
        });

        // Highlight current move squares
        start.element.classList.add("last-move");
        end.element.classList.add("last-move");

        nextTurn();
    } else {
        showError("That is an invalid move!");
        piece.x = start.x;
        piece.y = start.y;
        start.setPiece(start.piece);
    }
}

let isCheckmate = function (king) {
    let myPlayer = currentPlayer;
    let otherPlayer = currentPlayer == white ? black : white;
    currentPlayer = otherPlayer;
    if (currentPlayer.checked == false) {
        currentPlayer = myPlayer;
        return false;
    }

    // Try every friendly piece on every possible target square.
    // If ANY move results in the king no longer being exposed, it's not checkmate.
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].captured) continue;
        if (pieces[i].color != currentPlayer.color) continue;

        let piece = pieces[i];
        let origX = piece.x;
        let origY = piece.y;
        let origSquare = getSquare(origX, origY);

        // Try every square on the board as a destination
        for (let tx = 1; tx <= 8; tx++) {
            for (let ty = 1; ty <= 8; ty++) {
                let targetSquare = getSquare(tx, ty);
                if (!targetSquare) continue;

                let moveResult = piece.isValidMove(targetSquare, 2);
                if (!moveResult.valid) continue;

                // Simulate the move
                let capturedPiece = targetSquare.piece;
                if (capturedPiece) capturedPiece.captured = true;

                origSquare.unsetPiece();
                targetSquare.setPiece(piece);
                piece.x = tx;
                piece.y = ty;

                // Handle capture via en passant (capture square differs from target)
                let enPassantCaptured = null;
                if (moveResult.capture && moveResult.capture !== targetSquare) {
                    enPassantCaptured = moveResult.capture.piece;
                    if (enPassantCaptured) enPassantCaptured.captured = true;
                    moveResult.capture.unsetPiece();
                }

                let stillExposed = kingExposed(currentPlayer.king);

                // Undo the simulation
                if (enPassantCaptured) {
                    moveResult.capture.setPiece(enPassantCaptured);
                    enPassantCaptured.captured = false;
                }
                targetSquare.unsetPiece();
                if (capturedPiece) {
                    targetSquare.setPiece(capturedPiece);
                    capturedPiece.captured = false;
                }
                origSquare.setPiece(piece);
                piece.x = origX;
                piece.y = origY;

                if (!stillExposed) {
                    currentPlayer = myPlayer;
                    return false; // Found a legal move — not checkmate
                }
            }
        }
    }

    currentPlayer = myPlayer;
    return true; // No legal move escapes check — checkmate
};


let showPromotion = function (player) {
    document.getElementById("promotionMessage").className = "overlay show";
    document.getElementById("promotionList").className = player.color;
};

let closePromotion = function () {
    document.getElementById("promotionMessage").className = "overlay";
};

let promote = function (type) {
    let newPiece;
    let oldPiece = currentPlayer.promote;
    //console.log(currentPlayer);
    let index = pieces.indexOf(oldPiece);
    switch (type) {
        case "queen":
            newPiece = new Queen(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "castle":
            newPiece = new Castle(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "bishop":
            newPiece = new Bishop(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "knight":
            newPiece = new Knight(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
    }
    if (index != -1) {
        getSquare(oldPiece.x, oldPiece.y).unsetPiece();
        pieces[index] = newPiece;
        getSquare(oldPiece.x, oldPiece.y).setPiece(newPiece);
        //console.log(getSquare(oldPiece.x, oldPiece.y));
        currentPlayer.promote = null;
        closePromotion();
        if (currentPlayer == white) {
            /*if(isCheckmate(black.king)){
                showError("Checkmate");
                return;
            }*/
            if (newPiece.isValidMove(getSquare(black.king.x, black.king.y), 2).valid) {
                showError("Check")
                black.checked = true;
                white.king.checkedBy = newPiece;
            }
            if (kingExposed(black.king)) {
                showError("Check")
                black.checked = true;
                black.king.checkedBy = newPiece;
            }
        }
        else {
            /*if(isCheckmate(white.king)){
                showError("Checkmate");
                return;
            }*/
            if (newPiece.isValidMove(getSquare(white.king.x, white.king.y), 2).valid) {
                showError("Check")
                white.checked = true;
            }
            if (kingExposed(white.king)) {
                showError("Check")
                white.checked = true;
            }
        }
        nextTurn();
    }
};

let kingExposed = function (at) {
    for (let i = 0; i < pieces.length; i++) {
        let square = getSquare(pieces[i].x, pieces[i].y);
        if (pieces[i].color != at.color && pieces[i].captured == false) {
            if (pieces[i] instanceof Pawn) {
                let direction = pieces[i].color == "white" ? -1 : 1;
                let movementY = (at.y - pieces[i].y);
                let movementX = (at.x - pieces[i].x);
                if (movementY == direction) {
                    if (Math.abs(movementX) == 1) {
                        at.checkedBy = pieces[i];
                        return true;
                    }
                }
            }
            else {
                if (square.piece.isValidMove(getSquare(at.x, at.y)).valid) {
                    at.checkedBy = pieces[i];
                    console.log(getSquare(at.x, at.y));
                    console.log(pieces[i]);
                    return true;
                }
            }
        }
    }
    return false;
};

let nextTurn = function () {
    turn++;
    if (currentPlayer.color == "white") {
        currentPlayer = black;
        document.getElementById("turnInfo").innerHTML = "Player's turn: <b>Black</b>";
    } else {
        currentPlayer = white;
        document.getElementById("turnInfo").innerHTML = "Player's turn: <b>White</b>";
    }
    // If single-player and it's now the engine's turn, request engine move
    if (singlePlayerMode && userSide !== null && currentPlayer.color !== userSide) {
        // small delay so UI updates (turn text, move highlights) before engine starts
        if (userSide == "white") {
            document.getElementById("turnInfo").innerHTML = "Player's turn: <b>White</b>";
        } else {
            document.getElementById("turnInfo").innerHTML = "Player's turn: <b>Black</b>";
        }
        setTimeout(() => {
            requestEngineMove();
        }, 250);
    }
    let turnLabel = document.querySelector("#turnInfo b");

    if (currentPlayer === white) {
        turnLabel.classList.remove("turn-black");
        turnLabel.classList.add("turn-white");
    } else {
        turnLabel.classList.remove("turn-white");
        turnLabel.classList.add("turn-black");
    }
}