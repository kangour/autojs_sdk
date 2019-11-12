/**
 * 仓库：https://github.com/kangour/autojs_sdk
 */

operation_app = ''
window = {
    width: device.width,
    height: device.height,
}

/**
 * 权限管理
 */
auto.waitFor();
setScreenMetrics(window.width, window.height);
if (!requestScreenCapture()) {
    log('Screen capture fail');
    exit();
}

/**
 * 通知栏提示
 */
let runing_tip = floaty.rawWindow(
    <frame gravity="center" bg="#CC999999">
        <text padding="5 0 5 0" w="auto" h="auto" id="text" textColor='#FFFFFF'></text>
    </frame>
)
runing_tip.setPosition(220, 5);
runing_tip.setTouchable(false);

/**
 * 通知栏提示内容设置
 * @param {*} _text 提示文本
 */
function set_runing_tip(_text) {
    ui.run(function () {
        runing_tip.text.setText(operation_app + _text);
    });
}

/**
 * 修改通知栏提示的坐标
 * @param {*} _text 提示文本
 */
function set_runing_tip_position(x, y) {
    runing_tip.setPosition(x, y);
}

/**
 * 开始结束提示
 */
function start_tip(this_app) {
    warn('开始执行', this_app)
    vibrate(100)
}
function end_tip(operation_app) {
    warn(operation_app, '执行完成')
    vibrate(300)
}
// 普通上滑解锁
// /**
//  * 解锁
//  */
// function unlock() {
//     while (true) {
//         // 唤醒屏幕
//         if (!device.isScreenOn()) {
//             log('Wake up')
//             device.wakeUp();
//             // 避开锁屏界面的弹窗
//             back()
//         }
//         if (has_text('画报')) {
//             warn('尝试解锁')
//             swipe(500, 1600, 100, 500, 200);
//             sleep(500)
//         } else {
//             warn('解锁成功')
//             break
//         }
//     }
//     log('Unlocked')
//     sleep(800);
//     back() // 避开解锁后界面的弹窗
//     sleep(800)
// }

// MUI10 解锁
function unlock() {
    // 唤醒屏幕
    if (!device.isScreenOn()) {
        log('Wake up')
        device.wakeUp();
        // 避开锁屏界面的弹窗
        back()
    }
    sleep(800)
    if (has_text('画报')) {
        warn('尝试解锁')
        //下拉状态栏
        swipe(500, 30, 500, 1000, 300);
        sleep(400);
        //点击时间
        click(100, 120);
        sleep(400);
        //解锁 密码 
        desc(2).findOne().click();
        desc(3).findOne().click();
        desc(6).findOne().click();
        desc(9).findOne().click();
        //等待解锁完成
        text('闹钟').waitFor();
        warn('Unlocked')
        //返回主页
        home();
    }
}

/**
 * 获取文本类型，分别有 text、desc
 * @param {string} _text 需要查询的文本
 */
function get_text_type(_text) {
    for (i = 5; i > 0; i--) {
        if (textContains(_text).exists()) {
            return 'text'
        } else if (descContains(_text).exists()) {
            return 'desc'
        } else {
            // verbose(_text, '不存在 ' + i)
            sleep(200)
        }
    }
    return null
}

/**
 * 当前屏幕是否存在文本
 * @param {*} _text 需要查询的文本
 */
function has_text(_text) {
    set_runing_tip('find ' + _text)
    point = get_coord_by_text(_text, 'no_tip')
    if (point != null && point.x > 0 && point.x < window.width && point.y > 0 && point.y < window.height) return true
    return false
}

/**
 * 设备音量
 * @param {*} number 
 */
function set_volume(number) {
    device.setMusicVolume(device.getMusicMaxVolume() / 100 * number)
}

/**
 * 震动控制
 * @param {*} duration 震动时长
 * @param {*} times 震动次数
 * @param {*} delay 两次间的延迟
 */
function vibrate(duration, times, delay) {
    if (delay == null) delay = 0
    if (times == null) times = 1
    for (i = 0; i < times; i++) {
        device.vibrate(duration);
        sleep(delay)
    }
}

/**
 * 操作失败后的提示弹窗，引导下一步操作
 * @param {*} callback 弹窗确认后执行的函数，一般出入执行失败的函数
 * @param {*} _text 
 */
