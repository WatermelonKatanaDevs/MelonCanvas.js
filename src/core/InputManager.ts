export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private gamepadButtons: { [index: number]: boolean } = {};

  constructor() {
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
    window.addEventListener("gamepadconnected", () => this.updateGamepadState());
  }

  isKeyPressed(key: string): boolean {
    return this.keys[key] || false;
  }

  isGamepadButtonPressed(buttonIndex: number): boolean {
    return this.gamepadButtons[buttonIndex] || false;
  }

  private updateGamepadState(): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      gamepad.buttons.forEach((button, index) => {
        this.gamepadButtons[index] = button.pressed;
      });
    }
  }
}
