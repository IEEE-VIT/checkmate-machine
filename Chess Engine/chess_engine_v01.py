from copy import deepcopy
from typing import Optional, List, Tuple, Dict

PIECE_VALUES = {
    'P': 1, 'p': 1,  # Pawn
    'N': 3, 'n': 3,  # Knight
    'B': 3, 'b': 3,  # Bishop
    'R': 5, 'r': 5,  # Rook
    'Q': 9, 'q': 9,  # Queen
    'K': 0, 'k': 0  # King
}

PST = {
    'P': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 5, 20, 20, 5, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'p': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [0, 0, 5, 20, 20, 5, 0, 0],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'N': [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    'n': [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    'B': [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    'b': [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    'R': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0]
    ],
    'r': [
        [0, 0, 0, 5, 5, 0, 0, 0],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'Q': [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    'q': [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    'K': [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [30, 40, 40, 40, 40, 40, 40, 30]
    ],
    'k': [
        [30, 40, 40, 40, 40, 40, 40, 30],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30]
    ]
}


class ChessBoard:
    """Represents a chess board and manages game state."""

    def __init__(self):
        """Initialize board with standard starting position."""
        self.board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            [None, None, None, None, None, None, None, None],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]
        self.move_history = []
        self.nodes_evaluated = 0
        # Optional override for side-to-move (None => infer from move_history)
        self.forced_turn: Optional[str] = None

    def copy(self):
        """Create a deep copy of the board state."""
        new_board = ChessBoard()
        new_board.board = deepcopy(self.board)
        new_board.move_history = self.move_history.copy()
        return new_board

    def is_white_piece(self, piece: Optional[str]) -> bool:
        """Check if piece belongs to White."""
        return piece is not None and piece.isupper()

    def is_black_piece(self, piece: Optional[str]) -> bool:
        """Check if piece belongs to Black."""
        return piece is not None and piece.islower()

    def get_current_turn(self) -> str:
        """Return whose turn it is: 'white' or 'black'."""
        if self.forced_turn in ('white', 'black'):
            return self.forced_turn

        return 'white' if len(self.move_history) % 2 == 0 else 'black'

    def set_board_from_fen(self, fen: str, side: Optional[str] = None) -> None:
        """Set board position from a FEN string (only piece placement + optional side supported).

        Args:
            fen: FEN string (e.g. 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
            side: Optional explicit side-to-move: 'white' or 'black'. If provided it overrides FEN's side or the
                  board's inferred turn.
        """
        parts = fen.strip().split()
        placement = parts[0]
        # If FEN contains side and caller didn't provide side, use it
        fen_side = None
        if len(parts) > 1 and side is None:
            if parts[1] == 'w':
                fen_side = 'white'
            elif parts[1] == 'b':
                fen_side = 'black'

        ranks = placement.split('/')
        if len(ranks) != 8:
            raise ValueError('FEN must contain 8 ranks')

        new_board: List[List[Optional[str]]] = []
        for rank in ranks:
            row: List[Optional[str]] = []
            for ch in rank:
                if ch.isdigit():
                    row.extend([None] * int(ch))
                else:
                    row.append(ch)
            if len(row) != 8:
                raise ValueError('Each FEN rank must expand to 8 squares')
            new_board.append(row)

        # FEN ranks go from rank 8 -> rank 1; our board rows are 0->7 top->bottom, so assignment is direct
        self.board = new_board
        self.move_history = []
        # set forced turn
        if side in ('white', 'black'):
            self.forced_turn = side
        elif fen_side in ('white', 'black'):
            self.forced_turn = fen_side
        else:
            self.forced_turn = None

    def get_valid_moves(self, row: int, col: int) -> List[Tuple[int, int]]:
        """Get all valid moves for piece at (row, col)."""
        piece = self.board[row][col]
        if not piece:
            return []

        moves = []
        piece_type = piece.lower()

        if piece_type == 'p':
            direction = -1 if self.is_white_piece(piece) else 1
            start_row = 6 if self.is_white_piece(piece) else 1

            nr = row + direction
            if 0 <= nr < 8 and self.board[nr][col] is None:
                moves.append((nr, col))

                if row == start_row:
                    nr2 = row + 2 * direction
                    if self.board[nr2][col] is None:
                        moves.append((nr2, col))

            for dc in [-1, 1]:
                nr, nc = row + direction, col + dc
                if 0 <= nr < 8 and 0 <= nc < 8 and self.board[nr][nc]:
                    if (self.is_white_piece(piece) and self.is_black_piece(self.board[nr][nc])) or \
                            (self.is_black_piece(piece) and self.is_white_piece(self.board[nr][nc])):
                        moves.append((nr, nc))

        elif piece_type == 'n':
            knight_moves = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]
            for dr, dc in knight_moves:
                nr, nc = row + dr, col + dc
                if 0 <= nr < 8 and 0 <= nc < 8:
                    target = self.board[nr][nc]
                    if target is None or \
                            (self.is_white_piece(piece) and self.is_black_piece(target)) or \
                            (self.is_black_piece(piece) and self.is_white_piece(target)):
                        moves.append((nr, nc))

        elif piece_type == 'k':
            king_moves = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
            for dr, dc in king_moves:
                nr, nc = row + dr, col + dc
                if 0 <= nr < 8 and 0 <= nc < 8:
                    target = self.board[nr][nc]
                    if target is None or \
                            (self.is_white_piece(piece) and self.is_black_piece(target)) or \
                            (self.is_black_piece(piece) and self.is_white_piece(target)):
                        moves.append((nr, nc))

        else:  # Sliding pieces (bishop, rook, queen)
            if piece_type == 'b':
                directions = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
            elif piece_type == 'r':
                directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
            else:  # queen
                directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                while 0 <= nr < 8 and 0 <= nc < 8:
                    target = self.board[nr][nc]
                    if target is None:
                        moves.append((nr, nc))
                    elif (self.is_white_piece(piece) and self.is_black_piece(target)) or \
                            (self.is_black_piece(piece) and self.is_white_piece(target)):
                        moves.append((nr, nc))
                        break
                    else:
                        break
                    nr += dr
                    nc += dc

        return moves

    def get_all_legal_moves(self) -> List[Tuple[Tuple[int, int], Tuple[int, int]]]:
        """Get all legal moves for current player."""
        turn = self.get_current_turn()
        moves = []

        for r in range(8):
            for c in range(8):
                piece = self.board[r][c]
                if not piece:
                    continue
                if (turn == 'white' and not self.is_white_piece(piece)) or \
                        (turn == 'black' and not self.is_black_piece(piece)):
                    continue

                valid_moves = self.get_valid_moves(r, c)
                for nr, nc in valid_moves:
                    moves.append(((r, c), (nr, nc)))

        return moves

    def make_move(self, from_pos: Tuple[int, int], to_pos: Tuple[int, int]) -> bool:
        """Make a move. Returns True if successful."""
        r1, c1 = from_pos
        r2, c2 = to_pos

        piece = self.board[r1][c1]
        if not piece:
            return False

        if (r2, c2) not in self.get_valid_moves(r1, c1):
            return False

        self.board[r2][c2] = piece
        self.board[r1][c1] = None
        self.move_history.append((from_pos, to_pos))
        return True

    def undo_move(self) -> bool:
        """Undo the last move. Returns True if successful."""
        if not self.move_history:
            return False

        from_pos, to_pos = self.move_history.pop()
        r1, c1 = from_pos
        r2, c2 = to_pos

        piece = self.board[r2][c2]
        self.board[r1][c1] = piece
        self.board[r2][c2] = None
        return True

    def evaluate(self) -> int:
        """Evaluate board position. Positive = White advantage, Negative = Black advantage."""
        score = 0

        for r in range(8):
            for c in range(8):
                piece = self.board[r][c]
                if not piece:
                    continue

                piece_type = piece.lower()
                base_value = PIECE_VALUES[piece_type]
                pst_value = PST[piece][r][c]

                if self.is_white_piece(piece):
                    score += base_value + pst_value
                else:
                    score -= base_value + pst_value

        return score

    def __str__(self) -> str:
        """Return string representation of board."""
        result = "  a b c d e f g h\n"
        for r, row in enumerate(self.board):
            result += f"{8 - r} "
            for piece in row:
                result += (piece if piece else '.') + ' '
            result += f"{8 - r}\n"
        result += "  a b c d e f g h\n"
        return result


class ChessEngine:
    """Chess engine with minimax and alpha-beta pruning."""

    def __init__(self, board: Optional[ChessBoard] = None):
        """Initialize engine with optional board."""
        self.board = board if board else ChessBoard()
        self.nodes_evaluated = 0
        self.max_depth_reached = 0

    def reset(self):
        """Reset engine state."""
        self.nodes_evaluated = 0
        self.max_depth_reached = 0

    def minimax(self, depth: int, alpha: int = -10000, beta: int = 10000, maximizing: bool = True) -> int:
        """
        Minimax algorithm with alpha-beta pruning.

        Args:
            depth: Remaining search depth
            alpha: Alpha value for pruning
            beta: Beta value for pruning
            maximizing: True if maximizing player (White)

        Returns:
            Evaluation score
        """
        if depth == 0:
            self.nodes_evaluated += 1
            return self.board.evaluate()

        legal_moves = self.board.get_all_legal_moves()

        if not legal_moves:
            return 9999 if maximizing else -9999

        legal_moves.sort(key=lambda move: self._move_priority(move), reverse=True)

        if maximizing:
            max_eval = -10000
            for from_pos, to_pos in legal_moves:
                piece = self.board.board[from_pos[0]][from_pos[1]]
                captured = self.board.board[to_pos[0]][to_pos[1]]
                self.board.board[to_pos[0]][to_pos[1]] = piece
                self.board.board[from_pos[0]][from_pos[1]] = None
                self.board.move_history.append((from_pos, to_pos))

                eval_score = self.minimax(depth - 1, alpha, beta, False)
                max_eval = max(eval_score, max_eval)
                alpha = max(alpha, eval_score)

                self.board.move_history.pop()
                self.board.board[from_pos[0]][from_pos[1]] = piece
                self.board.board[to_pos[0]][to_pos[1]] = captured

                if beta <= alpha:
                    break

            return max_eval
        else:
            min_eval = 10000
            for from_pos, to_pos in legal_moves:
                piece = self.board.board[from_pos[0]][from_pos[1]]
                captured = self.board.board[to_pos[0]][to_pos[1]]
                self.board.board[to_pos[0]][to_pos[1]] = piece
                self.board.board[from_pos[0]][from_pos[1]] = None
                self.board.move_history.append((from_pos, to_pos))

                eval_score = self.minimax(depth - 1, alpha, beta, True)
                min_eval = min(eval_score, min_eval)
                beta = min(beta, eval_score)

                self.board.move_history.pop()
                self.board.board[from_pos[0]][from_pos[1]] = piece
                self.board.board[to_pos[0]][to_pos[1]] = captured

                if beta <= alpha:
                    break

            return min_eval

    def _move_priority(self, move: Tuple[Tuple[int, int], Tuple[int, int]]) -> int:
        """Score move for better move ordering (captures first)."""
        from_pos, to_pos = move
        target = self.board.board[to_pos[0]][to_pos[1]]
        if target:
            return PIECE_VALUES[target.lower()]
        return 0

    def find_best_move(self, depth: int) -> Optional[Tuple[Tuple[int, int], Tuple[int, int]]]:
        """
        Find the best move using minimax with alpha-beta pruning.

        Args:
            depth: Search depth (1-5 recommended)

        Returns:
            Tuple of (from_pos, to_pos) or None if no legal moves
        """
        self.reset()
        legal_moves = self.board.get_all_legal_moves()

        if not legal_moves:
            return None

        turn = self.board.get_current_turn()
        best_move = None
        best_value = -10000 if turn == 'white' else 10000

        for from_pos, to_pos in legal_moves:
            piece = self.board.board[from_pos[0]][from_pos[1]]
            captured = self.board.board[to_pos[0]][to_pos[1]]
            self.board.board[to_pos[0]][to_pos[1]] = piece
            self.board.board[from_pos[0]][from_pos[1]] = None
            self.board.move_history.append((from_pos, to_pos))

            value = self.minimax(depth - 1, -10000, 10000, turn == 'black')

            self.board.move_history.pop()
            self.board.board[from_pos[0]][from_pos[1]] = piece
            self.board.board[to_pos[0]][to_pos[1]] = captured

            if turn == 'white' and value > best_value:
                best_value = value
                best_move = (from_pos, to_pos)
            elif turn == 'black' and value < best_value:
                best_value = value
                best_move = (from_pos, to_pos)

        return best_move

    def get_engine_stats(self) -> Dict:
        """Return engine statistics."""
        return {
            'nodes_evaluated': self.nodes_evaluated,
            'depth': self.max_depth_reached
        }

    def find_best_move_from_fen(self, fen: str, side: str, depth: int) -> Optional[Tuple[Tuple[int, int], Tuple[int, int]]]:
        """Set the board from a FEN string and return the best move for the given side.

        Args:
            fen: FEN string (piece placement; optional side may be included)
            side: 'white' or 'black' to indicate which side should move
            depth: search depth passed to the engine

        Returns:
            Best move tuple ((r1,c1),(r2,c2)) or None
        """
        if side not in ('white', 'black'):
            raise ValueError("side must be 'white' or 'black'")

        # Update board from FEN and set forced turn
        self.board.set_board_from_fen(fen, side)
        return self.find_best_move(depth)


def find_best_move_for_fen(fen_input: str, side_input: Optional[str] = None, depth: int = 3):
    """Convenience wrapper that creates an engine, sets the FEN and returns best move and stats.

    Args:
        fen_input: FEN string (may include side)
        side_input: Optional explicit side ('white' or 'black') to override FEN
        depth: search depth

    Returns:
        Tuple(best_move_or_None, engine_stats_dict)
    """
    engine = ChessEngine()

    # Determine side from FEN if side_input not provided
    fen_parts = fen_input.strip().split()
    fen_side = None
    if len(fen_parts) > 1:
        if fen_parts[1] == 'w':
            fen_side = 'white'
        elif fen_parts[1] == 'b':
            fen_side = 'black'

    if side_input in ('white', 'black'):
        chosen_side = side_input
    elif fen_side in ('white', 'black'):
        chosen_side = fen_side
    else:
        chosen_side = 'white'

    best = engine.find_best_move_from_fen(fen_input, chosen_side, depth)
    return best, engine.get_engine_stats()


# Example: accept FEN and side, return best move
if __name__ == "__main__":
    import sys

    engine = ChessEngine()

    # CLI usage: python chess_engine.py "<FEN>" [white|black] [depth]
    if len(sys.argv) > 1:
        fen_input = sys.argv[1]
        side_input = sys.argv[2] if len(sys.argv) > 2 else ''
        depth = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 3
    else:
        fen_input = input("Enter FEN (leave blank for startpos): ").strip()
        if not fen_input:
            fen_input = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        side_input = input("Side to move (white/black) [leave blank to use FEN]: ").strip().lower()
        depth_input = input("Search depth (default 3): ").strip()
        depth = int(depth_input) if depth_input.isdigit() else 3

    # Determine side to pass to engine: prefer explicit side_input, else use FEN side, else default to white
    fen_parts = fen_input.strip().split()
    fen_side = None
    if len(fen_parts) > 1:
        if fen_parts[1] == 'w':
            fen_side = 'white'
        elif fen_parts[1] == 'b':
            fen_side = 'black'

    if side_input in ('white', 'black'):
        chosen_side = side_input
    elif fen_side in ('white', 'black'):
        chosen_side = fen_side
    else:
        chosen_side = 'white'

    print(f"Setting position from FEN and searching for best move for: {chosen_side} (depth={depth})")
    best, stats = find_best_move_for_fen(fen_input, side_input=chosen_side, depth=depth)

    if best:
        (r1, c1), (r2, c2) = best
        print(f"Best move: {chr(97 + c1)}{8 - r1} -> {chr(97 + c2)}{8 - r2}")
        print("Engine stats:", stats)
    else:
        print("No legal moves found for the given position/side.")
