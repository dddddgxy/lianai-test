/* =========================================================
   人物数据 · 64 位正面历史人物 / 文化符号
   维度顺序固定为 [主动, 陪伴, 浪漫, 冒险, 表达, 边界感]
   数值 0-100：越高越靠近该极（主动/陪伴/浪漫/冒险/表达/边界清晰）
   ---------------------------------------------------------
   说明：所有人物均为正面人物或正面文化符号；
   匹配只做性格与关系隐喻，不涉及历史评价与私德评判。
   ========================================================= */

window.LOVE_DATA = {

  axes: [
    { key: 'act',   high: '主动',   low: '被动' },
    { key: 'comp',  high: '陪伴',   low: '独立' },
    { key: 'rom',   high: '浪漫',   low: '务实' },
    { key: 'adv',   high: '冒险',   low: '稳定' },
    { key: 'expr',  high: '表达',   low: '行动' },
    { key: 'bound', high: '边界清晰', low: '愿意融合' }
  ],

  /* ============ 恋爱人格（原型） ============ */
  archetypes: {

    /* ---------- 女生入口：匹配男历史人物 ---------- */
    'f-steady': {
      entry: 'female',
      title: '可靠担当',
      label: '定海神针型',
      tagline: '你要的不是情话，是一句“已经办好了”。',
      tips: [
        '把“我想要什么”说具体，他擅长执行，不擅长猜。',
        '允许自己偶尔不靠谱，关系不是项目管理。',
        '记得夸他，他的付出常常是沉默的。'
      ],
      figures: ['zhugeliang', 'xiaohe', 'weizheng', 'zhangliang', 'xunyu', 'weiqing']
    },

    'f-fun': {
      entry: 'female',
      title: '松弛有趣',
      label: '松弛有趣型',
      tagline: '生活已经够苦了，恋爱必须好笑。',
      tips: [
        '跟他学会把糟糕的日子讲成段子，但底线要提前说清。',
        '他忘事不是不在意，重要的事直接提醒。',
        '留一点自己的节奏，别被他的随性带着漂。'
      ],
      figures: ['sushi', 'huangtingjian', 'mifu', 'baijuyi', 'wangxizhi']
    },

    'f-free': {
      entry: 'female',
      title: '浪漫自由',
      label: '风一样的人型',
      tagline: '你要的是心动，不是一张日程表。',
      tips: [
        '和他在一起，计划要留三成空白。',
        '你需要热闹，他可能需要孤独，说清楚再各自出发。',
        '别用“你到底爱不爱我”测他，他更吃“我陪你走一段”。'
      ],
      figures: ['libai', 'xuxiake', 'wangbo', 'jikang']
    },

    'f-loyal': {
      entry: 'female',
      title: '赤诚守护',
      label: '赤诚守护型',
      tagline: '爱是不退的那一步。',
      tips: [
        '他的爱在行动里，学会翻译“我在”这两个字。',
        '别把他的坚定当理所当然，他也需要被护着。',
        '有分歧时谈事实，不谈立场。'
      ],
      figures: ['yuefei', 'wentianxiang', 'yuqian', 'simaqian', 'lanlingwang']
    },

    'f-spark': {
      entry: 'female',
      title: '少年锐气',
      label: '少年锐气型',
      tagline: '先冲再说，回头再想。',
      tips: [
        '跟他一起冲，但保留一个自己的降落伞。',
        '他说话直，别往心里去；你的感受也要直说。',
        '他把劲儿用在你们身上，也会用在你身上，边界要谈。'
      ],
      figures: ['huoqubing', 'banchao', 'zuti', 'xiangyu', 'sunce']
    },

    'f-grace': {
      entry: 'female',
      title: '风度并肩',
      label: '并肩体面型',
      tagline: '好的关系，是两个人都好看。',
      tips: [
        '他习惯体面，你要主动问一句“你真实的想法呢”。',
        '别在外面拆他台，回家再算账。',
        '允许他偶尔不完美，他也在学着放松。'
      ],
      figures: ['zhouyu', 'xiean', 'luxun', 'lishimin', 'wangyangming']
    },

    'f-quiet': {
      entry: 'female',
      title: '安静自洽',
      label: '低电量自洽型',
      tagline: '不吵不闹，各自发光。',
      tips: [
        '安静不是冷淡，说好“不说话也是陪伴”。',
        '你需要热闹时，直接约他，不用等他猜。',
        '各自的空间越清晰，靠近时越舒服。'
      ],
      figures: ['wangwei', 'taoyuanming', 'menghaoran']
    },

    'f-ideal': {
      entry: 'female',
      title: '理想主义',
      label: '理想主义上头型',
      tagline: '心里有火，眼里也有别人。',
      tips: [
        '他的热血需要落地，帮他一起列清单。',
        '记得提醒他：你也是需要被照顾的人。',
        '别跟他的理想争宠，跟它并肩。'
      ],
      figures: ['fanzhongyan', 'xinqiji', 'dufu']
    },

    'f-king': {
      entry: 'female',
      title: '掌局开创',
      label: '大开大合型',
      tagline: '你要的不是甜，是「这事我来定」。',
      tips: [
        '他做决定很快，你的意见要在他动工之前说。',
        '他把事做成的方式很硬，别把「效率」误读成「不在乎」。',
        '提醒他一句：关系不是项目，有些事不用排期。'
      ],
      figures: ['yingzheng', 'caocao', 'zhuyuanzhang', 'zhudi', 'zhangjuzheng']
    },

    /* ---------- 男生入口：匹配女历史人物 ---------- */
    'm-talent': {
      entry: 'male',
      title: '才华真性情',
      label: '真性情才女型',
      tagline: '爱就爱得响亮，输也输得漂亮。',
      tips: [
        '她的情绪是真的，接住比讲道理重要。',
        '她敢爱也敢走，别把她的直率当理所当然。',
        '有分歧时先回应感受，再谈对错。'
      ],
      figures: ['liqingzhao', 'zhuowenjun', 'gutaiqing']
    },

    'm-action': {
      entry: 'male',
      title: '行动担当',
      label: '行动担当型',
      tagline: '话不多，事都办了。',
      tips: [
        '她习惯扛事，主动问一句“要不要我来”。',
        '别把她的能干当成不需要被照顾。',
        '她快，你可以慢，说好节奏就好。'
      ],
      figures: ['huamulan', 'lianghongyu', 'muguiying']
    },

    'm-mind': {
      entry: 'male',
      title: '智性沉静',
      label: '智性沉静型',
      tagline: '不急着回答，先想清楚。',
      tips: [
        '她需要想清楚，别逼她当场表态。',
        '她的沉默不是拒绝，是在整理。',
        '偶尔给她一点不讲道理的偏爱。'
      ],
      figures: ['banzhao', 'banjieyu', 'weifuren']
    },

    'm-wit': {
      entry: 'male',
      title: '机锋清冷',
      label: '机锋清冷型',
      tagline: '嘴上是刀，心里是秤。',
      tips: [
        '她的锋利是对事，不是对你。',
        '别在嘴上赢她，赢了也没意思。',
        '她要的是能接住她的人，不是捧着她的人。'
      ],
      figures: ['xiedaoyun', 'sumeimei', 'wuzao']
    },

    'm-power': {
      entry: 'male',
      title: '力量权威',
      label: '力量权威型',
      tagline: '她定方向，你安心跟上。',
      tips: [
        '她定方向时，先跟上，再提意见。',
        '她也会累，主动接过一部分。',
        '别用“你太强势”当武器，谈具体的事。'
      ],
      figures: ['fuhao', 'xianfuren', 'pingyang']
    },

    'm-lead': {
      entry: 'male',
      title: '坚毅领导',
      label: '坚毅领导型',
      tagline: '扛得住事，也扛得住你。',
      tips: [
        '她的高标准先用在事上，你可以谈你的节奏。',
        '她需要的是同伴，不是下属。',
        '记得她也需要被肯定，不只是被需要。'
      ],
      figures: ['qinliangyu', 'shexiang', 'fengliao']
    },

    'm-maker': {
      entry: 'male',
      title: '实干创造',
      label: '实干创造型',
      tagline: '能修就别扔，能过就好好过。',
      tips: [
        '她的浪漫藏在细节里，别只看得见成果。',
        '帮她留出“没用但开心”的时间。',
        '她专注时别打断，等她抬头再说话。'
      ],
      figures: ['huangdaopo', 'wangzhenyi', 'tanyunxian']
    },

    'm-gentle': {
      entry: 'male',
      title: '温婉陪伴',
      label: '温婉陪伴型',
      tagline: '把日子过成一盏灯。',
      tips: [
        '她的体贴不是义务，记得回应。',
        '主动问她“你今天想做什么”。',
        '她把家照顾好，你也要把她照顾好。'
      ],
      figures: ['guandaosheng', 'shenyixiu']
    }
  },

  /* ============ 人物 ============ */
  figures: {

    /* ---------- 女生入口 ---------- */

    zhugeliang: {
      name: '诸葛亮', dynasty: '蜀汉', archetype: 'f-steady',
      tags: ['说到做到', '长期主义', '把日子过成方案'],
      scene: '你说想辞职去看海，他没拦，只递来一张表：存款、路线、备选方案。末了写一行：去吧，后方我守。',
      friction: '靠谱是真靠谱，就是连周末出游，他都能给你做出三个方案的利弊分析。',
      vector: [76, 62, 26, 20, 32, 56]
    },
    xiaohe: {
      name: '萧何', dynasty: '西汉', archetype: 'f-steady',
      tags: ['稳', '后勤担当', '不声张'],
      scene: '他不太会说情话，但你冰箱永远有菜，房租永远提前交。你问他图什么，他说：你安心，我就安心。',
      friction: '稳到近乎无趣，你想疯一次的念头，可能要提前三个月申请。',
      vector: [68, 70, 20, 16, 40, 58]
    },
    weizheng: {
      name: '魏征', dynasty: '唐', archetype: 'f-steady',
      tags: ['实话实说', '原则感', '不给糖也给药'],
      scene: '你新买的裙子问他好不好看，他认真看了三秒：显瘦，但颜色压气色。你气得笑出来——还真是句句实话。',
      friction: '诚实到有点欠揍，你要的是夸夸，他给你的是复盘。',
      vector: [72, 54, 20, 18, 58, 52]
    },
    zhangliang: {
      name: '张良', dynasty: '西汉', archetype: 'f-steady',
      tags: ['提前想到', '不居功', '退得干净'],
      scene: '你说想换工作，他先问了三件事：钱能撑几个月、最坏是什么、退路在哪。问完只说：可以走了。',
      friction: '他把路都铺好了，你偶尔会想：这一趟，我自己到底选过什么。',
      vector: [62, 42, 34, 52, 52, 78]
    },
    xunyu: {
      name: '荀彧', dynasty: '东汉末', archetype: 'f-steady',
      tags: ['守后方', '有原则', '把事办圆'],
      scene: '你在前面忙，他在后面把账、把人、把时间都收好。你回头时，他手上还端着一杯温的茶。',
      friction: '他很少抢话，但底线很硬；有些事他只会说一次「这样不妥」。',
      vector: [70, 48, 30, 34, 56, 66]
    },
    weiqing: {
      name: '卫青', dynasty: '西汉', archetype: 'f-steady',
      tags: ['稳重', '护人', '不居功'],
      scene: '你被人当众为难，他没替你还嘴，只在你身后站定。散场后他说：刚才那句，你不用忍。',
      friction: '他护你，但不擅长哄你；想听好话的时候，他大概率沉默。',
      vector: [74, 74, 26, 36, 26, 48]
    },

    sushi: {
      name: '苏轼', dynasty: '北宋', archetype: 'f-fun',
      tags: ['松弛', '有趣', '生活家'],
      scene: '他负责做饭写诗，你负责吐槽他老被贬。周末逛菜市场，他能把一根萝卜讲出人生哲理，你笑得拎不动袋子。',
      friction: '有趣是真有趣，但你可能要习惯：他随时想出发，行李永远半开着。',
      vector: [54, 66, 90, 60, 88, 24]
    },
    huangtingjian: {
      name: '黄庭坚', dynasty: '北宋', archetype: 'f-fun',
      tags: ['雅趣', '慢热', '会玩'],
      scene: '下雨天他非要拉你去听雨，说这是免费的交响乐。你嫌他幼稚，最后还是两个人蹲在屋檐下听了一小时。',
      friction: '浪漫有余、计划不足，纪念日的餐厅可能要到当天才订。',
      vector: [52, 54, 70, 52, 64, 56]
    },
    mifu: {
      name: '米芾', dynasty: '北宋', archetype: 'f-fun',
      tags: ['痴', '专注', '不按常理'],
      scene: '他能为一块好看的石头陪你绕三条街，回家路上还给你讲了一路这笔怎么下。你听不懂，但喜欢他眼睛发亮。',
      friction: '痴起来六亲不认，你得接受自己偶尔排在他的“宝贝”后面。',
      vector: [50, 54, 80, 86, 82, 14]
    },
    baijuyi: {
      name: '白居易', dynasty: '唐', archetype: 'f-fun',
      tags: ['生活家', '爱分享', '把日子写下来'],
      scene: '他做饭爱放糖，非要你尝第一口。吃完拉你下楼散步，路上把邻居家的猫都逗了一遍。',
      friction: '他什么都能聊，也什么都想分享；你想安静，得先说一句。',
      vector: [56, 62, 76, 44, 84, 44]
    },
    wangxizhi: {
      name: '王羲之', dynasty: '东晋', archetype: 'f-fun',
      tags: ['雅趣', '随性', '手上功夫'],
      scene: '他写字你磨墨，写坏了就揉掉重来。写完把纸推给你：这句送你，别嫌丑。',
      friction: '他讲究，桌面乱一点、笔没洗干净，都要从头再来一遍。',
      vector: [48, 58, 78, 40, 68, 62]
    },

    libai: {
      name: '李白', dynasty: '唐', archetype: 'f-free',
      tags: ['自由', '浪漫', '说走就走'],
      scene: '他半夜敲门，说月亮太好了，要不要去江边。你披上外套就出门——这一晚没做什么，但你记了很多年。',
      friction: '浪漫是真浪漫，但在他那儿，“明天”这两个字经常是空的。',
      vector: [80, 12, 96, 92, 90, 90]
    },
    xuxiake: {
      name: '徐霞客', dynasty: '明', archetype: 'f-free',
      tags: ['远方', '好奇', '背包客'],
      scene: '他把地图摊在桌上，说下个月去看那座山。你问路好不好走，他说：不好走才要去啊。',
      friction: '世界很大，他的背包很小——小到常常只装得下他自己。',
      vector: [70, 18, 74, 96, 60, 84]
    },
    wangbo: {
      name: '王勃', dynasty: '唐', archetype: 'f-free',
      tags: ['少年才气', '炽热', '一闪一闪'],
      scene: '他写给你的句子，你抄在本子上抄了三遍。他有点得意：随手写的。你翻个白眼，还是偷偷笑了。',
      friction: '才华横溢也情绪滚烫，他的高光和低谷都来得又快又猛。',
      vector: [72, 50, 80, 80, 86, 28]
    },
    jikang: {
      name: '嵇康', dynasty: '三国魏', archetype: 'f-free',
      tags: ['清冷', '自成一派', '不解释'],
      scene: '他在院子里打铁，一锤一锤，不急着说话。你坐在旁边看了一下午，他忽然递过锤子：来，试试。',
      friction: '他不爱应酬，也不爱解释；你想把他拉进热闹里，多半会失败。',
      vector: [34, 26, 62, 56, 74, 90]
    },

    yuefei: {
      name: '岳飞', dynasty: '南宋', archetype: 'f-loyal',
      tags: ['守护', '赤诚', '说到做到'],
      scene: '你加班到深夜，楼下那盏灯一直亮着。他说不放心，也不催你，就站在那儿等，像一堵不会走的墙。',
      friction: '他把责任看得比情绪重，你要的撒娇，他常常听不懂。',
      vector: [88, 80, 32, 38, 36, 22]
    },
    wentianxiang: {
      name: '文天祥', dynasty: '南宋', archetype: 'f-loyal',
      tags: ['硬骨', '笃定', '不退'],
      scene: '你问他为什么总能这么笃定，他说：心里有个不能退的地方。那一刻你忽然懂了，他连爱都是硬骨头。',
      friction: '原则感太强，吵架时很难让他先低头——但他也从不敷衍你。',
      vector: [88, 74, 40, 32, 50, 26]
    },
    yuqian: {
      name: '于谦', dynasty: '明', archetype: 'f-loyal',
      tags: ['清白', '可靠', '少话'],
      scene: '他不太会哄人，但你每次出事，他永远第一个到。事后只说一句：没事了，我在。',
      friction: '话少、心事重，你需要主动去问，他才肯说。',
      vector: [84, 78, 32, 34, 38, 26]
    },
    simaqian: {
      name: '司马迁', dynasty: '西汉', archetype: 'f-loyal',
      tags: ['忍得住', '把事做完', '认死理'],
      scene: '他答应你的事，隔三年也会办完。你问他怎么记得，他说：写下来的，就不能不算。',
      friction: '他认准的事九头牛拉不回；要劝他，得先陪他把这件事看完。',
      vector: [80, 56, 40, 30, 62, 50]
    },
    lanlingwang: {
      name: '兰陵王', dynasty: '北齐', archetype: 'f-loyal',
      tags: ['勇武', '爱兵', '不摆架子'],
      scene: '他忙完一整天才回来，先问你今天吃了没。你递水过去，他一口气喝完，才说自己的事。',
      friction: '他把责任排在前面，你的小事常常排在后面；要说出来，他才看得见。',
      vector: [86, 66, 34, 70, 34, 32]
    },

    huoqubing: {
      name: '霍去病', dynasty: '西汉', archetype: 'f-spark',
      tags: ['锐气', '果决', '少年感'],
      scene: '你说想去蹦极，他眼睛一亮：走啊。两个小时后你们站在高台上，他比你还兴奋，风把头发吹得乱七八糟。',
      friction: '冲劲十足，但你可能要习惯他说话直、决定快、回头少。',
      vector: [96, 34, 52, 94, 58, 44]
    },
    banchao: {
      name: '班超', dynasty: '东汉', archetype: 'f-spark',
      tags: ['志向', '行动派', '说干就干'],
      scene: '他说想辞职去做一件非做不可的事。你没劝，只问：带上我吗。他愣了三秒，笑了：当然。',
      friction: '志向很大，浪漫很小——纪念日他大概率会忘。',
      vector: [92, 40, 50, 90, 50, 40]
    },
    zuti: {
      name: '祖逖', dynasty: '东晋', archetype: 'f-spark',
      tags: ['自律', '热血', '闻鸡起舞'],
      scene: '凌晨五点他把你摇醒，说江上雾好看。你困得想打人，可看到他的眼睛，还是爬起来穿了鞋。',
      friction: '自我要求极高，也容易把这股劲儿用在你身上。',
      vector: [94, 42, 56, 86, 56, 44]
    },
    xiangyu: {
      name: '项羽', dynasty: '秦末', archetype: 'f-spark',
      tags: ['少年气', '决断', '一条道走到黑'],
      scene: '他做事不留后手，说走就走。你问他万一不成怎么办，他笑：那就再来一次。',
      friction: '他不喜欢退，也不喜欢被劝；有时你得替两个人留一条后路。',
      vector: [94, 26, 68, 96, 56, 52]
    },
    sunce: {
      name: '孙策', dynasty: '东汉末', archetype: 'f-spark',
      tags: ['锐气', '爱交朋友', '跑得快'],
      scene: '他在饭桌上把三个人变成朋友，出门还记得你要的那家糖水铺。夜里他说：明天带你见个人。',
      friction: '他跑得太快，计划永远比你的行李先出门。',
      vector: [95, 34, 62, 90, 62, 32]
    },

    zhouyu: {
      name: '周瑜', dynasty: '东汉末', archetype: 'f-grace',
      tags: ['风度', '并肩', '场面人'],
      scene: '聚会上有人拿话挤兑你，他没急着反驳，只笑着接了一句，场面瞬间转回来。回家路上他说：不用你出面。',
      friction: '体面到滴水不漏，你有时会怀疑：他到底有没有真的生气过。',
      vector: [66, 62, 56, 52, 80, 62]
    },
    xiean: {
      name: '谢安', dynasty: '东晋', archetype: 'f-grace',
      tags: ['从容', '稳', '不动声色'],
      scene: '你慌得不行的时候，他还在慢悠悠地下棋。等事情过去才说：我早安排好了。你气他不早说，又佩服得不行。',
      friction: '太稳了，稳到你偶尔想找个能一起慌的人。',
      vector: [56, 60, 46, 38, 70, 76]
    },
    luxun: {
      name: '陆逊', dynasty: '三国吴', archetype: 'f-grace',
      tags: ['外柔内刚', '分寸', '谋定'],
      scene: '他从不在人前跟你争，回家才把不同意见一条条摆出来。你被说得心服，嘴上还要逞强：下次让你。',
      friction: '外柔内刚，他的退让不是没主意，是还没到他说的时候。',
      vector: [64, 62, 51, 46, 76, 66]
    },
    lishimin: {
      name: '李世民', dynasty: '唐', archetype: 'f-grace',
      tags: ['气度', '能听劝', '并肩'],
      scene: '你的方案在会上被否了，他没当场站你这边，散会后把反对的人一个个约来聊。三天后方案过了，他说：是你的。',
      friction: '他顾大局，你有时会觉得自己只是局里的一部分。',
      vector: [82, 52, 48, 72, 78, 64]
    },
    wangyangming: {
      name: '王阳明', dynasty: '明', archetype: 'f-grace',
      tags: ['通透', '知行合一', '爱讲道理'],
      scene: '你纠结一件事，他不给答案，只问：你真正怕的是什么。你被问住了，忽然就知道该怎么办。',
      friction: '他总在讲道理，你要的有时只是一句「我在」，不是一句「想通了没」。',
      vector: [78, 50, 52, 64, 86, 72]
    },

    wangwei: {
      name: '王维', dynasty: '唐', archetype: 'f-quiet',
      tags: ['安静', '自洽', '低电量'],
      scene: '周末你们各占沙发一头，他看书，你刷剧，一整天只说了七句话。奇怪的是，你一点都不觉得被冷落。',
      friction: '安静是真安静，但你需要热闹的时候，他可能接不住。',
      vector: [26, 44, 54, 18, 18, 90]
    },
    taoyuanming: {
      name: '陶渊明', dynasty: '东晋', archetype: 'f-quiet',
      tags: ['松弛', '田园', '不争'],
      scene: '他种的菜长得歪歪扭扭，还认真给你炒了一盘。你吃着有点咸，他说：自己种的，咸也是香的。',
      friction: '佛系到极致，你想推他往前走一步，往往要自己先走三步。',
      vector: [30, 50, 46, 16, 20, 86]
    },
    menghaoran: {
      name: '孟浩然', dynasty: '唐', archetype: 'f-quiet',
      tags: ['清淡', '好客', '不凑热闹'],
      scene: '他不爱应酬，但你朋友来家里，他能安安静静煮一下午茶。散场后他说：你的朋友，都挺好。',
      friction: '不争不抢，有时候你希望他为你出头，他却只想息事宁人。',
      vector: [32, 50, 52, 22, 22, 84]
    },

    fanzhongyan: {
      name: '范仲淹', dynasty: '北宋', archetype: 'f-ideal',
      tags: ['理想', '担当', '先人后己'],
      scene: '你抱怨公司不公平，他没劝你忍，只问：你想改变哪一部分。然后认真陪你列了一张能做的小清单。',
      friction: '心怀天下，坏处是：他常常先照顾世界，再照顾你。',
      vector: [82, 58, 54, 38, 70, 30]
    },
    xinqiji: {
      name: '辛弃疾', dynasty: '南宋', archetype: 'f-ideal',
      tags: ['热血', '不服', '少年心气'],
      scene: '他喝到微醺，拍着桌子讲少年时的梦。你没打断，只给他续了杯茶——你知道这些话，他平时不说。',
      friction: '热血难凉，也容易把日子过成一场没打完的仗。',
      vector: [86, 52, 64, 46, 82, 30]
    },
    dufu: {
      name: '杜甫', dynasty: '唐', archetype: 'f-ideal',
      tags: ['细腻', '共情', '把人放心上'],
      scene: '他记得你随口提过的每件小事：不吃香菜、怕冷、讨厌电梯里的香水味。他的浪漫，是把人反复端详。',
      friction: '心思太细，也容易把别人的苦往自己身上背。',
      vector: [76, 60, 60, 36, 68, 36]
    },

    yingzheng: {
      name: '嬴政', dynasty: '秦', archetype: 'f-king',
      tags: ['决断', '格局', '一件事做到头'],
      scene: '他说要从这头修一条路通到那头，你说太远了。他说：远才要修。然后第二天就动工了。',
      friction: '他决定得太快，你常常是事情已经开始之后，才知道有这回事。',
      vector: [94, 30, 44, 86, 64, 82]
    },
    caocao: {
      name: '曹操', dynasty: '东汉末', archetype: 'f-king',
      tags: ['才略', '爱才', '写诗的人'],
      scene: '你写了半首诗，他接了下半句，还嫌你收得太软。那晚两个人改到天亮，谁也没提睡觉。',
      friction: '他欣赏你，也随时在衡量你；在他面前，你很难彻底松懈。',
      vector: [88, 34, 54, 78, 74, 66]
    },
    zhuyuanzhang: {
      name: '朱元璋', dynasty: '明', archetype: 'f-king',
      tags: ['从零开始', '立规矩', '自己动手'],
      scene: '他记得每一笔账，连你买菜的数目都能对上。你说他太较真，他说：日子就是这么过出来的。',
      friction: '他的规矩很多，而且默认你也照着做；想改，得谈很久。',
      vector: [92, 36, 34, 72, 50, 76]
    },
    zhudi: {
      name: '朱棣', dynasty: '明', archetype: 'f-king',
      tags: ['大开大合', '敢押', '要做就做大'],
      scene: '他说想把家搬到更远的地方，你说那边什么都没有。他说：那就建起来。',
      friction: '他做的是大事，你的小事容易被他的日程挤掉。',
      vector: [93, 32, 44, 84, 56, 78]
    },
    zhangjuzheng: {
      name: '张居正', dynasty: '明', archetype: 'f-king',
      tags: ['接烂摊子', '定规矩', '十年如一日'],
      scene: '家里一团乱的时候，他坐下来列了张表：谁做什么、什么时候做完。三个月后，日子真的顺了。',
      friction: '他习惯安排，也习惯检查；你会想在那张表上，给自己留一行空白。',
      vector: [86, 40, 34, 52, 58, 72]
    },

    /* ---------- 男生入口 ---------- */

    liqingzhao: {
      name: '李清照', dynasty: '北宋', archetype: 'm-talent',
      tags: ['才华', '真性情', '爱赢也爱赖'],
      scene: '她赌书赢了得意一整天，输了就赖你让着。下雨天非要去划船，回来湿透了还笑你像块木头。',
      friction: '真性情不打折，情绪来的时候，你得接得住那阵风。',
      vector: [76, 62, 90, 56, 92, 44]
    },
    zhuowenjun: {
      name: '卓文君', dynasty: '西汉', archetype: 'm-talent',
      tags: ['烈性', '清醒', '敢选'],
      scene: '她说走就走，跟你去开一家小店。日子清苦，她站在灶台前还笑：我选的人，我认。',
      friction: '烈性又清醒，她可以为你吃苦，但不会为你委屈。',
      vector: [80, 66, 90, 64, 92, 38]
    },
    gutaiqing: {
      name: '顾太清', dynasty: '清', archetype: 'm-talent',
      tags: ['清雅', '专注', '词心'],
      scene: '她写词到深夜，你端茶进去，她头也不抬：这句还差一个字。你放下茶就出来了——你们早懂彼此的节奏。',
      friction: '沉浸在自己的世界里，你需要学会不被打扰地陪着她。',
      vector: [70, 58, 84, 48, 86, 50]
    },

    huamulan: {
      name: '花木兰', dynasty: '北朝民歌', archetype: 'm-action',
      tags: ['行动', '扛事', '不吭声'],
      scene: '搬家那天她一个人扛完了所有箱子，你想帮忙，她抬手：你扶着门就行。晚上她却靠在你肩上睡着了。',
      friction: '太能扛了，你心疼她的时候，她总说没事。',
      vector: [92, 62, 30, 80, 30, 42]
    },
    lianghongyu: {
      name: '梁红玉', dynasty: '南宋', archetype: 'm-action',
      tags: ['果决', '擂鼓', '顶事'],
      scene: '你被工作压得喘不过气，她直接把你电脑合上：走，先吃饭。饭桌上她把事情一条条捋清，你忽然就不慌了。',
      friction: '雷厉风行，偶尔会忘了你也可以慢慢来。',
      vector: [94, 58, 38, 82, 34, 38]
    },
    muguiying: {
      name: '穆桂英', dynasty: '民间演义', archetype: 'm-action',
      tags: ['气场', '决断', '说了算'],
      scene: '她做事从不拖泥带水，家里大小事一拍板就定了。你以为她会嫌你慢，她却说：你负责想，我负责干。',
      friction: '气场强，吵架时你得先学会不被她的气势带跑。',
      vector: [93, 62, 38, 72, 36, 40]
    },

    banzhao: {
      name: '班昭', dynasty: '东汉', archetype: 'm-mind',
      tags: ['智性', '沉静', '会提问'],
      scene: '你遇到难题，她不急着给答案，先问你三个问题。问完你自己就想通了。她笑：我可什么都没说。',
      friction: '理性得让人安心，也让人偶尔想念一点不讲道理的偏爱。',
      vector: [42, 50, 38, 22, 34, 82]
    },
    banjieyu: {
      name: '班婕妤', dynasty: '西汉', archetype: 'm-mind',
      tags: ['克制', '体面', '懂事'],
      scene: '她话不多，但你每次说完，她都能接住那句没说出口的。你问她怎么知道，她说：听出来的。',
      friction: '太懂事，容易把自己的委屈藏起来，你得主动去问。',
      vector: [38, 52, 44, 20, 28, 86]
    },
    weifuren: {
      name: '卫夫人', dynasty: '东晋', archetype: 'm-mind',
      tags: ['专业', '耐心', '一笔一画'],
      scene: '她教你写字，一笔一画地纠正你的手。你写歪了，她不叹气，只说：再写一张。那天你们写到灯芯都短了。',
      friction: '标准高、耐心长，你要接受她的温柔里带着要求。',
      vector: [42, 48, 38, 24, 32, 82]
    },

    xiedaoyun: {
      name: '谢道韫', dynasty: '东晋', archetype: 'm-wit',
      tags: ['机锋', '清冷', '嘴上不让'],
      scene: '有人当众刁难你，她一句反问，对方脸都红了。事后你道谢，她挑眉：我只是听不惯蠢话。',
      friction: '嘴上不饶人，吵起架来你可能三句就接不上。',
      vector: [56, 26, 48, 36, 88, 92]
    },
    sumeimei: {
      name: '苏小妹', dynasty: '民间传说', archetype: 'm-wit',
      tags: ['机灵', '拆台', '可爱'],
      scene: '你发朋友圈装深沉，她第一个评论拆台。你气得删了重发，她私聊：这次好点了。这大概就是她夸人的方式。',
      friction: '机灵过头，你得练就一颗经得起拆台的心脏。',
      vector: [68, 38, 60, 46, 96, 74]
    },
    wuzao: {
      name: '吴藻', dynasty: '清', archetype: 'm-wit',
      tags: ['独立', '敏感', '忽远忽近'],
      scene: '她读到一半忽然合上书，说想一个人走走。你没跟，只在门口留了盏灯。她回来时，手里带了你爱吃的糖。',
      friction: '独立又敏感，她需要你在，但不一定需要你说话。',
      vector: [58, 28, 46, 36, 90, 88]
    },

    fuhao: {
      name: '妇好', dynasty: '商', archetype: 'm-power',
      tags: ['力量', '决断', '看眼神'],
      scene: '点菜时你犹豫半天，她三句话定完，还顺手把你想吃的都加上了。你问她怎么知道，她说：看你看菜单的眼神。',
      friction: '决断力太强，你偶尔会觉得自己像个被安排好的配角。',
      vector: [97, 40, 24, 86, 58, 68]
    },
    xianfuren: {
      name: '冼夫人', dynasty: '南朝', archetype: 'm-power',
      tags: ['担当', '大局', '外刚内软'],
      scene: '两家人闹矛盾，她几句话就把场面摆平了。回家路上她牵着你的手，忽然轻声问：刚才吓到你了吧。',
      friction: '在外能扛事，在内也需要你先递一句“辛苦了”。',
      vector: [95, 46, 28, 84, 64, 64]
    },
    pingyang: {
      name: '平阳昭公主', dynasty: '唐', archetype: 'm-power',
      tags: ['主见', '事业', '自己成全自己'],
      scene: '她说想自己干一件事，你说好。三个月后她做成了，庆功宴上第一杯酒敬的是你：谢谢你没拦我。',
      friction: '事业心重，别把她的忙碌解读成不在意。',
      vector: [96, 40, 24, 90, 64, 68]
    },

    qinliangyu: {
      name: '秦良玉', dynasty: '明', archetype: 'm-lead',
      tags: ['坚毅', '复盘', '意志力'],
      scene: '你项目崩了，她没安慰，只拉了张白板：哪一步错了。复盘到凌晨，她递来一杯热水：明天继续。',
      friction: '意志力惊人，也容易用同一套标准要求你。',
      vector: [90, 52, 26, 70, 64, 48]
    },
    shexiang: {
      name: '奢香夫人', dynasty: '明', archetype: 'm-lead',
      tags: ['大局观', '调停', '举杯'],
      scene: '她在饭桌上把两家人的旧账一件件说开，最后举杯：以后是自家人。你坐在旁边，第一次觉得被保护很轻。',
      friction: '大局观太重，小情绪她常常接不住，需要你直接说。',
      vector: [86, 58, 32, 64, 70, 44]
    },
    fengliao: {
      name: '冯嫽', dynasty: '西汉', archetype: 'm-lead',
      tags: ['善辩', '外交', '会说话'],
      scene: '你在饭局上被人绕晕，她笑着接过话，三两句把场面拉回来。回家她说：以后这种局，我陪你。',
      friction: '太会说话，你有时分不清她是在哄你还是在说服你。',
      vector: [88, 55, 26, 70, 72, 48]
    },

    huangdaopo: {
      name: '黄道婆', dynasty: '元', archetype: 'm-maker',
      tags: ['实干', '创造', '能修就别扔'],
      scene: '家里的坏椅子她拆了重装，居然比新的还稳。你夸她，她摆摆手：能修就别扔。她对感情也是这个态度。',
      friction: '务实到可爱，浪漫那一部分，可能需要你来补。',
      vector: [74, 52, 22, 50, 20, 74]
    },
    wangzhenyi: {
      name: '王贞仪', dynasty: '清', archetype: 'm-maker',
      tags: ['好奇', '仰望', '半夜看星'],
      scene: '她半夜拉着你上屋顶看星，一边看一边给你讲。你大半没听懂，只记得她说话时，风把她的头发吹到脸上。',
      friction: '好奇心太旺，她的世界很大，你得习惯偶尔排第二位。',
      vector: [66, 48, 46, 64, 40, 56]
    },
    tanyunxian: {
      name: '谈允贤', dynasty: '明', archetype: 'm-maker',
      tags: ['照顾', '专业', '盯着你喝完'],
      scene: '你咳嗽两声她就皱眉，转身煮了碗汤。你嫌苦，她盯着你喝完，才说：乖。',
      friction: '照顾人上瘾，你要学会坦白说“我想自己来”。',
      vector: [68, 56, 32, 48, 32, 66]
    },

    guandaosheng: {
      name: '管道昇', dynasty: '元', archetype: 'm-gentle',
      tags: ['温婉', '默契', '磨墨'],
      scene: '你在书房忙，她在旁边磨墨，一晚上没说话。你抬头，她刚好也抬头，两个人就笑了——不用说话也知道对方在。',
      friction: '柔和体贴，但她的委屈常常不说，需要你主动看见。',
      vector: [42, 88, 74, 30, 54, 30]
    },
    shenyixiu: {
      name: '沈宜修', dynasty: '明', archetype: 'm-gentle',
      tags: ['体贴', '顾家', '把灯留着'],
      scene: '她把一家人照顾得妥妥帖帖，还记得给你留一盏夜灯。你问她累不累，她笑：你们好，我就好。',
      friction: '习惯把自己放最后，你得反复告诉她：你也可以先顾自己。',
      vector: [38, 84, 66, 26, 48, 34]
    }
  },

  /* ============ 入口 ============ */
  entries: {
    female: {
      tag: '女生入口',
      archetypeOrder: ['f-steady', 'f-fun', 'f-free', 'f-loyal', 'f-spark', 'f-grace', 'f-quiet', 'f-ideal', 'f-king']
    },
    male: {
      tag: '男生入口',
      archetypeOrder: ['m-talent', 'm-action', 'm-mind', 'm-wit', 'm-power', 'm-lead', 'm-maker', 'm-gentle']
    }
  },

  /* ============ 分享文案模板 ============ */
  share: {
    female: [
      '测了一下「测测你最适合跟哪位历史人物谈恋爱」，结果是我：{label}。\n最搭的是{dynasty}·{figure}型。\n{scene}\n行吧，我认。\n#恋爱人格 #历史人物 #恋爱测试 #性格测试',
      '被一句「{friction}」精准命中，笑不出来了。\n我的恋爱人格：{label}\n匹配人物：{dynasty}·{figure}\n姐妹们也来测测，评论区对答案。\n#恋爱观察 #古人也恋爱 #性格测试',
      '不装了，我是{label}。\n和{dynasty}·{figure}谈恋爱大概是这样：{scene}\n第一条建议就够我反省一晚上：{tip}\n#恋爱人格测试 #自我观察 #情绪价值'
    ],
    male: [
      '测了下「测测你最适合跟哪位历史人物谈恋爱」，我是{label}。\n最搭的是{dynasty}·{figure}型。\n{scene}\n兄弟们别笑，还挺准。\n#恋爱人格 #历史人物 #性格测试 #恋爱测试',
      '本来当段子测的，结果被这句说中了：「{friction}」\n我的恋爱人格：{label}\n匹配：{dynasty}·{figure}\n来对答案。\n#恋爱观察 #古人也恋爱 #性格测试',
      '我是{label}，配到{dynasty}·{figure}。\n{scene}\n相处建议第一条：{tip}\n#恋爱人格测试 #自我观察 #恋爱观'
    ]
  }
};
