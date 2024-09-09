import {
  _decorator,
  BoxCollider,
  Component,
  EventTouch,
  Input,
  ITriggerEvent,
  Node,
  RigidBody,
  SkeletalAnimation,
  Tween,
  tween,
  UITransform,
  Vec3,
} from "cc";
import { DeviceInfo } from "./DeviceInfo";
import { ObstacleManager } from "./ObstacleManager";
import { ScoreHandler } from "./ScoreHandler";
import { GameManager, GameState } from "./GameManager";
import { UIManager } from "./UIManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(UIManager) uiManager: UIManager = null;
  @property(SkeletalAnimation) skeletalAnimation: SkeletalAnimation = null;
  @property(ObstacleManager) obstacleManager: ObstacleManager = null;
  @property(ScoreHandler) scoreHandler: ScoreHandler = null;
  @property(DeviceInfo) deviceInfo: DeviceInfo = null;

  @property(Node) touchArea: Node = null;
  @property(Node) failTrigger: Node = null;
  @property(Node) winTrigger: Node = null;

  private canJump: boolean = true;
  private rb: RigidBody = null;
  private initPosition: Vec3 = null;

  protected onLoad(): void {
    this.touchArea.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.rb = this.node.getComponent(RigidBody);
  }

  protected start(): void {
    this.initPosition = new Vec3(this.node.getPosition());
    let fail_collider = this.failTrigger.getComponent(BoxCollider);
    if (fail_collider) {
      fail_collider.on("onTriggerEnter", this.onFailTriggerEnter, this);
    }
    let win_collider = this.winTrigger.getComponent(BoxCollider);
    if (win_collider) {
      win_collider.on("onTriggerEnter", this.onWinTriggerEnter, this);
    }
    this.setContentSize();
  }

  onFailTriggerEnter(event: ITriggerEvent) {
    console.log("fail");
    if (this.gameManager.getState() == GameState.GAME_OVER) return;
    this.gameManager.setState(GameState.GAME_OVER); 
    Tween.stopAllByTarget(event.otherCollider.node);
    Tween.stopAllByTarget(this.node);
    this.winTrigger.getComponent(BoxCollider).enabled = false;
    this.failTrigger.getComponent(BoxCollider).enabled = false;
    this.uiManager.handleEndScreen();
  }

  onWinTriggerEnter(event: ITriggerEvent) {
    console.log("win");
    if (this.gameManager.getState() == GameState.GAME_OVER) return;
    let target = event.otherCollider;
    Tween.stopAllByTarget(target.node);
    Tween.stopAllByTarget(this.node);
    this.obstacleManager.spawnObstacle();
    this.scoreHandler.incrementScore();
  }

  onAnimationComplete() {
    this.canJump = true;
  }

  private jump() {
    if (!this.canJump) return;
    this.canJump = false;
    this.jumpAnimation();
    this.setPlayerPositionByTween();
  }

  private jumpAnimation() {
    let jumpAnim = this.skeletalAnimation.defaultClip.name;
    this.skeletalAnimation.play(jumpAnim);

    this.skeletalAnimation.once(
      SkeletalAnimation.EventType.FINISHED,
      this.onAnimationComplete,
      this
    );
  }

  private setPlayerPositionByTween() {
    let self = this;
    const currentPosition = this.node.position;
    let jumpDuration: number = 0.20;
    let landDuration: number = 0.20;

    const jumpUp = new Vec3(
      currentPosition.x,
      currentPosition.y + 1,
      currentPosition.z
    );

    const jumpDown = new Vec3(
      currentPosition.x,
      currentPosition.y,
      currentPosition.z
    );

    Tween.stopAllByTarget(this.node);

    tween(this.node)
      .delay(0.2)
      .to(jumpDuration, { position: jumpUp }, { easing: "sineOut" })
      .to(landDuration, { position: jumpDown }, { easing: "sineIn" })
      .start();
  }

  private onTouchStart(event: EventTouch) {
    this.jump();
  }

  private setContentSize() {
    this.touchArea
      .getComponent(UITransform)
      .setContentSize(
        this.deviceInfo.GAME_WIDTH * 2,
        this.deviceInfo.GAME_HEIGHT * 2
      );
  }

  resetPlayer() {
    this.scheduleOnce(() => {
      this.winTrigger.getComponent(BoxCollider).enabled = true;
      this.failTrigger.getComponent(BoxCollider).enabled = true;
      this.node.setPosition(new Vec3(0, -0.3, 0));
    }, 0.2);
  }
}
