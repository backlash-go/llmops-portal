import { logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    id: undefined,
    username: '',
    email: '',
    name: '',
    firstName: '',
    lastName: '',
    displayName: '',
    avatar: '',
    status: undefined
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, user) => {
    state.id = user.id
    state.username = user.username || ''
    state.email = user.email || ''
    state.firstName = user.first_name || ''
    state.lastName = user.last_name || ''
    state.displayName = user.display_name || ''
    state.avatar = user.avatar || ''
    state.status = user.status
    state.name = user.display_name || user.username || user.email || ''
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data || response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_USER', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
