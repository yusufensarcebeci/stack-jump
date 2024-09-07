import {
  _decorator,
  BoxCollider,
  Component,
  ICollisionEvent,
  instantiate,
  math,
  Node,
  Prefab,
  RigidBody,
  Tween,
  tween,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ObstacleManager")
export class ObstacleManager extends Component {
  @property(Prefab) obstaclePrefab: Prefab = null;
  @property(Number) poolSize: number = 10;

  private minSpawnInterval: number = 1; // minimum spawn süresi
  private maxSpawnInterval: number = 2.5; // maximum spawn süresi
  private minTweenDuration: number = 1.5; // minimum tween süresi
  private maxTweenDuration: number = 3.0; // maximum tween süresi

  initialPosZ: number = -40;
  spawnPosY: number = 0.4;
  initalPos;

  private obstaclePool: Node[] = [];

  protected onLoad(): void {
    this.initializeObstaclePool();
  }

  protected start(): void {
    this.spawnObstacle();
  }

  private initializeObstaclePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const obstacle = instantiate(this.obstaclePrefab);
      obstacle.active = true;
      this.node.addChild(obstacle);
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
    this.spawnPosY += 0.4; // Y pozisyonunu artır

    this.tweenObstacle(obstacle);
    this.scheduleNextSpawn();
  }

  private scheduleNextSpawn() {
    const spawnInterval =
      Math.random() * (this.maxSpawnInterval - this.minSpawnInterval) +
      this.minSpawnInterval;

    this.scheduleOnce(() => {
      this.spawnObstacle();
    }, spawnInterval);
  }

  private getObstacleFromPool(): Node {
    if (this.obstaclePool.length > 0) {
      const obstacle = this.obstaclePool.pop();
      return obstacle;
    } else {
      console.warn("Obstacle pool is empty!");
      return null;
    }
  }
}
