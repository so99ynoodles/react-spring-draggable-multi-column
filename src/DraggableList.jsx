import React, { useRef, useEffect } from 'react'
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import { useGesture } from 'react-use-gesture'
import { useSprings, animated, interpolate } from 'react-spring'
import useMedia from './use-media'
import './styles.css'

// Returns fitting styles for dragged/idle items
const fn = (order, columnCount = 1, width, height, down, originalIndex, originalRow, originalCol, x, y) => index => {
  const itemIndex = order.indexOf(index)
  const row = Math.floor(itemIndex / columnCount) + 1
  const column = columnCount === 1 ? 0 : itemIndex % columnCount

  return down && index === originalIndex
    ? {
        x: originalCol * width + x,
        y: originalRow * height + y,
        scale: 1.1,
        zIndex: '1',
        shadow: 15,
        immediate: n => n === 'y' || n === 'zIndex'
      }
    : { x: column * width, y: (row - 1) * height, scale: 1, zIndex: '0', shadow: 1, immediate: false }
}

export default function DraggableList({
  items,
  mediaQueries = [1000, 600],
  columns = [5, 1],
  defaultColumn = 1,
  width = 400,
  height = 100
}) {
  const columnCount = useMedia(mediaQueries.map(width => `(min-width: ${width}px)`), columns, defaultColumn)
  const order = useRef(items.map((_, index) => index))
  const [springs, setSprings] = useSprings(items.length, fn(order.current, columnCount, width, height))
  useEffect(() => {
    setSprings(fn(order.current, columnCount, width, height))
  }, [columnCount, width, height, setSprings])

  const bind = useGesture(({ args: [originalIndex], down, delta: [x, y] }) => {
    const itemIndex = order.current.indexOf(originalIndex)
    const originalRow = Math.floor(itemIndex / columnCount)
    const originalCol = columnCount === 1 ? 0 : itemIndex % columnCount
    const curRow = clamp(Math.round((originalRow * height + y) / height), 0, items.length - 1)
    const curCol = clamp(Math.round((originalCol * width + x) / width), 0, columnCount - 1)
    const curIndex = curRow * columnCount + curCol
    const newOrder = swap(order.current, itemIndex, curIndex)
    setSprings(fn(newOrder, columnCount, width, height, down, originalIndex, originalRow, originalCol, x, y))
    if (!down) order.current = newOrder
  })

  return (
    <div className="content" style={{ height: items.length * 100 }}>
      {springs.map(({ zIndex, shadow, x, y, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            transform: interpolate([x, y, scale], (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`)
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}
