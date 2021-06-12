var setting = require('./../Config/setting');

var RateLimiter = {
    data : {},
    ipBlackList : {},
    check : function (ip){
        var result = false;
        var now = new Date();
        //check if ip is in blacklist
        if (this.ipBlackList.hasOwnProperty(ip)){
            var item = this.ipBlackList[ip];
            if ( now - item.blockStart >= setting.DdosLimitOptions.blockSeconds * 1000){
                delete this.ipBlackList[ip];
                result = true;
                this.data[ip] = [];
                this.data[ip].push({
                    requestTime : now
                });
            }else{
                result = false;
            }
            return result;
        }

        //check if ip continuously requesting.
        if (this.data.hasOwnProperty(ip)){
            this.data[ip].push({
                requestTime : now
            });
            var len = this.data[ip].length;
            //clear the expired requests
            for (var i = len-1 ; i >= 0 ; i--){
                var item = this.data[ip][i];
                if (now - item.requestTime > setting.DdosLimitOptions.seconds * 1000){
                    this.data[ip].splice(i, 1);
                }
            }

            //check if the count of ip request
            if(this.data[ip].length >= setting.DdosLimitOptions.requestLimit){
                result = false;
                this.ipBlackList[ip] = [];
                delete this.data[ip];
                this.ipBlackList[ip].blockStart = now;
            } else {
                result = true;
            }

        } else {
            //newly added ip request
            this.data[ip] = [];
            this.data[ip].push({
                ip:ip,
                requestTime : now
            });
            result = true;
        }
        return result;
    }
};
module.exports = RateLimiter;