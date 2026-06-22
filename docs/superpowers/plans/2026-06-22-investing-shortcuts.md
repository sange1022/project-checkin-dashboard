# 投资学习快捷入口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在右上角增加“巴”和“芒”两个安全的新标签页快捷入口。

**Architecture:** 使用原生外链复用 `icon-button`，不增加应用状态。

**Tech Stack:** React、TypeScript、Testing Library

---

### Task 1: 添加并发布快捷入口

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] 测试两个链接的名称、地址、新标签页和安全属性。
- [ ] 添加“巴”“芒”文字按钮。
- [ ] 运行全量测试和生产构建。
- [ ] 提交并发布 GitHub Pages。
