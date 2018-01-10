/**
 *
 *  @auth xlx_good@qq.com
 *  @date 17/12/28.
 *
 */

-(function (window) {
    /**
     * 科隆终端与网关通信协议数据解析
     * @param <String> 车机上报数据
     * */
    function KLTCP(msg) {
        this.msg = msg;
        this.info = [];
        this.parse();
    }

    KLTCP.prototype = {
        /**
         * 解析数据
         * */
        parse: function () {
            var msg = this.msg.split(' ');
            var header = msg.splice(0,2); //消息头部
            var len = msg.splice(0,2);//消息长度
            var num = msg.splice(0,2);//流水号
            var deviceId = msg.splice(0,7);//设备ID
            var funId = msg.splice(0,2).join('');//功能ID
            console.log(funId);
            switch (funId){
                case '0021':
                    this.eventInfo(msg);
                    break;
            }
            this.info.push({"消息头部": to16Str(header)});
            this.info.push({"消息长度": to16(len)});
            this.info.push({"流水号": to16(num)});
            this.info.push({"设备ID": to16Str(deviceId.splice(0,1)) + deviceId.splice(0,6).join('')});
            this.info.push({"功能ID": funId});
        },
        /**
         * 解析事件信息包
         * @param <array>
         * */
        eventInfo: function (msg) {
            var packageNum = msg.splice(0,1);//包个数
            var posC = msg.splice(0,1);//当前定位类型
            if(to8(posC) == 1){ //GPS包 49字节
                var _gpsData = msg.splice(0, 49);
                this.GPS(_gpsData)
            }else{ // @todo 2 GSM基站定位 55字节
                var _bsData = msg.splice(0, 55);
            }
            var eventType = '0x' + msg.splice(0,2).join(''); //事件类别
            var attachLen = msg.splice(0,2); //附带信息数据内容长度
            var attach = msg.splice(0, to16(attachLen)); // 附带信息
            switch (eventType){//事件类别
                case '0x0011':
                    this.fireOff(attach);
                    break;
            }

            this.info.push({"包个数": to8(packageNum)});
            this.info.push({"当前定位类型": {1: 'GPS定位',2: 'GSM基站定位'}[to8(posC)]});
            this.info.push({"事件类型": eventType });
            this.info.push({"附带数据内容长度":  to16(attachLen)});
        },
        /**
         * 解析GPS包
         * @param <array>
         * */
        GPS: function (msg) {
            var time = msg.splice(0,6); //时间信息
            var lat = msg.splice(0,4);//纬度
            var lnt  = msg.splice(0,4);//经度
            var speed = msg.splice(0,2); //速度
            var direction = msg.splice(0,2); //方向
            var height = msg.splice(0,4); //海拔
            var moon = msg.splice(0,1); // 卫星数
            var PDOP = msg.splice(0,1); // PDOP精度
            var HDOP = msg.splice(0,1); // HDOP精度
            var VDOP = msg.splice(0,1); // HDOP精度
            var status = msg.splice(0,1); // 状态位
            var voltage = msg.splice(0,2); // 电瓶电压
            var carSpeed = msg.splice(0,2);//车速
            var machineSpeed = msg.splice(0,2);//发动机转速
            var mileage = msg.splice(0,4);//累计里程
            var oil = msg.splice(0,4);//累计油耗
            var travelTime = msg.splice(0,4);//累计行驶时间
            var gpslTime = msg.splice(0,4);//GPS信息时间戳

            this.info.push({"时间信息": toTime(time)});
            this.info.push({"纬度":  to16(lat)*0.000001});
            this.info.push({"经度":  to16(lnt)*0.000001});
            this.info.push({"速度":  to16(speed)});
            this.info.push({"方向":  to16(direction)*0.1});
            this.info.push({"海拔":  to16(height)*0.1 + '米'});
            this.info.push({"卫星数":  to8(moon)});
            this.info.push({"PDOP精度":  to8(PDOP)*0.1});
            this.info.push({"HDOP精度":  to8(HDOP)*0.1 });
            this.info.push({"VDOP精度":  to8(VDOP)*0.1});
            this.info.push({"状态位": {0: '无效', 1: '有效'}[to8(status)]});
            this.info.push({"电瓶电压":  to16(voltage)*0.01 + 'v'});
            this.info.push({"车速": to16(carSpeed)*0.1 + 'km/h'});
            this.info.push({"发动机转速":  to16(machineSpeed)});
            this.info.push({"累计里程":  to32(mileage) + '米'});
            this.info.push({"累计油耗":  to32(oil) + 'mL'});
            this.info.push({"累计行驶时间": to32(travelTime) + 's' });
            this.info.push({"GPS信息时间戳": to16(gpslTime) + 's' });
        },
        /**
         * 解析熄火事件附带信息
         * @param <array>
         * */
        fireOff: function (arr) {
            var speedUp = arr.splice(0,2);// 急加速总次数
            var speedDown = arr.splice(0,2);// 急减速总次数
            var wheel = arr.splice(0,2);// 急转弯总次数
            var safe = arr.splice(0,20);// 安防数据
            this.info.push({"急加速总次数": to16(speedUp)});
            this.info.push({"急减速总次数": to16(speedDown)});
            this.info.push({"急转弯总次数": to16(wheel)});
            this.info.push({"安防数据": to8(safe)});
        },
        /**
         * 把数据解析成JSON 格式；
         * */
        toJSON: function () {
            var _data = {};
           for (var i=0; i<this.info.length; i++){
               Object.assign(_data, this.info[i]);
           }
            return _data;
        }
    }


    function to32(arr) {
        return parseInt(arr.join(''), 32)
    }
    function to16(arr) {
        return parseInt(arr.join(''), 16);
    }
    function to8(arr) {
        return parseInt(arr.join(''), 8);
    }

    function to16Str(arr) {
        for(var i=0; i<arr.length;  i++){
            arr[i] = String.fromCharCode(parseInt(arr[i], 16));
        }
        return arr.join('');
    }
    function toTime(arr) {
        for(var i=0; i<arr.length;  i++){
            arr[i] = parseInt(arr[i], 16);
        }
        return arr[0] + '年' + arr[1] +'月' + arr[2] + '日' + arr[3] + '时' + arr[4] + '分' + arr[5] + '秒';
    }


    /**
     * CRC16校验
     * @param <string>
     * */
    function Caculate(msg) {
        var crc = 0xFFFF;
        var c15,bit;
        for(var i=0; i<msg.length; i++){
            for(var j=0; j<8; j++){
                c15 = ((crc >> 15 & 1) == 1);
                bit = ((msg[i] >> (7 - j) & 1) == 1);
                crc <<= 1;

                if (c15 ^ bit) crc ^= 0x1021;
            }
        }
        return crc;
    }

    window.KLTCP = KLTCP;
    window.Caculate = Caculate;

})(window);