function confirm_continue(callback, _text) {
    tts_report(_text + '失败')
    if (get_hours() < 9) {
        sleep(2000)
        callback(_text)
        return
    }
    vibrate(1000, 3, 0)
    if (confirm(_text + "不存在，2s 后重试？")) {
        toast('2s 后重试')
        sleep(2000)
        callback(_text)
    } else {
        if (confirm("继续下一步？")) {
            toast('2s 后继续')
            sleep(2000)
        } else {
            toastLog('手动结束运行')
            exit()
        }
    }
}

/**
 * 文本点击
 * @param {*} _text 待查询的文本
 * @param {*} fix_coord 修复坐标位置，传入一个数组，第一位是 x 坐标，第二位是 y 坐标。
 *                      应用中的页面结构决定了获取的坐标准确性，调试时，可以用开发者工具打开指针位置，查看点击位置是否正确，错误的点击位置则需要传入修复的坐标。
 *                      例如：[10, -10] 表示在点击时，x 右移 10 个点，y 上移 10 个点
 * @param {*} tip_type 未找到时，是否需要提示，传入 no_tip 则不提示
 */
function click_item(_text, fix_coord, tip_type) {
    if (fix_coord == undefined) fix_coord = [0, 0]
    wait_for(_text)
    log('(click) ' + _text)
    if (has_text(_text) == false && tip_type != 'no_tip') {
        confirm_continue(click_item, _text)
        return
    }
    text_type = get_text_type(_text)
    if (text_type == 'text') {
        click_text(_text, fix_coord)
    } else if (text_type == 'desc') {
        click_desc(_text, fix_coord)
    } else if (tip_type != 'no_tip') {
        error('Unknown type', text_type)
    }
}

/**
 * 任意类型的文本循环点击
 * @param {*} _text 待查询的文本
 * @param {*} tip_type 未找到时，是否需要提示，传入 no_tip 则不提示
 */
function click_item_each(_text, tip_type) {
    wait_for(_text)
    log('(click-each) ' + _text)
    if (has_text(_text) == false && tip_type != 'no_tip') {
        confirm_continue(click_item, _text)
        return
    }
    text_type = get_text_type(_text)
    if (text_type == 'text') {
        click_text_each(_text)
    } else if (text_type == 'desc') {
        click_desc_each(_text)
    } else if (tip_type != 'no_tip') {
        error('Unknown type', text_type)
    }
}

/**
 * 获取文本坐标，文本点击时自动调用
 * @param {*} _text 待查询的文本
 * @param {*} tip_type 未找到时，是否需要提示，传入 no_tip 则不提示
 */
function get_coord_by_text(_text, tip_type) {
    text_type = get_text_type(_text)
    btn = null
    if (text_type == null) {
        if (tip_type != 'no_tip') confirm_continue(get_coord_by_text, _text)
        return null
    } else if (text_type == 'text') {
        btn = textContains(_text).findOne()
        if (btn.bounds().centerX() == undefined) btn = textStartsWith(_text).findOne()
        if (btn.bounds().centerX() == undefined) btn = textEndsWith(_text).findOne()
    } else if (text_type == 'desc') {
        btn = descContains(_text).findOne()
        if (btn.bounds().centerX() == undefined) btn = descStartsWith(_text).findOne()
        if (btn.bounds().centerX() == undefined) btn = descEndsWith(_text).findOne()
    } else {
        if (tip_type != 'no_tip') error('Unknown type', text_type)
        return null
    }
    point = btn.bounds()
    if (point.centerX()) {
        return {
            x: point.centerX(),
            y: point.centerY()
        }
    } else {
        sleep(800)
        return get_coord_by_text(_text, tip_type)
    }
}

function click_desc(_text, fix_coord) {
    point = get_coord_by_text(_text)
    click(point.x + fix_coord[0], point.y + 10 + fix_coord[1]);
    sleep(800)
}

function long_click_desc(_text) {
    point = get_coord_by_text(_text)
    log('(long-click)' + _text)
    press(point.x, point.y + 10, 800)
    sleep(500)
}

function click_desc_each(_text) {
    let btns = descContains(_text).untilFind();
    btns.each(function (btn) {
        let point = btn.bounds();
        click(point.centerX(), point.centerY() + 10);
    })
    sleep(800)
}

