import selfStorage from "../utils/storage";

class Interval {

    key: string = "initInterValId"

    interValId: number | undefined

    latestOpTime:number //mills seconds

    constructor(key:string) {
        this.interValId = selfStorage.getItem(this.key)
        this.key = key;
    }

    start(fn: Function, t: number,breakFlag:boolean = false) {
        fn();
        this.stop();
        if(breakFlag){
            this.latestOpTime = Date.now();
            this.interValId = window.setInterval(() => {
                if(Date.now() - this.latestOpTime  < 3 * 60 * 1000){
                    fn()
                }
            }, t)
        }else{
            this.interValId = window.setInterval(() => {
                fn()
            }, t)
        }
        selfStorage.setItem(this.key, this.interValId);
    }

    stop() {
        if (this.interValId) {
            selfStorage.removeItem(this.key)
            clearInterval(this.interValId)
        }

    }
}

const interVar = new Interval("homeIntervalId");
const interVarSwap = new Interval("swapIntervalId");
const interVarEpoch = new Interval("interVarEpochId");

export default interVar

export {
    interVarSwap,interVarEpoch
}