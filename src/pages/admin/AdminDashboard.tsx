/* eslint-disable  */
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Space,
  Input,
  Select,
  DatePicker,
  Button,
  Typography,
  Badge,
  Tooltip,
  Modal,
  Tag,
  Row,
  Col,
  Statistic,
  Avatar,
  Divider,
  notification,
  Drawer,
  Descriptions,
  Progress,
  Alert,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import {
  surveyApi,
  SurveySubmission,
  GetSurveysParams,
  SurveyStats,
} from "../../services/api";
import { BiRefresh } from "react-icons/bi";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const AdminDashboard: React.FC = () => {
  // State management
  const [surveys, setSurveys] = useState<SurveySubmission[]>([]);
  const [stats, setStats] = useState<SurveyStats>({
    totalSurveys: 0,
    submittedSurveys: 0,
    reviewedSurveys: 0,
    draftSurveys: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveySubmission | null>(
    null
  );
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SurveySubmission | null>(
    null
  );

  // Filter states
  const [filters, setFilters] = useState<GetSurveysParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    sortBy: "submissionDate",
    sortOrder: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} од ${total} записи`,
  });

  // Fetch surveys
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await surveyApi.getSurveys(filters);
      setSurveys(response.data);
      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          current: response.pagination!.currentPage,
          total: response.pagination!.totalItems,
        }));
      }
    } catch (error: any) {
      notification.error({
        message: "Грешка",
        description: "Неуспешно преземање на податоци",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await surveyApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSurveys();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchSurveys();
  }, [filters]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  // Handle date range filter
  const handleDateRangeFilter = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  // Handle table change (pagination, sorting)
  const handleTableChange: TableProps<SurveySubmission>["onChange"] = (
    paginationData,
    filtersData,
    sorter
  ) => {
    const newFilters: GetSurveysParams = {
      ...filters,
      page: paginationData?.current || 1,
      limit: paginationData?.pageSize || 10,
    };

    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      newFilters.sortBy = sorter.field as string;
      newFilters.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    setFilters(newFilters);
  };

  // Update status
  const handleStatusUpdate = async (
    id: string,
    status: "draft" | "submitted" | "reviewed",
    reviewNotes?: string
  ) => {
    try {
      await surveyApi.updateSurveyStatus(id, status, reviewNotes);
      notification.success({
        message: "Успешно ажурирано",
        description: "Статусот е успешно ажуриран",
      });
      fetchSurveys();
      fetchStats();
      setStatusModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Грешка",
        description: "Неуспешно ажурирање на статус",
      });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      submitted: {
        color: "blue",
        text: "Поднесен",
        icon: <ClockCircleOutlined />,
      },
      reviewed: {
        color: "green",
        text: "Прегледан",
        icon: <CheckCircleOutlined />,
      },
      draft: {
        color: "orange",
        text: "Нацрт",
        icon: <ExclamationCircleOutlined />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge
        color={config.color}
        text={
          <Space>
            {config.icon}
            {config.text}
          </Space>
        }
      />
    );
  };

  // Table columns definition
  const columns: ColumnsType<SurveySubmission> = [
    {
      title: "Банка",
      dataIndex: ["ndaDetails", "bankName"],
      key: "bankName",
      width: 200,
      ellipsis: true,
      render: (text: string, record: SurveySubmission) => (
        <div>
          <div className="font-semibold text-gray-800">{text}</div>
          <div className="text-sm text-gray-500">
            {record.ndaDetails.bankContactName}
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Контакт лице",
      dataIndex: ["questionnaireData", "contactPersonEmail"],
      key: "contactEmail",
      width: 180,
      ellipsis: true,
      render: (email: string, record: SurveySubmission) => (
        <div>
          <div className="text-sm font-medium">
            {record.questionnaireData.contactPersonName || "N/A"}
          </div>
          <div className="text-xs text-blue-600">{email || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Поднесен", value: "submitted" },
        { text: "Прегледан", value: "reviewed" },
        { text: "Нацрт", value: "draft" },
      ],
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: "Датум на поднесување",
      dataIndex: "submissionDate",
      key: "submissionDate",
      width: 160,
      sorter: true,
      render: (date: string) => (
        <div>
          <div className="text-sm font-medium">
            {dayjs(date).format("DD.MM.YYYY")}
          </div>
          <div className="text-xs text-gray-500">
            {dayjs(date).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Прогрес",
      key: "progress",
      width: 120,
      render: (_, record: SurveySubmission) => {
        let completed = 0;
        if (record.ndaDetails?.bankName) completed++;
        if (record.questionnaireData?.contactPersonEmail) completed++;
        if (record.questionnaireData?.q1_1) completed++;
        if (record.questionnaireData?.q1_2) completed++;

        const percentage = Math.round((completed / 4) * 100);

        return (
          <div className="text-center">
            <Progress
              type="circle"
              size={50}
              percent={percentage}
              strokeColor={percentage === 100 ? "#52c41a" : "#1890ff"}
            />
          </div>
        );
      },
    },
    {
      title: "Акции",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record: SurveySubmission) => (
        <Space>
          <Tooltip title="Преглед детали">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedSurvey(record);
                setDetailsVisible(true);
              }}
              className="text-blue-600 hover:bg-blue-50"
            />
          </Tooltip>

          <Tooltip title="Ажурирај статус">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentRecord(record);
                setStatusModalVisible(true);
              }}
              className="text-green-600 hover:bg-green-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <Avatar
              size={80}
              icon={<BarChartOutlined />}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 mb-4"
            />
            <Title
              level={1}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            >
              Админ панел
            </Title>
            <Text className="text-xl text-gray-600">
              Управување со пополнети прашалници
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Statistic
                  title={
                    <span className="text-blue-100">Вкупно прашалници</span>
                  }
                  value={stats.totalSurveys}
                  prefix={<TeamOutlined className="text-white" />}
                  valueStyle={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <Statistic
                  title={<span className="text-orange-100">Поднесени</span>}
                  value={stats.submittedSurveys}
                  prefix={<ClockCircleOutlined className="text-white" />}
                  valueStyle={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <Statistic
                  title={<span className="text-green-100">Прегледани</span>}
                  value={stats.reviewedSurveys}
                  prefix={<CheckCircleOutlined className="text-white" />}
                  valueStyle={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Statistic
                  title={<span className="text-purple-100">Нацрти</span>}
                  value={stats.draftSurveys}
                  prefix={<ExclamationCircleOutlined className="text-white" />}
                  valueStyle={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card className="shadow-xl rounded-2xl border-0 mb-8 bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <Title level={4} className="flex items-center text-gray-700 mb-4">
              <FilterOutlined className="mr-2 text-blue-500" />
              Филтри и пребарување
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Input
                  placeholder="Пребарај по банка, контакт лице..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  allowClear
                  size="large"
                  className="rounded-lg"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Select
                  placeholder="Филтрирај по статус"
                  allowClear
                  size="large"
                  className="w-full rounded-lg"
                  onChange={handleStatusFilter}
                >
                  <Option value="submitted">Поднесени</Option>
                  <Option value="reviewed">Прегледани</Option>
                  <Option value="draft">Нацрти</Option>
                </Select>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <RangePicker
                  placeholder={["Почетен датум", "Краен датум"]}
                  size="large"
                  className="w-full rounded-lg"
                  format="DD.MM.YYYY"
                  onChange={handleDateRangeFilter}
                />
              </Col>

              <Col xs={24} sm={12} lg={4}>
                <Button
                  type="primary"
                  icon={<BiRefresh />}
                  size="large"
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
                  onClick={() => {
                    fetchSurveys();
                    fetchStats();
                  }}
                >
                  Освежи
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Main Table */}
        <Card className="shadow-xl rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
          <Table
            columns={columns}
            dataSource={surveys}
            rowKey="_id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            className="modern-table"
            size="middle"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
          />
        </Card>

        {/* Survey Details Drawer */}
        <Drawer
          title={
            <div className="flex items-center space-x-3">
              <Avatar icon={<FileTextOutlined />} className="bg-blue-500" />
              <div>
                <div className="font-semibold">Детали за прашалник</div>
                <div className="text-sm text-gray-500">
                  {selectedSurvey?.ndaDetails.bankName}
                </div>
              </div>
            </div>
          }
          placement="right"
          open={detailsVisible}
          onClose={() => setDetailsVisible(false)}
          width={720}
          className="survey-details-drawer"
        >
          {selectedSurvey && (
            <div className="space-y-6">
              {/* Status and Meta Info */}
              <Alert
                message={
                  <div className="flex items-center justify-between">
                    <span>
                      Статус:{" "}
                      <StatusBadge status={selectedSurvey.status || "draft"} />
                    </span>
                    <div className="flex items-center space-x-4">
                      <Button
                        size="small"
                        icon={<BiRefresh />}
                        onClick={() => {
                          fetchSurveys();
                          notification.success({
                            message: "Податоците се освежени",
                            placement: "topRight",
                          });
                        }}
                        className="text-blue-600"
                      >
                        Освежи
                      </Button>
                      <span className="text-sm text-gray-500">
                        ID: {selectedSurvey._id}
                      </span>
                    </div>
                  </div>
                }
                type="info"
                className="rounded-lg"
              />

              {/* NDA Details */}
              <Card title="НДА Детали" className="shadow-sm rounded-xl">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Банка">
                    {selectedSurvey.ndaDetails.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Адреса на банка">
                    {selectedSurvey.ndaDetails.bankAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Контакт лице">
                    {selectedSurvey.ndaDetails.bankContactName} -{" "}
                    {selectedSurvey.ndaDetails.bankContactPosition}
                  </Descriptions.Item>
                  <Descriptions.Item label="Примач">
                    {selectedSurvey.ndaDetails.receiverName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Намена">
                    {selectedSurvey.ndaDetails.ndaPurpose}
                  </Descriptions.Item>
                  <Descriptions.Item label="Времетраење">
                    {selectedSurvey.ndaDetails.ndaDurationYears} години
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* General Information */}
              <Card
                title={
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Општи информации</span>
                  </div>
                }
                className="shadow-sm rounded-xl mb-4"
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Банка (прашалник)">
                    <span className="font-medium">
                      {selectedSurvey.questionnaireData.bankName || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Датум на пополнување">
                    <span className="font-medium">
                      {selectedSurvey.questionnaireData.fillDate || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Контакт лице">
                    <span className="font-medium">
                      {selectedSurvey.questionnaireData.contactPersonName ||
                        "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Позиција">
                    <span className="font-medium">
                      {selectedSurvey.questionnaireData.contactPersonPosition ||
                        "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Е-пошта" span={2}>
                    <a
                      href={`mailto:${selectedSurvey.questionnaireData.contactPersonEmail}`}
                      className="text-blue-600"
                    >
                      {selectedSurvey.questionnaireData.contactPersonEmail ||
                        "N/A"}
                    </a>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* ICT Risk Management */}
              <Card
                title={
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>ИКТ Управување со ризици</span>
                  </div>
                }
                className="shadow-sm rounded-xl mb-4"
              >
                <div className="space-y-4">
                  {/* Question 1.1 */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        1. Систем за управување со ИТ ризици
                      </span>
                      <Tag
                        color={
                          selectedSurvey.questionnaireData.q1_1 === "Да"
                            ? "green"
                            : selectedSurvey.questionnaireData.q1_1 === "Не"
                            ? "red"
                            : "orange"
                        }
                        className="font-medium"
                      >
                        {selectedSurvey.questionnaireData.q1_1 || "N/A"}
                      </Tag>
                    </div>

                    {/* Q1.1 Additional Details */}
                    {selectedSurvey.questionnaireData.q1_1_status && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-300">
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>Статус на последната ревизија:</strong>
                        </div>
                        <div className="text-sm bg-white p-2 rounded border">
                          {selectedSurvey.questionnaireData.q1_1_status}
                        </div>
                      </div>
                    )}

                    {selectedSurvey.questionnaireData.q1_1_date && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-300">
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>Датум на последна ревизија:</strong>
                        </div>
                        <div className="text-sm bg-white p-2 rounded border">
                          {selectedSurvey.questionnaireData.q1_1_date}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question 1.2 */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        2. Редовна проценка на ИТ ризици
                      </span>
                      <Tag
                        color={
                          selectedSurvey.questionnaireData.q1_2 === "Да"
                            ? "green"
                            : selectedSurvey.questionnaireData.q1_2 === "Не"
                            ? "red"
                            : "orange"
                        }
                        className="font-medium"
                      >
                        {selectedSurvey.questionnaireData.q1_2 || "N/A"}
                      </Tag>
                    </div>

                    {/* Q1.2 Frequency Details */}
                    {selectedSurvey.questionnaireData.q1_2_freq && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-300">
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>Фреквенција на проценки/ревизии:</strong>
                        </div>
                        <div className="text-sm bg-white p-2 rounded border">
                          {selectedSurvey.questionnaireData.q1_2_freq}
                          {selectedSurvey.questionnaireData.q1_2_freq ===
                            "Друго" &&
                            selectedSurvey.questionnaireData
                              .q1_2_freq_other_text && (
                              <span className="ml-2 italic text-gray-600">
                                (
                                {
                                  selectedSurvey.questionnaireData
                                    .q1_2_freq_other_text
                                }
                                )
                              </span>
                            )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show all other questionnaire fields dynamically */}
                  {Object.keys(selectedSurvey.questionnaireData).map((key) => {
                    // Skip basic info fields and already shown fields
                    const skipFields = [
                      "bankName",
                      "fillDate",
                      "contactPersonName",
                      "contactPersonPosition",
                      "contactPersonEmail",
                      "additionalComments",
                      "q1_1",
                      "q1_1_status",
                      "q1_1_date",
                      "q1_2",
                      "q1_2_freq",
                      "q1_2_freq_other_text",
                    ];

                    if (
                      !skipFields.includes(key) &&
                      selectedSurvey.questionnaireData[key] &&
                      selectedSurvey.questionnaireData[key] !== ""
                    ) {
                      const value = selectedSurvey.questionnaireData[key];

                      // Determine display name and color based on field type
                      let displayName = key;
                      let borderColor = "border-blue-500";

                      if (key.startsWith("q")) {
                        // This is a question field
                        displayName = `Прашање ${key
                          .replace(/q|_/g, " ")
                          .trim()}`;
                        borderColor = "border-purple-500";
                      } else if (key.includes("date")) {
                        displayName = key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                        borderColor = "border-orange-500";
                      } else if (
                        key.includes("status") ||
                        key.includes("freq")
                      ) {
                        displayName = key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                        borderColor = "border-indigo-500";
                      }

                      return (
                        <div
                          key={key}
                          className={`bg-gray-50 p-4 rounded-lg border-l-4 ${borderColor}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-gray-700 block mb-2">
                                {displayName}:
                              </span>
                              <div className="text-sm bg-white p-3 rounded border">
                                {value}
                              </div>
                            </div>
                            <Tag
                              color={
                                value === "Да"
                                  ? "green"
                                  : value === "Не"
                                  ? "red"
                                  : value === "Делумно"
                                  ? "orange"
                                  : "blue"
                              }
                              className="font-medium ml-3"
                            >
                              {value.length > 20 ? "Одговор" : value}
                            </Tag>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Show a summary of all collected data */}
                  <Divider />
                  {/* <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Text className="font-medium text-blue-800 block mb-2">
                      Преглед на сите собрани податоци:
                    </Text>
                    <div className="text-xs text-blue-600 space-y-1">
                      {Object.keys(selectedSurvey.questionnaireData).map(
                        (key) => {
                          const value = selectedSurvey.questionnaireData[key];
                          if (value && value !== "") {
                            return (
                              <div key={key} className="flex justify-between">
                                <span className="font-mono">{key}:</span>
                                <span className="ml-2 truncate max-w-xs">
                                  {String(value).length > 50
                                    ? `${String(value).substring(0, 50)}...`
                                    : String(value)}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                  </div> */}
                </div>
              </Card>

              {/* Additional Comments */}
              {selectedSurvey.questionnaireData.additionalComments && (
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Дополнителни коментари</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl"
                >
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Paragraph className="text-gray-700 mb-0">
                      {selectedSurvey.questionnaireData.additionalComments}
                    </Paragraph>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Drawer>

        {/* Status Update Modal */}
        <Modal
          title="Ажурирај статус"
          open={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          footer={null}
          className="status-modal"
        >
          {currentRecord && (
            <div className="space-y-4">
              <div className="text-center">
                <Title level={4}>{currentRecord.ndaDetails.bankName}</Title>
                <Text type="secondary">
                  Тековен статус:{" "}
                  <StatusBadge status={currentRecord.status || "draft"} />
                </Text>
              </div>

              <Divider />

              <div className="space-y-3">
                <Button
                  block
                  size="large"
                  type={
                    currentRecord.status === "submitted" ? "primary" : "default"
                  }
                  icon={<ClockCircleOutlined />}
                  onClick={() =>
                    handleStatusUpdate(currentRecord._id!, "submitted")
                  }
                  className="rounded-lg"
                >
                  Означи како поднесен
                </Button>

                <Button
                  block
                  size="large"
                  type={
                    currentRecord.status === "reviewed" ? "primary" : "default"
                  }
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleStatusUpdate(currentRecord._id!, "reviewed")
                  }
                  className="rounded-lg bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  Означи како прегледан
                </Button>

                <Button
                  block
                  size="large"
                  type={
                    currentRecord.status === "draft" ? "primary" : "default"
                  }
                  icon={<ExclamationCircleOutlined />}
                  onClick={() =>
                    handleStatusUpdate(currentRecord._id!, "draft")
                  }
                  className="rounded-lg"
                >
                  Врати во нацрт
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
