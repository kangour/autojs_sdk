# autojs sdk

基于 Autojs 的 APP、小程序自动化测试 SDK，支持：启动应用、停留等待、判断存在、文本点击、颜色点击、循环点击、坐标拾取、语音播报、通知栏提示、音量调节、震动等数十项能力。

autojs sdk 在 Auto.js 的基础上，通过大量接口优化提升了模块的通用性，并进行丰富的功能扩展。

仅支持安卓，组织 QQ 群：984025847

## 能干啥

使用 autojs sdk，一行代码就能完成 `语音播报`/`任意类型文本点击`/`循环点击`/`坐标拾取`/`自动权限控制`/`自动类型识别`/`自动按键监听`/`通知栏实时提示`/`自动移除最近任务`/`自动解锁` 等数十项能力，更多能力陆续开放中。


## 简单上手

编写基于 auto sdk 的应用前，请将 lib.js 放在脚本目录。

分为三个步骤，用 `require('lib.js')` 引入 auto_sdk，编写主函数 `main()`，然后传入 `start_app()`。

这里展示仅用 5 行代码（主函数）开发一个音乐播放应用，实现的功能有 `自动解锁`/`启动网易云音乐`/`播放每日推荐歌曲`/`调节音量`/`通知栏提示操作状态`。


```JavaScript
// 导入：从 lib.js 导入需要的方法
let { start_app, click_item, set_volume, wait_befor_click } = require('lib.js');

// 编写主函数：程序启动后执行的逻辑代码。
function main() {
    wait_befor_click('发现', '跳过')
    click_item('发现')
    click_item('每日推荐')
    click_item('播放全部')
    set_volume(30)
}

// 启动应用：传入参数依次为：主函数，要启动的 App 名称，当前应用描述，是否语音播报执行状态。
start_app(main, '网易云音乐', '播放日推', true)
```


## 开放的方法

这里列举了部分方法，更多详见 autojs_sdk/lib.js 的 module.exports 部分。

```JavaScript
    start_app: start_app, // 脚本运行的前置+后置自动化操作，包括屏幕解锁，自动按键监听，移出最近任务，启动 App，执行脚本，结束进程等。
    wait_for: wait_for, // 等待文本出现
    has_text: has_text, // 当前屏幕是否存在文本
    vibrate: vibrate, // 设备震动
    say_hi: say_hi, // 获取问候语
    log: log, // 普通日志
    warn: warn, // 警告日志
    error: error, // 错误日志
    verbose: verbose, // 调试日志
    click_item: click_item, // 任意类型的文本点击
    click_color: click_color, // 颜色点击
    click_item_each: click_item_each, // 任意类型的文本循环点击
    click_color_each: click_color_each, // 颜色循环点击
    wait_befor_click: wait_befor_click, // 接口描述：等待某文本出现之前的点击。 场景举例：启动网易云音乐时，等待首页出现之前，点击跳过按钮 wait_befor_click('我的', '跳过')
    get_coord_by_color: get_coord_by_color, // 通过颜色获取坐标
    get_coord_by_text: get_coord_by_text, // 获取文本坐标，文本点击时自动调用
    set_volume: set_volume, // 设置设备音量
    set_runing_tip: set_runing_tip, // 通知栏提示内容设置
```


## 高频函数介绍


**入口函数**

```JavaScript
start_app(callback, op_app, this_app, use_tts)
```

程序入口函数，自动完成解锁、启动 App、权限控制、按键监听、通知栏提示等操作。

- callback：软件启动后执行的函数，如 main
- operation_app：需要启动的软件，如 网易云音乐
- this_app：当前程序的描述，如 播放每日推荐
- use_tts：执行完毕后是否使用语音提示（默认不启用）


**文本点击**

```JavaScript
click_item(_text)
```

自动识别文本类型，并点击文本。
- _text: 待点击的文本


**颜色点击**

```JavaScript
click_color(_color, x, y, w, h)
```

在指定的区域点击传入的颜色

- _color：待点击的颜色
- x：区域左上角的 x 坐标
- y：区域左上角的 y 坐标
- w：区域宽度
- h：区域高度


**等待前点击**

```JavaScript
wait_befor_click(target, source)
```

在 target 出现前，如果出现 source，就点击。

例如进入有开屏广告的应用前，点击 “跳过广告” 文本，有效节约启动时间：

wait_befor_click('首页', '跳过')


## 开发者的话

还有很多函数等待你去发掘，比如日期时间处理，日志，坐标处理，震动，音量调节等能力，均可参考 auto_sdk/lib.js 的函数注释，同时也希望你能和我一起来完善它，一起构建一个最流行、最好用的工具；你可以将自己基于 auto_lib 编写的应用提交到 example 目录下。



## 项目交流群

auto_lib 群：984025847



## 项目主页

https://github.com/laobingm/autojs_sdk
