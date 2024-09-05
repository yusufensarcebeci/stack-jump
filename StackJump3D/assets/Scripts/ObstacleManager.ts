import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObstacleManager')
export class ObstacleManager extends Component {
   
    @property(Node) obstacleTest : Node= null;



    // obstacle prefab al

    // sahne yüklernirken belirli sayıda tane üret

    protected start(): void {
        const currentPosition = this.obstacleTest.position;

        const pos = new Vec3(
            currentPosition.x+5,
            currentPosition.y,
            currentPosition.z
          );
        tween(this.obstacleTest)
        .to(2,{position: pos})
        .start();

        
    }
}


