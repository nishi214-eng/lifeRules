# 58ハッカソンにて開発 「LifeRules」
タスク管理Androidアプリ<br>
2daysハッカソンにて、4人チーム2日間で開発。※本番環境には未マージ<br>
# ハッカソン1日目中間発表にて作成した資料<br>
https://www.canva.com/design/DAGRXhBW_UM/NuUIwtP0Ps1Xz58IIxhH2Q/view?utm_content=DAGRXhBW_UM&utm_campaign=designshare&utm_medium=link&utm_source=editor
# 成果物
<img width="200" alt="image" src="https://github.com/user-attachments/assets/fc2c38d8-a861-4cbf-a542-66432fc92810">
todoリスト<br><br>
<img src="https://github.com/user-attachments/assets/12307937-1d6d-4136-9086-70b2e64d573b" width="200">AIがタスク内容とその重要度を基に通知文を生成→プッシュ通知を送信<br><br>
<img width="200" alt="image" src="https://github.com/user-attachments/assets/ea22b0b3-d72f-491d-9cdc-9d606e10debc">
Todoリストに予定を追加すると、AIがその予定の実行に必要なタスクを算出(例：ハッカソン→環境構築,実装,発表会)<br>
<br>

# 利用技術
・ReactNaive<br>
・Expo<br>
・FireBase<br>
・OpenAI api<br>
# ハッカソンでの挑戦
ハッカソンのチームメンバーに教えていただいた、github の Projects機能によるタスク管理とIssueドリブン開発に挑戦（Fork元参照）
# 主な担当
・FireStoreを利用したデータ管理<br>
・openAi apiの利用<br>
・プッシュ通知の実装<br>
・中間発表の資料作成とプレゼン
# 58ハッカソンでの私の課題と反省
・Githubの知識不足<br>
・コミットの粒度が他のメンバーと違う<br>
・時間が足りず、FireStoreにデータを追加すると即座にフロントに表示するリアルタイム反映が実装できなかった<br>
・Reactの知識があるという理由で安易にReact Nativeをフレームワークとして採用したこと（実際はページ遷移すら実装に苦労した）<br>
・環境変数の設定の仕方など、チームメンバーに伝えて実行してもらうべき要素を伝えず、結果API keyやFireBaseのproject idを直書きする安易な実装になってしまっている
