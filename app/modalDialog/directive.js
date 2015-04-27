myAppDirectives
    .constant('modalDialogConfig', {
        width: '300px',
        marginTop: '90px',
        marginBottom: '90px',
        footerButton: [{
            buttonText: '确定',
            callBack: function (e) {

            }
        }, {
            buttonText: '取消',
            callBack: function (e) {

            }
        }],
        show: false,
        title: '模态框'
    })
    .directive('modalDialog', ['$timeout', 'modalDialogConfig', function ($timeout, modalDialogConfig) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                dialogConfig: '=dialogConfig'
            },
            template: '<div id="myDialog" class="modal-layer" ng-show="ModalDialogController.show" ng-click="ModalDialogController.close($event)">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content" ng-switch on="dialogConfig.footerButton">' +
            '<div class="modal-header">' +
            '<a class="modal-close" ng-click="ModalDialogController.close($event)">X</a>' +
            '<h4>{{ModalDialogController.title}}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude>' +

            '</div>' +
            '<div class="modal-footer">' +
            '<button></button>' +
            '<button></button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            require: ['modalDialog'],
            controller: ['$scope', '$element', function ($scope, $element, $attrs) {

                var ModalDialogController = this,
                    d = document;

                var $modalDialog = $element.children(),
                    $modalContent = $modalDialog.children();

                var options = angular.extend(modalDialogConfig, $scope.dialogConfig);
                ModalDialogController.show = options.show;
                ModalDialogController.title = options.title;
                /**
                 * @description 初始化modal dialog
                 */
                ModalDialogController.init = function () {
                    ModalDialogController.setModalStyle();
                    //ModalDialogController.setTitle();
                    if (angular.isArray(modalDialogConfig.footerButton) && modalDialogConfig.footerButton.length > 0) {
                        //ModalDialogController.setFooter();
                    }
                };

                /**
                 * @description 初始化modal dialog样式
                 */
                ModalDialogController.setModalStyle = function () {
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
                ModalDialogController.open = function () {
                    ModalDialogController.show = true;
                };

                /**
                 * @description 关闭modal dialog
                 */
                ModalDialogController.close = function ($event) {
                    $event.stopPropagation();
                    var target = $event.target,
                        className = target.getAttribute('class');
                    if (className) {
                        if (className.indexOf('modal-layer') !== -1 || className.indexOf('modal-close') !== -1) {
                            ModalDialogController.show = !ModalDialogController.show;
                        }
                    }
                };

                ModalDialogController.setFooter = function () {
                    var i = 0,
                        footerButton = modalDialogConfig.footerButton,
                        len = footerButton.length,
                        buttonText = '',
                        callback = null,
                        btn = '';

                    var footer = '<div class="modal-footer"></div>';
                    $modalContent.append(footer);
                    var $modalFooter = jq.$('.modal-footer');

                    switch (len) {
                        case 1:
                            if (angular.isObject(footerButton[i])) {
                                buttonText = footerButton[i].buttonText;
                                callback = footerButton[i].callBack;
                                btn = '<button id="modal-btn" class="modal-btn">' + buttonText + '</button>';
                                $modalFooter.append();

                                break;
                            } else {
                                throw new Error(footerButton[i] + 'must be a Object');
                            }
                            break;
                        case 2:

                            for (; i < len; i++) {
                                if (angular.isObject(footerButton[i])) {
                                    callback = footerButton[i].callBack;
                                    btn = '<button id="modal-btn' + [i] + '">' + footerButton[i].buttonText + '</button>';
                                    $modalFooter.append(btn);
                                    if (angular.isFunction(callback)) {
                                        btn.on('click', callback);
                                    }
                                } else {
                                    throw new Error(footerButton[i] + 'must be a Object');
                                }
                            }
                    }
                };

                var jq = jq || {};
                jq.$ = function (selector) {
                    var $ = d.querySelectorAll.bind(d),
                        dom = $(selector);
                    return angular.element(dom);
                }

            }],

            controllerAs: 'ModalDialogController',
            link: function (scope, element, attrs, ctrls) {
                var ModalDialogController = ctrls[0],
                    NgModelController = ctrls[1];
                ModalDialogController.init();
                ModalDialogController.open();
            }
        }
    }]);

