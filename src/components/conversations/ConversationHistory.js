import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Conversations.css';

const ConversationHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/conversations`, config);
        setConversations(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="conversation-history-container">
      <h2>Your Consultation History</h2>
      
      {conversations.length === 0 ? (
        <div className="no-conversations">
          <p>You don't have any consultations yet.</p>
        </div>
      ) : (
        <div className="conversations-wrapper">
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div 
                key={conversation._id} 
                className={`conversation-item ${selectedConversation && selectedConversation._id === conversation._id ? 'selected' : ''}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="conversation-info">
                  <div className="conversation-primary">
                    {conversation.formData.primarySymptom}
                  </div>
                  <div className="conversation-date">
                    {formatDate(conversation.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="conversation-details">
            {selectedConversation ? (
              <div className="selected-conversation">
                <div className="conversation-header">
                  <h3>{selectedConversation.formData.primarySymptom}</h3>
                  <div className="conversation-meta">
                    <div>Date: {formatDate(selectedConversation.createdAt)}</div>
                  </div>
                </div>
                
                <div className="patient-details">
                  <h4>Patient Information:</h4>
                  <ul>
                    <li><strong>Age:</strong> {selectedConversation.formData.age}</li>
                    <li><strong>Gender:</strong> {selectedConversation.formData.gender}</li>
                    {selectedConversation.formData.race && (
                      <li><strong>Race/Ethnicity:</strong> {selectedConversation.formData.race}</li>
                    )}
                  </ul>
                </div>
                
                <div className="symptoms">
                  <h4>Symptoms:</h4>
                  <ul>
                    <li><strong>Primary:</strong> {selectedConversation.formData.primarySymptom}</li>
                    {selectedConversation.formData.secondarySymptom && (
                      <li><strong>Secondary:</strong> {selectedConversation.formData.secondarySymptom}</li>
                    )}
                    {selectedConversation.formData.otherSymptoms && (
                      <li><strong>Additional Notes:</strong> {selectedConversation.formData.otherSymptoms}</li>
                    )}
                  </ul>
                </div>
                
                <div className="ai-response">
                  <h4>Medical Assistant's Response:</h4>
                  <div className="response-content">
                    {selectedConversation.response.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Select a consultation to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory; 