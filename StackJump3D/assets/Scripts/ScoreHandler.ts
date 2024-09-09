import { _decorator, Component, Label, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ScoreHandler")
export class ScoreHandler extends Component {
  @property(Node) scoreLabel: Node = null;
  @property(Node) gameOverScoreLabel: Node = null;

  public score: number = 0;

  public getScore() {
    return this.score;
  }

  public resetScore() {
    this.score = 0;
    this.updateScoreLabel();
    return this.score;
  }

  public incrementScore() {
    this.score += 1;
    this.updateScoreLabel();
  }

  private updateScoreLabel() {
    if (this.scoreLabel) {
      const label = this.scoreLabel.getComponent(Label);
      if (label) {
        label.string = `${this.score}`;
      }
    }
  }

  public updategameOverScoreLabel() {
    if (this.gameOverScoreLabel) {
      const label = this.gameOverScoreLabel.getComponent(Label);
      if (label) {
        label.string = `Your Score: ${this.score}`;
      }
    }
  }
}
