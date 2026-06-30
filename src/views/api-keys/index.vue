<template>
  <div class="api-keys-page">
    <section class="api-keys-content">
      <h1>API keys</h1>

      <div class="api-keys-desc">
        <p>列表内是你的全部 API key，API key 仅在创建时可见可复制，请妥善保存。不要与他人共享你的 API key，或将其暴露在浏览器或其他客户端代码中。</p>
        <p>为了保护你的账户安全，我们可能会自动禁用发现已公开泄露的 API key。</p>
      </div>

      <div class="keys-table-wrap">
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
              <td class="key-text">{{ item.key }}</td>
              <td>{{ item.createdAt }}</td>
              <td>{{ item.lastUsedAt || '-' }}</td>
              <td class="actions-cell">
                <button type="button" class="icon-button" aria-label="编辑 API key" @click="handleEdit(item)">
                  <i class="el-icon-edit" />
                </button>
                <button type="button" class="icon-button" aria-label="删除 API key" @click="handleDelete(item)">
                  <i class="el-icon-delete" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <el-button class="create-button" type="primary" @click="handleCreate">
        创建 API key
      </el-button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ApiKeys',
  data() {
    return {
      apiKeys: [
        {
          id: 1,
          name: 'backlash',
          key: 'sk-7407a************************c168',
          createdAt: '2026-05-12',
          lastUsedAt: '2026-06-15'
        },
        {
          id: 2,
          name: 'on mac',
          key: 'sk-5003e************************6bed',
          createdAt: '2026-06-14',
          lastUsedAt: ''
        }
      ]
    }
  },
  methods: {
    handleCreate() {
      this.$message.info('API key 创建接口待接入')
    },
    handleEdit() {
      this.$message.info('API key 编辑接口待接入')
    },
    handleDelete() {
      this.$message.info('API key 删除接口待接入')
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
</style>
