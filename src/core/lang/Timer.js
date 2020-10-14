class Timer {
    constructor(runnableObject,period) {
        this.runnableObject = runnableObject;
        this.intervalId = null;
        this.period = period;
    }

    schedule(runnableObject,period){
        this.runnableObject = runnableObject;
        this.intervalId = null;
        this.period = period;
        this.start();
    }

    start(){
        if(this.intervalId)
            throw new Error(`El Timer ya se encuentra en ejecución.`);
        var this_ = this;
        this.intervalId = setInterval(function(){
            this_.runnableObject.run();
        }, this.period);
    }

    stop(){
        if(this.intervalId)
            clearInterval(this.intervalId);
        this.intervalId = null;
    }
}