function PhotoItem(props) {
  const { photo } = props

  const handleClick = (e) => {
    props.onView(e, photo)
  }

  return (
    <dl className="photo-item" onClick={(e) => handleClick(e)}>
      <dt>
        <img src={photo.thumb}></img>
      </dt>
    </dl>
  )
}

export default PhotoItem
