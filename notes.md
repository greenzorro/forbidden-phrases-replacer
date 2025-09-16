# 违禁词替换工具项目备忘录

## 1. 项目概述

### 1.1 项目目的
本文档旨在详细记录 `projects/forbidden-phrases-replacer` 目录下的违禁词替换工具项目，为项目的未来开发和维护提供便利。

**重要提示：** 每次新增或修改功能后，请务必更新此备忘录，确保文档的准确性和时效性。

### 1.2 项目简介
专为社交媒体运营人员设计的违禁词替换解决方案，支持抖音、快手、小红书、视频号等平台的内容安全处理。这是一个纯前端React应用，基于Vite构建，所有数据在本地处理，保护用户隐私。

## 2. 技术栈与依赖

### 2.1 核心技术栈
- **前端框架**: React 19.1.1 + TypeScript
- **构建工具**: Vite 7.1.2
- **样式系统**: Tailwind CSS 3.4.17
- **状态管理**: Zustand 5.0.8
- **图标库**: Lucide React 0.544.0

### 2.2 文件处理
- **压缩处理**: JSZip 3.10.1
- **文件下载**: FileSaver.js 2.0.5

### 2.3 开发依赖
- **TypeScript**: 5.8.3
- **ESLint**: 9.33.0 + React相关插件
- **PostCSS**: 8.5.6 + Autoprefixer
- **其他构建工具**: @vitejs/plugin-react, globals等

## 3. 项目结构分析

### 3.1 实际目录结构
```
forbidden-phrases-replacer/
├── .cloudflare/                 # Cloudflare Pages配置
├── dist/                        # 构建输出目录
├── node_modules/                # 依赖包
├── public/                      # 静态资源
│   ├── android-chrome-192x192.png  # Android图标
│   ├── android-chrome-512x512.png  # Android大图标
│   ├── app-icon.png              # 应用主图标
│   ├── apple-touch-icon.png      # Apple触摸图标
│   ├── favicon-16x16.png         # 小favicon
│   ├── favicon-32x32.png         # 大favicon
│   ├── robots.txt                # SEO机器人文件
│   ├── site.webmanifest          # PWA清单文件
│   └── sitemap.xml               # SEO站点地图
├── src/                         # 源代码
├── src/                         # 源代码
│   ├── components/             # React组件
│   │   ├── DownloadManager.tsx  # 下载管理器
│   │   ├── FileUploader.tsx    # 文件上传器
│   │   ├── InlineAlert.tsx     # 非侵入式验证提示组件
│   │   ├── Logo.tsx            # Logo组件，使用app-icon.png
│   │   ├── RuleEditor.tsx      # 规则编辑器，支持实时验证
│   │   ├── TextProcessor.tsx   # 文本处理器，支持复制功能
│   │   └── ThemeToggle.tsx     # 主题切换，支持本地存储
│   ├── stores/                 # 状态管理
│   │   └── appStore.ts         # 主应用状态
│   ├── types/                  # TypeScript类型定义
│   │   └── index.ts            # 类型导出
│   ├── utils/                  # 工具函数
│   │   ├── fileUtils.ts        # 文件处理工具，包含异常处理
│   │   ├── ruleUtils.ts        # 规则处理工具
│   │   ├── textUtils.ts        # 文本处理工具，支持性能优化
│   │   └── validationUtils.ts  # 验证工具，简化版格式和逻辑检查
│   ├── assets/                 # 资源文件
│   ├── App.css                 # 应用样式
│   ├── App.tsx                 # 主应用组件
│   ├── index.css               # 全局样式
│   ├── main.tsx                # 应用入口
│   └── vite-env.d.ts           # Vite环境类型声明
├── .gitignore                  # Git忽略文件
│   ├── stores/                 # 状态管理
│   │   └── appStore.ts         # 主应用状态
│   ├── types/                  # TypeScript类型定义
│   │   └── index.ts            # 类型导出
│   ├── utils/                  # 工具函数
│   │   ├── fileUtils.ts        # 文件处理工具，包含异常处理
│   │   ├── ruleUtils.ts        # 规则处理工具
│   │   ├── textUtils.ts        # 文本处理工具，支持性能优化
│   │   └── validationUtils.ts  # 验证工具，简化版格式和逻辑检查
│   ├── assets/                 # 资源文件
│   ├── App.css                 # 应用样式
│   ├── App.tsx                 # 主应用组件
│   ├── index.css               # 全局样式
│   ├── main.tsx                # 应用入口
│   └── vite-env.d.ts           # Vite环境类型声明
├── test/                       # 测试目录
├── .gitignore                  # Git忽略文件
├── eslint.config.js            # ESLint配置
├── index.html                  # HTML入口文件
├── notes.md                    # 项目备忘录（本文档）
├── package.json                # 项目配置和依赖
├── package-lock.json           # 依赖版本锁定
├── postcss.config.cjs          # PostCSS配置
├── README.md                   # 项目说明
├── tailwind.config.cjs         # Tailwind CSS配置
├── test-large-content.txt      # 大文本测试文件
├── tsconfig.app.json           # TypeScript应用配置
├── tsconfig.json               # TypeScript基础配置
├── tsconfig.node.json          # TypeScript Node.js配置
└── vite.config.ts              # Vite配置
```

