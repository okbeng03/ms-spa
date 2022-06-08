import { useState } from 'react'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Modal, Upload, message } from 'antd'

const { Dragger } = Upload;

function UploadItem(props) {
  const [visible, setVisible] = useState(false)

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/sso/upload',
    onChange(info) {
      const { status } = info.file;

      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功.`);
      } else if (status === 'error') {
        const { error } = info.file

        if (error.status === 413) {
          message.error(`${info.file.name} 因文件太大上传失败.`);  
        } else {
          message.error(`${info.file.name} 上传失败.`);
        }
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
