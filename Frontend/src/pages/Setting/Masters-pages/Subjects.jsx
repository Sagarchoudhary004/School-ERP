import { useEffect, useState } from "react";
import MasterCrudPage from "../../../components/masters/MasterCrudPage";
import {
  classSectionService,
  departmentService,
  subjectService,
} from "../../../services/masterSetupServices";

const columns = [
  { key: "subjectName", label: "Subject Name" },
  { key: "subjectCode", label: "Subject Code" },
  { key: "subjectType", label: "Type" },
  {
    key: "applicableClasses",
    label: "Applicable Classes",
    render: (record) => record.applicableClasses?.join(", ") || "-",
  },
  { key: "department", label: "Department" },
];

const validate = ({
  subjectName,
  subjectCode,
  subjectType,
  applicableClasses,
}) => {
  if (!subjectName) return "Subject Name is required";
  if (!subjectCode) return "Subject Code is required";
  if (!subjectType) return "Subject Type is required";
  if (!applicableClasses?.length) {
    return "At least one class must be selected";
  }
  return null;
};

export default function Subjects() {
  const [classOptions, setClassOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [classes, departments] = await Promise.all([
        classSectionService.getAll(),
        departmentService.getAll(),
      ]);

      setClassOptions(
        (classes.data.data || []).map((item) => ({
          label: `${item.className} - ${item.sectionName}`,
          value: `${item.className} - ${item.sectionName}`,
        }))
      );

      setDepartmentOptions(
        (departments.data.data || []).map((item) => ({
          label: item.departmentName,
          value: item.departmentName,
        }))
      );
    };

    fetchOptions().catch(() => {
      setClassOptions([]);
      setDepartmentOptions([]);
    });
  }, []);

  const fields = [
    { name: "subjectName", label: "Subject Name" },
    { name: "subjectCode", label: "Subject Code" },
    {
      name: "subjectType",
      label: "Subject Type",
      type: "select",
      options: [
        { label: "Theory", value: "Theory" },
        { label: "Practical", value: "Practical" },
      ],
    },
    {
      name: "applicableClasses",
      label: "Applicable Classes",
      type: "multiselect",
      options: classOptions,
      defaultValue: [],
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: departmentOptions,
    },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <MasterCrudPage
      title="Subjects"
      description="Manage academic subjects taught in school."
      entityName="Subject"
      service={subjectService}
      fields={fields}
      columns={columns}
      validate={validate}
      transformRecord={(record) => ({
        subjectName: record.subjectName || "",
        subjectCode: record.subjectCode || "",
        subjectType: record.subjectType || "",
        applicableClasses: record.applicableClasses || [],
        department: record.department || "",
        description: record.description || "",
      })}
    />
  );
}
