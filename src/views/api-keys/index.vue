<template>
  <div class="api-keys-page">
    <section class="api-keys-content">
      <h1>API keys</h1>

      <div class="api-keys-desc">
        <p>列表内是你的全部 API key，API key 仅在创建时可见可复制，请妥善保存。不要与他人共享你的 API key，或将其暴露在浏览器或其他客户端代码中。</p>
        <p>为了保护你的账户安全，我们可能会自动禁用发现已公开泄露的 API key。</p>
      </div>

      <div v-loading="listLoading" class="keys-table-wrap">
        <table class="keys-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>Key</th>
              <th>创建日期</th>
              <th>最新使用日期</th>
              <th class="actions-col" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in apiKeys" :key="item.id">
              <td>{{ item.name }}</td>
              <td class="key-text">{{ item.displayKey }}</td>
              <td>{{ item.createdAt }}</td>
              <td>{{ item.lastUsedAt || '-' }}</td>
              <td class="actions-cell">
                <button type="button" class="icon-button" aria-label="编辑 API key" @click="handleEdit(item)">
                  <i class="el-icon-edit" />
                </button>
                <button type="button" class="icon-button" aria-label="删除 API key" :disabled="deleteLoadingId === item.id" @click="handleDelete(item)">
                  <i class="el-icon-delete" />
                </button>
              </td>
            </tr>
            <tr v-if="!listLoading && apiKeys.length === 0">
              <td class="empty-cell" colspan="5">暂无 API key</td>
            </tr>
          </tbody>
        </table>
      </div>

      <el-button class="create-button" type="primary" @click="handleCreate">
        创建 API key
      </el-button>
    </section>

    <el-dialog
      title="创建 API key"
      :visible.sync="createDialogVisible"
      width="420px"
      custom-class="api-key-dialog"
      @closed="resetCreateForm"
    >
      <el-form class="api-key-form" label-position="top">
        <el-form-item label="名称">
          <el-input v-model.trim="createForm.name" maxlength="40" placeholder="输入 API key 的名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="dialog-cancel-button" @click="createDialogVisible = false">取消</el-button>
        <el-button class="dialog-primary-button" type="primary" :loading="createLoading" @click="submitCreate">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="保存 API key" :visible.sync="createdKeyDialogVisible" width="520px" custom-class="api-key-dialog">
      <p class="dialog-tip">API key 只会完整显示一次，请现在复制保存。</p>
      <div class="created-key-value">{{ createdKey }}</div>
      <span slot="footer">
        <el-button class="dialog-cancel-button" @click="copyCreatedKey">复制</el-button>
        <el-button class="dialog-primary-button" type="primary" @click="createdKeyDialogVisible = false">已保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改 API key 名称"
      :visible.sync="editDialogVisible"
      width="420px"
      custom-class="api-key-dialog"
      @closed="resetEditForm"
    >
      <el-form class="api-key-form" label-position="top">
        <el-form-item label="名称">
          <el-input v-model.trim="editForm.name" maxlength="40" placeholder="输入 API key 的名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="dialog-cancel-button" @click="editDialogVisible = false">取消</el-button>
        <el-button class="dialog-primary-button" type="primary" :loading="editLoading" @click="submitEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  batchDeleteUserAiApiKeys,
  createUserAiApiKey,
  getUserAiApiKeys,
  updateUserAiApiKey
} from '@/api/api-keys'

const MAX_API_KEY_COUNT = 3
const API_KEY_LIST_LIMIT = 10

