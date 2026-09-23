# 魂の結束 — 完成版

公開先：https://dorami-tamakizu.github.io/Eta/

道中60体を倒してボス戦へ進む、スマートフォン向けアクションゲームです。
上スワイプごとに一歩分の加速が積み重なります。撃破直後のスーパーダッシュは敵の束の間隔1つ分（32）までです。
ボスは前後左右へ移動し、スキル命中時のみダメージを与えます。主人公の後退に連動して巨大化しません。撃破数は画面表示しません。
スキルは元の命中判定と50%経過後のキャンセル受付です。連打予約や左レーンだけへの命中を中断する仕様はありません。

通常攻撃は2秒に1回・1ダメージで、GPTイメージ製の斜め振り下ろしエフェクトと同期します。ボスの横斬撃は表示中の接触も1発動1回まで判定し、炎竜は描画位置・幅を含めて命中判定します。防御による無効化は維持します。

## 配布ファイル

`index.html` が参照するハッシュ付き JavaScript が公開用です。`game.js`、`bgm.js`、`sfx.js` は保守用ソースで、対応する公開用ファイルと内容が一致します。
`assets/` には現行コードが参照する素材のみを収録しています。旧版はGit履歴に残り、公開ディレクトリには含めません。
背景の画像内容は維持し、ファイル名に内容ハッシュを付けています。背景の読み込み完了後にSTARTを有効化し、読み込み途中に旧背景を描く処理はありません。

## 検証

```sh
node tests/release.cjs
node tests/boss-hitbox.cjs
node tests/running.cjs
node tests/boss-animation.cjs
node tests/swipe-movement.cjs
node tests/bgm.cjs
node tests/ultimate-audio.cjs
```

ローカル起動：`python -m http.server 8765`
音源の出典は `AUDIO_CREDITS.md`、ボス素材の出典は `assets/README-boss-contact-v6.md` を参照してください。
