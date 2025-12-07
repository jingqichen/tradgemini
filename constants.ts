import { DocSection } from './types';

// --- Phase 1: Ingestion & Structuring (Gemini Role) ---
export const ANALYST_PERSONA_PROMPT = `
## Role
你是由高盛、桥水基金顶级分析师组成的AI决策委员会。你的任务是根据我提供的上下文（视频字幕、会议纪要、研报文档），进行深度金融分析。

## Context
数据来源包括：行业专家访谈视频、券商深度研报、市场路演记录。内容可能包含口语化表达，请自动修正并提取核心逻辑。

## Workflow
请忽略无关的闲聊，专注于以下五个维度进行深挖，并输出为结构化的 Markdown 报告：

1. **宏观策略 (Macro)**: 提取关于GDP、利率、通胀、央行政策（Fed/人行）的明确观点。
2. **行业轮动 (Sector Rotation)**: 识别当前处于"复苏/过热/滞胀/衰退"哪个周期的行业，挖掘被低估的细分赛道。
3. **资金流向 (Capital Flow)**: 提取关于北向资金、机构席位、主力资金介入迹象的描述。
4. **技术分析 (Technical)**: 提取文本中提到的关键点位（支撑位/压力位）、形态（如头肩底）、趋势指标（MACD/KDJ）描述。
5. **基本面 (Fundamentals)**: 提取个股或行业的估值水平（PE/PB）、业绩增速、护城河分析。

## Output Format
请严格按照以下格式输出：

### 1. 宏观风向标
*   **核心判断**: [例如：看多/看空/震荡]
*   **关键因子**: [列出影响判断的政策或数据]

### 2. 行业机会扫描
| 行业/赛道 | 推荐逻辑 | 风险点 | 周期阶段 |
| :--- | :--- | :--- | :--- |
| [例如: AI光模块] | [逻辑描述] | [风险] | [成长期] |

### 3. 个股/标的深度分析
*   **标的名称**: [股票代码]
*   **基本面亮点**: ...
*   **技术面信号**: [从文本中提取的分析，如：回踩20日线]
*   **资金面动作**: ...

### 4. 交易计划建议
*   **买入区间**: ...
*   **止损位**: ...
*   **目标价**: ...
`;

// --- Phase 2: Logic & Red Teaming (DeepSeek Role Simulation) ---
// Since we are client-side, we simulate DeepSeek's reasoning capability via Gemini using a specific persona.
export const DEEP_LOGIC_PROMPT = `
## Role
你现在是基金公司的首席风控官（CRO）和投资总监（CIO）。你以逻辑严密、批判性强、善于发现逻辑漏洞著称（模拟 DeepSeek-R1 的深度推理模式）。

## Task
请对上一阶段分析师提交的《投资分析报告》进行无情的“红队测试”（Red Teaming）：

1. **寻找逻辑断层**：报告中是否有“因为 A 所以 B”，但实际上 A 推导不出 B 的情况？
2. **数据源质疑**：报告中引用的数据是否可能滞后？（例如引用了上个月的财报，但没考虑本周的监管新规）。
3. **情绪剔除**：文本中是否有过于乐观的主观词汇（如“暴涨”、“必买”）？请剔除情绪，还原客观事实。
4. **最终决策打分**：
   对每一个推荐标的进行打分（0-100分）：
   - >80分：强烈建议买入（逻辑闭环，风险可控）
   - 50-80分：观察（有瑕疵，需等待更好价格）
   - <50分：否决（逻辑有硬伤）

请给出最终的 **《模拟实盘操作指令单》**。
`;

export const SYSTEM_INSTRUCTION = `你是由 "FinanceInsight AI" 开发的顶尖金融分析师。
你的核心工作流是：
1. **Gemini 模式 (读取)**: 快速阅读大量非结构化数据，提取宏观、行业、个股信息。
2. **DeepSeek 模式 (推理)**: 对提取的信息进行逻辑推演、质疑和红队测试。

在回答用户问题时，请先引用原文数据，然后进行逻辑反思。始终使用 Markdown 格式渲染表格和重点。`;