### 3.2 组件功能分析
- **Logo.tsx**: 显示应用Logo和标题，使用app-icon.png作为图标
- **ThemeToggle.tsx**: 深色/浅色主题切换，支持本地存储记忆
- **RuleEditor.tsx**: 违禁词规则编辑器，支持导入导出、实时验证、异常处理
- **TextProcessor.tsx**: 单条文本实时处理，支持示例内容和复制功能
- **FileUploader.tsx**: 批量文件上传和处理，集成文件列表和操作按钮
- **DownloadManager.tsx**: 处理后文件下载管理，支持单文件TXT和多文件ZIP下载
- **InlineAlert.tsx**: 非侵入式验证提示组件，支持错误和警告显示

### 3.3 状态管理
使用Zustand进行状态管理，主要状态包括：
- 规则列表 (rules)
- 上传文件 (files)
- 处理后文件 (processedFiles)
- 原始和处理文本 (originalText, processedText)
- 主题设置 (theme)

## 4. 构建与部署

### 4.1 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览生产版本
npm run preview
```

### 4.2 应用图标和标识
- **Favicon**: 多尺寸PNG图标（16x16, 32x32, 180x180, 192x192, 512x512）
- **导航栏图标**: 使用app-icon.png作为应用标识
- **PWA支持**: Web应用清单文件，支持添加到主屏幕
- **SEO优化**: 完整的meta标签和结构化数据

### 4.3 Cloudflare Pages部署
**问题记录**：初次部署失败，原因分析如下：

#### 4.3.1 部署失败原因
- **错误现象**: Cloudflare Pages错误地使用了Next.js构建命令 (`npx next build`)
- **根本原因**: 这是一个Vite项目，不是Next.js项目
- **错误信息**: `Couldn't find any 'pages' or 'app' directory`

#### 4.3.2 解决方案
1. **构建配置**: 确保使用正确的构建命令 `npm run build`
2. **输出目录**: 配置输出目录为 `dist`
3. **环境**: Node.js 22.16.0 + npm 10.9.2

#### 4.3.3 部署配置
在Cloudflare Pages中配置：
- **构建命令**: `npm run build`
- **输出目录**: `dist`

#### 4.3.4 修复的代码问题
在修复部署过程中，发现并解决了以下TypeScript警告：
- 移除了`DownloadManager.tsx`中未使用的`{ Download, FileText }`导入
- 移除了`FileUploader.tsx`中未使用的`Upload`导入和`processedFiles`变量

### 4.3 其他部署平台
项目可部署到任何支持静态网站的平台：
- Vercel
- Netlify
- GitHub Pages
- 其他静态网站托管服务

## 5. 功能特性

### 5.1 核心功能
- **规则编辑**: 支持文本框直接编辑替换规则，格式：`违禁词,替换词`，实时验证基础格式
- **实时处理**: 输入文本后实时替换并显示结果，支持性能优化和批量处理
- **批量处理**: 支持多文件上传和批量处理，集成文件列表和操作按钮
- **规则管理**: 支持导入导出规则，包含基础格式验证和异常处理
- **本地存储**: 自动保存规则到浏览器本地存储，主题设置也持久化
- **异常处理**: 简化的验证系统，专注于格式、空值、重复等基础检查
- **复制功能**: 支持一键复制处理结果，带成功提示

