import React, { useState, useEffect, useCallback } from 'react';
import ContentList from './ContentList';
import ContentForm from './ContentForm';
import api from '../../config/api';
import './ContentManager.css';

const ContentManager = ({ type }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/content?type=${type}`);
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchContents();
    setEditingContent(null);
    setShowForm(false);
  }, [type, fetchContents]);

  const handleCreate = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/content/${id}`);
        fetchContents();
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
  };

  const handleFormSuccess = () => {
    fetchContents();
    handleFormClose();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>{type === 'EVENT' ? 'Events' : type === 'ACHIEVEMENT' ? 'Achievements' : 'Work Done'}</h2>
        <button className="create-btn" onClick={handleCreate}>
          + Create New
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchContents} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <ContentForm
          type={type}
          content={editingContent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <ContentList
        contents={contents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContentManager;