export const ARCHITECTURE_DOCS: DocSection[] = [
  {
    title: "1. 核心架构设计 (Core Design)",
    content: `
**核心架构思路：双脑协同 (Dual-Brain Synergy)**

为了实现对 A 股大盘和个股走势的精准研判，系统采用了分层处理架构：

1.  **信息摄取者 (The Reader): Google Gemini 1.5 Pro**
    *   **职责**: 利用其 1M+ Token 的超长上下文窗口，吞吐数十万字的研报、会议纪要和视频字幕。
    *   **任务**: 结构化提取宏观数据、行业逻辑、技术面信号。
    *   **输出**: 标准化的 JSON/Markdown 中间态数据。

2.  **逻辑分析师 (The Thinker): DeepSeek R1 (Simulated/API)**
    *   **职责**: 模拟深度推理模型，对提取的数据进行“红队测试 (Red Teaming)”。
    *   **任务**: 寻找逻辑断层，剔除情绪化表达，进行博弈论视角的资金流向推演。
    *   **输出**: 最终的投资决策打分与实盘操作指令。
    `
  },
  {
    title: "2. 数据流处理 (Pipeline)",
    content: `
**从网盘到决策的完整链路：**

1.  **Ingestion (Python/Celery):**
    *   监听百度网盘/本地目录 -> 自动下载。
    *   OCR (Paddle) 解析 PDF 表格。
    *   Whisper (Large-v3) 提取视频会议字幕。
2.  **Structuring (Gemini):**
    *   System Prompt: "Role: Global Financial Analyst".
    *   Action: 提取 [宏观, 行业, 资金, 技术, 基本面] 五维数据。
3.  **Reasoning (DeepSeek Logic):**
    *   System Prompt: "Role: Chief Risk Officer (CRO)".
    *   Action: 矛盾检测 (政策 vs 资金)、预期差分析、风险压力测试。
4.  **Presentation (React):**
    *   渲染交互式研报，展示胜率赔率计算。
    `
  },
  {
    title: "3. 关键 Prompt 设计 (Prompt Engineering)",
    content: "系统内置了多阶段 Prompt 链，确保输出的专业性。",
    language: "python",
    code: `
# 阶段一：Gemini 信息提取
PROMPT_1 = """
Role: 全局金融分析师
Task: 忽略闲聊，提取以下维度的核心逻辑：
1. 宏观策略 (利率/通胀/政策)
2. 行业轮动 (复苏/过热/滞胀/衰退)
3. 资金流向 (北向/主力)
4. 技术分析 (点位/形态)
Output: Markdown Table
"""

# 阶段二：DeepSeek 逻辑对抗
PROMPT_2 = """
Role: 首席风控官 (CRO) - DeepSeek Style
Task: 对上述报告进行红队测试：
1. 寻找逻辑断层 (A推不出B)
2. 质疑数据时效性
3. 剔除情绪化词汇
Output: 最终决策打分 (0-100)
"""
    `
  },
   {
    title: "6. 生产环境部署 (Docker Full Enterprise)",
    content: `
为了获得完整的系统功能（包括百度网盘爬虫、GPU 加速的 Whisper 语音转写、本地 Milvus 向量数据库），必须使用 Docker 进行私有化部署。

**系统组件拓扑：**
1. **Frontend:** React + Vite (端口 3000)
2. **Backend:** FastAPI + Python 3.10 (端口 8000)
3. **Task Queue:** Celery + Redis (异步处理视频/爬虫任务)
4. **Vector DB:** Milvus Standalone (端口 19530)

**部署步骤：**

1. **环境准备：**
   确保服务器已安装 Docker Engine 和 NVIDIA Container Toolkit (如需 GPU 加速)。

2. **配置环境变量 (.env)：**
   \`\`\`bash
   GEMINI_API_KEY=your_key_here
   MILVUS_URI=tcp://milvus:19530
   REDIS_URL=redis://redis:6379/0
   \`\`\`

3. **启动集群：**
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

4. **验证服务：**
   - 前端访问: http://localhost:3000
   - 后端 Swagger API: http://localhost:8000/docs
   - 检查 GPU 状态: \`docker exec -it backend nvidia-smi\`
`,
    language: "yaml",
    code: `version: '3.9'

services:
  # 1. Web 前端服务
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: always

  # 2. Python 后端与 AI 引擎
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./data:/app/data  # 挂载数据卷以持久化网盘下载文件
    environment:
      - API_KEY=\${GEMINI_API_KEY}
      - MILVUS_URI=tcp://milvus:19530
      - REDIS_URL=redis://redis:6379/0
    ports:
      - "8000:8000"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    depends_on:
      - milvus
      - redis

  # 3. 向量数据库 (Milvus Standalone)
  milvus:
    image: milvusdb/milvus:v2.3.0
    command: ["milvus", "run", "standalone"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - ./milvus_volumes:/var/lib/milvus
    ports:
      - "19530:19530"
    depends_on:
      - etcd
      - minio

  # 4. 任务队列缓存
  redis:
    image: redis:7-alpine
    restart: always

  # --- Milvus 依赖项 (Etcd & MinIO) ---
  etcd:
    image: quay.io/coreos/etcd:v3.5.5
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls=http://0.0.0.0:2379

  minio:
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    command: minio server /data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin`
  }
];