import { useEffect, useState } from "react";

import StudentLayout from "../components/StudentLayout";

import {
  addSkill,
  deleteSkill,
  getMySkills,
  updateSkill,
} from "../service/api";

import "./Skills.css";

function Skills() {
  const [skills, setSkills] = useState({
    teach: [],
    learn: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    skill_type: "TEACH",
    level: "BEGINNER",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // LOAD SKILLS
  // =========================

  const loadSkills = async () => {
    try {
      setError("");

      const data = await getMySkills();

      setSkills({
        teach: data.teach || [],
        learn: data.learn || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      skill_type: "TEACH",
      level: "BEGINNER",
      description: "",
    });

    setEditingId(null);
  };

  // =========================
  // ADD / UPDATE SKILL
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateSkill(editingId, {
          level: formData.level,
          description: formData.description,
        });

        setMessage(
          "Skill updated successfully."
        );
      } else {
        await addSkill(formData);

        setMessage(
          "Skill added successfully."
        );
      }

      resetForm();

      await loadSkills();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT SKILL
  // =========================

  const handleEdit = (
    skill,
    skillType
  ) => {
    setEditingId(skill.id);

    setFormData({
      name: skill.name,
      category: skill.category,
      skill_type: skillType,
      level: skill.level,
      description: skill.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE SKILL
  // =========================

  const handleDelete = async (
    skillId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this skill?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteSkill(skillId);

      setMessage(
        "Skill deleted successfully."
      );

      await loadSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="skills-loading">
        Loading skills...
      </div>
    );
  }

  return (
    <StudentLayout>

      <div className="skills-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="skills-header">

          <div>

            <p className="skills-label">
              MY SKILLS
            </p>

            <h1>
              Manage Your Skills
            </h1>

            <p>
              Add what you can teach and what
              you want to learn.
            </p>

          </div>

        </header>

        {/* =========================
            SUCCESS / ERROR
        ========================== */}

        {message && (
          <div className="skills-success">
            {message}
          </div>
        )}

        {error && (
          <div className="skills-error">
            {error}
          </div>
        )}

        {/* =========================
            SKILL FORM
        ========================== */}

        <section className="skill-form-card">

          <h2>
            {editingId
              ? "Edit Skill"
              : "Add a New Skill"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="skill-form-grid">

              <div className="skill-form-group">

                <label htmlFor="skill-name">
                  Skill Name
                </label>

                <input
                  id="skill-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Python"
                  disabled={Boolean(editingId)}
                  required
                />

              </div>

              <div className="skill-form-group">

                <label htmlFor="skill-category">
                  Category
                </label>

                <input
                  id="skill-category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Example: Programming"
                  disabled={Boolean(editingId)}
                  required
                />

              </div>

              <div className="skill-form-group">

                <label htmlFor="skill-type">
                  Skill Type
                </label>

                <select
                  id="skill-type"
                  name="skill_type"
                  value={formData.skill_type}
                  onChange={handleChange}
                  disabled={Boolean(editingId)}
                >
                  <option value="TEACH">
                    I can teach this
                  </option>

                  <option value="LEARN">
                    I want to learn this
                  </option>
                </select>

              </div>

              <div className="skill-form-group">

                <label htmlFor="skill-level">
                  Level
                </label>

                <select
                  id="skill-level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="BEGINNER">
                    Beginner
                  </option>

                  <option value="INTERMEDIATE">
                    Intermediate
                  </option>

                  <option value="ADVANCED">
                    Advanced
                  </option>
                </select>

              </div>

            </div>

            <div className="skill-form-group">

              <label htmlFor="skill-description">
                Description
              </label>

              <textarea
                id="skill-description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your experience or learning goal"
              />

            </div>

            <div className="skill-form-actions">

              <button
                className="skill-save-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Skill"
                    : "Add Skill"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* =========================
            SKILL LISTS
        ========================== */}

        <section className="skills-columns">

          {/* =========================
              TEACH SKILLS
          ========================== */}

          <div className="skills-list-card">

            <div className="skills-card-heading">

              <div>

                <h2>
                  📚 Skills I Teach
                </h2>

                <p>
                  Skills you can share with others.
                </p>

              </div>

              <span>
                {skills.teach.length}
              </span>

            </div>

            {skills.teach.length === 0 ? (

              <div className="skills-empty">
                No teaching skills added yet.
              </div>

            ) : (

              <div className="skill-list">

                {skills.teach.map(
                  (skill) => (

                    <div
                      className="skill-item"
                      key={skill.id}
                    >

                      <div>

                        <div className="skill-item-title">

                          <h3>
                            {skill.name}
                          </h3>

                          <span className="teach-badge">
                            TEACH
                          </span>

                        </div>

                        <p className="skill-category">
                          {skill.category}
                        </p>

                        <p className="skill-level">
                          Level: {skill.level}
                        </p>

                        {skill.description && (
                          <p className="skill-description">
                            {skill.description}
                          </p>
                        )}

                      </div>

                      <div className="skill-item-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              skill,
                              "TEACH"
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-skill-button"
                          onClick={() =>
                            handleDelete(
                              skill.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* =========================
              LEARN SKILLS
          ========================== */}

          <div className="skills-list-card">

            <div className="skills-card-heading">

              <div>

                <h2>
                  🎯 Skills I Want to Learn
                </h2>

                <p>
                  Skills you want to gain.
                </p>

              </div>

              <span>
                {skills.learn.length}
              </span>

            </div>

            {skills.learn.length === 0 ? (

              <div className="skills-empty">
                No learning skills added yet.
              </div>

            ) : (

              <div className="skill-list">

                {skills.learn.map(
                  (skill) => (

                    <div
                      className="skill-item"
                      key={skill.id}
                    >

                      <div>

                        <div className="skill-item-title">

                          <h3>
                            {skill.name}
                          </h3>

                          <span className="learn-badge">
                            LEARN
                          </span>

                        </div>

                        <p className="skill-category">
                          {skill.category}
                        </p>

                        <p className="skill-level">
                          Level: {skill.level}
                        </p>

                        {skill.description && (
                          <p className="skill-description">
                            {skill.description}
                          </p>
                        )}

                      </div>

                      <div className="skill-item-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              skill,
                              "LEARN"
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-skill-button"
                          onClick={() =>
                            handleDelete(
                              skill.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </StudentLayout>
  );
}

export default Skills;