function click_text(_text, fix_coord) {
    btn = textContains(_text).findOne()
    let point = btn.bounds();
    click(point.centerX() + fix_coord[0], point.centerY() + 10 + fix_coord[1]);
    sleep(800)
}
function click_text_each(_text) {
    let btns = textContains(_text).untilFind();
    btns.each(function (btn) {
        let point = btn.bounds();
        click(point.centerX(), point.centerY() + 10);
    })
    sleep(800)
}

function has_color(_color, x, y, w, h) {
    return find_color(_color, x, y, w, h)
}

function find_color(_color, x, y, w, h) {
    if (x == undefined) {
        x = 0
        y = 0
        w = device.width
        h = device.height
    }
    image = captureScreen();
    let point = findColorInRegion(image, _color, x, y, w, h);
    if (point) return point
    else {
        sleep(200)
        return null
    }
}

/**
 * 等待某区域颜色出现，持续 10s
 * @param {*} _color 
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 */
function wait_for_color(_color, x, y, w, h) {
    let n = 0
    while (true) {
        log('wait_for_color', _color)
        verbose('(find-color)' + _color)
        point = find_color(_color, x, y, w, h)
        if (point) return point
        else {
            sleep(1000)
            n++
        }
        if (n > 10) {
            warn('not found', _color)
            return null
        }
    }
}

/**
 * 通过颜色获取坐标
 * @param {*} _color 
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 */
function get_coord_by_color(_color, x, y, w, h) {
    verbose('(find-color)' + _color)
    return wait_for_color(_color, x, y, w, h)
}

/**
 * 0 到 200 s 随机睡眠
 * @param {*} tip_message 睡眠时的提示消息
 */
function random_sleep(tip_message) {
    if (tip_message == undefined) tip_message = 'random-sleep'
    random_number = random(0, 200)
    log(tip_message + ' sleep ' + random_number + ' s')
    for (i = random_number; i >= 0; i--) {
        if (i % 3 == 0) toast(tip_message + ' ' + i + ' s')
        sleep(1000)
    }
}

/**
 * 按键监听，自动执行，按下音量加结束进程
 */
function key_event() {
    threads.start(function () {
        events.observeKey();
        events.on("key_down", function (keyCode, events) {
            if (keyCode == keys.volume_up) {
                toastLog('运行结束')
                exit();
            }
        });
    });
}

// /**
//  * 普通左右布局任务
//  * 将即将启动的 App 从最近任务中移除
//  * @param {*} operation_app App 名称
//  */
// function clear_recent(operation_app) {
//     log('移除最近任务')
//     home()
//     sleep(800)
//     recents()
//     sleep(800)
//     let times_swips = 0
//     while (true) {
//         if (has_text(operation_app)) {
//             point = get_coord_by_text(operation_app)
//             if (point.x < 530) {
//                 swipe(100, 1000, 500, 1000, 500);
//             } else if (point.x > 800) {
//                 swipe(500, 1000, 100, 1000, 500);
//             } else {
//                 swipe(point.x - 330, 1400, point.x - 330, 100, 1000);
//                 sleep(500)
//             }
//             times_swips++
//             if (times_swips > 10) {
//                 warn('重试')
//                 times_swips = 0
//                 clear_recent()
//                 break
//             }
//         } else {
//             break
//         }
//     }
//     home()
// }

/**
 * Mui10 任务
 * 将即将启动的 App 从最近任务中移除
 * @param {*} operation_app App 名称
 */
function clear_recent(operation_app) {
    log('移除最近任务')
    home()
    sleep(800)
    recents()
    sleep(800)
    let times_swips = 0
    while (true) {
        if (has_text(operation_app)) {
            point = get_coord_by_text(operation_app)
            swipe(point.x, point.y, point.x + 500, point.y, 600);
            sleep(800)
            times_swips++
            if (times_swips > 10) {
                warn('重试')
                times_swips = 0
                clear_recent()
                break
            }
        } else {
            break
        }
    }
    home()
}
/**
 * 脚本运行的前置+后置自动化操作，包括屏幕解锁，自动按键监听，移出最近任务，启动 App，执行脚本，结束进程等。
 * @param {*} callback 启动 App 后需要执行的内容
 * @param {*} op_app 需要启动的 App，如：网易云音乐
 * @param {*} this_app 当前脚本描述，如：播放日推
 * @param {*} use_tts 是否使用结束语音，传入 true 时，会在运行结束前给出语音提示
 */
