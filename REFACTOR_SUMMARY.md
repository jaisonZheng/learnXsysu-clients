# LearnX SYSU 重构总结

本次重构将原有的清华大学 LearnX 客户端适配为中山大学版本，主要完成了以下三个任务：

## ✅ 任务一：硬编码账户与绕过真实认证

### 修改的文件：
- `src/screens/Login.tsx`
- `src/data/actions/auth.ts`

### 主要改动：
1. **硬编码默认账户**：在登录页面，用户名和密码的初始值被设置为：
   - Username: `student2025`
   - Password: `password123`

2. **绕过 CAS 认证**：
   - 移除了原有的 SSO 弹窗和清华大学统一认证流程
   - 点击登录按钮后，直接调用本地登录逻辑，不再连接清华服务器
   - 使用伪造的 fingerPrint 来模拟登录成功状态

3. **保持登录状态**：
   - 登录成功后，Redux 会保存认证信息（用户名、密码、fingerPrint）
   - 由于使用了 redux-persist，应用重启后会自动恢复登录状态

---

## ✅ 任务二：替换数据源

### 新增的文件：
- `src/data/api.ts` - 新的 SYSU 后端 API 服务

### 修改的文件：
- `src/data/actions/notices.ts`
- `src/data/actions/assignments.ts`

### 主要改动：
1. **创建新的 API 服务**：
   - 目标地址：`http://43.136.42.69:8000/api/list`
   - 使用 GET 请求获取数据
   - 定义了后端返回的数据结构类型 `SysuNoticeRaw` 和 `SysuApiResponse`

2. **注释掉原有爬虫逻辑**：
   - 在 `getAllNoticesForCourses()` 中，注释掉了调用 `dataSource.getAllContents()` 的代码
   - 在 `getAllAssignmentsForCourses()` 中，同样注释掉了爬虫相关代码
   - 原有的清华服务器请求逻辑被完全绕过

---

## ✅ 任务三：数据适配器

### 新增的文件：
- `src/data/adapter.ts` - 数据适配器

### 主要功能：
1. **适配器函数**：
   - `adaptSysuDataToNotice()` - 将后端数据转换为 `Notice` 类型
   - `adaptSysuDataToAssignment()` - 将后端数据转换为 `Assignment` 类型
   - `adaptSysuDataListToNotices()` - 批量转换并排序通知数据
   - `adaptSysuDataListToAssignments()` - 批量转换并排序作业数据

2. **字段映射**：
   - `unique_hash` → `id`
   - `deadline` → `publishTime` (通知) / `deadline` (作业)
   - `content` → `content` (通知) / `description` (作业)
   - `publisher` → `publisher` / `courseTeacherName`

3. **默认值处理**：
   - 课程信息统一设置为默认值（`default-course`, `中山大学`）
   - 作业相关字段（提交状态、评分等）设置为未提交/未评分的默认状态

---

## 🔄 数据流

```
用户登录
  ↓
Login.tsx (硬编码账户: student2025/password123)
  ↓
auth.ts (绕过 CAS，直接设置登录成功)
  ↓
Redux State (loggedIn: true)
  ↓
App 主页加载数据
  ↓
notices.ts/assignments.ts 调用 fetchSysuData()
  ↓
api.ts 请求 http://43.136.42.69:8000/api/list
  ↓
adapter.ts 将后端数据转换为 App 格式
  ↓
Redux Store 更新
  ↓
UI 组件渲染数据
```

---

## 📝 后端数据结构

### SYSU 后端返回格式：
```json
{
  "data": [
    {
      "type": "notice",
      "title": "校庆通知",
      "content": "<p>这里是HTML格式的详细内容...</p>",
      "publisher": "教务处",
      "deadline": "2025-11-12T10:00:00",
      "markedImportant": true,
      "unique_hash": "abc12345",
      "hasRead": false,
      "url": "http://..."
    }
  ]
}
```

### App 内部 Notice 格式：
```typescript
{
  id: "abc12345",
  title: "校庆通知",
  content: "<p>这里是HTML格式的详细内容...</p>",
  publisher: "教务处",
  publishTime: "2025-11-12T10:00:00",
  markedImportant: true,
  hasRead: false,
  url: "http://...",
  courseId: "default-course",
  courseName: "中山大学",
  courseTeacherName: "教务处"
}
```

---

## ⚠️ 注意事项

1. **API 地址**：目前硬编码为 `http://43.136.42.69:8000`，如需修改请编辑 `src/data/api.ts`

2. **类型限制**：后端目前只返回 `type: "notice"` 的数据，如果未来需要区分通知和作业，需要：
   - 后端添加不同的 type 字段（如 "assignment"）
   - 适配器中根据 type 进行不同的转换逻辑

3. **课程信息缺失**：由于后端没有返回课程相关信息，适配器中使用了默认值。如果需要真实的课程数据，需要：
   - 后端添加 `courseId`, `courseName` 等字段
   - 修改适配器逻辑使用真实数据

4. **作业功能**：当前作业相关的高级功能（提交、评分等）被设置为默认值，如需支持需要后端提供相应数据

5. **离线模式保留**：原有的"离线模式"功能被保留，用户可以在无网络时继续使用已缓存的数据

---

## 🧪 测试建议

1. 启动应用，验证默认账户是否自动填充
2. 点击登录，检查是否成功跳过认证进入主页
3. 检查通知和作业列表是否正常显示数据（需要后端 API 正常运行）
4. 重启应用，验证是否保持登录状态
5. 检查数据格式是否正确渲染在 UI 组件中

---

## 🚀 后续优化建议

1. **环境变量配置**：将 API 地址移到配置文件或环境变量中
2. **错误处理**：增强 API 请求的错误处理和用户提示
3. **Loading 状态**：优化数据加载时的 UI 反馈
4. **数据缓存**：考虑添加本地缓存机制，减少网络请求
5. **类型完善**：根据实际后端数据结构完善 TypeScript 类型定义

---

重构完成！🎉
