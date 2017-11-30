"use strict";
const AWSXRay = require('aws-xray-sdk');
const Alexa = require('alexa-sdk');
const fortunes = [{
        'score': 'good',
        'description': '星みっつで良いでしょう'
    },
    {
        'score': 'normal',
        'description': '星ふたつで普通でしょう'
    },
    {
        'score': 'bad',
        'description': '星ひとつでイマイチでしょう'
    }
];
// ステートの定義
const states = {
    SYNASTRYMODE: '_SYNASTRYMODE'
};
// 相性占い結果の定義
const synastries = [{
        'score': 'good',
        'description': '良いです。仲良くなれるかもしれません'
    },
    {
        'score': 'normal',
        'description': '普通です。仲良くなるために頑張りましょう'
    },
    {
        'score': 'bad',
        'description': '悪いです。仲良くなるためには努力が必要かもしれません'
    }
];
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers, synastriesHandlers); // 既存のハンドラに加えてステートハンドラ(後半で定義)も登録
    alexa.execute();
};
var handlers = {
    'LaunchRequest': function() {
        this.emit('AMAZON.HelpIntent');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', '今日の運勢を占います。' +
            'たとえば、うらないでふたご座の運勢を教えてと聞いてください');
    },
    'HoroscopeIntent': function() {
        var sign = this.event.request.intent.slots.StarSign.value;
        var fortune = fortunes[Math.floor(Math.random() * 3)];
        this.handler.state = states.SYNASTRYMODE; // ステートをセット
        this.attributes['sign'] = sign; // 星座をセッションアトリビュートにセット
        var message = '今日の' + sign + 'の運勢は' + fortune.description + '。' +
            '相性を占いますので、お相手の星座を教えてください';
        var reprompt = 'お相手の星座を教えてください';
        this.emit(':ask', message, reprompt); // 相手の星座を聞くためにaskアクションに変更
        console.log(message);
    }
};
// ステートハンドラの定義
var synastriesHandlers = Alexa.CreateStateHandler(states.SYNASTRYMODE, {
    'HoroscopeIntent': function() {
        // ハンドラの実行後、スキルの初期状態に戻すためステートをリセット
        this.handler.state = '';
        this.attributes['STATE'] = undefined;
        var yourSign = this.attributes['sign']; // セッションアトリビュートsignを参照
        var hisSign = this.event.request.intent.slots.StarSign.value; // スロットから相手の星座を参照
        var synastry = synastries[Math.floor(Math.random() * 3)]; // ランダムに相性を決める
        var message = yourSign + 'と' + hisSign + 'の相性は' + synastry.description;
        this.emit(':tell', message);
        console.log(message);
    },
    'Unhandled': function() {
        var reprompt = 'お相手の星座を教えてください';
        this.emit(':ask', reprompt, reprompt);
    }
});
