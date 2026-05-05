import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- 診断結果のデータベース（45パターン分作成可能） ---
// ここにAIで生成したテキストと画像をあらかじめ登録しておきます
const diagnosisDatabase = {
  "0-0-1": {
    "vision": "デスクワーク中心でストレスが低い今の状態は、巡りを改善する絶好のチャンスです。座りっぱなしによる圧迫を解き放つことで、10年後もセルライトのない美しいラインを維持できます。",
    "message": "自分を大切にできている証拠ですね。その調子で、たまには立ち上がって脚も労わってあげましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-0-2": {
    "vision": "少しの座りっぱなしの疲れがセルライトの種になりかけています。今から老廃物を流す習慣をつければ、10年後もスッキリとした太ももでいられますよ。",
    "message": "無理なく自分のペースで過ごせていますね。少しのケアが未来の脚を大きく変えてくれますよ。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-0-3": {
    "vision": "毎日のデスクワークで徐々に太もも周辺が固まり始めています。今しっかりほぐして巡りをリセットすれば、10年後の頑固な横張りは確実に防げます。",
    "message": "毎日のお仕事お疲れ様です。頑張りすぎないで、少しだけ脚を伸ばす深呼吸の時間を作ってみてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-0-4": {
    "vision": "高いストレスと長時間の座り仕事で、セルライトが非常に硬化しやすい状態です。プロの手で一度リセットし自律神経を整えれば、10年後も軽やかな脚を取り戻せます。",
    "message": "毎日たくさん抱え込んでいませんか？脚の張りはあなたの頑張りの証。どうかご自身を甘やかす時間を作ってあげてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-0-5": {
    "vision": "脳の疲労が脚を「鎧」のように硬くしています。今すぐ心身の緊張を解き放つケアを始めれば、10年後は見違えるほどしなやかで巡りの良い脚になりますよ。",
    "message": "限界まで本当によく頑張りましたね。もう自分を後回しにするのは終わりにしましょう。私たちにゆだねてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-1-1": {
    "vision": "ストレスは少ないものの、座り姿勢で鼠径部が圧迫され冷えが生じています。今のうちに血流を促すケアを取り入れれば、10年後もぽかぽかと温かい脚を保てます。",
    "message": "穏やかな日々を過ごせていて素晴らしいです。冷えは万病の元、少しだけ温める意識を持ってみてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-1-2": {
    "vision": "デスクワークでの血流低下が冷えを招いています。今の段階で芯から温めるアプローチをすれば、10年後も代謝の高いスッキリ脚が叶います。",
    "message": "心に少しのゆとりがある今が、体質改善のベストタイミングです。温かい飲み物でホッと一息ついてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-1-3": {
    "vision": "冷えが蓄積し、脂肪が燃えにくい状態になりつつあります。今のうちに熱を生み出す力を呼び覚ませば、10年後も冷え知らずの健康的な脚で過ごせます。",
    "message": "毎日同じ姿勢で頑張っていると、脚先まで冷えてしまいますよね。足首を回すだけでも立派なケアですよ。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-1-4": {
    "vision": "強いストレスで血管が収縮し、デスクワークの圧迫と相まって深刻な冷えを引き起こしています。リラクゼーションと共に深部を温めれば、10年後の未来は明るいです。",
    "message": "緊張状態が続くと、体はどんどん冷えてしまいます。頑張り屋さんのあなたこそ、心まで温まる休息が必要です。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-1-5": {
    "vision": "極度のストレスと冷えが合わさり、脚全体が氷のように固まっています。一刻も早く自律神経を休ませてあげることで、10年後は血色の良い柔らかな脚を取り戻せます。",
    "message": "SOSのサイン、しっかり受け取りました。今は何も考えず、ただただ温かく包み込まれる時間を自分に許してあげてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-2-1": {
    "vision": "座り癖による筋膜の癒着が脚痩せを阻害していますが、心身の状態は良好です。適切なほぐしを取り入れるだけで、10年後は全身のバランスが整った美脚になります。",
    "message": "ダイエット成功、本当に素晴らしいです！あとは脚だけ。リラックスして最後の仕上げを楽しみましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-2-2": {
    "vision": "デスクワークでの代償動作が脚の太さを残しています。正しい筋肉の使い方の癖をつければ、10年後もリバウンドのない理想の脚のラインを保てます。",
    "message": "全体が痩せたのはあなたの努力の賜物です。残った脚のお悩みは、私たちプロに少しだけお手伝いさせてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-2-3": {
    "vision": "座り姿勢の偏りが下半身の代謝だけを落としています。今から根本的な巡りの改善を行うことで、10年後は「脚が一番のチャームポイント」と言えるようになります。",
    "message": "「脚だけ痩せない」という悔しさ、よくわかります。でも諦めないで。原因はあなたの努力不足ではなく、日常の癖にあります。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-2-4": {
    "vision": "ストレスからくる無意識の力みが、脚だけに筋肉の張りを残しています。心の緊張を解き、癒着を剥がすことで、10年後はスラリとしたモデルのような脚が手に入ります。",
    "message": "気を張る日々の中で、脚もキュッと力んで守ってくれているんです。もう大丈夫、少し肩の力を抜いてみましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "0-2-5": {
    "vision": "過酷なストレスが自律神経を乱し、脚にだけ「守りの鎧」を作らせています。まずは深い休息をとることで体が安心し、10年後は嘘のようにすっきりした下半身になります。",
    "message": "心が限界を迎えている時、体は必死にバランスを取ろうとします。今はダイエットをお休みして、自分を癒すことを最優先にしてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-0-1": {
    "vision": "立ち仕事で重力に負けた水分が一時的に溜まっていますが、ストレスがないため回復は早いです。毎日のリセットケアで、10年後もむくみやセルライトのない脚でいられます。",
    "message": "心穏やかに過ごせている今、お風呂上がりの少しのマッサージで脚は素直にスッキリしてくれますよ。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-0-2": {
    "vision": "立ち仕事の疲労が蓄積し、夕方のむくみがセルライト化し始めています。今のうちに循環を整えれば、10年後もボコボコ感のないなめらかな脚を維持できます。",
    "message": "毎日重力と戦いながら立っている脚に、感謝の気持ちを込めて優しくなでてあげてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-0-3": {
    "vision": "長時間の立ち仕事と日常のストレスで、太ももの外側に負荷がかかり張りが出きています。今正しいケアをすれば、10年後も痛みのない美しいラインの脚で歩き続けられます。",
    "message": "夕方の靴がきつくなる不快感、辛いですよね。今日もお疲れ様。脚を高くしてゆっくり休んでください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-0-4": {
    "vision": "強いストレスと立ちっぱなしの疲労が重なり、老廃物がカチカチのセルライトになりかけています。プロの徹底的なデトックスで、10年後は軽やかに弾むような脚が手に入ります。",
    "message": "心も体もパンパンに張っていませんか？その張りはあなたの頑張りそのもの。どうか私たちに軽くするお手伝いをさせてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-0-5": {
    "vision": "極度のストレスと肉体疲労で、脚の筋肉が常に緊張し固太りのセルライトを作っています。まずは心身を究極にリラックスさせることで、10年後は見違えるほど柔らかな美脚になります。",
    "message": "限界を超えて立ち続けているあなたへ。もう自分にムチを打つのはやめて、温かいベッドで泥のように眠る日を作ってください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-1-1": {
    "vision": "立ち仕事でもストレスが少ないため、冷えは初期段階です。ポンプの役割をするふくらはぎのケアを日常に組み込めば、10年後も芯から温かい代謝の良い脚を保てます。",
    "message": "ご自身のペースで働けていて素晴らしいですね。お風呂でしっかり脚を温めるだけで、さらに軽くなりますよ。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-1-2": {
    "vision": "疲労による筋肉の硬直が血流を妨げ、冷えを生んでいます。今のうちに柔軟性を取り戻せば、10年後も冷房に負けない健康的な脚でいられます。",
    "message": "立ち仕事での冷えは、脚からの「休ませて」というサインです。少しだけ足先を動かして血を巡らせてみましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-1-3": {
    "vision": "夕方からの冷えとむくみが慢性化しつつあります。今、自らの力で熱を生み出せる体に改善すれば、10年後もむくみ知らずの軽やかな脚で生活できます。",
    "message": "毎日立っていると、足先から冷気が上がってくるように感じますよね。温かい靴下で自分を優しく守ってあげてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-1-4": {
    "vision": "高いストレスにより交感神経が優位になり、末端の血管が収縮して深刻な冷えを引き起こしています。深いリラクゼーションを取り入れることで、10年後は血流の豊かな温かい脚になります。",
    "message": "気を張ったまま立ち続けるのは、想像以上の負担です。あなたの冷え切った脚も心も、温かく包み込んで溶かしてあげたいです。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-1-5": {
    "vision": "心身の限界が自律神経をフリーズさせ、脚が氷のように冷たく硬直しています。今は休息と温熱ケアを最優先にすることで、10年後は生命力に溢れる柔らかな脚を取り戻せます。",
    "message": "「もう無理かも」という心の声、我慢しないでください。あなたが一番大切にするべきなのは、他の誰でもなくあなた自身です。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-2-1": {
    "vision": "立ち仕事特有の筋肉の使い方が脚の太さを残していますが、心身の状態は良いです。立ち姿勢の重心を整えるだけで、10年後はすらりとしたバランスの良い脚を手に入れられます。",
    "message": "ダイエット大成功ですね！あと一歩、脚のバランスだけです。自分の体を褒めながら、リラックスして仕上げていきましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-2-2": {
    "vision": "長時間の立ち仕事による筋膜の癒着が、脚だけ痩せない原因です。プロの技術で癒着を丁寧に剥がせば、10年後も引き締まった美しい下半身をキープできます。",
    "message": "全体は痩せたのに脚だけ…もどかしいですよね。それはあなたの姿勢の頑張り癖が原因。私たちがしっかりリセットします。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-2-3": {
    "vision": "立ち仕事の疲労で前ももやふくらはぎが張り、そこだけが太く残っています。筋肉の緊張を解くケアを始めれば、10年後はどんな服でも着こなせるスッキリ脚になります。",
    "message": "毎日体重を支えてくれている脚の筋肉が「もっと頑張らなきゃ」と張っている状態です。優しくほぐして安心させてあげましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-2-4": {
    "vision": "ストレスによる力みと立ちっぱなしの負担が、頑固な「鎧」のような筋肉の張りを作っています。心からのリラックスを経験することで、10年後は驚くほど華奢な脚に生まれ変わります。",
    "message": "気を張って立っていると、脚にも無意識に力が入りますよね。もう戦わなくて大丈夫。力を抜くことから始めましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "1-2-5": {
    "vision": "限界のストレス状態で立ち続けた結果、脚がガチガチに防衛反応を起こしています。すべてを休める時間を作れば体が安心し、10年後は理想通りのほっそりした脚に整います。",
    "message": "これ以上頑張れと言われたら壊れてしまう、そんな状態ですね。ダイエットのことは忘れて、ただただ自分を労わる時間を作ってください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-0-1": {
    "vision": "動き回る日々で疲労はありますが、ストレスが低いため循環は悪くありません。少しの自分時間でケアを加えれば、10年後も若々しいセルライトのない脚を保てます。",
    "message": "ご家族のための時間の中でも、ご自身の心を大切にできていて素敵です。その延長で、脚のケア時間も作ってみてくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-0-2": {
    "vision": "不規則な動きと軽いストレスから、骨盤周りに老廃物が溜まり始めています。今のうちにバランスを整えれば、10年後も横張りのないスッキリした下半身でいられます。",
    "message": "毎日パタパタと動き回って、本当にお疲れ様です。少し立ち止まって、自分の脚を愛おしむ時間を持ってみてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-0-3": {
    "vision": "家事や抱っこなどの片側重心の癖が、太ももの横張りとセルライトを作っています。今、プロのケアで歪みをリセットすれば、10年後も美しいボディラインで若々しくいられます。",
    "message": "家族優先で自分のことは後回しになりがちですよね。でも、あなたが笑顔でいることが家族の幸せ。自分へのご褒美をあげてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-0-4": {
    "vision": "高いストレスと終わりのない家事育児で、体が常に緊張状態になりセルライトが硬化しています。心と体を徹底的に解放すれば、10年後は身軽でしなやかな脚を取り戻せます。",
    "message": "「私さえ我慢すれば」と、一人で抱え込んでいませんか？あなたの脚の張りは、言葉にできないSOSです。どうか私達に頼ってください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-0-5": {
    "vision": "心身の限界を超えた状態での家事育児が、脚をガチガチの鎧に変えてしまっています。今は何よりも深い休息をとることで、10年後は信じられないほど軽やかな脚と笑顔を取り戻せます。",
    "message": "毎日、息つく暇もないですね。涙が出るほど頑張っているあなたに、今はただ「休んでいいんだよ」と伝えたいです。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-1-1": {
    "vision": "動き回ることで熱は生まれていますが、足元への意識が不足しがちです。日常のちょっとした温めケアを取り入れるだけで、10年後も冷えのない健康的な脚を保てます。",
    "message": "穏やかな気持ちで家族と向き合えている証拠ですね。足首を冷やさない工夫をするだけで、もっと体が楽になりますよ。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-1-2": {
    "vision": "忙しさからくるシャワー浴などが冷えの蓄積を招いています。今の段階で湯船に浸かるなどの温め習慣をつければ、10年後も代謝の良い巡る脚でいられます。",
    "message": "自分の入浴時間はカラスの行水になっていませんか？たまにはゆっくりお湯に浸かって、自分だけの時間を楽しんでくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-1-3": {
    "vision": "家事育児の疲労と自律神経の軽い乱れが、慢性的な冷えを引き起こしています。今根本的な体質改善を行えば、10年後も内側から輝くような温かい脚で過ごせます。",
    "message": "バタバタと動き回っているのに、脚先は氷のように冷たい…それは体が疲れているサインです。少しペースダウンしてみましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-1-4": {
    "vision": "高いストレスにより交感神経が働き続け、血流が内臓に集中するため極端な末端冷えが起きています。究極のリラックスで副交感神経を優位にすれば、10年後は温かく柔らかな脚を取り戻せます。",
    "message": "24時間気を張っているお母さんの体は、ずっと戦闘モードです。温かい手で丁寧にケアして、安心させてあげたいです。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-1-5": {
    "vision": "限界のストレス状態が自律神経を完全に乱し、脚が芯から凍え切っています。まずはすべてを手放して深い休息と温熱ケアをすれば、10年後は生命力にあふれた温かい体になります。",
    "message": "自分を犠牲にしてまで頑張らないでください。あなたの心と体の冷えを溶かす場所が、ここにはあります。頼ってくださいね。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-2-1": {
    "vision": "家事育児の不規則な姿勢が脚のラインを崩していますが、ストレスが低いため改善はスムーズです。正しい骨盤の位置を覚えれば、10年後も全体のバランスが取れた美脚でいられます。",
    "message": "忙しい中でもダイエットを成功させたこと、本当に尊敬します！最後の仕上げはプロに任せて、リラックスしてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-2-2": {
    "vision": "抱っこや家事の偏った筋肉の使い方が、特定の部位の太さを残しています。癒着を剥がして姿勢をリセットすれば、10年後もパンツスタイルが似合うスッキリ脚を保てます。",
    "message": "「なぜ脚だけ？」と悩まないで。それはあなたが毎日家族のために動いている証拠の筋肉です。美しく整えていきましょう。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-2-3": {
    "vision": "終わりのない家事の疲労と負担が脚の筋肉を張らせ、そこだけ痩せない状態を作っています。プロのケアで根本からほぐせば、10年後は全身がしなやかなモデルのような体型になります。",
    "message": "自分の体に目を向ける余裕もない中、ここまで痩せたのはすごいことです。残った脚のお悩みは、一人で抱え込まずご相談ください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-2-4": {
    "vision": "高いストレスと肉体疲労で、脚の筋肉が「これ以上痩せたら体を支えられない」と防衛反応を起こしています。心からの休息を与えれば、10年後は驚くほど華奢で真っ直ぐな脚になります。",
    "message": "気を張り詰めた毎日に、体も必死に耐えています。もう戦わなくて大丈夫。力を抜いて、自分のためだけの時間を過ごしてください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  },
  "2-2-5": {
    "vision": "心身の限界からくる無意識の極度の力みが、脚を硬い鎧のように太く残しています。すべてを休めて体を安心させてあげることで、10年後は本来の美しいあなた自身の脚に生まれ変わります。",
    "message": "限界まで頑張るお母さん、本当にお疲れ様です。今は結果を焦らず、ただただ自分を甘やかして大切にする日を作ってください。",
    "imageUrl": "https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&w=800&q=80"
  }
};

const App = () => {
  const [lifeStyleIdx, setLifeStyleIdx] = useState(0);
  const [mainWorryIdx, setMainWorryIdx] = useState(0);
  const [stressLevel, setStressLevel] = useState(3);
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const chartRef = useRef(null);

  const lifeStyles = ["デスクワーク中心", "立ち仕事中心", "家事・育児中心"];
  const worries = ["太もものセルライト・横の張り", "冷え・温まらない", "脚だけ痩せない"];
  const stressLabels = ["ほぼなし", "低い", "普通", "高い", "限界に近い"];

  const startDiagnosis = () => {
    setIsDiagnosisLoading(true);
    setDiagnosisResult(null);

    // AI解析をシミュレーションするための待ち時間（2秒）
    setTimeout(() => {
      const key = `${lifeStyleIdx}-${mainWorryIdx}-${stressLevel}`;
      // データベースにない組み合わせの場合は、デフォルト（0-0-3）を表示
      const result = diagnosisDatabase[key] || diagnosisDatabase["0-0-3"];
      
      setDiagnosisResult(result);
      setIsDiagnosisLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const ctx = document.getElementById('evolutionChart')?.getContext('2d');
    if (ctx && !chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['純粋な脂肪', 'むくみ・巡り', '芯の冷え', '脳疲労・ストレス', 'デジタル疲労', '筋膜の癒着'],
          datasets: [
            {
              label: '1980年代',
              data: [90, 65, 40, 25, 5, 30],
              backgroundColor: 'rgba(214, 191, 160, 0.2)',
              borderColor: 'rgba(214, 191, 160, 1)',
              borderWidth: 2,
              fill: true
            },
            {
              label: '現在',
              data: [50, 85, 95, 90, 100, 80],
              backgroundColor: 'rgba(26, 42, 64, 0.2)',
              borderColor: 'rgba(26, 42, 64, 1)',
              borderWidth: 3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } }
        }
      });
    }
  }, []);

  return (
    <div className="bg-[#fdfbf7] text-[#3d2e1f] font-sans min-h-screen">
      <nav className="bg-white border-b border-[#e6d8c3] h-16 flex items-center px-6 justify-between sticky top-0 z-50">
        <span className="font-serif font-bold text-lg">創業44周年 脚やせシステム</span>
        <a href="#booking" className="bg-[#1a2a40] text-white text-xs px-5 py-2 rounded-full font-bold">無料体験予約</a>
      </nav>

      <header className="py-20 text-center px-6 bg-gradient-to-b from-[#fdfbf7] to-[#f5f0e6]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">
            脚が変われば、人生の景色が変わる。<br />
            <span className="text-[#b5945d] text-2xl md:text-4xl">44年の知見で、未来をシミュレーション。</span>
          </h1>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#fdfbf7] rounded-3xl shadow-2xl overflow-hidden border border-[#f2ece0] grid grid-cols-1 lg:grid-cols-2">
            
            {/* 入力エリア */}
            <div className="p-8 md:p-12 space-y-8 bg-[#f5f0e6]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3">ライフスタイル</label>
                  <select onChange={(e) => setLifeStyleIdx(parseInt(e.target.value))} className="w-full p-4 bg-white border border-[#e1d4bc] rounded-xl">
                    {lifeStyles.map((s, i) => <option key={i} value={i}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3">一番の悩み</label>
                  <select onChange={(e) => setMainWorryIdx(parseInt(e.target.value))} className="w-full p-4 bg-white border border-[#e1d4bc] rounded-xl">
                    {worries.map((w, i) => <option key={i} value={i}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3">現在のストレス度</label>
                  <input type="range" min="1" max="5" value={stressLevel} onChange={(e) => setStressLevel(parseInt(e.target.value))} className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#b5945d]" />
                  <div className="flex justify-between text-xs mt-2 font-bold text-[#b5945d]">
                    <span>穏やか</span>
                    <span className="text-[#1a2a40]">{stressLabels[stressLevel-1]}</span>
                    <span>限界</span>
                  </div>
                </div>
              </div>
              <button onClick={startDiagnosis} disabled={isDiagnosisLoading} className="w-full bg-[#1a2a40] text-white font-bold py-5 rounded-2xl shadow-xl transition-all">
                {isDiagnosisLoading ? "解析中..." : "AI未来カウンセリングを開始する ✨"}
              </button>
            </div>

            {/* 結果表示エリア */}
            <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-white min-h-[500px]">
              {diagnosisResult ? (
                <div className="w-full space-y-6 animate-in fade-in duration-700">
                  <img src={diagnosisResult.imageUrl} className="w-full aspect-video rounded-2xl object-cover shadow-lg" alt="未来予想" />
                  <div className="bg-[#f9f7f2] p-6 rounded-2xl border border-[#e1d4bc]">
                    <h4 className="font-serif font-bold text-[#b5945d] mb-2">🔮 10年後の未来予測</h4>
                    <p className="text-sm leading-relaxed">{diagnosisResult.vision}</p>
                  </div>
                  <div className="bg-[#1a2a40] text-white p-6 rounded-2xl">
                    <p className="text-sm italic italic leading-relaxed">「{diagnosisResult.message}」</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-64 h-64 mx-auto opacity-80">
                    <canvas id="evolutionChart"></canvas>
                  </div>
                  <p className="text-sm text-gray-500 italic">左のフォームを入力して診断を開始してください</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
