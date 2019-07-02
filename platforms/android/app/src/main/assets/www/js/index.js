var app = new App();
function onDeviceReady() {
    app.init();
}
function App() {
    var deviceVersion;
    var isAndroidApp = true;
    var isIosApp = false;
    var isBrowserApp = false;
    var isOldDevice = false;

    var cameraPreview;
    var cameraIosPreview;
    var canvasPreview;
    var canvasPreviewCtx;
    var facePreviewCtx;

    var cameraScale = 0;
    var cameraWidth;
    var cameraHeight;
    var cameraMiniWidth;
    var cameraMiniHeight;

    var faceBox = {
        size: 0,
        x: 0,
        y: 0
    };


    this.init = function () {
        deviceVersion = parseInt(device.version);
        isAndroidApp = window.device.platform === "Android";
        isIosApp = window.device.platform === "iOS";
        isBrowserApp = (!isAndroidApp && !isIosApp);
        if ((isAndroidApp && deviceVersion <= 7) || (isIosApp && deviceVersion <= 11)) {
            isOldDevice = true;
        }

        var self = this;
        cameraPreview = document.getElementById("cameraPreview");
        cameraIosPreview = document.getElementById("cameraIosPreview");
        canvasPreview = document.getElementById("canvasPreview");

        canvasPreviewCtx = canvasPreview.getContext('2d', { alpha: false });
        facePreviewCtx = document.getElementById("facePreview").getContext("2d", { alpha: false });

        if (isBrowserApp) {
            cameraPreview.style.width = "450px";
            cameraPreview.style.height = "inherit";

            canvasPreview.style.width = "450px";
            canvasPreview.style.height = "inherit";
        }

        if (isIosApp) {
            window.plugin.CanvasCamera.initialize(cameraIosPreview);
        }
        this.openCamera();
        this.initFaceDetection();
    }

    this.openCamera = function () {
        if (isIosApp) {
            var self = this;
            cameraIosPreview.style.display = "inline";
            const options = {
                use: 'file',
                fps: 15,
                hasThumbnail: false,
                cameraFacing: "front",
                onAfterDraw: function (frame) {
                    cameraIosPreview.style.width = "150px";
                    cameraIosPreview.style.height = "inherit";
                    self.handleCameraSize();
                }
            };
            window.plugin.CanvasCamera.start(options);
        } else if (navigator.mediaDevices !== undefined) {
            var videoObj = {
                audio: false,
                video: {
                    width: { min: 320, max: 1800 },
                    height: { min: 320, max: 1800 },
                    frameRate: { ideal: 10, max: 15 },
                    facingMode: { deal: "environment" }
                }
            }

            navigator.mediaDevices.getUserMedia(videoObj).then(function (stream) {
                cameraPreview.srcObject = stream;
                cameraPreview.play();
            }, function (error) {
                console.log("Video capture error: ", error.code);
            })
            cameraPreview.onloadedmetadata = this.handleCameraSize;
        } else {
            var errBack = function (error) {
                console.log("Video capture error: ", error.code);
            };

            var videoObj = {
                "video": true,
                "audio": false
            }

            var browser = navigator;

            browser.getUserMedia = (
                browser.getUserMedia ||
                browser.webkitGetUserMedia ||
                browser.mozGetUserMedia ||
                browser.msGetUserMedia
            );

            browser.getUserMedia(videoObj, function (stream) {
                cameraPreview.src = window.URL.createObjectURL(stream);
                cameraPreview.play();
            }, errBack);
            cameraPreview.onloadedmetadata = this.handleCameraSize;
        }
    }

    this.handleCameraSize = function () {
        if (isIosApp) {
            //            if (cameraScale !== undefined){
            //                return;
            //            }
            cameraWidth = cameraIosPreview.width;
            cameraHeight = cameraIosPreview.height;
        } else {
            if (cameraPreview === undefined) {
                cameraPreview = document.getElementById("cameraPreview");
                canvasPreview = document.getElementById("canvasPreview");
                canvasPreviewCtx = canvasPreview.getContext('2d', { alpha: false });
            }
            cameraWidth = cameraPreview.videoWidth;
            cameraHeight = cameraPreview.videoHeight;
        }

        const maxSize = Math.max(cameraWidth, cameraHeight);
        var cameraScaleTemp;
        if (isOldDevice) {
            cameraScaleTemp = 62 / maxSize;
        } else {
            cameraScaleTemp = 95 / maxSize;
        }
        if (cameraScale != cameraScaleTemp) {
            cameraScale = cameraScaleTemp;
            cameraMiniWidth = parseInt(cameraWidth * cameraScale);
            cameraMiniHeight = parseInt(cameraHeight * cameraScale);

            canvasPreview.width = cameraMiniWidth;
            canvasPreview.height = cameraMiniHeight;
        }
    }

    this.initFaceDetection = function () {
        var self = this;
        const sizeFrameMemory = isOldDevice ? 5 : 30;
        facedetection.initFaceDetection(sizeFrameMemory, "./facefinder", function (result) {
            self.processFrame();
            self.updateFacePreview();
        });
    }

    this.processFrame = function () {
        var self = this;
        if (canvasPreviewCtx === undefined || cameraMiniWidth === undefined || Number.isNaN(cameraMiniWidth)) {
            this.handleCameraSize();
        } else {
            canvasPreviewCtx.drawImage(
                isIosApp ? cameraIosPreview : cameraPreview,
                0, 0, cameraWidth, cameraHeight,
                0, 0, cameraMiniWidth, cameraMiniHeight
            );
            var rgba = canvasPreviewCtx.getImageData(0, 0, cameraMiniWidth, cameraMiniHeight).data;

            facedetection.detections(rgba, cameraMiniWidth, cameraMiniHeight, cameraMiniWidth * 0.2, cameraMiniWidth * 1.2, 0.1, function (dets) {
                var greaterFace = Math.max.apply(
                    Math,
                    dets.map(function (o) {
                        return o[2];
                    })
                );

                for (i = 0; i < dets.length; ++i) {
                    var box = dets[i];
                    if (box[2] != greaterFace || box[3] === undefined) {
                        continue;
                    }

                    canvasPreviewCtx.beginPath();
                    canvasPreviewCtx.arc(box[1], box[0], box[2] / 2, 0, 2 * Math.PI, false);
                    canvasPreviewCtx.lineWidth = 1;
                    canvasPreviewCtx.strokeStyle = 'red';
                    canvasPreviewCtx.stroke();

                    faceBox = {
                        x: box[1] - box[2] / 2,
                        y: box[0] - box[2] / 2,
                        size: box[2]
                    }

                }

            });
        }

        window.setTimeout(function () {
            self.processFrame();
        }, isOldDevice ? 110 : 30);
    }

    this.updateFacePreview = function () {
        var loop = function () {
            if (faceBox.x > 0) {
                var size = parseInt(faceBox.size / cameraScale);

                var faceSizeOriginal = document.createElement('canvas');
                faceSizeOriginal.width = size;
                faceSizeOriginal.height = size;
                var faceSizeOriginalCtx = faceSizeOriginal.getContext("2d", { alpha: false });
                faceSizeOriginalCtx.drawImage(
                    isIosApp ? cameraIosPreview : cameraPreview,
                    parseInt(faceBox.x / cameraScale), parseInt(faceBox.y / cameraScale), size, size,
                    0, 0, size, size
                );

                facePreviewCtx.drawImage(
                    faceSizeOriginal,
                    0, 0, faceSizeOriginal.width, faceSizeOriginal.height,
                    0, 0, 400, 400
                );

                cameraIosPreviewTemp = null;
                faceSizeOriginal = null;
                faceSizeOriginalCtx = null;
                facePreview = null;
                delete faceSizeOriginalCtx;
                delete faceSizeOriginal;
                delete facePreview;
                delete cameraIosPreviewTemp;
            }

            if (!isOldDevice) {
                requestAnimationFrame(loop);
            }
        }
        if (isOldDevice) {
            var self = this;
            loop();
            window.setTimeout(function () {
                self.updateFacePreview();
            }, 30);
        } else {
            requestAnimationFrame(loop);
        }
    }
}

document.addEventListener('deviceready', onDeviceReady, false);
