import { _decorator, Component, math, Node, Vec3 } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Camera")
export class Camera extends Component {
  @property(Node) target: Node = null;
  @property smoothTime: number = 0.05;
  @property(GameManager) gameManager: GameManager = null;

  tempPosition: Vec3 = new Vec3();

  protected start(): void {}

  private smoothFollow(offsetY: number, offsetZ: number, deltaTime: number) {
    const targetY = this.target.position.y + offsetY;
    const targetZ = this.target.position.z + offsetZ;
    const currentY = this.node.position.y;
    const currentZ = this.node.position.z;

    const smoothY = math.lerp(currentY, targetY, this.smoothTime);
    const smoothZ = math.lerp(currentZ, targetZ, this.smoothTime);

    this.node.setPosition(this.node.position.x, smoothY, smoothZ);
  }

  protected update(deltaTime: number) {
    const state = this.gameManager.currentState;

    switch (state) {
      case GameState.INIT:
        this.node.setPosition(this.tempPosition.set(0, 5, 8));
        break;
      case GameState.GAME_RUNNING:
        if (this.target) {
          this.smoothFollow(8, 10, deltaTime);
        }
        break;
      case GameState.GAME_OVER:
        if (this.target) {
          this.smoothFollow(8, 20, deltaTime);
        }
        break;
    }
  }
}
