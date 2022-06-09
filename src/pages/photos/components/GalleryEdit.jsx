import { useState } from 'react';
import { Form, Input, DatePicker, Modal, Button, message } from 'antd';
import { updateGallery } from '../../../api';
import moment from 'moment';

function GalleryEdit(props) {
  const { visible, bucketName, tags } = props
  const [form] = Form.useForm()

  useState(() => {
    if (tags.birthday) {
      tags.birthday = moment(tags.birthday)
    }
    
    form.setFieldsValue(tags || {})
  }, [tags])

  const onFinish = async (values) => {
    try {
      if (values.birthday) {
        values.birthday = values.birthday.format('YYYY-MM-DD')
      }

      await updateGallery({
        bucketName,
        values
      })

      message.success('编辑相册成功，即将刷新页面!', function() {
        window.location.href = '/'
      })
    } catch (err) {
      message.error('gallery update error::' + err.message)
    }
  }

  return (
    <Modal
      title="编辑相册"
      visible={visible}
      footer={null}
    >
      <Form
        layout="vertical"
        name="gallery-edit"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入相册名称" allowClear></Input>
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input placeholder="请输入相册描述" allowClear></Input>
        </Form.Item>
        <Form.Item name="birthday" label="出生日期">
          <DatePicker></DatePicker>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default GalleryEdit
