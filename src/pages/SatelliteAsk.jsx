import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import OpenAI from "openai";

// Initialize OpenAI with DeepSeek API Key and Base URL
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
});

const SatelliteAsk = ({ report }) => {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Compose context for DeepSeek
  const contextString = `Satellite Report Context:\n` +
    `Location: ${report.address} (Lat: ${report.location.lat}, Lng: ${report.location.lng})\n` +
    `Severity: ${report.severity}\n` +
    `Time: ${report.time}\n` +
    `Description: ${report.description}\n` +
    (report.videoRequested ? `Video Feed: Requested\n` : "") +
    (report.videoAvailable ? `Video Feed: Available\n` : "");

  const askQuestion = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert assistant for scientists investigating disaster vulnerabilities. Always use the provided satellite report context, and if possible, use tools or reasoning to provide the most precise location (such as the specific quarter or neighborhood, not just the city). If you need to clarify or infer the exact location, do so. Be concise, actionable, and professional." },
          { role: "system", content: contextString },
          { role: "user", content: question },
        ],
        model: "deepseek/deepseek-r1:free",
      });
      setAnswer(completion.choices[0].message.content || "No answer.");
    } catch (error) {
      setAnswer("Error fetching answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-block align-middle">
      <button
        className="ml-2 p-2 rounded-full bg-gradient-to-br from-green-400 via-blue-400 to-blue-600 hover:from-blue-500 hover:to-green-500 text-white shadow-lg border-2 border-white hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Ask DeepSeek about this report"
        style={{ boxShadow: '0 2px 8px 0 rgba(0,80,180,0.15)' }}
        onClick={() => setShow(true)}
      >
        <FaRegCommentDots className="text-lg" />
      </button>
      {show && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-40">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0 w-full max-w-lg relative border border-blue-200 flex flex-col overflow-hidden animate-fadeIn" style={{minHeight:'420px'}}>
            <button className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 font-bold z-10" onClick={() => setShow(false)}>&times;</button>
            <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-blue-100 bg-gradient-to-r from-blue-700 to-blue-400">
              <FaRegCommentDots className="text-2xl text-white" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Satellite Report Chat</h3>
            </div>
            <div className="px-6 pt-3 pb-2 text-xs text-blue-700 bg-blue-50 rounded-b-lg whitespace-pre-line font-mono border-b border-blue-100">
              {contextString}
            </div>
            <div className="flex-1 flex flex-col gap-2 px-6 py-4 bg-white min-h-[120px] max-h-72 overflow-y-auto rounded">
              {/* Chat bubbles */}
              {question && (
                <div className="flex justify-end mb-1">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow max-w-[80%] text-sm">
                    {question}
                  </div>
                </div>
              )}
              {answer && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm shadow max-w-[80%] text-gray-800 text-sm prose prose-blue whitespace-pre-line" style={{overflowWrap:'anywhere'}}>
                    {/* Format markdown-like response */}
                    <FormattedAnswer answer={answer} />
                  </div>
                </div>
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-sm shadow text-gray-500 text-sm animate-pulse">Thinking...</div>
                </div>
              )}
            </div>
            <form className="flex gap-2 px-6 py-4 bg-blue-50 border-t border-blue-100" onSubmit={e => { e.preventDefault(); askQuestion(); }}>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask anything about this report..."
                className="flex-1 p-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
                autoFocus
              />
              <button
                className="flex items-center gap-2 bg-gradient-to-br from-green-400 via-blue-400 to-blue-600 hover:from-blue-500 hover:to-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 disabled:opacity-60"
                type="submit"
                disabled={loading || !question}
                style={{ boxShadow: '0 2px 8px 0 rgba(0,80,180,0.10)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-blue-400 rounded-full"></span> Asking...</span>
                ) : (
                  <>
                    <FaRegCommentDots className="text-lg" /> Ask
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </span>
  );
}

// Format answer with basic markdown (bold, lists, line breaks)
function FormattedAnswer({ answer }) {
  // Simple formatting: bold, lists, line breaks
  let formatted = answer
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/\- (.*?)(?=<br\/>|$)/g, '<li>$1</li>');
  // Wrap lists in <ul>
  formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}
// Only one default export at the end

export default SatelliteAsk;
