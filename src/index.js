// Original:(https://codesandbox.io/embed/r5qmj8m6lq)
import { render } from 'react-dom'
import React from 'react'
import DraggableList from './DraggableList'

render(
  <DraggableList
    items={'So99yNoodles'.split('')}
    mediaQueries={[1880, 1460, 840, 420]}
    columns={[4, 3, 2, 1]}
    defaultColumn={1}
    width={420}
    height={120}
    draggable
  />,
  document.getElementById('root')
)
