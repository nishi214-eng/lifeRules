import axios from "axios";
import  { OPENAI_API_KEY }  from  "@env" 
import { useState } from "react";
// openAI APIにHTTPリクエストを送信し、そのレスポンスを取得する関数
export const requestOpenAi = (schedule:string) => {
    const [answer,setAnswer] = useState<string>("");
    try{
        // openAI apiへのHTTPリクエストを作成 返り値はPromise
        axios.post("https://api.openai.com/v1/chat/completions",{
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": ``}, //ここに前提条件を書き込む 例：重要度が高いなら強い文章で通知文を考えて
                {"role": "user", "content": `${schedule}`}
            ] // イベントやタスクを受け取ってプロンプトに組み込む
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
         },).then((response) => { // レスポンスを表示
            setAnswer(response.data.response.choices[0].message.content)
            return answer
         }).catch((error) => { 
            console.log(error)
         })
    }catch (error) {
        console.log(error)
    }
}
