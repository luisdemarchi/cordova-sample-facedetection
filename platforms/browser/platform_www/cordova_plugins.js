cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.virtuoworks.cordova-plugin-canvascamera/www/CanvasCamera.js",
        "id": "com.virtuoworks.cordova-plugin-canvascamera.CanvasCamera",
        "pluginId": "com.virtuoworks.cordova-plugin-canvascamera",
        "clobbers": [
            "plugin.CanvasCamera",
            "CanvasCamera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-facedetection-lite/www/FaceDetection.js",
        "id": "cordova-plugin-facedetection-lite.FaceDetection-Lite",
        "pluginId": "cordova-plugin-facedetection-lite",
        "clobbers": [
            "facedetection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-facedetection-lite/src/browser/FaceDetectionProxy.js",
        "id": "cordova-plugin-facedetection-lite.FaceDetectionProxy",
        "pluginId": "cordova-plugin-facedetection-lite",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-facedetection-lite/src/browser/pico.min.js",
        "id": "cordova-plugin-facedetection-lite.Pico",
        "pluginId": "cordova-plugin-facedetection-lite",
        "merges": [
            "Pico"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-compat": "1.2.0",
    "com.virtuoworks.cordova-plugin-canvascamera": "1.1.8",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-facedetection-lite": "0.3.4"
}
// BOTTOM OF METADATA
});