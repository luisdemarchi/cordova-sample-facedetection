cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.virtuoworks.cordova-plugin-canvascamera.CanvasCamera",
      "file": "plugins/com.virtuoworks.cordova-plugin-canvascamera/www/CanvasCamera.js",
      "pluginId": "com.virtuoworks.cordova-plugin-canvascamera",
      "clobbers": [
        "plugin.CanvasCamera",
        "CanvasCamera"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-facedetection-lite.FaceDetection-Lite",
      "file": "plugins/cordova-plugin-facedetection-lite/www/FaceDetection.js",
      "pluginId": "cordova-plugin-facedetection-lite",
      "clobbers": [
        "facedetection"
      ]
    }
  ];
  module.exports.metadata = {
    "com.virtuoworks.cordova-plugin-canvascamera": "1.1.8",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-facedetection-lite": "0.3.4"
  };
});