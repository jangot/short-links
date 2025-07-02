import React, { useState } from 'react';
import { LinkInfo, LinkAnalytics, linksApi } from '../api/linksApi';
import { getAppUrl } from '../config/appConfig';
import { LinkAnalyticsComponent } from './LinkAnalytics';
import { formatDateForDisplay } from '../utils/dateUtils';

interface LinkInfoCardProps {
  link: LinkInfo;
  analytics: LinkAnalytics | null;
  analyticsLoading: boolean;
  onLinkDeleted: () => void;
}

export const LinkInfoCard: React.FC<LinkInfoCardProps> = ({
  link,
  analytics,
  analyticsLoading,
  onLinkDeleted,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const shortUrl = getAppUrl() + '/' + (link.alias || link.id);

  const handleDelete = async () => {
    setDeleteMsg('');
    setDeleteError('');
    setDeleting(true);

    try {
      const response = await linksApi.deleteLink(link.alias || link.id);
      setDeleteMsg(response.data.message);
      onLinkDeleted();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Link information</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Original:</strong>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2"
          >
            {link.originalUrl}
          </a>
        </div>
        <div className="mb-3">
          <strong>Short:</strong>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2"
          >
            {shortUrl}
          </a>
          <button
            className="btn btn-sm btn-success ms-2"
            onClick={() => navigator.clipboard.writeText(shortUrl)}
          >
            Copy
          </button>
        </div>
        <div className="text-muted small mb-3">
          <span className="me-3">
            Created: {new Date(link.createdAt).toLocaleString('en-US')}
          </span>
          <span className="me-3">
            Expiration: {formatDateForDisplay(link.expiresAt)}
          </span>
          <span>ID: {link.id}</span>
        </div>

        {analytics && <LinkAnalyticsComponent analytics={analytics} />}

        {analyticsLoading && (
          <div className="text-success small mb-2">Loading statistics...</div>
        )}

        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete link'}
        </button>

        {deleteMsg && (
          <div className="alert alert-success mt-2">{deleteMsg}</div>
        )}
        {deleteError && (
          <div className="alert alert-danger mt-2">{deleteError}</div>
        )}
      </div>
    </div>
  );
};
