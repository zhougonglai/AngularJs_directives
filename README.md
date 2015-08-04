# angular_directives

__简介__:

在`angular`里面，如果要写一些多次使用的`UI`组件，或是类似`jQuery`的插件，最好使用`angular`的模块的`directive`方法来创建一些自定义的指令，达到可复用组件的目的。

学习`angular`的过程中，最复杂的东西就是指令了，所以，不管是内置指令，还是自定义指令，都要搞清楚，这是使用`angular`必须要熟练掌握的知识点。


__其他说明:__

*	类似`jQuery`插件的东西，那么一些思想也是通用的，比如在指令所在父级scope(比如父级controller)向其传递参数，作为指令的配置参数，类似`jQuery`插件的传参。
*	指令文件名，模块名，指令模版文件名，样式文件名都是对应的。

__目录结构说明:__

以下目录和文件在项目`angular-directives`的根目录

`app/` 应用的`js`目录，子级目录根据指令功能划分

`bower_components/`	bower前端包管理安装包时生成的目录，里面有`angular.js`,`angular-route`等一些包

`css/` 应用的`css`目录，里面按照功能，每个指令对应自己的一个`css`样式文件，在`index.html`中同时只能引入一个指令的样式文件，否则会冲突。

`jsonData/` 一些测试用json数据

`node_modules/` npm包管理工具，目前安装了`grunt`前端自动化构建工具的一些插件

`release/`  发布版本，经过`grunt`构建好的版本，目前仅用来测试`angular`压缩流程，没什么实际意义

`templates/` 指令模版和视图模版目录

`index.html`  主应用视图文件

__如何查看__:

将`index.html`文件中需要将对应的指令css,指令标签注释打开，并将其他指令文件注掉后，直接用`webstorm`内置服务器打开（`localhost:63342`），或者本地搭建一个`apache`服务器，推荐`wamp`，或者`nodejs`架设一个服务器...

__指令列表__

|指令名称|指令功能|完成度|
|---|---|---|
|datePickerBase|基础日期选择指令|100%|
|datePickerFlight|添加飞机票项目业务逻辑的日期选择指令|100%|
|datePickerVisa|添加签证项目业务逻辑的日期选择指令|100%|
|cityPicker|城市选择指令(火车票，飞机票，签证，三个项目三套模版数据)|100%|
|swiperList|条目左滑操作指令|90%|
|modalDialog|模态框指令|90%|
|footer|公共底部|90%|
|tab|tab页切换|90%|
|rollerPicker|类似ios的滚筒日期城市选择指令|0%|



