import { _decorator, Component, Node, Vec2, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DeviceInfo")
export class DeviceInfo extends Component {
  GAME_WIDTH: number = null;
  GAME_HEIGHT: number = null;

  protected onLoad(): void {
    this.GAME_WIDTH = view.getVisibleSizeInPixel().width;
    this.GAME_HEIGHT = view.getVisibleSizeInPixel().height;
  }

  start() {
    this.GAME_WIDTH = view.getVisibleSizeInPixel().width;
    this.GAME_HEIGHT = view.getVisibleSizeInPixel().height;

    console.log(
      `Screen Width: ${this.GAME_WIDTH},\n Screen Height: ${this.GAME_HEIGHT}`
    );
  }

  public getDeviceSize() {
    let size = { 
        w: this.GAME_WIDTH, 
        h: this.GAME_HEIGHT 
    };
    return size;
}
}
