const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })
}

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
 function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export async function getCroppedImg(imageSrc, crop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(1, 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    crop.x,
    crop.y,
    crop.width,
    crop.height
  )

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = crop.width
  canvas.height = crop.height

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0)

  // As Base64 string
  return canvas.toDataURL('image/jpeg');

  // As a blob
  // return new Promise((resolve, reject) => {
  //   canvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/jpeg')
  // })
}
