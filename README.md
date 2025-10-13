CheckMate Machine ♟️
Promoting Fair Play through Computer Vision and AI

CheckMate Machine is an intelligent vision-based system designed to ensure fairness in chess by automatically detecting a 2D chessboard from a screen, recognizing all pieces in real time, validating moves through an integrated chess engine, and analyzing gameplay for irregularities.

🧠 Overview

CheckMate Machine bridges computer vision and chess analytics to promote transparent and fair play. Using deep learning and OpenCV, it processes live or static board images, accurately determines the position of each piece, and continuously verifies that all moves comply with the rules of chess and provides smart game analysis.

⚙️ Core Functionality

Automated Board Detection:
Detects and isolates the chessboard from any 2D screen image using robust edge and contour analysis.

Piece Recognition:
A Convolutional Neural Network (CNN) trained on a large, standardized dataset identifies each piece with high accuracy, distinguishing between color and type (e.g., white pawn, black rook).

Move Validation:
Every detected move is validated in real time using an integrated chess engine (Stockfish), ensuring compliance with legal chess rules.

Fair Play Analysis:
The system tracks and evaluates move patterns to identify anomalies or potential external assistance, promoting honest gameplay.

Game Visualization:
Provides an annotated overlay or digital board interface showing detected positions, legal moves, and game insights.

🧩 Technical Highlights

Developed using Python, leveraging OpenCV for vision processing and TensorFlow/Keras for deep learning. The dataset was automatically generated and labeled through a custom OpenCV pipeline, ensuring clean and balanced training data. Perspective correction and segmentation techniques enable accurate detection across varied angles and lighting conditions. Real-time inference ensures smooth gameplay analysis with minimal delay.

🖥️ System Workflow

Capture: Input an image or live stream of a chessboard.

Detection: Locate the chessboard and correct perspective.

Segmentation: Divide the board into 64 squares.

Classification: Identify each piece using the trained CNN.

Validation: Compare moves with the chess engine’s legal move set.

Analysis: Generate fair-play and game integrity reports.

📊 Results

Board Detection Accuracy: 100% under varied conditions.

Piece Classification Accuracy: 97.89% total.

🏁 Final Product

CheckMate Machine stands as a complete, AI-powered chess monitoring tool that unites the precision of computer vision with the intelligence of chess engines. It not only ensures move legality but also enhances the transparency and integrity of the game, whether used for online tournaments, training sessions, or fair-play verification.
