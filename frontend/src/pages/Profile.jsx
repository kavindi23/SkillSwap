import { useEffect, useState } from "react";

import StudentLayout from "../components/StudentLayout";

import {
  getMyProfile,
  updateMyProfile,
} from "../service/api";

import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    university: "",
    faculty: "",
    department: "",
    year: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError("");

        const data = await getMyProfile();

        setProfile(data);

        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
          university: data.university || "",
          faculty: data.faculty || "",
          department: data.department || "",
          year: data.year || "",
          location: data.location || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedProfile =
        await updateMyProfile(formData);

      setProfile(updatedProfile);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <StudentLayout>

      <div className="profile-main">

        {/* =========================
            HEADER
        ========================== */}

        <div className="profile-header">

          <div>

            <p className="profile-label">
              MY PROFILE
            </p>

            <h1>
              Profile Information
            </h1>

            <p>
              Manage your personal and university
              information.
            </p>

          </div>


          <div className="profile-avatar">
            {initials}
          </div>

        </div>


        {/* =========================
            CONTENT
        ========================== */}

        <div className="profile-content">

          {/* PROFILE SUMMARY */}

          <section className="profile-summary">

            <div className="large-avatar">
              {initials}
            </div>

            <h2>
              {profile?.full_name}
            </h2>

            <p>
              {profile?.email}
            </p>

            <span className="role-badge">
              {profile?.role}
            </span>

            <div className="rating-box">
              ⭐{" "}
              {Number(
                profile?.rating || 0
              ).toFixed(1)}
            </div>

          </section>


          {/* EDIT PROFILE */}

          <section className="profile-form-card">

            <h2>
              Edit Profile
            </h2>


            {message && (
              <div className="success-message">
                {message}
              </div>
            )}


            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">

                  <label htmlFor="full_name">
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="university">
                    University
                  </label>

                  <input
                    id="university"
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    autoComplete="organization"
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="faculty">
                    Faculty
                  </label>

                  <input
                    id="faculty"
                    name="faculty"
                    type="text"
                    value={formData.faculty}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="department">
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="year">
                    Year
                  </label>

                  <input
                    id="year"
                    name="year"
                    type="text"
                    value={formData.year}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    autoComplete="address-level2"
                  />

                </div>

              </div>


              <div className="form-group">

                <label htmlFor="bio">
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others a little about yourself..."
                />

              </div>


              <button
                className="save-profile-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </section>

        </div>

      </div>

    </StudentLayout>
  );
}

export default Profile;