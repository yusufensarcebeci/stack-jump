import { _decorator, Component, EventTouch, Node, System, SystemEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchHandle')
export class TouchHandle extends Component {
    start() {
        // Canvas veya herhangi bir node üzerine touch event ekleyin
        // this.node.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        console.log('Touched!');
    }
}


