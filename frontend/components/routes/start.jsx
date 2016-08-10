import React from 'react'

const Content = (props) => {
  return <Content>{props.children}</Content>
}

Content.propTypes = {
  children: React.PropTypes.children,
}

export default Content
