import { _decorator, Component, Enum, Node } from "cc";

const { ccclass, property } = _decorator;

export enum GameState {
  LOADING,
  INIT,
  GAME_RUNNING,
  GAME_OVER,
}

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Enum(GameState) })
  currentState: GameState = GameState.LOADING;

  public setState(newState: GameState) {
    this.currentState = newState;
    console.warn("Current Game State: ", GameState[this.currentState]);
  }

  public getState() {
    return this.currentState;
  }
}
