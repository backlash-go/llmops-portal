<template>
  <div class="profile-page">
    <section class="profile-content">
      <h1>个人信息</h1>

      <div class="profile-summary">
        <div class="avatar-box">
          <img v-if="user.avatar" :src="user.avatar" alt="用户头像">
          <span v-else>{{ avatarText }}</span>
        </div>
        <div class="summary-text">
          <h2>{{ displayName }}</h2>
          <p>{{ user.email || user.username || '-' }}</p>
        </div>
        <span class="status-badge" :class="{ active: isActive }">{{ statusText }}</span>
      </div>

      <div class="info-panel">
        <div v-for="item in profileItems" :key="item.label" class="info-row">
          <span class="info-label">{{ item.label }}</span>
          <span class="info-value">{{ item.value || '-' }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    user() {
      return this.$store.state.user
    },
    displayName() {
      return this.user.displayName || this.user.name || this.user.username || '未命名用户'
    },
    avatarText() {
      const source = this.displayName || this.user.email || this.user.username || 'U'
      return source.slice(0, 1).toUpperCase()
    },
    isActive() {
      return this.user.status === 1 || this.user.status === 'active'
    },
    statusText() {
      if (this.user.status === undefined || this.user.status === null || this.user.status === '') {
        return '未知状态'
      }

      return this.isActive ? '正常' : `状态 ${this.user.status}`
    },
    profileItems() {
      return [
        { label: '用户 ID', value: this.user.id },
        { label: '用户名', value: this.user.username },
        { label: '显示名称', value: this.user.displayName },
        { label: '邮箱', value: this.user.email },
        { label: '名字', value: this.user.firstName },
        { label: '姓氏', value: this.user.lastName },
        { label: '账户状态', value: this.statusText }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100%;
  padding: 34px 40px;
  background: #fff;
}

.profile-content {
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

.profile-summary {
  display: flex;
  align-items: center;
  min-height: 132px;
  margin-bottom: 24px;
  padding: 24px;
  border-radius: 8px;
  background: #f8f9fb;
}

.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-right: 18px;
  overflow: hidden;
  border-radius: 8px;
  background: #101218;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  font-weight: 800;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.summary-text {
  flex: 1;
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    color: #111318;
    font-size: 22px;
    line-height: 1.3;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #69707a;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 600;
    word-break: break-all;
  }
}

.status-badge {
  flex: none;
  min-width: 72px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #eceff3;
  color: #69707a;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 700;
  text-align: center;

  &.active {
    background: #e9f7ef;
    color: #1f7a43;
  }
}

.info-panel {
  padding: 0 14px;
  border-radius: 8px;
  background: #f8f9fb;
}

.info-row {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  min-height: 56px;
  border-bottom: 1px solid #e1e4e8;
  color: #111318;

  &:last-child {
    border-bottom: 0;
  }
}

.info-label,
.info-value {
  display: flex;
  align-items: center;
  padding: 14px 0;
  line-height: 1.5;
}

.info-label {
  color: #69707a;
  font-size: 14px;
  font-weight: 700;
}

.info-value {
  color: #111318;
  font-size: 15px;
  font-weight: 600;
  word-break: break-all;
}

@media (max-width: 760px) {
  .profile-page {
    padding: 28px 20px;
  }

  .profile-content h1 {
    margin-bottom: 24px;
    font-size: 24px;
  }

  .profile-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .avatar-box {
    margin: 0 0 16px;
  }

  .status-badge {
    margin-top: 16px;
  }

  .info-row {
    grid-template-columns: 1fr;
    padding: 12px 0;
  }

  .info-label,
  .info-value {
    padding: 2px 0;
  }
}
</style>
