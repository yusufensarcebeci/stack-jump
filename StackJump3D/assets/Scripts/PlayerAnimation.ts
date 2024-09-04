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

  public play() {
    let name = this.getClip().name;
    this.skeletalAnimation.play(`${name}`);
  }

  protected update(dt: number): void {
    if (this.done) return;

    this.elapsed += dt;

    if (this.elapsed >= 3) {
      this.done = true;
      this.play();
      console.log("Belirlenen süre doldu: ", this.elapsed);
    }
  }
}
