const admin = require("firebase-admin");

// serviceAccountKey.json を同じ階層に置く
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const formId = "TLu7prm6YNrSlarDnGzx";

const q1 = "2011b77a-79ec-490e-8b2a-b2a552cc9437"; // ラジオ
const q2 = "fe8f011b-5bf2-49d7-ac67-acf99d0a812f"; // チェック
const q3 = "5ef23b46-3002-481b-bba2-074ea0d1e0d0"; // プルダウン
const q4 = "8eb9d4d9-5657-4eb2-b386-23476096a21d"; // テキスト

// 選択肢
const q1Options = ["とても良い", "良い", "普通", "改善が必要"];
const q2Options = ["リアルタイム集計", "QRコード共有", "匿名回答", "CSV出力"];
const q3Options = ["週に数回", "月に数回", "年に数回", "ほぼ使わない"];
const q4Options = [
    "とても使いやすいです",
    "UIが見やすくて良い",
    "もっと機能が欲しい",
    "シンプルでいいと思う",
    "動作が少し重い",
    "デザインが好き",
    "スマホでも使いやすい",
    "改善に期待しています",
];

// 偏りをつける関数
function weightedRandom(options, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < options.length; i++) {
        sum += weights[i];
        if (rand < sum) return options[i];
    }
}

// チェックボックス用（1〜3個選択）
function randomMultiSelect(options) {
    const count = Math.floor(Math.random() * 3) + 1;
    return options.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function seed() {
    const batch = db.batch();

    for (let i = 0; i < 30; i++) {
        const ref = db.collection("answers").doc();

        const data = {
            formId: formId,
            userId: "demo",
            votedAt: new Date(),
            answers: {
                [q1]: weightedRandom(q1Options, [50, 30, 15, 5]), // 良い寄りに偏らせる
                [q2]: randomMultiSelect(q2Options),
                [q3]: weightedRandom(q3Options, [30, 40, 20, 10]),
                [q4]: q4Options[Math.floor(Math.random() * q4Options.length)],
            },
        };

        batch.set(ref, data);
    }

    await batch.commit();
    console.log("✅ 30件のデモ回答を追加しました");
}

seed();
