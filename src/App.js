import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    race: '',
    primarySymptom: '',
    secondarySymptom: '',
    otherSymptoms: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      image: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Medical Information Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="race">Race:</label>
            <input
              type="text"
              id="race"
              name="race"
              value={formData.race}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="primarySymptom">Primary Symptom:</label>
            <input
              type="text"
              id="primarySymptom"
              name="primarySymptom"
              value={formData.primarySymptom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="secondarySymptom">Secondary Symptom:</label>
            <input
              type="text"
              id="secondarySymptom"
              name="secondarySymptom"
              value={formData.secondarySymptom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="otherSymptoms">Other Symptoms:</label>
            <textarea
              id="otherSymptoms"
              name="otherSymptoms"
              value={formData.otherSymptoms}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image (if any):</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
