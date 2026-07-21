import { Form, Input, Modal } from 'antd';
import type { Class, CreateClassDto, UpdateClassDto } from '../../types';

interface Props {
  open: boolean;
  cls?: Class;
  onSubmit: (values: CreateClassDto | UpdateClassDto) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function ClassFormModal({ open, cls, onSubmit, onCancel, loading }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!cls;

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'עריכת כיתה' : 'הוספת כיתה'}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onCancel(); }}
      confirmLoading={loading}
      okText={isEdit ? 'שמור' : 'הוסף'}
      cancelText="ביטול"
    >
      <Form form={form} layout="vertical" initialValues={cls} dir="rtl">
        <Form.Item name="name" label="שם הכיתה" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="grade" label="שכבה" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="homeroomTeacher" label="מחנכת" rules={[{ required: true, message: 'שדה חובה' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
