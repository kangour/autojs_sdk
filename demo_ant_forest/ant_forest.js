const lib = require('lib');
start_app = lib.start_app
click_item = lib.click_item
warn = lib.warn
click_item_each = lib.click_item_each
click_color_each = lib.click_color_each
get_coord_by_color = lib.get_coord_by_color
wait_for = lib.wait_for
has_text = lib.has_text
wait_befor_click = lib.wait_befor_click
warn = lib.warn

if (random(0, 100) < 60) exit()
start_app(main, '支付宝', '蚂蚁森林能量收集')

// auto.waitFor();
// setScreenMetrics(1080, 1920);
// if (!requestScreenCapture()) {
//     log('截图权限获取失败');
//     exit();
// }
// main()
/**
 * 蚂蚁森林能量收集
 */
function main() {
    function friend_helper(point, _type) {
        click(point.x, point.y + 20);
        wait_for('弹幕')
        if (_type == 'help') {
            click_color_each("#fe963d", 0, 400, 1080, 700) // 帮好友收
            // click_color_each("#f5b875", 0, 400, 1080, 700) // 帮好友收
        }
        if (has_text('收集能量')) click_item_each('收集能量')
        // let random_number = random(0, 10)
        // let target_text = null
        // if (random_number > 9) {
        //     target_text = '感谢'
        // } else if (random_number > 8) {
        //     target_text = '轻轻的'
        // } else if (random_number > 7) {
        //     target_text = '勤快的'
        // } else if (random_number > 6) {
        //     target_text = '给你点'
        // }
        // if (target_text) {
        //     click_item('弹幕')
        //     click_item(target_text, 'no_tip')
        // }
        back();
        // wait_for('好友排行榜')
    }
    click_item('首页')
    wait_for('扫一扫')
    click_item('蚂蚁森林')
    wait_for('种树')
    if (has_text('收集能量')) click_item_each('收集能量')
    toast("进入排行榜");
    // 临时替代循环：因为 has text 得到的坐标不准
    swipe(500, 1900, 500, 500, 500);
    swipe(500, 1900, 500, 500, 500);
    while (true) {
        if (has_text('查看更多好友')) break;
        swipe(500, 1900, 500, 500, 500);
        sleep(300)
    }
    sleep(300)
    click_item('查看更多好友')
    wait_for('好友排行榜')
    sleep(800)
    while (true) {
        point = get_coord_by_color("#1da06e", 980, 200, 100, 1600)
        // 帮他收能量 
        point_other = get_coord_by_color("#f99035", 980, 200, 100, 1600)
        if (point) {
            if (get_coord_by_color("#1da06e", point.x + 30, point.y + 20, 10, 10)) {
                // 能量未成熟
            } else {
                // 发现能量
                friend_helper(point)
            }
            swipe(500, 1900, 500, 1900 - point.y, 500);
        } else if (point_other) {
            friend_helper(point_other, 'help')
            // swipe(500, 1900, 500, 1900 - point_other.y, 500);
        } else if (has_text('没有更多了')) {
            toast('没有更多了')
            break
        } else {
            swipe(500, 1800, 500, 200, 500)
        }
        sleep(300)
    }
    back();
    sleep(500)
    back();
    sleep(500)
}