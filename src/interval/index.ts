import selfStorage from "../utils/storage";

class Interval {

    key: string = "initInterValId"

    interValId: number | undefined

    constructor() {
        this.interValId = selfStorage.getItem(this.key)
    }

    start(fn: Function, t: number) {
        fn();
        this.stop();
        this.interValId = window.setInterval(() => {
            fn()
        }, t)
        selfStorage.setItem(this.key, this.interValId);
    }

    stop() {
        if (this.interValId) {
            selfStorage.removeItem(this.key)
            clearInterval(this.interValId)
        }

    }
}

const interVar = new Interval();

export default interVar