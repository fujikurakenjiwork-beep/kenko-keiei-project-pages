/*
 * 健康経営プロジェクト 案内チャットボット（条件分岐型・AIではない）
 * - 回答はサイト本文（index.html）の内容から作成。本文を直したら、ここの回答も合わせて直す
 * - 外部への通信はしない。入力内容は送信も保存もしない
 * - 連絡先はページ内の #contact のリンクを読み取る（本文の連絡先を差し替えれば自動で反映）
 */
(function () {
  'use strict';

  // ---------- 回答シナリオ ----------
  // id: { text: 回答（段落の配列）, options: [[ボタン文言, 次のid], ...] }
  var MENU = [
    ['ストレスチェック義務化', 'law'],
    ['健康経営優良法人とは', 'kenko'],
    ['認定のメリット', 'merit'],
    ['支援内容', 'support'],
    ['費用', 'price'],
    ['進め方・期間', 'flow'],
    ['相談したい', 'contact']
  ];
  var BACK = ['最初のメニューへ', 'start'];
  var CONTACT = ['無料相談について', 'contact'];

  var NODES = {
    start: {
      text: ['こんにちは。健康経営プロジェクトのご案内です。', '知りたいことを選ぶか、下の入力欄に質問を書いてください。'],
      options: MENU
    },
    law: {
      text: [
        '2025年5月公布の改正労働安全衛生法で、これまで努力義務だった<b>従業員50人未満の事業場</b>も、ストレスチェックが義務になりました。',
        '施行は公布後3年以内で、具体的な日は政令で決まります。'
      ],
      options: [['うちは数名だけど対象？', 'target'], ['いつから始まる？', 'when'], ['備えとして何をすればいい？', 'kenko'], BACK]
    },
    target: {
      text: [
        'はい、対象です。ストレスチェックの義務化は、従業員を雇用しているすべての事業場が対象です。',
        '健康経営優良法人の中小規模法人部門も、従業員1名以上から申請できます。'
      ],
      options: [['認定のメリットは？', 'merit'], ['費用は？', 'price'], BACK]
    },
    when: {
      text: [
        '施行は「公布（2025年5月）から3年以内に、政令で定める日」です。',
        '正確な施行日は、厚生労働省の最新の発表をご確認ください。決まりしだい、このサイトでもお知らせします。'
      ],
      options: [['今から何を準備する？', 'flow'], BACK]
    },
    kenko: {
      text: [
        '「健康経営優良法人」は、経済産業省と日本健康会議が進める認定制度です。中小規模法人部門だけで、年間2万件を超える申請があります。',
        'ストレスチェック義務化への備えとして、体制づくりから申請、認定後の更新までを伴走支援しています。'
      ],
      options: [['認定のメリットは？', 'merit'], ['どれくらいで取れる？', 'period'], ['その先は？', 'wellbeing'], BACK]
    },
    merit: {
      text: [
        '建設業にとって、主に次のメリットがあります。',
        '<b>・入札・補助金</b>：公共工事の入札で加点したり、補助金の審査で評価したりする自治体があります。<br><b>・融資・保証</b>：金利の優遇や保証料の減額などの制度を設ける金融機関があります。<br><b>・採用と定着</b>：求人票に認定ロゴを掲載できます。<br><b>・労務・安全管理</b>：就業規則や保険を整理する機会になります。',
        '※ 優遇の有無や内容は、自治体・金融機関・年度によって異なります。対象地域の制度はご相談時にお調べします。'
      ],
      options: [['支援内容を見る', 'support'], ['費用は？', 'price'], CONTACT, BACK]
    },
    support: {
      text: [
        '大企業のように産業医と顧問契約を結んだり、専任担当を置いたりしなくても続けられる「背伸びしない体制づくり」を目指します。',
        '・認定取得の伴走支援<br>・ストレスチェック体制の構築<br>・労働安全・保険の整理<br>・職場環境と福利厚生のご案内<br>・防災啓発ツール（リチウムイオンバッテリー火災の防災ポスター等）<br>・助成金・奨励金の情報提供'
      ],
      options: [['社内に担当者を置けない', 'staff'], ['助成金は使える？', 'subsidy'], ['認定を取った後は？', 'after'], BACK]
    },
    staff: {
      text: [
        '書類の準備や記録の仕組みづくりは、こちらで支援します。',
        '社内でお願いするのは、意思決定と最低限の窓口役です。'
      ],
      options: [['進め方を見る', 'flow'], CONTACT, BACK]
    },
    price: {
      text: [
        '<b>着手金：250,000円（税別）</b><br>認定取得まで伴走支援します。',
        '申請期間中の諸経費と、福利厚生・環境整備メニューは、現状をお聞きしたうえでお見積りします。'
      ],
      options: [['助成金でまかなえる？', 'subsidy'], CONTACT, BACK]
    },
    subsidy: {
      text: [
        '使える制度は、地域・会社の規模・取り組みの内容によって異なります。',
        '該当しそうな助成金・奨励金の情報をお伝えし、社会保険労務士をご紹介します。申請手続きは、ご紹介する社会保険労務士とのご契約になります。',
        '※ 受給を保証するものではありません。'
      ],
      options: [CONTACT, BACK]
    },
    flow: {
      text: [
        '認定取得までは、次の流れで進めます。',
        '① 無料相談（オンライン可）<br>② お申込み・現状診断<br>③ 健康宣言・体制づくり<br>④ 施策の実施と記録<br>⑤ 申請・認定'
      ],
      options: [['どれくらいかかる？', 'period'], ['申請はいつ？', 'schedule'], CONTACT, BACK]
    },
    period: {
      text: [
        '申請は年1回です。準備を始める時期によって、およそ1年〜1年半を見込んでください。',
        '目安：東京都の事業所はおよそ1年半、それ以外の地域はおよそ1年です。'
      ],
      options: [['申請はいつ？', 'schedule'], CONTACT, BACK]
    },
    schedule: {
      text: [
        '申請は例年8〜10月の年1回です。',
        '健康宣言、担当者の選任、施策の実施と記録など、申請前に整えることがあります。次回の申請に間に合わせるなら、今から準備を始めるのが現実的です。'
      ],
      options: [CONTACT, BACK]
    },
    after: {
      text: [
        '認定は毎年更新です。',
        '継続の支援に加えて、その先のウェルビーイング経営に進むためのご提案も行います。'
      ],
      options: [['ウェルビーイング経営とは', 'wellbeing'], BACK]
    },
    wellbeing: {
      text: [
        'まずは法令対応（ストレスチェック）と、健康経営優良法人の認定取得。',
        'その先に、社員の幸福と生産性を高める「ウェルビーイング経営」があります。'
      ],
      options: [CONTACT, BACK]
    },
    contact: {
      text: [], // 実行時に、ページ内の連絡先から組み立てる
      options: [BACK]
    },
    fallback: {
      text: [
        'すみません、うまくお答えできませんでした。',
        '下のメニューから選ぶか、無料相談で直接お尋ねください。'
      ],
      options: MENU
    }
  };

  // ---------- キーワード → 回答 ----------
  // 上から順に判定し、最初に当たったものを返す
  var RULES = [
    [/健康情報|健診|健康診断の結果|診断結果|検査結果|ストレスチェック(の)?結果|病気|病歴|持病|メンタル不調/, 'privacy'],
    [/料金|費用|価格|値段|いくら|着手金|見積/, 'price'],
    [/助成金|補助金|奨励金|まかな/, 'subsidy'],
    [/数名|少人数|人数|小さい|小規模|1人|一人|何人|対象/, 'target'],
    [/いつから|施行|政令|2028/, 'when'],
    [/ストレスチェック|義務|法改正|安衛法|労働安全衛生法/, 'law'],
    [/メリット|入札|加点|融資|金利|保証料|採用|求人|ロゴ/, 'merit'],
    [/担当|人手|余裕|忙し|手間/, 'staff'],
    [/期間|どれくらい|何ヶ月|何か月|何年|かかる/, 'period'],
    [/申請|締め切り|締切|スケジュール|いつ/, 'schedule'],
    [/流れ|進め方|手順|ステップ|始め/, 'flow'],
    [/更新|認定後|取得後|取った後|取ったら|取れたら|その後/, 'after'],
    [/ウェルビーイング|幸福/, 'wellbeing'],
    [/支援|サポート|何をして|内容|福利厚生|保険|防災/, 'support'],
    [/健康経営|優良法人|認定|とは/, 'kenko'],
    [/相談|問い合わせ|問合せ|連絡|電話|フォーム|申し込|申込/, 'contact'],
    [/^(こんにちは|こんばんは|はじめまして|メニュー|最初)/, 'start']
  ];
  NODES.privacy = {
    text: [
      'ご注意ください。このチャットやお問い合わせフォームには、従業員個人の健康診断結果・ストレスチェック結果・病歴などを入力しないでください。',
      'このチャットの入力内容は、どこにも送信・保存されません。'
    ],
    options: MENU
  };

  function matchRule(input) {
    var s = input.replace(/\s+/g, '');
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(s)) return RULES[i][1];
    }
    return 'fallback';
  }

  // ---------- 連絡先（ページ内のリンクを読む） ----------
  function contactNode() {
    var links = document.querySelectorAll('#contact a[href]');
    var html = [];
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      var external = /^https?:/.test(href);
      html.push('<a class="kkbot-link" href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + a.textContent.trim() + '</a>');
    });
    return {
      text: [
        '無料相談では、会社の規模と、いつまでに認定を取りたいかをお聞きします。オンラインでも対応します。',
        html.length ? html.join('') : '<a class="kkbot-link" href="#contact">お問い合わせ欄へ</a>',
        '※ フォームには、従業員個人の健康診断結果やストレスチェック結果などを入力しないでください。'
      ],
      options: [BACK]
    };
  }

  // ---------- 画面 ----------
  var ICON_CHAT = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.8 2 11.5c0 2.4 1.2 4.6 3.1 6.1L4.3 21l4-2.1c1.2.4 2.4.6 3.7.6 5.5 0 10-3.8 10-8.5S17.5 3 12 3zm-4 9.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg>';
  var ICON_BOT = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.1A7 7 0 0 1 19 11v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5a7 7 0 0 1 6-6.9V3a1 1 0 0 1 1-1zM9 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 12a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm20 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"/></svg>';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root, panel, log, chips, form, input, launcher, started = false;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    root = el('div', 'kkbot');
    launcher = el('button', 'kkbot-launcher', ICON_CHAT + '<span class="kkbot-badge" aria-hidden="true">?</span>');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'チャットでご案内を開く');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'kkbot-panel');

    // section / header だとサイト側の装飾（余白・固定表示）が効いてしまうので div にする
    panel = el('div', 'kkbot-panel');
    panel.id = 'kkbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '健康経営プロジェクト チャットでご案内');
    panel.hidden = true;

    var head = el('div', 'kkbot-head',
      '<span class="kkbot-avatar"><img src="./assets/logo/mark-180.png" width="180" height="180" alt=""></span>' +
      '<div class="kkbot-title"><strong>健康経営プロジェクト</strong><small>チャットでご案内（自動応答）</small></div>');
    var close = el('button', 'kkbot-close', ICON_CLOSE);
    close.type = 'button';
    close.setAttribute('aria-label', 'チャットを閉じる');
    head.appendChild(close);

    log = el('div', 'kkbot-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');

    chips = el('div', 'kkbot-chips');

    form = el('form', 'kkbot-form');
    form.setAttribute('autocomplete', 'off');
    input = el('input', 'kkbot-input');
    input.type = 'text';
    input.maxLength = 100;
    input.placeholder = '質問を入力（例：費用は？）';
    input.setAttribute('aria-label', '質問を入力');
    input.setAttribute('enterkeyhint', 'send');
    var send = el('button', 'kkbot-send', ICON_SEND);
    send.type = 'submit';
    send.setAttribute('aria-label', '送信');
    form.appendChild(input);
    form.appendChild(send);

    var foot = el('p', 'kkbot-foot', '入力内容は送信・保存されません。個人の健康情報は入力しないでください。');

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(chips);
    panel.appendChild(form);
    panel.appendChild(foot);
    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    launcher.addEventListener('click', function () { panel.hidden ? open() : closePanel(); });
    close.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) closePanel(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = '';
      say(q, 'user');
      reply(matchRule(q));
    });
    // 回答内の「お問い合わせ欄へ」などページ内リンクを押したら、パネルを閉じてスクロール
    log.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a) closePanel();
    });
  }

  function open() {
    panel.hidden = false;
    root.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'チャットを閉じる');
    launcher.innerHTML = ICON_CLOSE;
    document.documentElement.classList.add('kkbot-lock');
    if (!started) { started = true; reply('start', true); }
    setTimeout(function () {
      // スマホでいきなりキーボードが出ないよう、PC幅のときだけ入力欄にフォーカス
      if (window.matchMedia('(min-width: 641px)').matches) input.focus();
      else panel.querySelector('.kkbot-close').focus();
    }, 50);
  }

  function closePanel() {
    panel.hidden = true;
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'チャットでご案内を開く');
    launcher.innerHTML = ICON_CHAT;
    document.documentElement.classList.remove('kkbot-lock');
    launcher.focus();
  }

  function say(html, who) {
    var row = el('div', 'kkbot-row kkbot-' + who);
    var bubble = el('div', 'kkbot-bubble');
    if (who === 'user') bubble.textContent = html; // 利用者の入力は文字列として表示
    else bubble.innerHTML = html;
    row.appendChild(bubble);
    log.appendChild(row);
    scrollDown();
  }

  function scrollDown() {
    log.scrollTop = log.scrollHeight;
  }

  function setChips(options) {
    chips.innerHTML = '';
    options.forEach(function (opt) {
      var b = el('button', 'kkbot-chip');
      b.type = 'button';
      b.textContent = opt[0];
      b.addEventListener('click', function () {
        say(opt[0], 'user');
        reply(opt[1]);
      });
      chips.appendChild(b);
    });
    scrollDown(); // 選択肢の分だけ会話欄が狭くなるので、最後の回答が見えるよう再スクロール
  }

  function reply(id, instant) {
    var node = id === 'contact' ? contactNode() : (NODES[id] || NODES.fallback);
    chips.innerHTML = '';
    var typing = el('div', 'kkbot-row kkbot-bot', '<div class="kkbot-bubble kkbot-typing" aria-label="入力中"><i></i><i></i><i></i></div>');
    if (!instant && !reduceMotion) { log.appendChild(typing); scrollDown(); }
    setTimeout(function () {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      node.text.forEach(function (t) { say(t, 'bot'); });
      setChips(node.options);
    }, instant || reduceMotion ? 0 : 450);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
