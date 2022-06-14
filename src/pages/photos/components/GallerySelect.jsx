import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Divider, Input, Select, Space, Typography, message } from 'antd';
import { fetchAlbums } from '../../../api';

function CropperModal(props) {
  const { visible, onCancel, onOk } = props
  const [ bucket, setBucket ] = useState()
  const [ buckets, setBuckets ] = useState([])
  const [ name, setName ] = useState('')

  useEffect(() => {
    async function fetch() {
      const list = await fetchAlbums()
      setBuckets(list.map(item => {
        return {
          label: item.tags?.name || item.name,
          value: item.name
        }
      }))
    }

    fetch()
  }, [])

  const handleOk = async () => {
    if (!bucket) {
      message.error('请选择相册！')
      return
    }

    onOk(bucket)
  }

  const handleCancel = async () => {
    setBucket('')
    onCancel()
  }

  const onChange = (event) => {
    setName(event.target.value)
  }

  const addItem = (e) => {
    e.preventDefault()
    setBuckets([...buckets, {label: name, value: name}])
    setName('')
  }

  const handleSelect = (value) => {
    setBucket(value)
  }

  return (
    <Modal
      title="选择相册"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <Select
          style={{ width: 300 }}
          options={buckets}
          placeholder="select bucket"
          onChange={handleSelect}
          dropdownRender={menu => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space align="center" style={{ padding: '0 8px 4px' }}>
                <Input placeholder="Please enter bucket name" value={name} onChange={onChange} />
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
