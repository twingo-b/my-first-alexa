"use strict";
const Alexa = require('alexa-sdk');

// 占い結果の定義
const fortunes = [
    {'score':'good','description':'星みっつで良いでしょう' },
    {'score':'normal', 'description':'星ふたつで普通でしょう' },
    {'score':'bad','description':'星ひとつでイマイチでしょう' }
];

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context); // Alexa SDKのインスタンス生成
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};

var handlers = {
    // インテントに紐付かないリクエスト
    'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntentの呼び出し
    },
    // スキルの使い方を尋ねるインテント
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', '今日の運勢を占います。' +
            'たとえば、うらないでふたご座の運勢を教えてと聞いてください');
    },
    // 対話モデルで定義した、占いを実行するインテント
    'HoroscopeIntent': function () {
        var sign = this.event.request.intent.slots.StarSign.value; // スロットStarSignを参照
        var fortune = fortunes[Math.floor(Math.random()*3)];       // ランダムに占い結果を取得
        var message = '今日の' + sign + 'の運勢は' + fortune.description; // 応答メッセージ文字列の作成
        this.emit(':tell', message); // レスポンスの生成
        console.log(message);
    }
};
