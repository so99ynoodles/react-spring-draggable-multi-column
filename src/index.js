// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React from 'react'
import DraggableList from './DraggableList'

render(
  <DraggableList
    items={'RELATIONS'.split('')}
    mediaQueries={[1880, 1460, 840, 420]}
    columns={[4, 3, 2, 1]}
    defaultColumn={1}
    width={420}
    height={120}
  />,
  document.getElementById('root')
)
