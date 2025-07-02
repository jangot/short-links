import React, { useState } from 'react';
import { linksApi, LinkInfo, LinkAnalytics } from './api/linksApi';
import { CreateLinkForm } from './components/CreateLinkForm';
import { CreatedLinkCard } from './components/CreatedLinkCard';
import { SearchLinkForm } from './components/SearchLinkForm';
import { LinkInfoCard } from './components/LinkInfoCard';
import './App.css';

export default function App() {
  const [createResult, setCreateResult] = useState<LinkInfo | null>(null);
  const [info, setInfo] = useState<LinkInfo | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [infoError, setInfoError] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleLinkCreated = (link: LinkInfo) => {
    setCreateResult(link);
  };

  const handleSearch = async (identifier: string) => {
    setInfoError('');
    setInfo(null);
    setAnalytics(null);
    setInfoLoading(true);
    setAnalyticsLoading(true);

    try {
      const [infoResponse, analyticsResponse] = await Promise.all([
        linksApi.getLinkInfo(identifier),
        linksApi.getLinkAnalytics(identifier),
      ]);
      setInfo(infoResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (e: unknown) {
      setInfoError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setInfoLoading(false);
      setAnalyticsLoading(false);
    }
  };

  const handleLinkDeleted = () => {
    setInfo(null);
    setAnalytics(null);
  };

  return (
    <div className="container-fluid">
      <header className="bg-dark text-white py-3 mb-4">
        <div className="container">
          <h1 className="h2 mb-1">Short Links</h1>
          <p className="mb-0 text-muted">
            Создавайте, ищите и удаляйте короткие ссылки
          </p>
        </div>
      </header>

      <main className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <CreateLinkForm onLinkCreated={handleLinkCreated} />

            {createResult && <CreatedLinkCard link={createResult} />}

            <SearchLinkForm onSearch={handleSearch} loading={infoLoading} />

            {infoError && <div className="alert alert-danger">{infoError}</div>}

            {info && (
              <LinkInfoCard
                link={info}
                analytics={analytics}
                analyticsLoading={analyticsLoading}
                onLinkDeleted={handleLinkDeleted}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
