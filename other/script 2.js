(function() {
    'use strict';

    /*
     * Variables that are not in the global namespace
     */

    var i;
    var g = {
        mouse: {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        },
        divBox: null
    };

    /*
     * Start/End the drawing box process
     */

    function startMouse() {
        if (g.divBox === null) {
            g.mouse.startX = g.mouse.x;
            g.mouse.startY = g.mouse.y;
            g.divBox = document.createElement('div');
            g.divBox.className = 'box';

            function checkAndChange(elem, prop) {
                for (i = 0; i < elem.children.length; i++) {
                    if (elem.children[i].style.color === 'white') {
                        g.divBox.style[prop] = elem.children[i].innerHTML;
                    }
                }
            }
            checkAndChange(color, 'borderColor');
            checkAndChange(borderWidth, 'borderWidth');
            g.divBox.style.left = g.mouse.x + 'px';
            g.divBox.style.top = g.mouse.y + 'px';
            image.appendChild(g.divBox);
            image.style.cursor = 'crosshair';
        } else {
            g.divBox = null;
            image.style.cursor = '';
        }
    }

    /*
     * Change the background-color and color of toggles
     * #black and #white affect the color of the drawed boxes
     * #drag and #clickAndDrag affect how boxes are drawed
     */

    function setToggle() {
        function select(elem) {
            elem.style.backgroundColor = '#16a085';
            elem.style.color = 'white';
        }
        select(black);
        select(twoPX);
        select(drag);

        function toggleColors(THIS) {
            var childrenElem = THIS.parentElement.children;
            for (i = 0; i < childrenElem.length; i++) {
                childrenElem[i].style.backgroundColor = '#e8e8e8';
                childrenElem[i].style.color = 'black';
            }
            select(THIS);
        }

        function setBorder(prop, val) {
            var boxes = document.getElementsByClassName('box');
            if (boxes[0] !== undefined) {
                for (i = 0; i < boxes.length; i++) {
                    boxes[i].style[prop] = val;
                }
            }
        }
        for (i = 0; i < color.children.length; i++) {
            color.children[i].onclick = function() {
                toggleColors(this);
                setBorder('borderColor', this.innerHTML);
            };
        }
        onePX.onclick = function() {
            toggleColors(this);
            setBorder('borderWidth', this.innerHTML);
        };
        twoPX.onclick = function() {
            toggleColors(this);
            setBorder('borderWidth', this.innerHTML);
        };
        drag.onclick = function() {
            toggleColors(this);
            image.removeEventListener('click', startMouse);
            image.addEventListener('mousedown', startMouse);
            image.addEventListener('mouseup', startMouse);
        };
        clickAndDrag.onclick = function() {
            toggleColors(this);
            image.removeEventListener('mousedown', startMouse);
            image.removeEventListener('mouseup', startMouse);
            image.addEventListener('click', startMouse);
        };
    }
    setToggle();

    /*
     * Drawing boxes
     * http://stackoverflow.com/questions/17408010/drawing-a-rectangle-using-click-mouse-move-and-click
     */

    function initDraw() {
        function setMousePos(e) {
            var ev = e || window.event; //Moz || IE
            if (ev.pageX) { //Moz
                g.mouse.x = ev.pageX + window.pageXOffset;
                g.mouse.y = ev.pageY + window.pageYOffset;
            } else if (ev.clientX) { //IE
                g.mouse.x = ev.clientX + document.body.scrollLeft;
                g.mouse.y = ev.clientY + document.body.scrollTop;
            }
        }

        image.onmousemove = function() {
            setMousePos(event);
            if (g.divBox !== null) {
                g.divBox.style.width = Math.abs(g.mouse.x - g.mouse.startX) + 'px';
                g.divBox.style.height = Math.abs(g.mouse.y - g.mouse.startY) + 'px';
                g.divBox.style.left = (g.mouse.x - g.mouse.startX < 0) ? g.mouse.x + 'px' : g.mouse.startX + 'px';
                g.divBox.style.top = (g.mouse.y - g.mouse.startY < 0) ? g.mouse.y + 'px' : g.mouse.startY + 'px';
            }
        };
        image.addEventListener('mousedown', startMouse);
        image.addEventListener('mouseup', startMouse);
        image.addEventListener('mouseleave', function() {
            g.divBox = true;
            startMouse();
        });
    }
    initDraw();
	
	// Get URL parameters
	// http://www.cnblogs.com/shengxiang/archive/2011/09/19/2181629.html
	function GetURLParam(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]);
		return null;
	}
	
	// Post data to AMT server
	// http://www.jb51.net/article/75819.htm
	function postData(url,params){
		var temp=document.createElement("form");
		temp.action=url;
		temp.method="post";
		temp.style.display="none";
		for(var x in params){
			var opt=document.createElement("textarea");
			opt.name=x;
			opt.value=params[x];
			temp.appendChild(opt);
		}
		document.body.appendChild(temp);
		temp.submit();
		return temp;
	}

    /*
     * Submit, undo, cancel
     */

    function btnFunc() {
        submit.onclick = function() {
            
            //insert code here to transfer data to database
			var websocket=null;
			if('WebSocket' in window){
				websocket=new WebSocket("wss://121.42.45.176:8443/websocket_server/mark");
			}else{
				alert("Your browser does not support websocket!");
			}
			
			//Called on error
			websocket.onerror=function(){
				alert("Something went wrong...");
			}
			
			//Called when connection established
			websocket.onopen=function(){
				var tempImg = new Image();
				tempImg.src = 'streets.jpg';
				function convert(val, prop) {
					if ((val + '').match(/px/)) {
						val = +(val.slice(0, val.length - 2));
					}
					return Math.round(val * tempImg[prop] / image.children[0][prop]);
				}
				if (image.children.length > 1) {
					var jsonObj={
						nwidth:tempImg.width,
						nheight:tempImg.height,
						rects:[]
					}
					for (i = 1; i < image.children.length; i++) {
						var imageRect = image.children[0].getBoundingClientRect();
						var boxRect = image.children[i].getBoundingClientRect();
						var x = Math.abs(boxRect.left - imageRect.left);
						var y = Math.abs(boxRect.top - imageRect.top);
						var temp={
							num:i,
							width:convert(image.children[i].style.width, 'width'),
							height:convert(image.children[i].style.height, 'height'),
							x:convert(x, 'width'),
							y:convert(y, 'height')
						};
						jsonObj.rects.push(temp);
					}
					websocket.send(JSON.stringify(jsonObj));
				}
				websocket.close();
				
				//Submit answer to AMT server
				alert("assignmentId:"+GetURLParam("assignmentId")+"\n"
					 +"hitId"+GetURLParam("hitId")+"\n"
					 +"workerId"+GetURLParam("workerId")+"\n"
					 +"turkSubmitTo"+GetURLParam("turkSubmitTo"));
				postData("https://workersandbox.mturk.com/mturk/externalSubmit",{assignmentId:GetURLParam("assignmentId"),state:"ok"});
				
			}
			
			//Called on message
			websocket.onmessage=function(event){
				//event.data
			}
			
			//Called on close
			websocket.onclose=function(){
				
			}
			
			//Auto close connection on exit
			window.onbeforeunload=function(){
				websocket.close();
			}
			
        };
        undo.onclick = function() {
            if (image.children.length > 1) {
                image.removeChild(image.children[image.children.length - 1]);
            }
        };
        cancel.onclick = function() {
            if (image.children.length > 1) {
                image.innerHTML = '<img src="streets.jpg">';
            }
        };
    }
    btnFunc();

    /*
     * Delete all boxes when the browser window is resized
     */

    function resize() {
        window.onresize = function() {
            image.innerHTML = '<img src="streets.jpg">';
        };
    }
    resize();
})();
