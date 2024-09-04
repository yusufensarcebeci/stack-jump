import {
  _decorator,
  Component,
  EventTouch,
  Input,
  Node,
  tween,
  Vec3,
} from "cc";
import { PlayerAnimation } from "./PlayerAnimation";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(PlayerAnimation) playerAnimation: PlayerAnimation = null;
  //   @property(Node) touchHandleNode: Node = null;

  canJump: boolean = true;
  private tweenDuration: number = 0.8;

  protected onLoad(): void {
    this.node.setPosition(new Vec3(0, 1, 0));
  }

  public jump() {
    if (!this.canJump) return;
    this.canJump = false;
    this.setPlayerPosition();
    this.jumpAnim();
  }

  private jumpAnim() {
    if (!this.playerAnimation) return;
    console.log("Anim Founded:", this.playerAnimation);
    this.playerAnimation.playJumpAnimation();
  }

  private setPlayerPosition() {
    let self = this;
    const currentPosition = this.node.position;

    const jumpDown = new Vec3(
      currentPosition.x,
      currentPosition.y + 1,
      currentPosition.z
    );

    tween(this.node)
      .delay(0.4)
      .to(this.tweenDuration / 2, { position: jumpDown })
      .call(() => {
        self.canJump = true;
        console.log("Tween Copmleted!");
      })
      .start();
  }
}