function start_app(callback, op_app, this_app, use_tts, close_app) {
    if (close_app == undefined) close_app = false
    this_app = this_app != undefined ? this_app : op_app
    operation_app = op_app + '\n'
    while (!device.isScreenOn()) {
        unlock();
    }
    key_event()
    sleep(800)
    if (close_app == true) clear_recent(op_app)
    log('Launch', op_app)
    launchApp(op_app);
    start_tip(this_app);
    sleep(1000)
    if (op_app) {
        callback();
        end_tip(this_app);
        if (use_tts) tts_report(this_app + '成功')
        exit()
    }
}

/**
 * 给出语音提示
 * @param {*} _text 
 */
function tts_report(_text) {
    warn(_text)
    importClass(java.io.File);
    importClass(android.speech.tts.TextToSpeech);
    let ttsStatus = false;
    let ttsListener = new TextToSpeech.OnInitListener({
        onInit: function (status) {
            if (status == TextToSpeech.SUCCESS) {
                let ttsSetLanguageResult = TTS.setLanguage(TTS.getDefaultVoice().getLocale()/*ttsLanguage*/);
                if (ttsSetLanguageResult != TextToSpeech.LANG_MISSING_DATA && ttsSetLanguageResult != TextToSpeech.LANG_NOT_SUPPORTED) {
                    ttsStatus = true;
                    TTS.stop();
                    speech(_text);
                    // let file = "/sdcard/xxx.mp3";
                    // speech(_text, file);
                } else {
                    toast("TTS不支持当前语言");
                }
            } else {
                toast("初始化TTS失败");
            }
        }
    })
    let TTS = new TextToSpeech(context, ttsListener);
    function speech(ttsText, fileName) {
        if (TTS && ttsStatus) {
            if (ttsText.length <= TextToSpeech.getMaxSpeechInputLength()) {
                if (fileName) {
                    let file = new File(fileName);
                    if (!file.exists()) {
                        file.createNewFile();
                    }
                    TTS.synthesizeToFile(ttsText, null, file, Math.random());
                } else {
                    TTS.speak(ttsText, TextToSpeech.QUEUE_FLUSH/*QUEUE_FLUSH插队，QUEUE_ADD排队*/, null);
                }
                return true;
            } else {
                toast("朗读文本过长");
                return false;
            }
        } else {
            toast("TTS未准备好");
            return false;
        }
    }
}

/**
 * 颜色点击
 * @param {*} _color 需要点击的颜色
 * @param {*} x 颜色区域的左上角 x 坐标
 * @param {*} y 颜色区域的左上角 y 坐标
 * @param {*} w 颜色区域的宽度
 * @param {*} h 颜色区域的高度
 */
function click_color(_color, x, y, w, h) {
    let point = get_coord_by_color(_color, x, y, w, h)
    if (point) {
        click(point.x, point.y + 20);
        return true
    }
    return false
}

/**
 * 颜色循环点击
 * @param {*} _color 需要点击的颜色
 * @param {*} x 颜色区域的左上角 x 坐标
 * @param {*} y 颜色区域的左上角 y 坐标
 * @param {*} w 颜色区域的宽度
 * @param {*} h 颜色区域的高度
 */
function click_color_each(_color, x, y, w, h) {
    let attempts = 0
    let finded = 0
    while (true) {
        if (click_color(_color, x, y, w, h)) {
            finded++
            if (finded > 10) return
        } else {
            attempts++
            if (attempts > 2) return
        }
        sleep(300)
    }
}

/**
 * 等待文本出现
 * @param {*} _text 等待出现的文本
 */
function wait_for(_text) {
    log('(wait)' + _text)
    let n = 0
    while (true) {
        n++
        if (has_text(_text)) {
            set_runing_tip('')
            return true
        } else {
            set_runing_tip('查找(' + _text + ')第' + n + '次')

        }
        sleep(800)
    }
}

/**
 * 接口描述：等待某文本出现之前的点击。
 * 场景举例：启动网易云音乐时，等待首页出现之前，点击跳过按钮 wait_befor_click('我的', '跳过')
 * @param {*} wait_text 等待出现的文本
 * @param {*} click_text 需要点击的文本
 * @param {*} timer 等待计时器，计时器越长，click_text 被点击的几率越高
 */
function wait_befor_click(wait_text, click_text, timer) {
    log('(wait-click)' + click_text)
    if (timer == undefined) timer = 10
    for (let n = timer; n > 0; n--) {
        if (has_text(wait_text)) {
            break
        } else if (has_text(click_text)) {
            click_item(click_text)
        } else sleep(600)
    }
    // wait_for(wait_text)
    return
}

