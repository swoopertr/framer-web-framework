let setting = require('./../Config/setting');

let RateLimiter = {
    data : {},
    ipBlackList : {},
    check : function (ip){
        let result = false;
        let now = new Date();
        //check if ip is in blacklist
        if (this.ipBlackList.hasOwnProperty(ip)){
            let item = this.ipBlackList[ip];
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
            let len = this.data[ip].length;
            //clear the expired requests
            for (let i = len-1 ; i >= 0 ; i--){
                let item = this.data[ip][i];
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