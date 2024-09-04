import {
  _decorator,
  Component,
  EventTouch,
  Input,
  input,
  Node,
  System,
  SystemEvent,
  UITransform,
  Vec3,
  view,
} from "cc";
import { DeviceInfo } from "./DeviceInfo";
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

@ccclass("TouchHandle")
export class TouchHandle extends Component {
  @property(DeviceInfo) deviceInfo: DeviceInfo = null;
  @property(PlayerController) playerController: PlayerController = null;

  protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  onTouchStart(event: EventTouch) {
    // return event;
    this.playerController.jump();
  }

  start() {
    this.setContentSize();
  }

  private setContentSize() {
    this.node
      .getComponent(UITransform)
      .setContentSize(
        this.deviceInfo.GAME_WIDTH * 2,
        this.deviceInfo.GAME_HEIGHT * 2
      );
    console.log(this.node.getComponent(UITransform).contentSize);
  }

  //   onDestroy() {
  // input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
  //   }

  //   private setPosition() {
  //     let contentSize = this.node.getComponent(UITransform).contentSize;

  //     let pos = {
  //       x: contentSize.width / 2,
  //       y: contentSize.height / 2,
  //       z: 0,
  //     };
  //     this.node.setPosition(new Vec3(pos.x, pos.y, pos.z));
  //   }
}
