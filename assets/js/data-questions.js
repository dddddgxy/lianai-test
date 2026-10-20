/* =========================================================
   题目数据 · 两个入口各 20 题
   维度键：act 主动 / comp 陪伴 / rom 浪漫 / adv 冒险 / expr 表达 / bound 边界感
   每个选项 d 为该选项对维度的增量，最终按各维度可达上限归一化

   出题约定：
   1) 四个选项一律写「你会怎么做」，不写「你会有什么感觉」
   2) 四个选项是四种不同做法，不是同一件事的程度差别
   3) 场景生活化，不考历史知识
   ========================================================= */

window.QUIZ_DATA = {

  female: {
    tag: '女生入口',
    questions: [
      {
        text: '第一次约会，他把「去哪儿」抛给你。',
        options: [
          { text: '提前一天订好店，把时间和地址发过去。', d: { act: 9, comp: 2 } },
          { text: '回他三个备选，让他挑一个。', d: { act: 4, comp: 1 } },
          { text: '回一句「你定，我都行」，然后等他消息。', d: { act: -6, comp: 3 } },
          { text: '反问他：「你想去哪儿？」然后看他的反应。', d: { act: -2, expr: 3 } }
        ]
      },
      {
        text: '他送你一本旧书，扉页写了你的名字。',
        options: [
          { text: '把书翻到扉页，读了那行字，回他一句「谢谢」。', d: { rom: 9, expr: 2 } },
          { text: '收进书架，回他一句「收到了」。', d: { rom: 5 } },
          { text: '问他：「这书多少钱收的？」', d: { rom: -7, expr: -2 } },
          { text: '说「我大概用不上」，然后收好。', d: { rom: -4 } }
        ]
      },
      {
        text: '周末你有两天假。',
        options: [
          { text: '两天都排给他，买菜逛超市也算约会。', d: { comp: 9, bound: -5, rom: 2 } },
          { text: '白天各忙各的，晚上一起吃饭。', d: { comp: 4, bound: 2 } },
          { text: '一天给他，一天留给自己。', d: { comp: -2, bound: 4 } },
          { text: '各自安排，想见再约。', d: { comp: -7, bound: 7 } }
        ]
      },
      {
        text: '他临时说：「这周末，去个没去过的地方。」',
        options: [
          { text: '十分钟内收好包，问他几点出发。', d: { adv: 9, act: 5 } },
          { text: '先问清楚去哪儿、住哪儿，再答复。', d: { adv: 1, comp: 2 } },
          { text: '先把攻略做完，再答复他。', d: { adv: -4, act: 2 } },
          { text: '回他「这周想在家」，改天再说。', d: { adv: -7, comp: 2 } }
        ]
      },
      {
        text: '他下班回来，坐在沙发上一句话不说。',
        options: [
          { text: '拉着他把今天的事从头讲一遍。', d: { expr: 6, comp: 5, bound: -3 } },
          { text: '什么都不问，倒杯水放在他手边。', d: { expr: -5, comp: 4 } },
          { text: '直接问：「有什么要办的，我来。」', d: { expr: -3, act: 4 } },
          { text: '讲个笑话，把他逗笑为止。', d: { expr: 2, rom: 4 } }
        ]
      },
      {
        text: '他顺手拿起你的手机翻聊天记录。',
        options: [
          { text: '当场说：「这个不行，手机我自己看。」', d: { bound: 9, expr: 5 } },
          { text: '笑一下，把话题岔开。', d: { bound: -2, expr: -5 } },
          { text: '把手机递过去：「随便看。」', d: { bound: -7, comp: 4 } },
          { text: '伸手拿他的手机，也翻一遍。', d: { bound: 1, act: 3 } }
        ]
      },
      {
        text: '纪念日快到了。',
        options: [
          { text: '提前一周写好一封信，当天给他。', d: { rom: 9, expr: 3 } },
          { text: '订一家他提过一次的餐厅。', d: { rom: 3, comp: 3 } },
          { text: '一起把家里打扫干净，然后瘫着。', d: { rom: -5, comp: 4 } },
          { text: '提前说好：别搞仪式，省钱。', d: { rom: -8 } }
        ]
      },
      {
        text: '他连续加班一周。',
        options: [
          { text: '每天点一份夜宵送到他公司，不留言。', d: { comp: 6, expr: -2 } },
          { text: '直接去公司楼下等他。', d: { comp: 8, act: 5 } },
          { text: '发条消息：「忙完记得找我。」', d: { comp: 1, bound: 3 } },
          { text: '正好，把这段时间排满自己的事。', d: { comp: -7, bound: 6 } }
        ]
      },
      {
        text: '你们为一件小事吵起来。',
        options: [
          { text: '先开口：「这事今天说完。」', d: { act: 8, expr: 5 } },
          { text: '各退一步，等他先递话。', d: { act: 2 } },
          { text: '不说话，等他来找我。', d: { act: -8, expr: -4 } },
          { text: '递个台阶：「吃饭吗？」', d: { act: 5, rom: 2 } }
        ]
      },
      {
        text: '有个外地工作机会，薪水高但不稳。',
        options: [
          { text: '接下 offer，先去试试。', d: { adv: 9, act: 5 } },
          { text: '先把风险和账算清楚，再决定。', d: { adv: -2, comp: 1 } },
          { text: '问他：「你愿意一起去吗？」', d: { comp: 6, adv: 2 } },
          { text: '回掉这个机会，继续现在的生活。', d: { adv: -8, bound: 2 } }
        ]
      },
      {
        text: '喜欢一个人，你更愿意怎么让他知道。',
        options: [
          { text: '每天当面说一次「我喜欢你」。', d: { expr: 8, rom: 5 } },
          { text: '不说，把该做的事都替他做掉。', d: { expr: -7, act: 3 } },
          { text: '偶尔提一句，不多说。', d: { expr: 2 } },
          { text: '写在纸上，或者发消息，不当面说。', d: { expr: 4, rom: 3 } }
        ]
      },
      {
        text: '恋爱之后，你的独处时间：',
        options: [
          { text: '固定留出两天，谁也不占用。', d: { bound: 9, comp: -6 } },
          { text: '每周留一个晚上，其余时间给他。', d: { bound: 5, comp: 1 } },
          { text: '基本不留，时间都给他。', d: { bound: -6, comp: 7 } },
          { text: '看他的安排，随时调整。', d: { bound: -3, comp: 4 } }
        ]
      },
      {
        text: '他发烧到三十八度。',
        options: [
          { text: '请假过去，药和粥都带上。', d: { comp: 8, act: 5 } },
          { text: '先问「严不严重」，再决定去不去。', d: { comp: 3 } },
          { text: '点好外卖和药，远程盯着他吃。', d: { comp: 2, act: 4 } },
          { text: '回「多喝热水」，然后去忙自己的。', d: { comp: -5 } }
        ]
      },
      {
        text: '他约你出去，方式是：',
        options: [
          { text: '半夜带你去江边，说月亮很好。', d: { rom: 9, adv: 3 } },
          { text: '提前记住你的忌口，点菜时一样样避开。', d: { rom: 4, comp: 5 } },
          { text: '把路线、餐厅、时间都排好，你只管出门。', d: { rom: -2, act: 4 } },
          { text: '直接转一笔钱：「去买你喜欢的。」', d: { rom: -5 } }
        ]
      },
      {
        text: '旅行，票在你手上。',
        options: [
          { text: '只订来回票，中间空着。', d: { adv: 9, act: 2 } },
          { text: '定个大方向，细节当天再说。', d: { adv: 4 } },
          { text: '行程表精确到小时，餐厅也订好。', d: { adv: -6, act: 3 } },
          { text: '报个团，跟着走。', d: { adv: -8 } }
        ]
      },
      {
        text: '他做了一件很用心的事。',
        options: [
          { text: '当场说「谢谢」，再抱一下。', d: { expr: 8, rom: 4 } },
          { text: '不说，改天做件更大的还回去。', d: { expr: -4, act: 4 } },
          { text: '发条朋友圈，不点名。', d: { expr: 3, rom: 3 } },
          { text: '笑着捶他一下，说「你干嘛啊」。', d: { expr: 1, rom: 3 } }
        ]
      },
      {
        text: '他和异性朋友单独吃饭，提前告诉了你。',
        options: [
          { text: '回「玩得开心」，然后去忙自己的。', d: { bound: 8, comp: -3 } },
          { text: '问一句「几点回」，不追问。', d: { bound: 4 } },
          { text: '什么都不说，晚上等他解释。', d: { bound: -4, expr: -6 } },
          { text: '直接说：「我希望你以后避嫌。」', d: { bound: 5, expr: 7 } }
        ]
      },
      {
        text: '你确定自己喜欢上一个人了。',
        options: [
          { text: '找机会把话说出口。', d: { act: 9, expr: 6 } },
          { text: '制造见面机会，一次往前挪一格。', d: { act: 4, rom: 2 } },
          { text: '等他先开口。', d: { act: -8 } },
          { text: '先观察，确认了再动。', d: { act: -2, bound: 3 } }
        ]
      },
      {
        text: '恋爱之后，见面频率：',
        options: [
          { text: '天天见面，日程也合到一起。', d: { comp: 9, bound: -4 } },
          { text: '一周三四次，其余各自安排。', d: { comp: 4 } },
          { text: '一周一次，各自精彩。', d: { comp: -4, bound: 5 } },
          { text: '想见才约，不打卡。', d: { comp: -7, bound: 6 } }
        ]
      },
      {
        text: '你想让他懂你，会：',
        options: [
          { text: '什么都不说，等他自己看出来。', d: { expr: -4, rom: 6 } },
          { text: '把话说一半，看他能不能接上。', d: { expr: 3 } },
          { text: '有话直说，不懂就当面问。', d: { expr: 7, bound: 3 } },
          { text: '不解释，懂不懂都行。', d: { expr: -2, bound: 5 } }
        ]
      }
    ]
  },

  male: {
    tag: '男生入口',
    questions: [
      {
        text: '第一次约会，她说「都听你的」。',
        options: [
          { text: '提前一天订好店，把时间和地址发过去。', d: { act: 8, comp: 2 } },
          { text: '发两个备选，让她挑一个。', d: { act: 4, comp: 1 } },
          { text: '问她：「你平时喜欢去哪儿？」', d: { act: -4, comp: 3 } },
          { text: '说「先见面，边走边找」。', d: { act: 1, adv: 4 } }
        ]
      },
      {
        text: '她送你一张手写卡片，字有点歪。',
        options: [
          { text: '认真读完，回她一张写得更长的手写卡。', d: { rom: 8, expr: 3 } },
          { text: '读完说一句「写得真好」，收进钱包。', d: { rom: 4 } },
          { text: '问她：「这纸哪儿买的？」', d: { rom: -7, expr: -2 } },
          { text: '说声谢谢，夹进笔记本。', d: { rom: -3, expr: -4 } }
        ]
      },
      {
        text: '周末你有两天假。',
        options: [
          { text: '两天都给她，逛超市也算约会。', d: { comp: 9, bound: -5, rom: 2 } },
          { text: '白天各干各的，晚上一起吃饭。', d: { comp: 4, bound: 2 } },
          { text: '一天陪她，一天留给自己。', d: { comp: -2, bound: 4 } },
          { text: '各自安排，想见再约。', d: { comp: -7, bound: 7 } }
        ]
      },
      {
        text: '她说「下个月去爬山，没去过的那种」。',
        options: [
          { text: '回「好」，当天把路线和装备列出来。', d: { adv: 7, act: 6 } },
          { text: '先看天气和体力，再定。', d: { adv: 1, comp: 2 } },
          { text: '提议换个熟悉的地方，慢慢待着。', d: { adv: -5, comp: 2 } },
          { text: '直接说不去，怕累。', d: { adv: -8 } }
        ]
      },
      {
        text: '她下班回来，坐在沙发上一句话不说。',
        options: [
          { text: '问她怎么了，陪她把话说完。', d: { expr: 7, comp: 5, bound: -3 } },
          { text: '不说话，坐在旁边陪着。', d: { expr: -5, comp: 4 } },
          { text: '直接问：「有什么要办的，我来。」', d: { expr: -3, act: 5 } },
          { text: '带她出去吃顿好的。', d: { expr: 1, rom: 4 } }
        ]
      },
      {
        text: '你拿起她的手机，她说「没必要吧」。',
        options: [
          { text: '道歉：「确实是我越界了。」', d: { bound: 8, expr: 4 } },
          { text: '开玩笑带过去，把手机放回去。', d: { bound: -2, expr: -3 } },
          { text: '把自己的手机也递过去：「公平。」', d: { bound: -4, comp: 4 } },
          { text: '追问：「是不是有事瞒着我？」', d: { bound: -6, expr: 6 } }
        ]
      },
      {
        text: '她生日快到了。',
        options: [
          { text: '写一封长信，把想说的话写清楚。', d: { rom: 9, expr: 5 } },
          { text: '订一家她提过一次的餐厅。', d: { rom: 5, comp: 3 } },
          { text: '陪她把想做的事做完，不买礼物。', d: { rom: -2, comp: 5 } },
          { text: '转账，让她自己买。', d: { rom: -6 } }
        ]
      },
      {
        text: '她出差一周。',
        options: [
          { text: '每天视频，问她吃了什么。', d: { comp: 7, expr: 3 } },
          { text: '偶尔发条消息，不打扰她。', d: { comp: 1, bound: 4 } },
          { text: '正好，把想做的事都做了。', d: { comp: -7, bound: 6 } },
          { text: '问清航班，提前去接机。', d: { comp: 8, rom: 5, act: 4 } }
        ]
      },
      {
        text: '你们为一件小事吵起来。',
        options: [
          { text: '先开口，不管谁对。', d: { act: 8, expr: 4 } },
          { text: '冷静一晚，第二天再说。', d: { act: 1, bound: 3 } },
          { text: '等她先低头。', d: { act: -8 } },
          { text: '买点吃的放在她桌上，不说话。', d: { act: 3, rom: 3, expr: -3 } }
        ]
      },
      {
        text: '有个外派机会，待遇好但要重新开始。',
        options: [
          { text: '接下 offer，先去。', d: { adv: 9, act: 5 } },
          { text: '先算清风险和她的想法。', d: { adv: 0, comp: 4 } },
          { text: '问她愿不愿意一起，她点头再动。', d: { adv: 5, comp: 6 } },
          { text: '不去，稳定更重要。', d: { adv: -8 } }
        ]
      },
      {
        text: '你更习惯怎么表达喜欢。',
        options: [
          { text: '当面直说，不藏着。', d: { expr: 9, rom: 4 } },
          { text: '不说，修东西、接送、记得细节。', d: { expr: -6, act: 5, comp: 3 } },
          { text: '发消息说，比当面容易。', d: { expr: 3 } },
          { text: '偶尔说一句，让她自己回味。', d: { expr: -2, rom: 3 } }
        ]
      },
      {
        text: '恋爱之后，你的独处时间：',
        options: [
          { text: '固定留出两天，谁也不占用。', d: { bound: 9, comp: -6 } },
          { text: '会少，但每周留一个晚上。', d: { bound: 5 } },
          { text: '基本不留，她需要我就在。', d: { bound: -6, comp: 7 } },
          { text: '看她的状态，随时能调。', d: { bound: -2, comp: 4 } }
        ]
      },
      {
        text: '她发烧到三十八度。',
        options: [
          { text: '请假去买药、煮粥，守着。', d: { comp: 8, act: 5 } },
          { text: '先问「严不严重」，再安排。', d: { comp: 3 } },
          { text: '点好外卖和药，远程盯着她吃。', d: { comp: 2, act: 4 } },
          { text: '让她多休息，然后去忙自己的。', d: { comp: -5 } }
        ]
      },
      {
        text: '她约你出去，方式是：',
        options: [
          { text: '半夜说「外面下雨了，去走走」。', d: { rom: 8, adv: 4 } },
          { text: '提前记住你的小习惯，一样样照顾到。', d: { rom: 4, comp: 5 } },
          { text: '把路线、餐厅、时间都排好，你只管出门。', d: { rom: -3, act: 3 } },
          { text: '直接说「我想你了」。', d: { rom: 5, expr: 4 } }
        ]
      },
      {
        text: '你们计划旅行，你更倾向：',
        options: [
          { text: '只订来回票，中间空着。', d: { adv: 9, act: 2 } },
          { text: '定个大方向，细节当天再说。', d: { adv: 4 } },
          { text: '行程表精确到小时，餐厅也订好。', d: { adv: -6, act: 3 } },
          { text: '报个团，省心。', d: { adv: -8 } }
        ]
      },
      {
        text: '她为你做了一件很用心的事。',
        options: [
          { text: '认真说「谢谢」，再抱一下。', d: { expr: 8, rom: 4 } },
          { text: '不说，改天做件更大的还回去。', d: { expr: -4, act: 4 } },
          { text: '发条朋友圈，不点名。', d: { expr: 3, rom: 3 } },
          { text: '笑着揉她头发：「傻不傻。」', d: { expr: 1, rom: 4 } }
        ]
      },
      {
        text: '她和异性朋友单独吃饭，提前说了。',
        options: [
          { text: '回「玩得开心」，然后去忙自己的。', d: { bound: 8, comp: -3 } },
          { text: '问一句「几点回」，不追问。', d: { bound: 4 } },
          { text: '什么都不说，晚上等她解释。', d: { bound: -4, expr: -6 } },
          { text: '直接说：「我希望你以后避嫌。」', d: { bound: 5, expr: 7 } }
        ]
      },
      {
        text: '你确定自己喜欢上一个人了。',
        options: [
          { text: '找机会把话说出口。', d: { act: 9, expr: 6 } },
          { text: '多制造相处机会，一次往前挪一格。', d: { act: 4, rom: 2 } },
          { text: '等她先开口。', d: { act: -8 } },
          { text: '先确认她有没有意思，再动。', d: { act: -2, bound: 3 } }
        ]
      },
      {
        text: '恋爱之后，见面频率：',
        options: [
          { text: '天天见面，日程也合到一起。', d: { comp: 9, bound: -4 } },
          { text: '一周三四次，其余各自安排。', d: { comp: 4 } },
          { text: '一周一次，各自精彩。', d: { comp: -4, bound: 5 } },
          { text: '想见才约，不打卡。', d: { comp: -7, bound: 6 } }
        ]
      },
      {
        text: '你想让她懂你，会：',
        options: [
          { text: '什么都不说，等她自己看出来。', d: { expr: -4, rom: 6 } },
          { text: '把话说一半，看她能不能接上。', d: { expr: 3 } },
          { text: '有话直说，不懂就当面问。', d: { expr: 7, bound: 3 } },
          { text: '不解释，懂不懂都行。', d: { expr: -2, bound: 5 } }
        ]
      }
    ]
  }
};