/**
 * 获取当前年月日时分秒和星期
 */
function get_year() {
    let now = new Date();
    return now.getFullYear();
}
function get_month() {
    let now = new Date();
    return now.getMonth() + 1;
}
/**
 * 获取上个月月份
 */
function get_last_month() {
    _month = get_month()
    if (_month > 1 && _month <= 12) return _month - 1
    else if (_month == 1) return 12
    else {
        error('月份超出范围')
        return false
    }
}

/**
 * 计算单休的每月工作时长
 * @param {*} start_date 开始时间，格式：yyyy/mm/dd
 * @param {*} end_date 
 * @param {*} rest_days 每周休息天数
 */
function count_work_day(start_date, end_date, rest_days) {
    if (rest_days == undefined) rest_days = 1
    start_date = string2date(start_date);
    end_date = string2date(end_date);
    let delta = (end_date - start_date) / (1000 * 60 * 60 * 24);
    let weeks = 0;
    for (i = 0; i < delta; i++) {
        if (start_date.getDay() < rest_days) weeks++;
        start_date = start_date.valueOf();
        start_date += 1000 * 60 * 60 * 24;
        start_date = new Date(start_date);
    }
    return delta - weeks;
}

/**
 * 计算上个月的年份
 * @param {*} start_date 
 * @param {*} end_date 
 */
function get_last_month_year() {
    let now = new Date();
    now = now.valueOf();
    now -= 20 * 1000 * 60 * 60 * 24;
    let last_month_date = new Date(now);
    return last_month_date.getFullYear();
}

/**
 * 返回日期
 */
function get_date() {
    let now = new Date();
    return now.getDate();
}
/**
 * 返回星期
 */
function get_day() {
    let now = new Date();
    return now.getDay();
}
function get_hours() {
    let now = new Date();
    return now.getHours();
}
function get_minutes() {
    let now = new Date();
    return now.getMinutes();
}
function get_seconds() {
    let now = new Date();
    return now.getSeconds();
}

/**
 * 拆分用户设定的时间，20:59:35 分别拆为时分秒
 * @param {string} _time 时间字符串
 */
function get_my_hours(_time) {
    return Number(_time.split(":")[0])
}
function get_my_minutes(_time) {
    return Number(_time.split(":")[1])
}
function get_my_seconds(_time) {
    return Number(_time.split(":")[2])
}

/**
 * 获取倒计时
 * @param {string} _time 时间字符串
 */
function total_seconds_delta(_time) {
    return ~~(time2date(_time) - new Date()) / 1000
}
function seconds_delta(_time) {
    let delta_seconds = total_seconds_delta(_time)
    return parseInt(delta_seconds % 60)
}
function minutes_delta(_time) {
    let delta_seconds = total_seconds_delta(_time)
    return parseInt(delta_seconds / 60 % 60)
}
function hours_delta(_time) {
    let delta_seconds = total_seconds_delta(_time)
    return parseInt(delta_seconds / 60 / 60 % 60)
}
function time2date(_time) {
    let str_time = get_year() + '/' + get_month() + '/' + get_date() + ' ' + _time
    return new Date(str_time)
}
function string2date(_time) {
    return new Date(_time)
}
function time2str(_time) {
    let total_seconds = total_seconds_delta(_time)
    let seconds = seconds_delta(_time)
    let minutes = minutes_delta(_time)
    let hours = hours_delta(_time)
    if (total_seconds < 0) {
        seconds += 59
        hours += 23
        minutes += 59
    }
    result = ''
    if (hours != 0) result += hours + 'h '
    if (minutes != 0) result += minutes + 'm '
    result += seconds + 's'
    return result
}

/**
 * 简写的日志输出
 */
function error() {
    res = Array.prototype.slice.call(arguments).join(' ')
    // toast(res)
    console.error(res)
    // if (operation_app != '') res = operation_app + res
    set_runing_tip(res)
}
function warn() {
    res = Array.prototype.slice.call(arguments).join(' ')
    toast(res)
    console.warn(res)
    // if (operation_app != '') res = operation_app + res
    set_runing_tip(res)
}
function log() {
    res = Array.prototype.slice.call(arguments).join(' ')
    console.log(res)
    // toast(res)
    // if (operation_app != '') res = operation_app + res
    set_runing_tip(res)
}
function verbose() {
    res = Array.prototype.slice.call(arguments).join(' ')
    console.verbose(res)
    // if (operation_app != '') res = operation_app + res
    set_runing_tip(res)
}

