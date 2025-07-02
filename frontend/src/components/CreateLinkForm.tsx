import React, { useState } from 'react';
import { linksApi, LinkInfo } from '../api/linksApi';
import { convertToISOString } from '../utils/dateUtils';

interface CreateLinkFormProps {
  onLinkCreated: (link: LinkInfo) => void;
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({
  onLinkCreated,
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const response = await linksApi.createLink({
        originalUrl,
        alias: alias || undefined,
        expiresAt: convertToISOString(expiresAt),
      });

      onLinkCreated(response.data);
      setOriginalUrl('');
      setAlias('');
      setExpiresAt('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Create short link</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <input
                type="url"
                className="form-control"
                placeholder="Paste the original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Alias (optional)"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                className="form-control"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <small className="form-text text-muted">
                The time will be saved in UTC (Greenwich Mean Time)
              </small>
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
      {error && (
        <div className="card-footer">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      )}
    </div>
  );
};
