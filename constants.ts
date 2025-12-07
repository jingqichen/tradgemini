import { DocSection } from './types';

export const SYSTEM_INSTRUCTION = `你是由 "FinanceInsight AI" 开发的顶尖金融分析师和AI架构助手。
你的目标是基于非结构化数据提供深度的金融市场洞察，并在被问及时解释你底层的技术架构（Python, RAG, Whisper 等）。
在分析金融文本时：
1. 提取核心投资论点（Investment Theses）。
2. 识别买入/卖出信号及其推理依据。
3. 重点提示风险因素（监管、市场、运营）。
4. 使用专业的金融术语（如 EBITDA, MACD, Alpha/Beta, 估值中枢等）。
避免幻觉；如果数据缺失，请明确说明。请始终使用中文回答。`;

export const ARCHITECTURE_DOCS: DocSection[] = [
  {
    title: "1. 技术栈选型 (Tech Stack)",
    content: `
**核心理念：** 以 Python 为核心的微服务架构，优先考虑高吞吐量的非结构化数据处理和低延迟的推理能力。

*   **编排与应用层：**
    *   **FastAPI:** 选择它是因为其高性能的异步 I/O 能力，对于处理长时间运行的推理任务和实时更新的 WebSocket 连接至关重要。
    *   **React (TypeScript):** 构建类型安全、响应迅速的现代化前端应用。
*   **AI 与数据处理：**
    *   **LlamaIndex:** 在数据摄取管道方面优于 LangChain。它提供了优化的“索引”结构用于 RAG，特别擅长处理分层文档摘要。
    *   **OpenAI Whisper (Faster-Whisper):** ASR 的行业标准。我们使用 CTranslate2 后端 (faster-whisper) 在 GPU 上实现 4 倍的推理加速。
    *   **PaddleOCR:** 在处理中文金融文档（如复杂的表格、竖排文本）时，性能优于 Tesseract。
*   **存储层：**
    *   **Milvus / Qdrant:** 向量数据库，用于管理数百万级的文档 Embedding。
    *   **PostgreSQL:** 用于存储事务性元数据和用户管理信息。
    `
  },
  {
    title: "2. 系统架构与数据流 (Architecture)",
    content: `
**数据处理流水线 (Pipeline)：**

1.  **摄取层 (Ingestion):** 
    *   Cron 定时任务触发 \`bypy\` 或 Selenium 机器人扫描受监控的百度网盘文件夹。
    *   用户通过 Web 界面上传的本地文件。
    *   文件被下载/暂存至对象存储 (MinIO/S3)。
2.  **ETL 与 清洗:**
    *   **视频/音频:** FFMpeg 提取音频 -> Whisper ASR -> 文本 + 时间戳。
    *   **文档:** PyMuPDF/PdfPlumber 提取文本 + 表格 -> 清洗后的 Markdown。
3.  **索引 (Indexing / RAG):**
    *   文本切块 (Chunking)，滑动窗口 512 token。
    *   使用 \`text-embedding-3-small\` 或 BGE-M3 (多语言) 进行 Embedding。
    *   存入向量数据库 (Vector DB)。
4.  **推理层 (Inference):**
    *   用户查询 -> 检索 (Top-K) -> 重排序 (Cohere Rerank) -> LLM 上下文窗口 -> 生成回答。
    `
  },
  {
    title: "3. 模块 A: 数据摄取 (Baidu Netdisk)",
    content: "我们要采用混合策略。优先尝试 API/bypy。如果被反爬策略拦截，自动回退到 Selenium 无头浏览器自动化。",
    language: "python",
    code: `import os
from bypy import ByPy
from selenium import webdriver

class NetdiskIngestor:
    def __init__(self, save_path="./data/raw"):
        self.bp = ByPy()
        self.save_path = save_path
        os.makedirs(save_path, exist_ok=True)

    def sync_via_api(self, remote_path):
        """Standard sync using unofficial API wrapper"""
        try:
            print(f"Attempting API sync from {remote_path}...")
            self.bp.list(remote_path)
            self.bp.download(remote_path, self.save_path)
            return True
        except Exception as e:
            print(f"API Limit reached: {e}")
            return False

    def fallback_selenium_download(self, share_link, password):
        """Fallback for strict anti-scraping"""
        options = webdriver.ChromeOptions()
        options.add_argument('--headless') 
        # ... setup download prefs ...
        driver = webdriver.Chrome(options=options)
        
        try:
            driver.get(share_link)
            # Logic to input password and click download
            # This requires constant maintenance as DOM changes
            pass
        finally:
            driver.quit()`
  },
  {
    title: "3. 模块 B: 内容提取 (ASR)",
    content: "使用 Faster-Whisper 对金融会议视频进行高效的 GPU 加速转录。",
    language: "python",
    code: `from faster_whisper import WhisperModel
import datetime

class VideoProcessor:
    def __init__(self, model_size="large-v3"):
        # Run on GPU with FP16
        self.model = WhisperModel(model_size, device="cuda", compute_type="float16")

    def transcribe(self, audio_path):
        segments, info = self.model.transcribe(audio_path, beam_size=5)
        
        print(f"Detected language '{info.language}' with probability {info.language_probability}")

        transcript = []
        for segment in segments:
            # Format timestamp [00:10 -> 00:15]
            start = str(datetime.timedelta(seconds=int(segment.start)))
            end = str(datetime.timedelta(seconds=int(segment.end)))
            text = f"[{start} -> {end}] {segment.text}"
            transcript.append(text)
            
        return "\\n".join(transcript)`
  },
  {
    title: "3. 模块 C: AI 核心 (System Prompt & RAG)",
    content: "提示工程（Prompt Engineering）的核心在于角色设定，以减少金融语境下的幻觉。",
    language: "python",
    code: `from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, PromptTemplate

# 1. Specialized Financial Prompt
FINANCE_SYSTEM_PROMPT = """
You are a Senior Financial Analyst with 20 years of experience in equity research.
Your task is to analyze the provided context (transcripts/reports) and output a structured memo.

Strict Rules:
- If mentioning specific metrics (PE, PEG, ROE), cite the source paragraph.
- Distinguish between Management Guidance (optimistic) and Analyst Estimates (conservative).
- Identify Key Risks: Regulatory, Forex, Supply Chain.
- Output Format: JSON with keys 'summary', 'buy_thesis', 'risks', 'price_targets'.

Context:
{context_str}

Query:
{query_str}
"""

def setup_rag_pipeline(doc_path):
    documents = SimpleDirectoryReader(doc_path).load_data()
    index = VectorStoreIndex.from_documents(documents)
    
    # Customizing the query engine with our prompt
    qa_template = PromptTemplate(FINANCE_SYSTEM_PROMPT)
    query_engine = index.as_query_engine(text_qa_template=qa_template)
    
    return query_engine`
  },
  {
    title: "6. 快速启动与部署 (Deployment Guide)",
    content: `
本系统支持 Docker 容器化部署，包含 React 前端、FastAPI 后端和 Milvus 数据库。

**前提条件：**
1. 获取 Google Gemini API Key (https://aistudio.google.com/).
2. 安装 Docker 和 Docker Compose.

**步骤 1: 配置环境变量**
创建 \`.env\` 文件：
\`\`\`bash
# .env file
API_KEY=your_gemini_api_key_here
MILVUS_HOST=milvus
REDIS_HOST=redis
\`\`\`

**步骤 2: 启动服务**
使用 Docker Compose 一键启动：
\`\`\`bash
docker-compose up -d --build
\`\`\`

**步骤 3: 访问应用**
*   Web 前端: http://localhost:3000
*   API 文档: http://localhost:8000/docs
*   Milvus 控制台: http://localhost:8080 (如果配置了 Attu)

**前端本地开发 (可选):**
如果您只想运行这个演示前端：
1. \`npm install\`
2. \`npm run dev\`
3. 在浏览器打开页面，进入"系统设置"，填入您的 API Key。
`,
    language: "yaml",
    code: `version: '3.8'

services:
  # 后端 API 服务
  finance-backend:
    image: python:3.10-slim
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    environment:
      - API_KEY=\${API_KEY}
    depends_on:
      - milvus

  # 前端 UI 服务 (Nginx)
  finance-frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:80"
    depends_on:
      - finance-backend

  # 向量数据库
  milvus:
    image: milvusdb/milvus:v2.3.0
    ports:
      - "19530:19530"
    volumes:
      - ./milvus_data:/var/lib/milvus`
  }
];