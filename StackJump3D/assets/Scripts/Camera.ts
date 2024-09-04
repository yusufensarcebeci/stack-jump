import { _decorator, Component, math, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Camera")
export class Camera extends Component {
  @property(Node) target: Node = null;

  @property smoothTime: number = 0.3;

  private velocity: Vec3 = new Vec3();

  protected update(deltaTime: number) {
    if (this.target) {
      this.follow(this.target, deltaTime);
      console.log(this.node.position);
    }
  }

  follow(target: Node, deltaTime: number) {
    const targetY = target.position.y + 10;
    const currentY = this.node.position.y;

    const smoothY = math.lerp(currentY, targetY, this.smoothTime);
    this.node.setPosition(this.node.position.x, smoothY, this.node.position.z);
  }
}
