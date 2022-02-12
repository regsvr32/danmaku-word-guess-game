const defaultWordLibrary = [{ 
  category: '动物', active: true, words: [
    '老鼠', '牛', '老虎', '兔子', '蛇', '马', '羊', '猴子', '鸡', '狗', '猪', '猫', '狮子', '熊', '大象', '鹿', '狐狸', '鸭子', '青蛙', '乌龟'
  ]
}, { 
  category: '食物', active: true, words: [
    '苹果', '桃子', '梨', '番茄', '樱桃', '西瓜', '香蕉', '巧克力', '馒头', '包子', '饺子', '面包', '鸡蛋', '珍珠奶茶', '汉堡', '披萨'
  ]
}, { 
  category: '运动/游戏', active: true, words: [
    '足球', '篮球', '乒乓球', '羽毛球', '游泳', '跳水', '跑步', '滑雪', '麻将', '斗地主', '反恐精英', '英雄联盟'
  ]
}, { 
  category: '成语', active: true, words: [
    '黔驴技穷', '对牛弹琴', '守株待兔', '亡羊补牢', '揠苗助长', '借刀杀人', '沉鱼落雁', '闭月羞花', '画蛇添足', '画龙点睛',
    '刻舟求剑', '掩耳盗铃', '杯弓蛇影', '草木皆兵', '纸上谈兵', '草船借箭', '捕风捉影', '含沙射影', '覆水难收', '破镜重圆'
  ]
}, { 
  category: '服装/饰品', active: true, words: [
    '帽子', '手套', '袜子', '鞋子', '项链', '戒指', '耳环', '皮带', '手表', '眼镜', '吊带裤', '连衣裙'
  ]
}, { 
  category: '电影', active: true, words: [
    '乱世佳人', '教父', '泰坦尼克号', '肖申克的救赎', '盗梦空间', '黑客帝国', '指环王', '哈利波特', '复仇者联盟', '让子弹飞', '大话西游', '无间道'
  ]
}, { 
  category: '动画/动画人物', active: true, words: [
    '葫芦娃', '黑猫警长', '宝莲灯', '喜羊羊', '光头强', '狮子王', '米老鼠', '唐老鸭', '海绵宝宝', '派大星', '柯南', '皮卡丘', '天空之城', '千与千寻'
  ]
}, { 
  category: '节日', active: true, words: [
    '除夕', '春节', '元宵', '情人节', '清明', '劳动节', '端午', '儿童节', '七夕', '教师节', '中秋', '重阳', '圣诞节', '生日'
  ]
}, { 
  category: '名著人物', active: true, words: [
    '孙悟空', '唐僧', '猪八戒', '沙和尚', '白龙马', '二郎神', '哪吒', '刘备', '关羽', '张飞', '诸葛亮', '曹操', '夏侯惇',
    '董卓', '吕布', '貂蝉', '武松', '潘金莲', '鲁智深', '李逵', '贾宝玉', '林黛玉', '刘姥姥', '姜子牙', '纣王', '妲己'
  ]
}, { 
  category: '品牌', active: true, words: [
    '可口可乐', '麦当劳', '肯德基', '索尼', '任天堂', '微软', '奔驰', '法拉利', '保时捷', '蔻驰', '香奈儿', '路易威登', '耐克', '阿迪达斯'
  ]
}]

const defaultStyleConfig = {
  windowBackground: '#4c4c4c',
  mainFont: '',
  showLengthHint: true,
  showCategoryHint: true,
  guessCdEnabled: true,
  guessCdSeconds: 5
}

function initTextStyles(name, bold, color, size, strokeColor) {
  Object.assign(defaultStyleConfig, {
    [`${name}Bold`]: bold, [`${name}Color`]: color, [`${name}Size`]: size, [`${name}StrokeColor`]: strokeColor
  })
}

initTextStyles('turn', true, '#ffffff', 18, '#000000')
initTextStyles('hint', true, '#ffffff', 21, '#000000')
initTextStyles('message', false, '#ffffff', 18, '#000000')
initTextStyles('bingo', true, '#ffffff', 16, '#000000')

export default {
  words: defaultWordLibrary,
  style: defaultStyleConfig
}