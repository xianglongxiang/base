/**
 *
 *  @auth xlx_good@qq.com
 *  @date 17/10/18.
 *
 */
var pos = {},currIndex;

/**
 * 列表索引
 * */
function indexList(dom) {
    this.dom = dom;
    this.dom.style.cssText = 'height:'+ document.documentElement.offsetHeight +'px;';
    this.list = this.dom.querySelectorAll('li');
    this.createIndexNav();
}
/**
 * 创建右侧导航
 * */
indexList.prototype.createIndexNav = function () {
    var _this = this;
    var div = document.createElement('div');
    div.classList.add('indexlist-nav');
    var ul = document.createElement('ul');
    for(var i=0; i<_this.list .length; i++){
        var li = document.createElement('li');
        var index = _this.list[i].getAttribute('index');
        li.innerText = index;
        pos[index] = _this.list[i];
        ul.appendChild(li);
    }
    div.appendChild(ul);
    _this.dom.parentNode.appendChild(div);
    ul.addEventListener('click', function (e) {
        _this.location(e.target);
    })
    div.addEventListener('touchmove',function(e){
        event.preventDefault();
        e = e || window.event;
        var touch = e.touches[0];
        _this.location(document.elementFromPoint(touch.pageX, touch.pageY));
    })
}
/**
 * 定位
 * @param <document>
 * */
indexList.prototype.location = function (ele) {
    if(ele && ele.innerText && pos[ele.innerText] && currIndex != pos[ele.innerText]){
        this.dom.scrollTop = pos[ele.innerText].offsetTop;
    }
}

new indexList(document.getElementById('indexList'));