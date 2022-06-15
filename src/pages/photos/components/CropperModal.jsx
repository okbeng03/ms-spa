import { useState, useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Divider, Input, Select, Space, Typography, message } from 'antd';
import ReactCrop from 'react-image-crop';
import { getCroppedImg } from './cropper';
import { addCollection, fetchSujects } from '../../../api';
import 'react-image-crop/dist/ReactCrop.css';

function CropperModal(props) {
  const { visible, photo, onCancel } = props
  const [ crop, setCrop ] = useState()
  const [ subjects, setSubjects ] = useState([])
  const [ name, setName ] = useState('')
  const [ subject, setSubject ] = useState()
  const image = useRef(null)

  useEffect(() => {
    async function fetch() {
      const list = await fetchSujects()
      setSubjects(list)
    }

    fetch()
  }, [])

  const handleOk = async () => {
    const img = await getCroppedImg(photo.source, {
      ...crop,
      scaleX: image.current.naturalWidth / image.current.clientWidth,
      scaleY: image.current.naturalHeight / image.current.clientHeight
    })

    try {
      await addCollection(img, subject)
      message.success('add collection success!', () => {
        handleCancel()
      })
    } catch (err) {
      message.error('add collection error::' + err.message)
    }
  }

  const handleCancel = async () => {
    setSubject('')
    onCancel()
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const addItem = (e) => {
    e.preventDefault()
    setSubjects([...subjects, {label: name, value: name}])
    setName('')
  }

  const handleSubjectSelect = (value) => {
    setSubject(value)
  }

  return (
    <Modal
      title="Add Collection"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width="86%"
    >
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img ref={image} src={photo?.source} />
      </ReactCrop>
      <div>
        <Select
          style={{ width: 300 }}
          options={subjects}
          placeholder="select subject"
          onChange={handleSubjectSelect}
          dropdownRender={menu => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space align="center" style={{ padding: '0 8px 4px' }}>
                <Input placeholder="Please enter subject name" value={name} onChange={onNameChange} />
                <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                  <PlusOutlined /> Add item
                </Typography.Link>
              </Space>
            </>
          )}
        ></Select>
      </div>
    </Modal>
  )
}

export default CropperModal
