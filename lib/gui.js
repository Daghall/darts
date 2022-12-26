import Renderer from "./renderer.js";

class Gui {
  constructor() {
    const canvasElement = document.querySelector("canvas");
    canvasElement.width = 600;
    canvasElement.height = 600;

    this.renderer = new Renderer(canvasElement);
  }

  draw() {
    window.requestAnimationFrame((time) => {
      this.renderer.render(time);
      window.requestAnimationFrame(this.draw.bind(this));
    });
  }
}

function init() {
  const gui = new Gui();
  gui.draw();
}

init();
