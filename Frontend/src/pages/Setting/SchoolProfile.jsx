import { useCallback, useEffect, useState } from "react";
import { getSchoolProfile, saveSchoolProfile } from "../../services/schoolProfileService";

const SchoolProfile = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    shortName: "",
    establishedYear: "",
    boardAffiliation: "",
    schoolType: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    chairman: "",
    principal: "",
    vicePrincipal: "",
    adminHead: "",
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getSchoolProfile();

      if (profile && Object.keys(profile).length > 0) {
        setFormData((prev) => ({
          ...prev,
          ...profile,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile =>", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async () => {
    try {
      await saveSchoolProfile(formData);

      window.dispatchEvent(new Event("school-profile-updated"));
      alert("School Profile Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Saving School Profile");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            School/College Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage school/college information and branding
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="space-y-5">
            <Input
              label="School/College Name"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />

            <Input
              label="Short Name"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              required
            />

            <Input
              label="Established Year"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleChange}
              required
            />

            <Input
              label="Board/University Affiliation"
              name="boardAffiliation"
              value={formData.boardAffiliation}
              onChange={handleChange}
            />

            <Input
              label="School/College Type"
              name="schoolType"
              value={formData.schoolType}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Contact Details */}
        <Card title="Contact Details">
          <div className="space-y-5">
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                rows="4"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-y"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Management Section */}
      <div className="mt-6">
        <Card title="Management">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Chairman"
              name="chairman"
              value={formData.chairman}
              onChange={handleChange}
            />

            <Input
              label="Principal"
              name="principal"
              value={formData.principal}
              onChange={handleChange}
            />

            <Input
              label="Vice Principal"
              name="vicePrincipal"
              value={formData.vicePrincipal}
              onChange={handleChange}
            />

            <Input
              label="Admin Head"
              name="adminHead"
              value={formData.adminHead}
              onChange={handleChange}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="font-semibold text-lg text-slate-900 mb-5">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, name, value, onChange, required }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
    />
  </div>
);

export default SchoolProfile;
