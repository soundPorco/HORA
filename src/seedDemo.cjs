/* eslint-env node */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const formId = "TLu7prm6YNrSlarDnGzx";

const q1 = "2011b77a-79ec-490e-8b2a-b2a552cc9437";
const q2 = "fe8f011b-5bf2-49d7-ac67-acf99d0a812f";
const q3 = "5ef23b46-3002-481b-bba2-074ea0d1e0d0";
const q4 = "8eb9d4d9-5657-4eb2-b386-23476096a21d";

// Q1だけネガティブ増やす
const q1Options = [
    "とても良い",
    "良い",
    "普通",
    "やや使いにくい",
    "使いにくい",
    "よくわからない",
];

// ←ここ重要（ネガティブ増やす）
const q1Weights = [25, 25, 15, 15, 12, 8];

const q2Options = [
    "リアルタイム集計",
    "QRコード共有",
    "匿名回答",
    "CSV出力",
    "グラフカスタマイズ",
    "通知機能",
    "回答のエクスポート（PDF）",
    "チーム共有機能",
];

const q3Options = [
    "週に数回",
    "週に1回程度",
    "月に数回",
    "年に数回",
    "ほぼ使わない",
];

const q4Options = [
    "とても使いやすいです",
    "UIが見やすくて良い",
    "もっと機能が欲しい",
    "シンプルでいいと思う",
    "動作が少し重い",
    "デザインが好き",
    "スマホでも使いやすい",
    "改善に期待しています",
    "初心者でも使いやすい",
    "今後も使いたいと思う",
];

// 安全なランダム（絶対undefined出ない）
function weightedRandom(options, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;

    for (let i = 0; i < options.length; i++) {
        if (rand < weights[i]) return options[i];
        rand -= weights[i];
    }

    return options[options.length - 1];
}

// チェックボックス
function randomMultiSelect(options) {
    const count = Math.floor(Math.random() * 4) + 2;
    return options.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function seed() {
    const batch = db.batch();

    for (let i = 0; i < 60; i++) {
        const ref = db.collection("answers").doc();

        const data = {
            formId,
            userId: "demo",
            votedAt: new Date(),
            answers: {
                [q1]: weightedRandom(q1Options, q1Weights),
                [q2]: randomMultiSelect(q2Options),
                [q3]: q3Options[Math.floor(Math.random() * q3Options.length)],
                [q4]: q4Options[Math.floor(Math.random() * q4Options.length)],
            },
        };

        batch.set(ref, data);
    }

    await batch.commit();
    console.log("✅ 60件データ追加完了");
}

seed();
