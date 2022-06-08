function PhotoItem(props) {
  const { photo } = props

  const handleClick = () => {
    props.onView(photo)
  }

  return (
    <dl className="photo-item" onClick={() => handleClick()}>
      <dt>
        <img src={photo.thumb}></img>
      </dt>
    </dl>
  )
}

export default PhotoItem
