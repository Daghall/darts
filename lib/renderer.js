import { colors, fonts } from "./constants.js";

export default class Renderer {
  #canvas;
  #previousTime;
  #settings;

  constructor(canvasElement) {
    this.#canvas = canvasElement.getContext("2d");
    this.#buildSettings();
  }

  #buildSettings() {
    this.#settings = {
      numbers: [ 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13 ],
      segmentAngle: Math.PI / 10,
      halfSegmentAngle: Math.PI / 20,
      boardCenter: {
        x: 240,
        y: 240,
      },
      boardRadius: 230,
      doubleRadius: 180,
      tripleRadius: 110,
      innerBullseyeRadius: 10,
      outerBullseyeRadius: 20,
      numberOffset: 205,
      multiplierWidth: 15,
    };
  }

  render(time) {
    const elapsedTime = time - (this.#previousTime || 0);
    this.#reset();
    this.#renderBoard(elapsedTime);
    this.#previousTime = time;
  }

  #reset() {
    this.#canvas.clearRect(0, 0, 600, 600);
    this.#canvas.shadowColor = "transparent";
  }

  #renderBoard() {
    const {
      numbers,
      segmentAngle,
      halfSegmentAngle,
      boardCenter,
      boardRadius,
      doubleRadius,
      tripleRadius,
      innerBullseyeRadius,
      outerBullseyeRadius,
      numberOffset,
      multiplierWidth,
    } = this.#settings;

    this.#canvas.strokeStyle = colors.board.wire;
    this.#canvas.font = fonts.board;
    this.#canvas.lineWidth = 2;
    this.#canvas.textAlign = "center";
    this.#canvas.textBaseline = "middle";

    // Border
    this.#canvas.beginPath();
    this.#canvas.fillStyle = colors.board.background;
    this.#canvas.arc(boardCenter.x, boardCenter.y, boardRadius, 0, Math.PI * 2);
    this.#canvas.fill();
    this.#canvas.stroke();

    numbers.forEach((number, i) => {
      const startAngle = segmentAngle * i;
      const endAngle = startAngle + segmentAngle;
      const alt = i % 2;

      // Number
      {
        const x = boardCenter.x + Math.cos(startAngle + halfSegmentAngle) * numberOffset;
        const y = boardCenter.y + Math.sin(startAngle + halfSegmentAngle) * numberOffset;
        this.#canvas.fillStyle = colors.board.numbers;
        this.#canvas.fillText(number, x, y);
      }

      // Double
      this.#canvas.beginPath();
      this.#canvas.fillStyle = colors.board.multiplier[alt];
      this.#canvas.arc(boardCenter.x, boardCenter.y, doubleRadius, startAngle, endAngle);
      this.#canvas.lineTo(boardCenter.x, boardCenter.y);
      this.#canvas.fill();

      // Single, outer
      this.#canvas.beginPath();
      this.#canvas.fillStyle = colors.board.segment[alt];
      this.#canvas.arc(boardCenter.x, boardCenter.y, doubleRadius - multiplierWidth, startAngle, endAngle);
      this.#canvas.lineTo(boardCenter.x, boardCenter.y);
      this.#canvas.fill();

      // Triple
      this.#canvas.beginPath();
      this.#canvas.fillStyle = colors.board.multiplier[alt];
      this.#canvas.arc(boardCenter.x, boardCenter.y, tripleRadius, startAngle, endAngle);
      this.#canvas.lineTo(boardCenter.x, boardCenter.y);
      this.#canvas.fill();

      // Single, inner
      this.#canvas.beginPath();
      this.#canvas.fillStyle = colors.board.segment[alt];
      this.#canvas.arc(boardCenter.x, boardCenter.y, tripleRadius - multiplierWidth, startAngle, endAngle);
      this.#canvas.lineTo(boardCenter.x, boardCenter.y);
      this.#canvas.fill();
    });

    // Bullseye, outer
    this.#canvas.beginPath();
    this.#canvas.fillStyle = colors.board.bullseye.outer;
    this.#canvas.arc(boardCenter.x, boardCenter.y, outerBullseyeRadius, 0, Math.PI * 2);
    this.#canvas.fill();

    // Bullseye, inner
    this.#canvas.beginPath();
    this.#canvas.fillStyle = colors.board.bullseye.inner;
    this.#canvas.arc(boardCenter.x, boardCenter.y, innerBullseyeRadius, 0, Math.PI * 2);
    this.#canvas.fill();

    // Metal frame
    this.#canvas.shadowColor = colors.board.shadow;
    this.#canvas.shadowBlur = 2;
    this.#canvas.shadowOffsetX = 1;
    this.#canvas.shadowOffsetY = 1;

    this.#canvas.beginPath();

    // Rays
    numbers.forEach((_, i) => {
      const angle = segmentAngle * i;
      this.#canvas.moveTo(boardCenter.x + Math.cos(angle) * doubleRadius, boardCenter.y + Math.sin(angle) * doubleRadius);
      this.#canvas.lineTo(boardCenter.x + Math.cos(angle) * outerBullseyeRadius, boardCenter.y + Math.sin(angle) * outerBullseyeRadius);
    });

    // Double
    this.#canvas.moveTo(boardCenter.x + doubleRadius, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, doubleRadius, 0, Math.PI * 2);
    this.#canvas.moveTo(boardCenter.x + doubleRadius - multiplierWidth, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, doubleRadius - multiplierWidth, 0, Math.PI * 2);

    // Triple
    this.#canvas.moveTo(boardCenter.x + tripleRadius, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, tripleRadius, 0, Math.PI * 2);
    this.#canvas.moveTo(boardCenter.x + tripleRadius - multiplierWidth, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, tripleRadius - multiplierWidth, 0, Math.PI * 2);

    // Bullseye, outer
    this.#canvas.moveTo(boardCenter.x + outerBullseyeRadius, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, outerBullseyeRadius, 0, Math.PI * 2);

    // Bullseye, inner
    this.#canvas.moveTo(boardCenter.x + innerBullseyeRadius, boardCenter.y);
    this.#canvas.arc(boardCenter.x, boardCenter.y, innerBullseyeRadius, 0, Math.PI * 2);

    this.#canvas.stroke();
  }
}
