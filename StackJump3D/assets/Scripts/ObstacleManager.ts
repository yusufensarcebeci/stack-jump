import {
  _decorator,
  BoxCollider,
  Color,
  Component,
  instantiate,
  math,
  MeshRenderer,
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
  @property(Number) poolSize: number = 1000;
  @property(Number) firstSpawnDur: number = 0.5;

  initialPosZ: number = -40;
  spawnPosY: number = 0.4;
  initalPos;

  private obstaclePool: Node[] = [];
  private activeObstacles: Node[] = [];

  protected onLoad(): void {
    this.initializeObstaclePool();
  }

  private initializeObstaclePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const obstacle = instantiate(this.obstaclePrefab);
      obstacle.active = false;
      this.node.addChild(obstacle);
      obstacle.setPosition(new Vec3(-5, 0, -5));
      const randomColor = new Color(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      );
      const meshRenderer = obstacle.getComponent(MeshRenderer);
      if (meshRenderer) {
        meshRenderer.material.setProperty("albedo", randomColor);
      }
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
        1,
        { position: new Vec3(0, obstacle.position.y, obstacle.position.z) },
        {
          easing: "linear",
          onComplete() {
            //Burada combo işlemleri eklenir
            console.log("Obstacle Tween completed! x1");
          },
        }
      )
      .start();
  }

  public spawnObstacle() {
    const obstacle = this.getObstacleFromPool();
    const spawnX = Math.random() > 0.5 ? 4 : -4; // Rastgele x pozisyonu
    obstacle.setPosition(new Vec3(spawnX, this.spawnPosY, 0));
    obstacle.active = true;
    this.activeObstacles.push(obstacle);
    this.spawnPosY += 0.4;

    this.tweenObstacle(obstacle);
  }

  public firstSpawn() {
    this.scheduleOnce(() => {
      this.spawnObstacle();
    }, this.firstSpawnDur);
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

  public resetPool() {
    this.spawnPosY = 0.4;
    while (this.activeObstacles.length > 0) {
      const obstacle = this.activeObstacles.pop();
      if (obstacle) {
        obstacle.setPosition(new Vec3(-5, 0, -5));
        obstacle.active = false;
        obstacle.getComponent(BoxCollider).enabled = true;
        this.obstaclePool.push(obstacle);
      }
    }
  }
}
