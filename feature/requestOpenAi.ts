import axios from "axios";
//import { OPENAI_API_KEY } from '@env';
const OPENAI_API_KEY = "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"

// openAI APIにHTTPリクエストを送信し、そのレスポンスを取得する関数
export const requestOpenAi = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    try {
        const trimSchedule = systemPrompt.trim(); // 入力から余分な空白を削除
        const trimUserPrompt = userPrompt.trim();  // 入力から余分な空白を削除

        // openAI apiへのHTTPリクエストを作成
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4", // モデル名の確認
            messages: [
                { role: "system", content: trimSchedule },
                { role: "user", content: trimUserPrompt }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        });

        alert(response.data.choices[0].message.content);
        return response.data.choices[0].message.content; // レスポンスの内容を返す
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        throw error; // エラーを再スロー
    }
};