/**
 * 获取问候语
 */
function say_hi() {
    let hour = get_hours()
    let greet = "Hi"
    if (hour <= 3) {
        greet = "晚安"
    } else if (hour < 9) {
        greet = "早上好"
    } else if (hour < 12) {
        greet = "上午好"
    } else if (hour < 14) {
        greet = "中午好"
    } else if (hour < 18) {
        greet = "下午好"
    } else if (hour < 24) {
        greet = "晚上好"
    }
    return greet
}

function click_id(id_name) {
    id(id_name).findOne().click()
}

function swipe_down() {
    swipe(500, 500, 500, 1500, 500)
    sleep(800)
}

function swipe_up() {
    swipe(500, 1500, 500, 100, 500)
    sleep(800)
}

/**
 * 提醒用户，接下来的操作需要注意（用户确认后，方可继续）
 * @param {*} _text 
 */
function be_careful(_text) {
    log('请注意，', _text)
    while (true) {
        if (confirm(_text)) break;
        else sleep(1000);
    }
    sleep(1000);
}

/**
 * 提醒用户，接下来的操作需要人工处理（用户确认后，方可继续）
 * @param {*} _text 
 */
function handwork(_text, timer) {
    timer = timer === undefined ? 2 : timer
    let timer_backup = timer
    log('人工', _text)
    while (true) {
        for (timer; timer > 0; timer--) {
            sleep(1000);
            toast('倒计时 ' + timer + ' s');
        }
        if (confirm('已经' + _text + '?')) break;
        else timer = timer_backup + 1
    }
}

module.exports = {
    swipe_up: swipe_up,
    handwork: handwork,
    be_careful: be_careful,
    swipe_down: swipe_down,
    unlock: unlock, // 解锁
    clear_recent: clear_recent, // 结束最近任务
    start_app: start_app, // 脚本运行的前置+后置自动化操作，包括屏幕解锁，自动按键监听，移出最近任务，启动 App，执行脚本，结束进程等。
    wait_for: wait_for, // 等待文本出现
    has_text: has_text, // 当前屏幕是否存在文本
    vibrate: vibrate, // 设备震动
    say_hi: say_hi, // 获取问候语
    log: log, // 普通日志
    warn: warn, // 警告日志
    error: error, // 错误日志
    verbose: verbose, // 调试日志
    time2str: time2str, // 时间转字符串
    time2date: time2date, // 时间转日期
    random_sleep: random_sleep, // 0 到 200 s 随机睡眠
    total_seconds_delta: total_seconds_delta, // 获取倒计时
    click_item: click_item, // 任意类型的文本点击
    click_color: click_color, // 颜色点击
    click_id: click_id,
    find_color: find_color,
    has_color: has_color,
    wait_for_color: wait_for_color,
    click_item_each: click_item_each, // 任意类型的文本循环点击
    click_color_each: click_color_each, // 颜色循环点击
    wait_befor_click: wait_befor_click, // 接口描述：等待某文本出现之前的点击。 场景举例：启动网易云音乐时，等待首页出现之前，点击跳过按钮 wait_befor_click('我的', '跳过')
    get_coord_by_color: get_coord_by_color, // 通过颜色获取坐标
    get_coord_by_text: get_coord_by_text, // 获取文本坐标，文本点击时自动调用
    get_last_month: get_last_month, // 获取上个月月份
    get_year: get_year, // 获取年份
    get_month: get_month, // 获取月份
    get_date: get_date, // 返回日期
    get_day: get_day, // 返回星期
    get_hours: get_hours, // 返回小时
    get_minutes: get_minutes, // 返回分钟
    get_seconds: get_seconds, // 返回秒
    set_volume: set_volume, // 设置设备音量
    set_runing_tip: set_runing_tip, // 通知栏提示内容设置
    key_event: key_event, // 音量加结束脚本
    string2date: string2date, // 字符串转日期
    get_last_month_year: get_last_month_year, // 获取上个月的年份
    count_work_day: count_work_day, // 获取工作天数
    set_runing_tip_position: set_runing_tip_position, // 设置状态栏位置
}