export default {
  name: 'ApiKeys',
  data() {
    return {
      apiKeys: [],
      listLoading: false,
      createDialogVisible: false,
      createLoading: false,
      createForm: {
        name: ''
      },
      createdKeyDialogVisible: false,
      createdKey: '',
      editDialogVisible: false,
      editLoading: false,
      editForm: {
        id: '',
        name: ''
      },
      deleteLoadingId: '',
      maxApiKeyCount: MAX_API_KEY_COUNT
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.user.id
    }
  },
  created() {
    this.fetchApiKeys()
  },
  methods: {
    async fetchApiKeys() {
      this.listLoading = true
      try {
        if (!this.currentUserId) {
          this.$message.error('缺少用户 ID，无法加载 API key')
          return
        }

        const response = await getUserAiApiKeys({
          user_id: this.currentUserId,
          limit: API_KEY_LIST_LIMIT
        })
        const data = response.data || response
        const items = Array.isArray(data) ? data : (data.items || data.list || [])
        this.apiKeys = items.map(this.normalizeApiKey)
      } catch (error) {
        this.handleRequestError(error)
      } finally {
        this.listLoading = false
      }
    },
    normalizeApiKey(item) {
      const apiKey = item.key || item.api_key || item.apiKey || ''
      const apiKeyPrefix = item.api_key_prefix || item.apiKeyPrefix || ''
      const apiKeyLast4 = item.api_key_last4 || item.apiKeyLast4 || ''
      const createdAt = item.created_at || item.createdAt || ''
      const lastUsedAt = item.last_used_at || item.lastUsedAt || ''

      return {
        id: item.id,
        name: item.name || '',
        key: apiKey,
        displayKey: item.masked_key || item.maskedKey || this.maskApiKey(apiKey, apiKeyPrefix, apiKeyLast4),
        createdAt: this.formatDate(createdAt),
        lastUsedAt: this.formatDate(lastUsedAt)
      }
    },
    maskApiKey(key, prefix, last4) {
      if (prefix && last4) {
        return `${prefix}************************${last4}`
      }

      if (!key || key.includes('*')) {
        return key || ''
      }

      if (key.length <= 16) {
        return key
      }

      return `${key.slice(0, 8)}************************${key.slice(-4)}`
    },
    formatDate(value) {
      if (!value) {
        return ''
      }

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return value
      }

      return date.toISOString().slice(0, 10)
    },
    handleCreate() {
      if (this.apiKeys.length >= this.maxApiKeyCount) {
        this.$message.warning(`最多只能创建 ${this.maxApiKeyCount} 个 API key`)
        return
      }

      this.createDialogVisible = true
    },
    async submitCreate() {
      const name = this.createForm.name.trim()
      if (!name) {
        this.$message.warning('请输入 API key 名称')
        return
      }

      if (this.apiKeys.length >= this.maxApiKeyCount) {
        this.$message.warning(`最多只能创建 ${this.maxApiKeyCount} 个 API key`)
        return
      }

      if (!this.currentUserId) {
        this.$message.error('缺少用户 ID，无法创建 API key')
        return
      }

      this.createLoading = true
      try {
        const response = await createUserAiApiKey({
          user_id: this.currentUserId,
          name
        })
        const data = response.data || response
        const createdKey = data.key || data.api_key || data.apiKey || ''
        this.createDialogVisible = false
        this.$message.success('API key 创建成功')
        this.fetchApiKeys()

        if (createdKey) {
          this.createdKey = createdKey
          this.createdKeyDialogVisible = true
        }
      } catch (error) {
        this.handleRequestError(error)
      } finally {
        this.createLoading = false
      }
    },
    resetCreateForm() {
      this.createForm.name = ''
    },
    handleEdit(item) {
      this.editForm = {
        id: item.id,
        name: item.name
      }
      this.editDialogVisible = true
    },
    async submitEdit() {
      const name = this.editForm.name.trim()
      if (!name) {
        this.$message.warning('请输入 API key 名称')
        return
      }

      if (!this.editForm.id) {
        this.$message.error('缺少 API key ID，无法修改名称')
        return
      }

      if (!this.currentUserId) {
        this.$message.error('缺少用户 ID，无法修改名称')
        return
      }

      this.editLoading = true
      try {
        await updateUserAiApiKey(this.editForm.id, {
          user_id: this.currentUserId,
          name
        })
        this.editDialogVisible = false
        this.$message.success('API key 名称已更新')
        await this.fetchApiKeys()
      } catch (error) {
        this.handleRequestError(error)
      } finally {
        this.editLoading = false
      }
    },
    resetEditForm() {
      this.editForm = {
        id: '',
        name: ''
      }
    },
    handleDelete(item) {
      if (!item.id) {
        this.$message.error('缺少 API key ID，无法删除')
        return
      }

      if (!this.currentUserId) {
        this.$message.error('缺少用户 ID，无法删除')
        return
      }

      this.$confirm('确认删除该 API key？删除后无法恢复。', '删除 API key', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.deleteLoadingId = item.id
        try {
          await batchDeleteUserAiApiKeys({
            user_id: this.currentUserId,
            ids: [item.id]
          })
          this.$message.success('API key 已删除')
          await this.fetchApiKeys()
        } catch (error) {
          this.handleRequestError(error)
        } finally {
          this.deleteLoadingId = ''
        }
      }).catch(() => {})
    },
    handleRequestError(error) {
      if (error && error.code === 'ECONNABORTED') {
        this.$message.error('请求超时，请稍后重试')
      }
    },
    copyCreatedKey() {
      if (!this.createdKey) {
        return
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(this.createdKey).then(() => {
          this.$message.success('已复制')
        })
        return
      }

      const textarea = document.createElement('textarea')
      textarea.value = this.createdKey
      textarea.setAttribute('readonly', 'readonly')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('已复制')
    }
  }
}
</script>

