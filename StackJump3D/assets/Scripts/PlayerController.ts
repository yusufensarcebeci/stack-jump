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
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(SkeletalAnimation) skeletalAnimation: SkeletalAnimation = null;
  @property(DeviceInfo) deviceInfo: DeviceInfo = null;
  @property(Node) touchArea: Node = null;
  @property(Node) trigger: Node = null;

  private canJump: boolean = true;
  private tweenDuration: number = 0.7;
  private rb: RigidBody = null;
  jumpForce: number = 5;

  protected onLoad(): void {
    this.touchArea.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.setPosition(new Vec3(0, 2, 0));
    this.rb = this.node.getComponent(RigidBody);
    console.log(this.rb);
  }

  protected start(): void {
    let collider = this.trigger.getComponent(BoxCollider);
    if (collider) {
      collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }
    this.setContentSize();
  }
  animComplete() {
    this.canJump = true;
    console.log("Anim Completed");
  }

  public jump() {
    if (!this.canJump) return;
    this.canJump = false;
    this.jumpAnim();
    this.setPlayerPosByPhysic();
  }

  private jumpAnim() {
    let jumpAnim = this.skeletalAnimation.defaultClip.name;
    this.skeletalAnimation.play(jumpAnim);

    this.skeletalAnimation.once(
      SkeletalAnimation.EventType.FINISHED,
      this.animComplete,
      this
    );
  }

  onTriggerEnter(event: ITriggerEvent) {
    let targetNode = event.otherCollider.node;
    if (targetNode.name == "FailCollider") {
      // this.rb.applyImpulse(new Vec3(1, 1, 0));
      this.skeletalAnimation.stop();
    }
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

    const jumpDown = new Vec3(
      currentPosition.x,
      currentPosition.y + 1,
      currentPosition.z
    );
    Tween.stopAllByTarget(this.node);
    tween(this.node)
      .delay(0.3)
      .to(this.tweenDuration, { position: jumpDown }, { easing: "quintOut" })
      .call(() => {})
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
