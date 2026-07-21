import { Table, Button, Input, Select, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  useGetStudentsByClassQuery,
  useGetClassQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from '../../api';
import { QueryWrapper } from '../../components/QueryWrapper';
import { StudentFormModal } from '../../components/StudentForm/StudentFormModal';
import { useDebounce } from '../../hooks/useDebounce';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../../types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'הכל' },
  { value: 'ACTIVE', label: 'פעיל' },
  { value: 'INACTIVE', label: 'לא פעיל' },
];

export function StudentsPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const id = Number(classId);

  const { data: cls } = useGetClassQuery(id);
  const { data: students, isLoading, isError } = useGetStudentsByClassQuery(id);
  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const debouncedName = useDebounce(nameSearch);
  const debouncedId = useDebounce(idSearch);

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchName = !debouncedName || fullName.includes(debouncedName.toLowerCase());
      const matchId = !debouncedId || s.identityNumber.includes(debouncedId);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchName && matchId && matchStatus;
    });
  }, [students, debouncedName, debouncedId, statusFilter]);

  const openAdd = () => { setEditingStudent(undefined); setModalOpen(true); };
  const openEdit = (student: Student) => { setEditingStudent(student); setModalOpen(true); };

  const handleSubmit = async (values: CreateStudentDto | UpdateStudentDto) => {
    if (editingStudent) {
      await updateStudent({ id: editingStudent.id, body: values as UpdateStudentDto, classId: id }).unwrap();
      message.success('התלמיד עודכן בהצלחה');
    } else {
      await createStudent(values as CreateStudentDto).unwrap();
      message.success('התלמיד נוסף בהצלחה');
    }
    setModalOpen(false);
  };

  const columns = [
    { title: 'תעודת זהות', dataIndex: 'identityNumber', key: 'identityNumber' },
    { title: 'שם פרטי', dataIndex: 'firstName', key: 'firstName' },
    { title: 'שם משפחה', dataIndex: 'lastName', key: 'lastName' },
    { title: 'טלפון הורה', dataIndex: 'parentPhone', key: 'parentPhone' },
    {
      title: 'סטטוס',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'פעיל' : 'לא פעיל'}
        </Tag>
      ),
    },
    {
      title: 'פעולות',
      key: 'actions',
      render: (_: unknown, record: Student) => (
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/classes')} />
          <h2 style={{ margin: 0 }}>{cls?.name ?? 'תלמידים'}</h2>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>הוסף תלמיד</Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="חיפוש לפי שם"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Input.Search
          placeholder="חיפוש לפי ת.ז."
          value={idSearch}
          onChange={(e) => setIdSearch(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_FILTER_OPTIONS}
          style={{ width: 140 }}
        />
      </Space>

      <QueryWrapper isLoading={isLoading} isError={isError}>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </QueryWrapper>

      <StudentFormModal
        open={modalOpen}
        classId={id}
        student={editingStudent}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        loading={creating || updating}
      />
    </div>
  );
}