<style lang="scss" scoped>
.api-keys-page {
  min-height: 100%;
  padding: 34px 40px;
  background: #fff;
}

.api-keys-content {
  width: min(100%, 1040px);
  margin: 0 auto;

  h1 {
    margin: 0 0 30px;
    color: #0f1117;
    font-size: 26px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: 0;
  }
}

.api-keys-desc {
  margin-bottom: 24px;
  color: #242832;
  font-size: 15px;
  line-height: 1.8;
  font-weight: 600;

  p {
    margin: 0;
  }
}

.keys-table-wrap {
  margin-bottom: 24px;
  padding: 0 14px;
  overflow-x: auto;
  border-radius: 8px;
  background: #f8f9fb;
}

.keys-table {
  width: 100%;
  min-width: 840px;
  border-collapse: collapse;
  color: #111318;
  table-layout: fixed;

  th,
  td {
    padding: 14px 0;
    text-align: left;
    vertical-align: middle;
  }

  th {
    border-bottom: 1px solid #e1e4e8;
    color: #69707a;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
  }

  td {
    color: #111318;
    font-size: 15px;
    line-height: 1.35;
    font-weight: 600;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 16%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 45%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 16%;
  }

  .actions-col,
  .actions-cell {
    width: 8%;
  }
}

.empty-cell {
  color: #69707a !important;
  text-align: center !important;
}

.key-text {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  word-break: break-all;
}

.actions-cell {
  white-space: nowrap;
  text-align: right;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 4px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  color: #111318;
  background: transparent;
  font-size: 18px;
  cursor: pointer;

  &:disabled {
    color: #a8b0bd;
    cursor: not-allowed;
  }

  &:hover,
  &:focus {
    background: #eceff3;
  }
}

.create-button {
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: #101218;
  color: #fff;
  font-size: 14px;
  font-weight: 700;

  &:hover,
  &:focus {
    background: #20232b;
  }
}

@media (max-width: 900px) {
  .api-keys-page {
    padding: 28px 20px;
  }

  .api-keys-content {
    h1 {
      margin-bottom: 24px;
      font-size: 24px;
    }
  }

  .api-keys-desc {
    font-size: 14px;
    line-height: 1.7;
  }
}

.dialog-tip {
  margin: 0 0 12px;
  color: #69707a;
  font-size: 14px;
  line-height: 1.6;
}

.created-key-value {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fb;
  color: #111318;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-all;
}

::v-deep .api-key-dialog {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(15, 17, 23, .18);

  .el-dialog__header {
    padding: 24px 24px 12px;
  }

  .el-dialog__title {
    color: #0f1117;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 700;
  }

  .el-dialog__headerbtn {
    top: 24px;
    right: 22px;
    font-size: 18px;

    .el-dialog__close {
      color: #111318;
      font-weight: 700;
    }
  }

  .el-dialog__body {
    padding: 0 24px 8px;
  }

  .el-dialog__footer {
    padding: 12px 24px 24px;
  }

  .dialog-footer,
  .el-dialog__footer {
    text-align: right;
  }

  .el-button {
    min-width: 74px;
    height: 36px;
    padding: 0 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  .dialog-cancel-button {
    border-color: #e1e4e8;
    color: #111318;
    background: #fff;

    &:hover,
    &:focus {
      border-color: #cfd5dd;
      color: #111318;
      background: #f8f9fb;
    }
  }

  .dialog-primary-button {
    border-color: #101218;
    background: #101218;
    color: #fff;

    &:hover,
    &:focus {
      border-color: #20232b;
      background: #20232b;
      color: #fff;
    }

    &.is-disabled,
    &.is-disabled:hover,
    &.is-disabled:focus {
      border-color: #a8adb5;
      background: #a8adb5;
      color: #fff;
    }
  }
}

::v-deep .api-key-form {
  .el-form-item {
    margin-bottom: 12px;
  }

  .el-form-item__label {
    padding: 0 0 8px;
    color: #242832;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 600;
  }

  .el-input__inner {
    height: 40px;
    border: 1px solid #111318;
    border-radius: 8px;
    color: #111318;
    font-size: 14px;
    font-weight: 600;

    &::placeholder {
      color: #a8b0bd;
      font-weight: 600;
    }

    &:hover,
    &:focus {
      border-color: #101218;
    }
  }
}
</style>
