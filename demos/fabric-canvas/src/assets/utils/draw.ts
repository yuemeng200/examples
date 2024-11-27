interface FillColor {
  r: number
  g: number
  b: number
  a: number
}
// 颜色匹配函数（考虑容差）
function colorMatch(color1: Uint8ClampedArray, color2: Uint8ClampedArray, tolerance = 1): boolean {
  return Math.abs(color1[0] - color2[0]) <= tolerance
    && Math.abs(color1[1] - color2[1]) <= tolerance
    && Math.abs(color1[2] - color2[2]) <= tolerance
    && Math.abs(color1[3] - color2[3]) <= tolerance
}

// 添加泛洪填充函数
export function floodFill(canvas: HTMLCanvasElement, e: MouseEvent, fillColor: FillColor): ImageData | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const rect = canvas.getBoundingClientRect()
  const startX = Math.round(e.clientX - rect.left)
  const startY = Math.round(e.clientY - rect.top)
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // 获取起始点颜色
  const startIndex = (startY * canvas.width + startX) * 4
  const targetColor = new Uint8ClampedArray([
    data[startIndex],
    data[startIndex + 1],
    data[startIndex + 2],
    data[startIndex + 3]
  ])
  
  // 使用栈来存储待处理的像素点
  const stack = [[startX, startY]]
  const visited = new Set([`${startX},${startY}`])
  
  // 四个方向：上右下左
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!
    const index = (y * canvas.width + x) * 4

    // 填充当前像素
    data[index] = fillColor.r
    data[index + 1] = fillColor.g
    data[index + 2] = fillColor.b
    data[index + 3] = fillColor.a
    
    // 检查四个方向
    for (const [dx, dy] of directions) {
      const newX = x + dx
      const newY = y + dy
      const key = `${newX},${newY}`
      
      if (newX < 0 || newX >= canvas.width || 
          newY < 0 || newY >= canvas.height || 
          visited.has(key)) {
        continue
      }
      
      const newIndex = (newY * canvas.width + newX) * 4
      const currentColor = new Uint8ClampedArray([
        data[newIndex],
        data[newIndex + 1],
        data[newIndex + 2],
        data[newIndex + 3]
      ])
      
      if (colorMatch(currentColor, targetColor)) {
        stack.push([newX, newY])
        visited.add(key)
      }
    }
  }

  return imageData
} 