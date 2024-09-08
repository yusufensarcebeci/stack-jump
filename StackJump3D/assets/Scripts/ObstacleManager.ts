import {
  _decorator,
  Component,
  instantiate,
  math,
  Node,
  Prefab,
  tween,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ObstacleManager")
export class ObstacleManager extends Component {
  @property(Prefab) obstaclePrefab: Prefab = null;  
  @property(Number) minTweenDuration: number = 1; // minimum tween süresi
  @property(Number) maxTweenDuration: number = 2.5; // maximum tween süresi
  @property(Number) poolSize: number = 10;

  initialPosZ: number = -40;
  spawnPosY: number = 0.4;
  initalPos;

  private obstaclePool: Node[] = [];

  protected onLoad(): void {
    this.initializeObstaclePool();
  }

  protected start(): void {
    // this.spawnObstacle();
  }

  private initializeObstaclePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const obstacle = instantiate(this.obstaclePrefab);
      obstacle.active = false;
      this.node.addChild(obstacle);
      obstacle.setPosition(new Vec3(-5,0,-5))
      this.obstaclePool.push(obstacle);
    }
  }

  private tweenObstacle(obstacle: Node) {
    const tweenDuration =
      Math.random() * (this.maxTweenDuration - this.minTweenDuration) +
      this.minTweenDuration;
    const self = this;

    tween(obstacle)
      .to(
        tweenDuration,
        { position: new Vec3(0, obstacle.position.y, obstacle.position.z) },
        {
          easing: "linear",
          onComplete() {
            console.log("Tween completed");
          },
        }
      )
      .start();
  }

  public spawnObstacle() {
    const obstacle = this.getObstacleFromPool();
    const spawnX = Math.random() > 0.5 ? 4 : -4; // Rastgele x pozisyonu
    obstacle.setPosition(new Vec3(spawnX, this.spawnPosY, 0));
    obstacle.active = true
    this.spawnPosY += 0.4; // Y pozisyonunu artır

    this.tweenObstacle(obstacle);
  }

  private getObstacleFromPool(): Node {
    if (this.obstaclePool.length > 0) {
      const obstacle = this.obstaclePool.pop();
      return obstacle;
    } else {
      // console.warn("Obstacle pool is empty!");
      return null;
    }
  }
}