### 5.2 用户体验
- **响应式设计**: 完美支持PC和移动端，自适应布局
- **深浅模式**: 支持明暗主题切换，自动检测系统偏好并记忆选择
- **智能下载**: 单文件直接下载TXT，多文件自动打包ZIP
- **简化界面**: 优化上传区布局，文件列表和操作按钮集成显示
- **非侵入式提示**: 验证错误和警告使用内联提示，不占用额外空间
- **实时反馈**: 复制成功、文件处理等操作有即时反馈
- **示例内容**: 提供示例文本快速体验功能

### 5.3 技术特性
- **纯前端**: 无后端依赖，数据本地处理
- **隐私保护**: 所有数据均在本地处理，保护用户隐私
- **离线使用**: 支持离线使用，无需网络连接
- **类型安全**: 完整的TypeScript类型定义
- **异常处理**: 简化的验证系统，专注于格式、空值、重复等基础检查
- **性能优化**: 大文本和大量规则使用分批处理，避免UI阻塞
- **模块化**: 清晰的组件架构和工具函数分离

## 6. 使用说明

### 6.1 添加替换规则
在左侧"替换规则"区域，按照 `违禁词,替换词` 的格式添加规则，例如：
```
死,💀
血,🩸
```

### 6.2 处理文本
在右上角"单条替换"区域输入需要处理的文本，系统会实时显示替换结果。

### 6.3 批量处理文件
- 在右下角"批量替换"区域上传TXT文件
- 文件列表直接显示在上传区域内，左侧为文件列表，右侧为操作按钮
- 点击"替换 X 个文件"按钮开始批量处理并自动下载
- 单文件直接下载TXT，多文件自动打包ZIP

### 6.4 管理规则
- 支持导入/导出规则文件
- 规则自动保存到本地存储

## 7. 开发规范

### 7.1 代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 组件使用函数式写法
- 移除未使用的导入和变量

### 7.2 样式规范
- 使用Tailwind CSS类名
- 响应式设计优先
- 支持深色模式

### 7.3 文件组织
- 路径别名配置：`@/`, `@components/`, `@stores/`, `@types/`, `@utils/`
- 组件文件使用PascalCase命名
- 工具函数文件使用camelCase命名

## 8. 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 9. 注意事项与最佳实践

### 9.1 开发注意事项
- 确保构建无TypeScript错误
- 定期更新依赖包
- 测试不同浏览器的兼容性

### 9.2 部署注意事项
- 确保使用正确的构建命令（Vite项目使用`npm run build`）
- 验证输出目录配置正确
- 测试生产环境的完整功能

### 9.3 维护建议
- 保持依赖包版本更新
- 监控构建日志中的警告
- 定期备份重要的配置文件

## 10. 故障排查

### 10.1 构建失败
- 检查TypeScript错误
- 验证依赖包是否正确安装
- 确保所有导入都被正确使用

### 10.2 部署失败
- 确认构建命令与项目类型匹配（Vite vs Next.js）
- 检查输出目录配置
- 验证环境版本兼容性

### 10.3 功能问题
- 检查浏览器控制台错误
- 验证状态管理逻辑
- 测试不同文件格式的处理

## 11. 测试验证

### 11.1 功能完整性验证
经过全面测试，所有核心功能均正常工作：

- ✅ **规则编辑**: 支持实时编辑和验证
- ✅ **单条替换**: 通过示例效果功能验证正常
- ✅ **批量替换**: 多文件上传和处理功能完整
- ✅ **导入导出**: 规则文件管理功能正常
- ✅ **主题切换**: 深浅模式切换和本地存储正常
- ✅ **本地存储**: 规则和主题设置持久化保存

### 11.2 主要访问地址
- **主访问地址**: https://phrase-replacer.victor42.work/
- **应用图标**: 已统一更新为红色主题（#DF2F2F）
- **SEO优化**: 完整的meta标签和结构化数据

### 11.3 验证系统简化
基于纯前端应用特点，验证系统已简化为：
- 基础格式验证（缺少逗号、多余逗号）
- 空值检测（空关键词、空替换词）
- 简单循环依赖检测（A→B且B→A）
- 重复关键词警告
- 性能警告阈值调整至5000条规则

项目已完成全面测试，所有功能均正常工作。主要特点包括纯前端实现、无需后端、支持实时文本处理和批量文件处理，适合社交媒体内容安全处理需求。