/**
 *
 *  @auth xlx_good@qq.com
 *  @date 2018/6/23.
 *
 */
var canvas = document.getElementById("canvas");
var clientW = document.body.clientWidth
var clientH = document.body.clientHeight
canvas.width = clientW
canvas.height = clientH

if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
}

var radio = 1, index = 0, scale = .985, isPay=false

function draw() {
    if (index + 1 != imgList.length) {

        if (radio < imgList[index + 1].areaW / imgList[index + 1].imgW && (index++, radio = 1, !imgList[index + 1])){
            return console.log(0);
        }


        imgNext = imgList[index + 1],
            imgCur = imgList[index],

            img_oversize = init(imgNext.link),

            img_minisize = init(imgCur.link),

            ctx.clearRect(0, 0, canvas.width, canvas.height),

             drawImgOversize(img_oversize, imgNext.imgW, imgNext.imgH, imgNext.areaW, imgNext.areaH, imgNext.areaL, imgNext.areaT, radio),
             drawImgMinisize(img_minisize, imgCur.imgW, imgCur.imgH, imgNext.imgW, imgNext.imgH, imgNext.areaW, imgNext.areaH, imgNext.areaL, imgNext.areaT, radio);
        move();
    }

    isPay && requestAnimationFrame(draw);
}

function init(src) {
    var image = new Image();
    image.src = baseUrl + src;
    return image
}

function move() {
    radio = radio * 0.995;

}

function stop() {
    isPay = false
}
function start() {
    isPay = true
    index = 0
    draw()
}


function drawImgMinisize(img_minisize, imgCurImgW, imgCurImgH, imgNextImgW, imgNextImgH, imgNextAreaW, imgNextAreaH, imgNextAreaL, imgNextAreaT, radio) {

    var sx = 0,
        sy = 0,
        swidth = imgCurImgW,
        sheight = imgCurImgH,
        x = (imgNextAreaW / radio - imgNextAreaW) * (imgNextAreaL / (imgNextImgW - imgNextAreaW)) * radio * clientW / imgNextAreaW,
        y = (imgNextAreaH / radio - imgNextAreaH) * (imgNextAreaT / (imgNextImgH - imgNextAreaH)) * radio * clientH / imgNextAreaH,
        width = clientW,
        height = clientH;

    ctx.drawImage(img_minisize, sx, sy, swidth, sheight , x, y, clientW * radio, clientH * radio)
};


function drawImgOversize(img_oversize, imgNextImgW, imgNextImgH, imgNextAreaW, imgNextAreaH, imgNextAreaL, imgNextAreaT, radio) {

    var sx = imgNextAreaL - (imgNextAreaW / radio - imgNextAreaW) * (imgNextAreaL / (imgNextImgW - imgNextAreaW)),
        sy = imgNextAreaT - (imgNextAreaH / radio - imgNextAreaH) * (imgNextAreaT / (imgNextImgH - imgNextAreaH)),
        swidth = imgNextAreaW / radio,
        sheight = imgNextAreaH / radio,
        x = 0,
        y = 0,
        width = clientW,
        height = clientH;

    ctx.drawImage(img_oversize, sx, sy, swidth, sheight, x, y, clientW, clientH)
}