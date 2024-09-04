import { _decorator, Component, Node, Vec2, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DeviceInfo")
export class DeviceInfo extends Component {
  GAME_WIDTH: number = null;
  GAME_HEIGHT: number = null;

  start() {
    this.GAME_WIDTH = view.getVisibleSizeInPixel().width;
    this.GAME_HEIGHT = view.getVisibleSizeInPixel().height;

    console.log(
      `Screen Width: ${this.GAME_WIDTH},\n Screen Height: ${this.GAME_HEIGHT}`
    );
  }

  public getDeviceSize(): Vec2 {
    return new Vec2(this.GAME_WIDTH, this.GAME_HEIGHT);
}
}
