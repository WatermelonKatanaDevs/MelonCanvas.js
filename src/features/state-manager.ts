export class StateManager {
  private states: (() => void)[] = [];

  push(state: () => void) {
    this.states.push(state);
  }

  pop() {
    this.states.pop();
  }

  run() {
    const currentState = this.states[this.states.length - 1];
    if (currentState) currentState();
  }
}
