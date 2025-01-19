import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

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

  const [filledFields, setFilledFields] = useState({
    age: false,
    gender: false,
    primarySymptom: false
  });

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (['age', 'gender', 'primarySymptom'].includes(name)) {
      setFilledFields(prevState => ({
        ...prevState,
        [name]: value.trim() !== ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      image: file
    }));
  };

  const generatePrompt = (data) => {
    return `Please analyze the following patient information and provide a preliminary assessment:
    
    Patient Details:
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Race/Ethnicity: ${data.race || 'Not specified'}
    
    Symptoms:
    - Primary Symptom: ${data.primarySymptom}
    - Secondary Symptom: ${data.secondarySymptom || 'None reported'}
    - Additional Symptoms: ${data.otherSymptoms || 'None reported'}
    
    Please provide:
    1. Possible conditions to consider
    2. Recommended next steps
    3. General health advice based on the symptoms
    4. Whether immediate medical attention might be needed`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(process.env.REACT_APP_OPENAI_API_KEY);
      console.log('api key');
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful medical assistant. While you cannot provide official medical diagnosis, you can offer general information and suggestions based on symptoms."
            },
            {
              role: "user",
              content: generatePrompt(formData)
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Patient Information Form</h1>
        <p className="subtitle">Please fill out all required fields marked with *</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-group">
                <label htmlFor="age" className={filledFields.age ? 'filled' : ''}>
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className={filledFields.gender ? 'filled' : ''}>
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="race">Race/Ethnicity</label>
                <input
                  type="text"
                  id="race"
                  name="race"
                  value={formData.race}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Symptoms Information</h2>
              <div className="form-group">
                <label htmlFor="primarySymptom" className={filledFields.primarySymptom ? 'filled' : ''}>
                  Primary Symptom *
                </label>
                <input
                  type="text"
                  id="primarySymptom"
                  name="primarySymptom"
                  value={formData.primarySymptom}
                  onChange={handleChange}
                  required
                  placeholder="Main reason for visit"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondarySymptom">Secondary Symptom</label>
                <input
                  type="text"
                  id="secondarySymptom"
                  name="secondarySymptom"
                  value={formData.secondarySymptom}
                  onChange={handleChange}
                  placeholder="Additional symptoms"
                />
              </div>

              <div className="form-group">
                <label htmlFor="otherSymptoms">Additional Symptoms & Notes</label>
                <textarea
                  id="otherSymptoms"
                  name="otherSymptoms"
                  value={formData.otherSymptoms}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please describe any other symptoms or relevant information"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Supporting Documentation</h2>
              <div className="form-group file-upload">
                <label htmlFor="image">
                  Upload Related Images
                  <span className="file-help">(X-rays, Test Results, etc.)</span>
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button">Cancel</button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Form'}
            </button>
          </div>
        </form>

        {response && (
          <div className="response-section">
            <h2>Analysis Results</h2>
            <div className="response-content">
              {response.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
