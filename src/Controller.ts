export default class Controller {
  down = new ButtonInput();
  left = new ButtonInput();
  right = new ButtonInput();
  up = new ButtonInput();
  space = new ButtonInput();

  public handleKeyDownUp: (ev: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDownUp = (ev) => this.keyDownUp(ev);
  }

  private keyDownUp(ev: KeyboardEvent) {
    const down = ev.type === 'keydown';

    switch (ev.key) {
      case 'ArrowDown':
        this.down.setInput(down);
        break;

      case 'ArrowLeft':
        this.left.setInput(down);
        break;

      case 'ArrowRight':
        this.right.setInput(down);
        break;

      case 'ArrowUp':
        this.up.setInput(down);
        break;

      case ' ':
        this.space.setInput(down);
        break;
    }
  }
}

class ButtonInput {
  public active = false;
  public down = false;

  public setInput(down: boolean) {
    if (this.down !== down) this.active = down;
    this.down = down;
  }
}
