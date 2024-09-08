import { _decorator, Component, math, Node, UITransform, Vec2 } from "cc";
import { GameManager, GameState } from "./GameManager";
import { DeviceInfo } from "./DeviceInfo";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(DeviceInfo) deviceInfo: DeviceInfo = null;

  @property(Node) loadingScreen: Node = null;
  @property(Node) initScreen: Node = null;
  @property(Node) gameScreen: Node = null;
  @property(Node) endScreen: Node = null;

  @property(Node) load: Node = null;
  @property(Node) loadingScreenBackground: Node = null;

  private onPlayButtonClicked() {
    this.handleGameScreen();
  }

  protected onLoad(): void {
    this.loadingScreenBackground
      .getComponent(UITransform)
      .setContentSize(
        this.deviceInfo.getDeviceSize().w,
        this.deviceInfo.getDeviceSize().h
      );
    this.handleLoading();
    this.scheduleOnce(() => {
      this.handleInitScreen();
    }, 2);
  }

  public handleGameScreen() {
    this.hideAllScreens();
    if (this.gameScreen) {
      this.gameScreen.active = true;
      this.gameManager.setState(GameState.GAME_RUNNING);
    }
  }

  public handleEndScreen() {
    this.hideAllScreens();
    if (this.endScreen) {
      this.endScreen.active = true;
      this.gameManager.setState(GameState.GAME_OVER);
    }
  }
  public handleInitScreen() {
    this.hideAllScreens();
    if (this.initScreen) {
      this.initScreen.active = true;
      this.gameManager.setState(GameState.INIT);
    }
  }

  public handleLoading() {
    this.hideAllScreens();
    if (this.loadingScreen) {
      this.loadingScreen.active = true;
      this.gameManager.setState(GameState.LOADING);
    }
  }

  private hideAllScreens() {
    if (this.loadingScreen) this.loadingScreen.active = false;
    if (this.initScreen) this.initScreen.active = false;
    if (this.gameScreen) this.gameScreen.active = false;
    if (this.endScreen) this.endScreen.active = false;
  }

  private rotateLoadSprite(dt: number) {
    if (!this.load) return;
    let rotZ = this.load.eulerAngles.z;
    this.load.setRotationFromEuler(0, 0, rotZ - dt * 200);
  }

  protected update(dt: number): void {
    let activity = this.loadingScreen.active;
    if (activity) {
      this.rotateLoadSprite(dt);
    }
  }
}
