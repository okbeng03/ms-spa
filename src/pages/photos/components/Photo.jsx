import { Checkbox } from 'antd';

function PhotoItem(props) {
  const { photo } = props

  const handleClick = (e) => {
    props.onView(e, photo)
  }

  return (
    <dl onClick={(e) => handleClick(e)}>
      <dt>
        <Checkbox value={photo.name} onClick={(e) => {e.stopPropagation()}}></Checkbox>
        <img src={photo.thumb}></img>
      </dt>
    </dl>
  )
}

export default PhotoItem
