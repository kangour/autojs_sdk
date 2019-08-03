var lib = require('lib');
start_app = lib.start_app
click_item = lib.click_item
wait_for = lib.wait_for
set_volume = lib.set_volume
start_app(main, '网易云音乐', '播放日推')

// auto.waitFor();
// setScreenMetrics(1080, 1920);
// if (!requestScreenCapture()) {
//     log('截图权限获取失败');
//     exit();
// }
// main()

/**
 * 网易云音乐每日推荐，自动播放歌曲并调节音量
 */
function main() {
    click_item('跳过', 'no_tip')
    wait_for('发现')
    click_item('发现')
    click_item('每日推荐')
    click_item('播放全部')
    set_volume(40)
}