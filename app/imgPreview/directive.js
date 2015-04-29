/**
 * Created by dul on 2015/4/29.
 */

myAppDirectives
    .directive('imgPreview', ['$log', '$timeout', function ($log, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: './templates/directive/imgPreview.tpl.html',
            scope:{},
            link: function(scope, element, attrs) {

                var viewClientHeight = document.body.clientHeight,
                    viewClientWidth = document.body.clientWidth,
                    moEvent,
                    target,
                    $item,
                    img = element.find('img')[0],
                    $imgBox = element.children(),
                    offsetX,
                    offsetY,
                    imgBoxPadding = 10;


                scope.show = false;
                scope.init = function() {
                    scope.setStyle();
                };

                scope.setStyle = function() {
                    $imgBox.css('padding', imgBoxPadding + 'px');
                };
                scope.init();

                scope.$on('mouseOverEvent', function(e, data) {
                    moEvent = data.e;
                    target = moEvent.target;
                    $item = angular.element(target);

                    var overX = moEvent.clientX,
                        overY = moEvent.clientY,
                        imgHeight = scope.getImgHeight(),
                        imgWidth = scope.getImgWidth(),
                        imgBoxHeight = imgHeight + imgBoxPadding,
                        imgBoxWidth = imgWidth + imgBoxPadding,
                        mouseLeftWidth = overX,
                        mouseRightWidth = viewClientWidth - mouseLeftWidth,
                        mouseTopHeight = overY,
                        mouseBottomHeight = viewClientHeight - mouseTopHeight,
                        posX,
                        posY = overY;

                    $item.on('mousemove', scope.mouseMoveHandler);
                    $item.on('mouseleave', scope.mouseLeaveHandler);

                    posX = scope.getPreviewPosX(mouseLeftWidth, mouseRightWidth, overX, imgBoxWidth);
                    $log.info(posX,posY);
                    scope.setPosition(element, posX, posY);
                    scope.showPreview();
                });

                scope.mouseMoveHandler = function(e) {
                    var moveX = e.clientX + offsetX,
                        moveY = e.clientY +offsetY,
                        imgHeight = scope.getImgHeight(),
                        imgWidth = scope.getImgWidth(),
                        imgBoxHeight = imgHeight + imgBoxPadding,
                        imgBoxWidth = imgWidth + imgBoxPadding,
                        mouseLeftWidth = moveX,
                        mouseRightWidth = viewClientWidth - mouseLeftWidth,
                        mouseTopHeight = moveY,
                        mouseBottomHeight = viewClientHeight - mouseTopHeight,
                        posX,
                        posY = moveY;

                    posX = scope.getPreviewPosX(mouseLeftWidth, mouseRightWidth, moveX, imgBoxWidth);

                    scope.setPosition(element, posX, posY);
                };

                scope.mouseLeaveHandler = function(e) {
                    scope.hidePreview();
                };

                scope.getPreviewPosX = function(mlw, mrw, mx, imgBoxWidth) {
                    var posX;
                    if(mrw > imgBoxWidth + 20) {
                        posX = mx;
                        offsetX = 20;
                    } else if(mlw > imgBoxWidth - 40) {
                        posX = mlw - imgBoxWidth;
                        offsetX = -40;
                    }
                    return posX;
                };

                scope.getImgWidth = function() {
                    return img.width;
                };

                scope.getImgHeight = function() {
                    return img.height;
                };

                //隐藏图片预览
                scope.hidePreview = function() {
                    scope.show = false;
                };

                //显示图片预览
                scope.showPreview = function() {
                    scope.show = true;
                };

                //设置预览图片位置
                scope.setPosition = function(elem, x, y) {
                    var $elem,
                        posX,
                        posY;
                    if(arguments.length < 3 || !angular.isElement(elem)) return;
                    $elem = angular.element(elem);

                    if(angular.isString(x) && x.indexOf('px') !== -1) {
                        posX = x;
                    } else if(angular.isNumber(x)) {
                        posX = x + 'px';
                    } else {
                        return;
                    }
                    if(angular.isString(y) &&y.indexOf('px') !== -1) {
                        posY = y;
                    } else if(angular.isNumber(y)){
                        posY = y + 'px';
                    } else {
                        return;
                    }
                    $elem.css({
                        'top': posY,
                        'left': posX
                    });
                }
            }
        }
    }]);