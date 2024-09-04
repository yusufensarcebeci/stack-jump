import { _decorator, Component, SkeletalAnimation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerAnimation")
export class PlayerAnimation extends Component {
  @property(SkeletalAnimation) skeletalAnimation: SkeletalAnimation = null;

  private elapsed: number = 0;
  private done: boolean = false;

  protected start(): void {}

  private getClip() {
    let clip = this.skeletalAnimation.clips[0];
    return clip;
  }

  public playJumpAnimation() {
    let name = this.getClip().name;
    this.skeletalAnimation.play(`${name}`);
  }
}
