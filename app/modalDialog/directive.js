myAppDirectives
    .constant('modalDialogConfig', {
        width: '300px',
        marginTop: '90px',
        marginBottom: '90px',
        footerButtonList: null,
        show: false,
        title: '模态框',
        autoHide: false
    })
    .directive('modalDialog', ['$timeout', 'modalDialogConfig', '$log',
        function ($timeout, modalDialogConfig, $log) {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    dialogConfig: '='
                },
                templateUrl: './templates/directive/modalDialog.tpl.html',
                link: function (scope, element, attrs) {

                    var $modalDialog = element.children(),
                        $modalContent = $modalDialog.children(),
                        userConfig = scope.dialogConfig,
                        options = angular.extend(modalDialogConfig, userConfig);

                    scope.buttonArr = [];

                    /**
                     * @description 初始化modal dialog
                     */
                    scope.init = function () {
                        scope.title = options.title;
                        scope.show = options.show;
                        scope.setModalStyle();
                        scope.setModalComponents();
                    };

                    /**
                     * @description 取消按钮点击事件
                     */
                    scope.cancel = function() {
                        var cancelButtonObj = scope.buttonArr[1],
                            cancelButtonCallback = cancelButtonObj['callback'];
                        if(angular.isFunction(cancelButtonCallback)) {
                            cancelButtonCallback();
                        }
                    };

                    /**
                     * @description 确认按钮点击事件
                     */
                    scope.confirm = function() {
                        var confirmButtonObj = scope.buttonArr[0],
                            confirmButtonCallback = confirmButtonObj['callback'];
                        if(angular.isFunction(confirmButtonCallback)) {
                            confirmButtonCallback();
                        }
                    };

                    /**
                     * @description 根据用户传参，设置footer是否有button，有几个
                     */
                    scope.setModalComponents = function () {
                        var footerButtonList = options.footerButtonList,
                            len,
                            i = 0,
                            buttonObj;

                        if (angular.isArray(footerButtonList)) {
                            len = footerButtonList.length;
                            scope.footerButtonCount = len;
                            for(; i < len; i++) {
                                buttonObj = footerButtonList[i];
                                scope.buttonArr[i] = {};
                                scope.buttonArr[i] = {
                                    buttonText: buttonObj['buttonText'],
                                    callback: buttonObj['callBack'],
                                    position: buttonObj['position']
                                }
                            }
                        }
                    };

                    /**
                     * @description 监听父级作用域向子级广播的“打开模态框事件”
                     *              检查用户是否设置自动关闭模态框，delay模态框显示时间，单位毫秒
                     */
                    scope.$on('showModalDialog', function (e, data) {
                        var autoHide = options.autoHide,
                            delay = options.delay;
                        scope.open();
                        if(autoHide) {
                            $timeout(function() {
                               scope.hide();
                            }, delay)
                        }
                    });

                    /**
                     * @description 初始化modal dialog样式
                     */
                    scope.setModalStyle = function () {
                        var modalDialogWidth = modalDialogConfig.width,
                            modalDialogMarginTop = modalDialogConfig.marginTop,
                            modalDialogMarginBottom = modalDialogConfig.marginBottom;

                        $modalDialog.css({
                            width: modalDialogWidth,
                            marginTop: modalDialogMarginTop,
                            marginBottom: modalDialogMarginBottom
                        });
                    };

                    /**
                     * @description 打开modal dialog
                     */
                    scope.open = function () {
                        scope.show = true;
                    };

                    scope.hide = function() {
                        scope.show = false;
                    };

                    /**
                     * @description 关闭modal dialog
                     */
                    scope.close = function ($event) {
                        $event.stopPropagation();
                        var target = $event.target,
                            className = target.getAttribute('class');

                        if (className) {
                            if(!userConfig.isClickHide && className.indexOf('modal-layer') !== -1) {
                                return;
                            }
                            if (className.indexOf('modal-layer') !== -1 || className.indexOf('modal-close') !== -1) {
                                scope.hide();
                            }
                        }
                    };

                    scope.init();
                }
            }
        }]);

