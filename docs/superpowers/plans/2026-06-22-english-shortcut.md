# 英语抄写快捷入口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在主题切换旁增加新标签页打开的英语抄写快捷入口。

**Architecture:** 使用原生外链元素复用现有图标按钮样式，不增加应用状态。

**Tech Stack:** React、TypeScript、Testing Library

---

### Task 1: 快捷入口

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] 写失败测试：链接名称、地址、`target="_blank"` 和安全 `rel`。
- [ ] 添加书本图标外链并复用图标按钮样式。
- [ ] 运行全部测试和生产构建。
- [ ] 提交并发布 GitHub Pages。
