import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTranslationList } from './store/actions'
import { Redirect } from 'react-router-dom'
import HocStyle from '../../HocStyle'
import styles from './index.css'

class Translation extends Component {

  // componentDidMount生命周期函数只会在客户端渲染的时候才会执行，在服务端渲染的时候不会执行。
  componentDidMount() {
    if (!this.props.list.length) {        // 性能优化：服务端已获取数据则不再进行请求
      this.props.getTransList()
    }
  }

  getList() {
    const { list } = this.props
    return list.map(value => <div key={value.id}>{value.title}</div>)
  }

  render() {
    return this.props.login ? (<div className={styles.content}>
      {this.getList()}
    </div>) : <Redirect to='/' />
  }
}

const mapStateToProps = state => ({
  list: state.translation.translationList,
  login: state.header.login
})

const mapDispatchToProps = dispatch => ({
  getTransList() {
    dispatch(getTranslationList())
  }
})

// 给Translation组件添加静态方法loadData，不代表ExportTranslation会有这个静态方法(虽然connect会自动添加静态方法)
const ExportTranslation = connect(mapStateToProps, mapDispatchToProps)(HocStyle(Translation, styles))

ExportTranslation.loadData = (store) => {
  return store.dispatch(getTranslationList())    // 返回Promise
}

export default ExportTranslation 