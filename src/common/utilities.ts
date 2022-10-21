import { css } from '@emotion/css';

export const convertKatakanaToHiragana = (target: string) => {
  return target.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
};

export const convertZenkakuEisujiToHankaku = (target: string) => {
  return target.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
};

const KANA_CONVERTION_MAP = {
  ｶﾞ: 'ガ',
  ｷﾞ: 'ギ',
  ｸﾞ: 'グ',
  ｹﾞ: 'ゲ',
  ｺﾞ: 'ゴ',
  ｻﾞ: 'ザ',
  ｼﾞ: 'ジ',
  ｽﾞ: 'ズ',
  ｾﾞ: 'ゼ',
  ｿﾞ: 'ゾ',
  ﾀﾞ: 'ダ',
  ﾁﾞ: 'ヂ',
  ﾂﾞ: 'ヅ',
  ﾃﾞ: 'デ',
  ﾄﾞ: 'ド',
  ﾊﾞ: 'バ',
  ﾋﾞ: 'ビ',
  ﾌﾞ: 'ブ',
  ﾍﾞ: 'ベ',
  ﾎﾞ: 'ボ',
  ﾊﾟ: 'パ',
  ﾋﾟ: 'ピ',
  ﾌﾟ: 'プ',
  ﾍﾟ: 'ペ',
  ﾎﾟ: 'ポ',
  ｳﾞ: 'ヴ',
  ﾜﾞ: 'ヷ',
  ｦﾞ: 'ヺ',
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ｦ: 'ヲ',
  ﾝ: 'ン',
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｯ: 'ッ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  '｡': '。',
  '､': '、',
  ｰ: 'ー',
  '｢': '「',
  '｣': '」',
  '･': '・',
};

export const convertHankakuKatakanaToZenkaku = (target: string) => {
  const regexp = new RegExp(`(${Object.keys(KANA_CONVERTION_MAP).join('|')})`, 'g');
  return target
    .replace(regexp, (s) => KANA_CONVERTION_MAP[s as keyof typeof KANA_CONVERTION_MAP])
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜');
};

export const showNotification = (options: { title: string; body: string }) => {
  const { title, body } = options;
  const div = document.createElement('div');

  div.classList.add(css`
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 100;

    display: flex;
    align-items: center;
    gap: 16px;

    padding: 16px 24px 16px 12px;
    background-color: #fffa;
    backdrop-filter: blur(16px);
    border-left: 3px solid #e74c3c;
    broder-radius: 4px;
    overflow: hidden;
    font-family: 'Yu Gothic', 'メイリオ', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
    box-shadow: 0 4px 12px -3px #0004;

    .title {
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .body {
      font-size: 14px;
      color: #666;
    }
  `);

  div.innerHTML = `
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  </div>
  <div style="flex: 1;">
    <div class="title">${title}</div>
    <div class="body">${body}</div>
  </div>`
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ');

  document.body.append(div);
};
