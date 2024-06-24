"use strict";
exports.__esModule = true;
var MyWebWorker = /** @class */ (function () {
    function MyWebWorker(expression) {
        if (!expression) {
            throw new Error('必须传入一个函数');
        }
        this.thenFn = null;
        this.workerJSUrl = this.generateWorkerURL(this.generateWorkerJS(expression));
        this.worker = new Worker(this.workerJSUrl);
        this.listenMessage();
    }
    /**
     * 生成worker运行js串
     * @param {Function} expression
     */
    MyWebWorker.prototype.generateWorkerJS = function (expression) {
        return "self.onmessage = async (event) => {\n      const args = event.data || []\n      const result = await ( ".concat(expression.toString(), " ).apply(null, args);\n      self.postMessage(result);\n      return close()\n    }");
    };
    /**
     * 生成worker运行js的远程地址
     */
    MyWebWorker.prototype.generateWorkerURL = function (jsString) {
        var URL = window.URL || window.webkitURL;
        var blob = new Blob([jsString]);
        return URL.createObjectURL(blob);
    };
    MyWebWorker.prototype.listenMessage = function () {
        var _this = this;
        this.worker.onmessage = function (result) {
            var URL = window.URL || window.webkitURL;
            URL.revokeObjectURL(_this.workerJSUrl);
            // 回调
            if (_this.thenFn) {
                _this.thenFn(result.data);
            }
        };
        this.worker.onerror = function (error) { };
    };
    /**
     * 向worker发送消息
     */
    MyWebWorker.prototype.postMessage = function (args) {
        this.workerResult = null;
        this.worker.postMessage(args);
        return this;
    };
    /**
     * 接收
     */
    MyWebWorker.prototype.then = function (fn) {
        this.thenFn = fn;
    };
    return MyWebWorker;
}());
// 用法
// new MyWebWorker(function (startTime) {
//   let num = 0
//   for (let i = 0; i < 10000000000; i++) {
//     num += i
//   }
//   return {
//     startTime,
//     endTime: new Date().toLocaleTimeString(),
//     num
//   }
// })
//   .postMessage([new Date().toLocaleTimeString()])
//   .then((res) => {
//     console.log(res)
//   })
exports["default"] = MyWebWorker;
