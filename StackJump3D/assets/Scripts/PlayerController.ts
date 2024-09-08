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
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(SkeletalAnimation) skeletalAnimation: SkeletalAnimation = null;
  @property(ObstacleManager) obstacleManager: ObstacleManager = null;
  @property(DeviceInfo) deviceInfo: DeviceInfo = null;
  @property(Node) touchArea: Node = null;
  @property(Node) failTrigger: Node = null;
  @property(Node) winTrigger: Node = null;

  private canJump: boolean = true;
  private tweenDuration: number = 0.7;
  private rb: RigidBody = null;
  jumpForce: number = 5;

  protected onLoad(): void {
    this.touchArea.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    // this.node.setPosition(new Vec3(0, 2, 0));
    this.rb = this.node.getComponent(RigidBody);
  }

  protected start(): void {
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
    console.log("Fail");
  }

  onWinTriggerEnter(event: ITriggerEvent) {
    let target = event.otherCollider;
    target.node.getComponent(BoxCollider).enabled= false;
    Tween.stopAllByTarget(target.node);
    Tween.stopAllByTarget(this.node);
    this.obstacleManager.spawnObstacle();
    console.log(target);
  }

  onAnimationComplete() {
    this.canJump = true;
    console.log("Animation Completed");
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

  private setPlayerPosByPhysic() {
    this.rb = this.node.getComponent(RigidBody);
    if (this.rb) {
      this.scheduleOnce(() => {
        this.rb.applyImpulse(new Vec3(0, this.jumpForce, 0));
      }, 0.3);
    } else {
      console.log("Rb Bulunamadı");
    }
  }

  private setPlayerPositionByTween() {
    let self = this;
    const currentPosition = this.node.position;
    let jumpDuration: number = 0.25;
    let landDuration: number = 0.25;

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
      .delay(0.3)
      .to(jumpDuration, { position: jumpUp }, { easing: "sineOut" })
      .to(landDuration, { position: jumpDown }, { easing: "sineIn" })
      .call(() => {
        console.log("Zıplama tamamlandı!");
      })
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
}
