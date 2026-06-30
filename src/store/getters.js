const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  username: state => state.user.username,
  email: state => state.user.email,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  displayName: state => state.user.displayName
}
export default getters
