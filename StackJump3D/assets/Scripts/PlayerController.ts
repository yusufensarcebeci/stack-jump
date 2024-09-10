import {
  _decorator,
  BoxCollider,
  Component,
  Input,
  ITriggerEvent,
  Node,
  SkeletalAnimation,
  Tween,
  tween,
  UITransform,
  Vec3,
  view,
} from "cc";
import { ObstacleManager } from "./ObstacleManager";
import { ScoreHandler } from "./ScoreHandler";
import { GameManager, GameState } from "./GameManager";
import { UIManager } from "./UIManager";

const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(ObstacleManager) obstacleManager: ObstacleManager = null;
  @property(UIManager) uiManager: UIManager = null;
  @property(SkeletalAnimation) skeletalAnimation: SkeletalAnimation = null;
  @property(ScoreHandler) scoreHandler: ScoreHandler = null;
  @property(Node) touchArea: Node = null;
  @property(Node) failTrigger: Node = null;
  @property(Node) winTrigger: Node = null;

  private canJump: boolean = true;

  protected onLoad(): void {
    this.touchArea.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  protected start(): void {
    this.failTrigger
      .getComponent(BoxCollider)
      .on("onTriggerEnter", this.onFailTriggerEnter, this);
    this.winTrigger
      .getComponent(BoxCollider)
      .on("onTriggerEnter", this.onWinTriggerEnter, this);
    this.updateTouchAreaSize();
  }

  private onFailTriggerEnter(event: ITriggerEvent) {
    if (this.gameManager.getState() === GameState.GAME_OVER) return;

    this.gameManager.setState(GameState.GAME_OVER);
    this.failTrigger.getComponent(BoxCollider).enabled = false;
    this.winTrigger.getComponent(BoxCollider).enabled = false;
    Tween.stopAllByTarget(this.node);
    Tween.stopAllByTarget(event.otherCollider.node);
    this.uiManager.handleEndScreen();
    this.scoreHandler.updategameOverScoreLabel();
  }

  private onWinTriggerEnter(event: ITriggerEvent) {
    if (this.gameManager.getState() === GameState.GAME_OVER) return;
    Tween.stopAllByTarget(this.node);
    Tween.stopAllByTarget(event.otherCollider.node);
    this.obstacleManager.spawnObstacle();
    this.scoreHandler.incrementScore();
    // this.skeletalAnimation.stop();
  }

  private jump() {
    if (!this.canJump) return;
    this.canJump = false;
    this.playerJumpAnimation();
    this.tweenPlayerPosition();
  }

  private playerJumpAnimation() {
    const jumpAnim = this.skeletalAnimation.defaultClip.name;
    this.skeletalAnimation.play(jumpAnim);

    this.skeletalAnimation.once(
      SkeletalAnimation.EventType.FINISHED,
      () => {
        console.log("animation finished");
        this.canJump = true;
      },
      this
    );
  }

  private tweenPlayerPosition() {
    const currentPosition = this.node.position;
    const jumpUp = currentPosition.clone().add3f(0, 1, 0);
    const jumpDown = currentPosition.clone();

    Tween.stopAllByTarget(this.node);

    tween(this.node)
      .delay(0.15)
      .to(0.2, { position: jumpUp }, { easing: "sineOut" })
      .to(
        0.2,
        { position: jumpDown },
        {
          easing: "sineIn",
          onComplete() {
            console.log("tween finished");
          },
        }
      )
      .start();
  }

  private onTouchStart() {
    this.jump();
  }

  private updateTouchAreaSize() {
    const uiTransform = this.touchArea.getComponent(UITransform);
    if (uiTransform) {
      uiTransform.setContentSize(
        view.getVisibleSize().width * 2,
        view.getVisibleSize().height * 2
      );
    }
  }
  // Calling when the retry button is clicked
  public resetPlayer() {
    this.scheduleOnce(() => {
      this.failTrigger.getComponent(BoxCollider).enabled = true;
      this.winTrigger.getComponent(BoxCollider).enabled = true;
      this.node.setPosition(new Vec3(0, -0.3, 0));
      this.canJump = true;
    }, 0.3);
  }
}
