/**
 *  前端JS常用进行封装
 *  @auth xlx_good@qq.com
 *  @date 2013-3-14
 * 
 */
'use strict';


(function(win, doc){
	/**
	 * 浏览器类型判断
	 * @return [boolean] 
	 */
	var ua = navigator.userAgent;
	var browser = {
		ios: /iphone|ipod|ipad/i.test(ua),
		android: /android/i.test(ua),
		wechat: /micromessenger/i.test(ua),
		weibo: /weibo/i.test(ua),
		opera: /opera/i.test(ua) || /opr/i.test(ua),
		firefox: /firefox/i.test(ua),
		chrome: /chrome/i.test(ua) && !/opr/i.test(ua),
		safari: /safari/i.test(ua) && !/chrome/i.test(ua),
		ie: /msie/i.test(ua) || (!!win.ActiveXObject || "ActiveXObject" in win)
	};
	win.browser = browser;
})(window, document);

(function(win, doc){
	/**
	 * 判断对象是否为方法
	 * @param  {object}  target [判断的对象]
	 * @return {Boolean}        [true,对象为方法]
	 */
	function isFunction(target){
		return typeof target === 'function';
	}
	function isArray(target){
		return Array.isArray(target);
	}
	function isJSON(target){
		return toString.call(target) === '[object Object]';
	}
	function isNumber(target){
		return typeof target === 'number';
	}
	function isBool(target){
		return typeof target === 'boolean';
	}
	function isString(target){
		return typeof target === 'string';
	}
	function isNodeList(target){
		return toString.call(target) === '[object NodeList]';
	}
	win.isFunction = isFunction;
	win.isArray = isArray;
	win.isJSON = isJSON;
	win.isNumber = isNumber;
	win.isBool = isBool;
	win.isString = isString;
	win.isNodeList = isNodeList;
})(window, document);

(function(win, doc){
	/**
	 * 查询dom
	 * @param  {[Object]} selector [id,class,dom标签]
	 * @param  {HTMLobject} context  [dom上下文]
	 * @return {HTMLobject}          [dom对象]
	 */
	function $(selector, context){
		if(!selector){
			return;		
		}
		context = context || doc;
		return context.querySelector(selector);
	}

	/**
	 * 查询dom集合
	 * @param  {[Object]} selector [id,class,dom标签]
	 * @param   {[type]} context  [dom上下文]
	 * @return {HTMLCollection} 获取到的对象集
	 */
	function $a(selector, context){
		if(!selector){
			return;		
		}
		context = context || doc;
		return context.querySelectorAll(selector);
	}

	/**
	 * 根据id获取dom 
	 * @return {HTMLobject}          [dom对象]
	 */
	function $id(id){
		if(!id){
			return;		
		}
		return doc.getElementById(id);
	}

	win.$ = $;
	win.$a = $a;
	win.$id = $id;
})(window, document);

(function(win, doc){
	
	/**
	 * 绑定事件
	 * @param  {HTMLCollection} nodes   [绑定事件的元素]
	 * @param  {[type]} types   [绑定类型]
	 * @param  {[type]} handler [事件处理函数]
	 */
	function bind(nodes, types, handler,useCapture){
		nodes = isString(nodes) ? $a(nodes) : nodes;
		nodes = isNodeList(nodes) ? nodes : [nodes];
		types = types.split(' ');
		useCapture = arguments[3] || false;
		nodes.forEach(function(node){
			types.forEach(function(type){
				node.addEventListener(type, handler, useCapture);	
			});	
		});
	}
	/**
	 * 解绑事件
	 * @param  {HTMLCollection} nodes   [解绑事件的元素]
	 * @param  {[type]} types   [解绑类型]
	 * @param  {[type]} handler [事件处理函数]
	 */
	function unbind(nodes, types, handler,useCapture){
		nodes = isString(nodes) ? $a(nodes) : nodes;
		nodes = isNodeList(nodes) ? nodes : [nodes];
		types = types.split(' ');
		useCapture = arguments[3] || false;
		nodes.forEach(function(node){
			types.forEach(function(type){
				node.removeEventListener(type, handler, useCapture);	
			});	
		});
	}

	win.bind = bind;
	win.unbind = unbind;
})(window, document);

(function(win){

	function noop(){}
	/**
	 * ajax请求
	 * @param  {json} options [如jq]
	 * 
	 */
	function ajax(options){
		var xhr,reqData,tempParam,timeoutTimer,resData;
		if(win.XMLHttpRequest){
			//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
 			xhr = new XMLHttpRequest()
		} else { 
			// IE6, IE5 浏览器执行代码
		    xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		var defaultOptions = {
			url: '',
			type: 'get',
			dataType: 'json',
			before: noop,
			succrss: noop,
			error: noop,
			timeout:1
		}
		options = Object.assign(defaultOptions,options);
		reqData = options.data;
		var beforeHandler = isFunction(options.before) ? options.before : noop,
			successHandler = isFunction(options.success) ? options.success : noop,
			errorHandler = isFunction(options.error) ? options.error : noop;
		if(isJSON(reqData)){
			tempParam = [];
			for(var k in reqData){
				tempParam.push(encodeURIComponent(k) + '=' + encodeURIComponent(reqData[k]));
			}
			reqData = tempParam.join('&');
		}
		if (options.type.toUpperCase() !== 'POST') {
			options.url += (options.url.indexOf('?') > -1 ? '&' : '?') + reqData;
		}
		xhr.onreadystatechange = function(){
			if (timeoutTimer) {
				clearTimeout(timeoutTimer);
				timeoutTimer = null;
			}
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					resData = xhr.responseText;
					if (resData) {
						if (options.dataType.toLowerCase() === 'json') {
							try {
								resData = JSON.parse(resData);
							} catch (e) {
								errorHandler('parseerror');
								return;
							}
						}
						successHandler(resData);
					} else {
						errorHandler('emptydata');
					}
				} else {
					errorHandler(xhr.statusText || xhr.cancel ? 'cancel' : 'abort');
			}	
			if (beforeHandler() === false) {
				xhr = null;
				errorHandler('cancel');
				return xhr;
			}
			if (options.timeout > 0) {
				timeoutTimer = setTimeout(function () {
					xhr.cancel = true;
					xhr.abort();
					errorHandler('timeout');
				}, options.timeout);
			}
		}
        xhr.open(options.type, options.url, true);
		xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"); 
		if (options.type == 'POST') {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		}
		xhr.send(reqData);
		return xhr;
	}
	window.ajax = ajax;
})(window);

(function(win, doc){
	/**
	 * 获取/设置标签属性
	 * @param {HTMLElement} node
	 * @param {string} name 属性名
	 * @param {string} [value] 没有这个参数时为获取属性
	 */
	function attr(node, name, value) {
		return value ? node.setAttribute(name, value) : node.getAttribute(name);
	}
	win.attr = attr;
	
})(window, document);











