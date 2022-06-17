import { useState } from 'react'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Modal, Upload, message } from 'antd'

const { Dragger } = Upload;
const regExt = /\S+(\.\w+)$/
const regQQ = /^(\d{4}_\d{4}-\d{2}-\d{2})_\S+(\.\w+)$/

function UploadItem(props) {
  const [visible, setVisible] = useState(false)

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/sso/upload',
    onChange(info) {
      const { status } = info.file

      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功，识别耗时较长，请耐心等待结果，稍后刷新页面试试!`)
      } else if (status === 'error') {
        const { error } = info.file

        if (error.status === 413) {
          message.error(`${info.file.name} 因文件太大上传失败.`); 
        } else {
          message.error(`${info.file.name} 上传失败.`)
        }
      }
    },
    beforeUpload(file) {
      try {
        const match = file.name.match(regQQ)

        if (!match) {
          const match = file.name.match(regExt)
          Object.defineProperty(file, 'name', {
            writable: true
          })
          file.name = `${file.lastModified}${match[1]}`
        }

        return Promise.resolve(file)
      } catch (err) {
        console.error(err)
      }
    }
  };

  return (
    <div>
      <div className="album-upload" onClick={() => setVisible(true)}>
        <UploadOutlined style={{ fontSize: '48px' }} />
        <div>上传文件</div>
      </div>
      <Modal
        visible={visible}
        title="上传文件"
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到该区域并上传</p>
          <p className="ant-upload-hint">
            支持单文件和多文件。
          </p>
        </Dragger>
      </Modal>
    </div>
  )
}

export default UploadItem
