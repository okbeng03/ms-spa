import { useState } from 'react';
import { Modal } from 'antd';
import ReactCrop from 'react-image-crop';
import { getCroppedImg } from './cropper';
import { addCollection } from '../../../api';
import 'react-image-crop/dist/ReactCrop.css';

function CropperModal(props) {
  const { visible, photo, onCancel } = props
  const [ crop, setCrop ] = useState()

  const handleOk = async () => {
    const img = await getCroppedImg(photo.source, crop)
    await addCollection(img, 'bin')
  }

  return (
    <Modal
      title="Add Collection"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width="86%"
    >
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img src={photo?.source} />
      </ReactCrop>
    </Modal>
  )
}

export default CropperModal
