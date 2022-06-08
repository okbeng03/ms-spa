function PhotoItem(props) {
  const { photo } = props

  return (
    <dl className="photo-item">
      <dt>
        <img src={photo.thumb}></img>
      </dt>
    </dl>
  )
}

export default PhotoItem
