/**
 *
 *  @auth xlx_good@qq.com
 *  @date 17/12/11.
 *
 */

function Timer(time) {
    this.setInter = null;
    this.time = time || 10;
    this.num = 0;
    this.start();
}
Timer.prototype = {
    start: function () {
        var _this = this;
        if(this.setInter) return;
        this.setInter = setInterval(function () {
            _this.num++;
            postMessage(_this.num);
        },this.time);
    },
    stop: function () {
        clearInterval(this.setInter);
        this.setInter = null;
    }
}

var timerObj = null;
onmessage = function(e) {
    if(e.data.type == 'start'){
        if(timerObj){
            timerObj.start();
        }else{
            timerObj = new Timer(e.data.speed);
        }
    }else if(e.data.type == 'stop'){
        timerObj.stop();
    }
}