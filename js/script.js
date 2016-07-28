(function() {
    'use strict';

    /*
     * Global Variables
     */

    var i;
    var length;
    var g = {
        mouse: {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        },
        divBox: null,
        numImg: 24,
        imgVal: '',
        boolean: true
    };

    /*
     * Global, short, usable functions
     */
    function checkCSS(elem, prop, val) {
        /*
         * elem: The DOM element to check CSS
         * prop: The property of the DOM element
         * val: The possible value of the property of the DOM element
         */
        prop = prop ? prop : 'color';
        val = val ? val : 'rgb(255, 255, 255)';
        return $(elem).css(prop) === val;
    }

    function changeCountBoxes(num) {
        /*
         * num: A number that is added to countBoxes.innerHTML
         */
        countBoxes.innerHTML = +countBoxes.innerHTML + num;
        if (+countBoxes.innerHTML < 0) {
            countBoxes.innerHTML = 0;
        }
    }

    function destroy() {
        $(magnifyIcon).removeClass('magnifyIcon');
        $('.magnify').remove();
        $(image).prepend('<img class="zoom" src="' + g.imgVal + '" data-magnify-src="' + g.imgVal + '">');
    }

    function changeSource() {
        var imgNum = Math.ceil(Math.random() * g.numImg);
        g.imgVal = 'pictures/img' + imgNum + '.jpg';
        $('.zoom')[0].src = g.imgVal;
        $('.zoom').attr('data-magnify-src', g.imgVal);
    }
    changeSource();

    function checkBoxes() {
        if (image.children.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    function removeBoxes() {
        if (checkBoxes()) {
            $('.box').remove();
        }
        changeCountBoxes(-countBoxes.innerHTML);
    }

    /*
     * Change the background-color and color of toggles
     * #black and #white affect the color of the drawed boxes
     * #drag and #clickAndDrag affect how boxes are drawed
     */

    function setToggle() {
        function select(elem) {
            /*
             * elem: A DOM element that is animated with a green background and white text
             */
            $(elem).animate({
                backgroundColor: '#16a085',
                color: 'white'
            }, 150, 'easeOutQuad');
        }

        function toggleColors(elem) {
            /*
             * elem: A DOM element that turns back to a grey background and black text, along with its siblings
             */
            var childrenElem = elem.parentElement.children;
            for (i = 0, length = childrenElem.length; i < length; i++) {
                $(childrenElem[i]).css('background-color', '#e8e8e8');
                $(childrenElem[i]).css('color', 'black');
            }
            select(elem);
        }

        function setProp(prop, val, text) {
            /*
             * prop: CSS property to change for .box elements
             * val: CSS value to use
             */
            var boxes = document.getElementsByClassName('box');
            for (i = 0; i < boxes.length; i++) {
                if (!text || boxes[i].innerHTML === '<p>' + text + '</p>') {
                    $(boxes[i]).css(prop, val);
                }
            }
        }

        function colors() {
            setProp('color', this.value, this.previousSibling.innerHTML);
            setProp('border-color', this.value, this.previousSibling.innerHTML);
        }

        person.onclick = function() {
            toggleColors(this);
        };
        automobile.onclick = function() {
            toggleColors(this);
        };
        color1.oninput = colors;
        color2.oninput = colors;
        onePX.onclick = function() {
            toggleColors(this);
            setProp('border-width', this.innerHTML);
        };
        twoPX.onclick = function() {
            toggleColors(this);
            setProp('border-width', this.innerHTML);
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
        magnifyIcon.onclick = function() {
            if ($(magnifyIcon).hasClass('magnifyIcon') === true) {
                destroy();
            } else {
                $(magnifyIcon).addClass('magnifyIcon');
                $('.zoom').attr('height', $('.zoom').height() + 'px');
                $('.zoom').magnify();
            }
        };
    }
    setToggle();

    /*
     * Start/End the drawing box process
     */

    function startMouse() {
        function checkAndChange(elem, prop, bool) {
            /*
             * elem: parent element containing the children elements to check and set CSS value
             * prop: CSS property to set the boxes (DOM style)
             * bool: If it's true, the CSS value comes from elem.children[i]. If it's false, the CSS value comes from its next sibling.
             */
            for (i = 0, length = elem.children.length; i < length; i++) {
                if (checkCSS(elem.children[i])) {
                    if (bool) {
                        g.divBox.style[prop] = elem.children[i].innerHTML;
                    } else if (true && i !== length - 1) {
                        g.divBox.style[prop] = elem.children[i].nextSibling.value;
                    }
                }
            }
        }
        if (g.divBox === null) {
            if (event.target.tagName !== 'P' && event.target.tagName !== 'DIV') {
                g.mouse.startX = g.mouse.x;
                g.mouse.startY = g.mouse.y;
                g.divBox = document.createElement('div');
                g.divBox.className = 'box';
                checkAndChange(color, 'color', false);
                checkAndChange(color, 'borderColor', false);
                checkAndChange(borderWidth, 'borderWidth', true);
                g.divBox.style.left = g.mouse.x + 'px';
                g.divBox.style.top = g.mouse.y + 'px';
                image.appendChild(g.divBox);
                image.style.cursor = 'crosshair';
                if (checkCSS(drag)) {
                    image.addEventListener('mouseup', startMouse);
                } else {
                    image.removeEventListener('mouseup', startMouse);
                }
            } else {
                image.removeEventListener('mouseup', startMouse);
            }
        } else {
            if (Math.abs(g.mouse.x - g.mouse.startX) < 10 || Math.abs(g.mouse.y - g.mouse.startY) < 10) {
                $(g.divBox).remove();
            } else {
                $('.box').draggable({
                    containment: 'parent'
                });
                $('.box').resizable({
                    containment: 'parent'
                });
                var annotation;
                if (checkCSS(person)) {
                    annotation = 'Person';
                } else {
                    annotation = 'Automobile';
                }
                $(g.divBox).prepend('<p>' + annotation + '</p>');
                changeCountBoxes(1);
            }
            g.divBox = null;
            image.style.cursor = '';
        }
    }

    /*
     * Drawing boxes
     * http://stackoverflow.com/questions/17408010/drawing-a-rectangle-using-click-mouse-move-and-click
     */

    function initDraw() {
        function setMousePos(e) {
            var ev = e || window.event; //Moz || IE
            var imgLeft = image.getBoundingClientRect().left;
            var imgTop = image.getBoundingClientRect().top;
            if (ev.pageX) { //Moz
                g.mouse.x = ev.pageX + window.pageXOffset - imgLeft;
                g.mouse.y = ev.pageY + window.pageYOffset - imgTop;
            } else if (ev.clientX) { //IE
                g.mouse.x = ev.clientX + document.body.scrollLeft - imgleft;
                g.mouse.y = ev.clientY + document.body.scrollTop - imgTop;
            }
        }
        image.onmousemove = function() {
            setMousePos(event);
            if (g.divBox !== null) {
                g.divBox.style.width = Math.abs(g.mouse.x - g.mouse.startX) / image.offsetWidth * 100 + '%';
                g.divBox.style.height = Math.abs(g.mouse.y - g.mouse.startY) / image.offsetHeight * 100 + '%';
                g.divBox.style.left = (g.mouse.x - g.mouse.startX < 0) ? g.mouse.x / image.offsetWidth * 100 + '%' : g.mouse.startX / image.offsetWidth * 100 + '%';
                g.divBox.style.top = (g.mouse.y - g.mouse.startY < 0) ? g.mouse.y / image.offsetHeight * 100 + '%' : g.mouse.startY / image.offsetHeight * 100 + '%';
            }
        };
        image.addEventListener('mousedown', startMouse);
        image.addEventListener('mouseup', startMouse);
        image.addEventListener('mouseleave', function() {
            image.removeEventListener('mouseup', startMouse);
            if (!g.divBox) {
                g.divBox = null;
                image.style.cursor = '';
            }
        });
    }
    initDraw();

    /*
     * Submit, undo, cancel
     */

    function btnFunc() {
        submit.onclick = function() {
            function convert(val, prop) {
                /*
                 * val: The CSS value of the `prop` parameter below
                 * prop: The CSS property (width or height)
                 */
                return Math.round(val * tempImg[prop] / image.children[0][prop]);
            }
            if (checkBoxes()) {
                if ($(magnifyIcon).hasClass('magnifyIcon') === true) {
                    destroy();
                }
                var tempImg = new Image();
                tempImg.src = g.imgVal;
                console.log(
                    'Image Dimensions\n' +
                    'Native Width: ' + tempImg.width + 'px\n' +
                    'Native Height: ' + tempImg.height + 'px'
                );
                for (i = 1, length = image.children.length; i < length; i++) {
                    var imageRect = image.children[0].getBoundingClientRect();
                    var boxRect = image.children[i].getBoundingClientRect();
                    var x = Math.abs(boxRect.left - imageRect.left);
                    var y = Math.abs(boxRect.top - imageRect.top);
                    console.log(
                        'Box ' + i + ' Dimensions\n' +
                        'Width: ' + convert(image.children[i].offsetWidth, 'width') + '\n' +
                        'Height: ' + convert(image.children[i].offsetHeight, 'height') + '\n' +
                        'Relative Position: (' + convert(x, 'width') + 'px, ' + convert(y, 'height') + 'px)'
                    );
                }
                changeSource();
                cancel.click();
            }
        };
        undo.onclick = function() {
            if (checkBoxes()) {
                image.removeChild(image.children[image.children.length - 1]);
            }
            changeCountBoxes(-1);
        };
        cancel.onclick = removeBoxes;
    }
    btnFunc();

    /*
     * Delete all boxes when the browser window is resized
     */
    function resize() {
        window.onload = function() {
            g.imagePos = image.getBoundingClientRect();
        };

        function adjust() {
            if (g.bool) {
                image.style.margin = '0 auto';
            } else {
                image.style.margin = 'auto';
            }
            g.bool = !g.bool;
            /*
            if (checkBoxes()) {
                for (i = 1, length = image.children.length; i < length; i++) {
                    //console.log(image.children[i].style.left.match(/\d+/)[0]);
                    //console.log(image.getBoundingClientRect().left - g.imagePos.left);
                    //console.log(image.getBoundingClientRect().left);
                    //console.log(g.imagePos);
                    image.children[i].style.left = +image.children[i].style.left.match(/\d+/)[0] + (image.getBoundingClientRect().left - g.imagePos.left) / 1.25 + 'px';
                }
                g.imagePos = image.getBoundingClientRect();
            }
            */
        }
        window.addEventListener('resize', adjust);
    }
    resize();
})();